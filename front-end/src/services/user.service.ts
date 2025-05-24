import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserHistory } from '../models/user-history.model';
import { Exercice } from '../models/exercice.model';
import { MOCK_USERS } from '../mocks/mock-users-data';
import { MOCK_USER_HISTORY } from '../mocks/mock-users-history-data';
import { serverUrl, httpOptionsBase } from '../configs/server.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverUrlLoc = serverUrl;
  private userUrl = `${this.serverUrlLoc}/users`;

  private USE_MOCK = false;

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public userSelected$: Subject<User> = new Subject<User>();

  private mockUsers = [...MOCK_USERS];
  private mockUserHistories = [...MOCK_USER_HISTORY];

  constructor(private http: HttpClient) {
    this.retrieveUsers();
  }

  // ---------------------- USERS ----------------------

  /**
   * Ajouter un utilisateur
   */
  addUser(user: User): void {
    if (this.USE_MOCK) {
      user.id = Math.floor(Math.random() * 100000).toString();
      this.mockUsers.push(user);
      const emptyHistory: UserHistory = {
        userId: user.id,
        exerciceId: '',
        date: '',
        exerciceName: '',
        success: 0,
        failure: 0
      };
      this.mockUserHistories.push(emptyHistory);
      this.retrieveUsers();
    } else {
      this.http.post<User>(this.userUrl, user, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.retrieveUsers());
    }
  }

  /**
   * Supprimer un utilisateur
   */
  deleteUser(user: User): void {
    if (this.USE_MOCK) {
      this.mockUsers = this.mockUsers.filter(u => u.id !== user.id);
      this.mockUserHistories = this.mockUserHistories.filter(h => h.userId !== user.id);
      this.retrieveUsers();
    } else {
      this.http.delete(`${this.userUrl}/${user.id}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(() => this.retrieveUsers());
    }
  }

  /**
   * Récupérer tous les utilisateurs
   */
  retrieveUsers(): void {
    if (this.USE_MOCK) {
      this.users$.next([...this.mockUsers]);
    } else {
      this.http.get<User[]>(this.userUrl, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }))
        .subscribe(users => this.users$.next(users));
    }
  }

  /**
   * Sélectionner un utilisateur
   */
  setSelectedUser(user: User): void {
    if (this.USE_MOCK) {
      const foundUser = this.mockUsers.find(u => u.id === user.id);
      if (foundUser) {
        this.userSelected$.next(foundUser);
      }
    } else {
      this.http.get<User>(`${this.userUrl}/${user.id}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe(user => this.userSelected$.next(user));
    }
  }

  /**
   * Obtenir un utilisateur par son ID
   */
  getUserById(userId: string): Observable<User | undefined> {
    if (this.USE_MOCK) {
      const user = this.mockUsers.find(u => u.id === userId);
      return of(user);
    } else {
      return this.http.get<User>(`${this.userUrl}/${userId}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(undefined); }));
    }
  }

  // ---------------------- HISTORY ----------------------

  /**
   * Obtenir l'historique d'un utilisateur par son ID
   */
  getUserHistoryById(userId: string): Observable<UserHistory[]> {
    if (this.USE_MOCK) {
      const history = this.mockUserHistories.filter(h => h.userId === userId);
      return of(history);
    } else {
      const urlWithId = `${this.userUrl}/${userId}/history`;
      return this.http.get<UserHistory[]>(urlWithId, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }));
    }
  }

  /**
   * Ajouter une entrée dans l'historique d'un utilisateur
   */
  addUserHistory(newEntry: UserHistory): void {
    if (this.USE_MOCK) {
      this.mockUserHistories.push(newEntry);
    } else {
      const url = `${this.userUrl}/${newEntry.userId}/history`;
      this.http.post<UserHistory>(url, newEntry, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe();
    }
  }

  // ---------------------- ASSIGNED EXERCICES ----------------------

  /**
   * Assigner un exercice à un utilisateur (l'ajouter à sa liste privée)
   */
  assignExerciceToUser(userId: string, exerciceId: string): void {
    console.log('UserService.assignExerciceToUser appelé:', { userId, exerciceId });
    
    const users = this.users$.value;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      // Initialiser le tableau si nécessaire
      if (!users[userIndex].assignedExercices) {
        users[userIndex].assignedExercices = [];
      }

      // Ajouter l'exercice s'il n'y est pas déjà
      if (!users[userIndex].assignedExercices!.includes(exerciceId)) {
        users[userIndex].assignedExercices!.push(exerciceId);
        
        // Mettre à jour le BehaviorSubject pour notifier les observables
        this.users$.next([...users]);
        
        console.log('Exercice assigné avec succès. Liste mise à jour:', users[userIndex].assignedExercices);
      } else {
        console.log('Exercice déjà assigné à cet utilisateur');
      }
    } else {
      console.error('Utilisateur non trouvé:', userId);
    }
  }

  /**
   * Retirer un exercice de la liste privée d'un utilisateur
   */
  removeExerciceFromUser(userId: string, exerciceId: string): void {
    console.log('UserService.removeExerciceFromUser appelé:', { userId, exerciceId });
    
    const users = this.users$.value;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1 && users[userIndex].assignedExercices) {
      users[userIndex].assignedExercices = users[userIndex].assignedExercices!.filter(
        id => id !== exerciceId
      );
      
      // Mettre à jour le BehaviorSubject pour notifier les observables
      this.users$.next([...users]);
      
      console.log('Exercice retiré avec succès. Liste mise à jour:', users[userIndex].assignedExercices);
    } else {
      console.error('Utilisateur non trouvé ou pas d\'exercices assignés:', userId);
    }
  }

  /**
   * Obtenir la liste des exercices assignés à un utilisateur
   */
  getUserAssignedExercices(userId: string): Observable<string[]> {
    return this.users$.pipe(
      map(users => {
        const user = users.find(u => u.id === userId);
        const assignedExercices = user?.assignedExercices || [];
        console.log('getUserAssignedExercices pour', userId, ':', assignedExercices);
        return assignedExercices;
      })
    );
  }

  // ---------------------- PRIVATE EXERCICES (API) ----------------------
  // Ces méthodes sont pour une future intégration avec une API backend

  /**
   * Obtenir les exercices privés d'un utilisateur via API
   */
  getUserPrivateExercices(userId: string): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(`${this.userUrl}/${userId}/private-exercices`, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of([]); }));
  }

  /**
   * Ajouter un exercice à la liste privée via API
   */
  addExerciceToPrivateList(userId: string, exerciceId: string): Observable<any> {
    return this.http.post(`${this.userUrl}/${userId}/private-exercices`, { exerciceId }, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(); }));
  }

  /**
   * Retirer un exercice de la liste privée via API
   */
  removeExerciceFromPrivateList(userId: string, exerciceId: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${userId}/private-exercices/${exerciceId}`, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(); }));
  }

  /**
   * Vérifier si un exercice est dans la liste privée via API
   */
  isExerciceInPrivateList(userId: string, exerciceId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userUrl}/${userId}/private-exercices/${exerciceId}/exists`, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(false); }));
  }

  /**
   * Mettre à jour les exercices privés d'un utilisateur via API
   */
  updateUserPrivateExercices(userId: string, exerciceIds: string[]): Observable<any> {
    return this.http.put(`${this.userUrl}/${userId}/private-exercices`, { exerciceIds }, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(); }));
  }
}