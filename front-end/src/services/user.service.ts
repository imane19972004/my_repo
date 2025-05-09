import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserHistory } from '../models/user-history.model';
import { MOCK_USERS } from '../mocks/mock-users-data';
import { MOCK_USER_HISTORY } from '../mocks/mock-users-history-data';
import { serverUrl, httpOptionsBase } from '../configs/server.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverUrlLoc: string = 'http://localhost:9428'; // URL locale pour le backend
  private userUrl = this.serverUrlLoc + '/users'; // Route pour les users
  private userHistoryUrl = this.serverUrlLoc + '/userHistories'; // Route pour les historiques

  // IMPORTANT : Active ou désactive les données mockées, passera à false plus tard avec le backend
  private USE_MOCK = true;

  // Flux d'utilisateurs observables
  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public userSelected$: Subject<User> = new Subject<User>();

  // Copie locale des mocks pour pouvoir les modifier sans casser les fichiers mocks
  private mockUsers = [...MOCK_USERS];
  private mockUserHistories = [...MOCK_USER_HISTORY];

  constructor(private http: HttpClient) {
    this.retrieveUsers(); // On charge les users au démarrage
  }

  // Ajouter un utilisateur
  addUser(user: User) {
    if (this.USE_MOCK) {
      // Simule un id unique comme une vraie DB
      user.id = (Math.random() * 100000).toFixed(0).toString();

      // Ajout au mock
      this.mockUsers.push(user);

      const emptyHistory: UserHistory = {   // Crée un historique vide pour le nouvel utilisateur
        userId: user.id,
        exerciceId:'',
        date:'',
        exerciceName:'',
        success: 0,
        failure: 0
      };
      this.mockUserHistories.push(emptyHistory);
      this.users$.next([...this.mockUsers]); // Met à jour la liste observable
    } else {
      // Version avec backend
      this.http.post<User>(this.userUrl, user, httpOptionsBase).subscribe(() => {
        this.retrieveUsers(); // Rechargement des users
      });
    }
  }

  // Supprimer un utilisateur
  deleteUser(user: User) {
    if (this.USE_MOCK) {// Supprime l'utilisateur dans les mocks et l'historique lié puis mettre à jour la liste observable
      this.mockUsers = this.mockUsers.filter(u => u.id !== user.id);
      this.mockUserHistories = this.mockUserHistories.filter(h => h.userId !== user.id);

      this.users$.next([...this.mockUsers]);
    } else {
      // Version  avec backend
      const urlWithId = `${this.userUrl}/${user.id}`;
      this.http.delete(urlWithId, httpOptionsBase).subscribe(() => this.retrieveUsers());
    }
  }

  // Récupérer tous les utilisateurs
  private retrieveUsers() {
    if (this.USE_MOCK) {
      // Version mock : copie et push dans l'observable
      this.users$.next([...this.mockUsers]);
    } else {
      // Version avec backend
      this.http.get<User[]>(this.userUrl, httpOptionsBase).subscribe((userList) => {
        this.users$.next(userList);
      });
    }
  }

  // Sélectionner un utilisateur
  setSelectedUser(user: User) {
    if (this.USE_MOCK) {
      // Trouver l'utilisateur dans les mocks
      const foundUser = this.mockUsers.find(u => u.id === user.id);
      if (foundUser) {
        this.userSelected$.next(foundUser);
      }
    } else {
      // Version avec backend
      const urlWithId = `${this.userUrl}/${user.id}`;
      this.http.get<User>(urlWithId, httpOptionsBase).subscribe((user) => {
        this.userSelected$.next(user);
      });
    }
  }

  // Récupérer un utilisateur par son ID
  getUserById(userId: string): Observable<User | undefined> {
    if (this.USE_MOCK) {
      const user = this.mockUsers.find(u => u.id === userId);
      return of(user);
    } else {
      const urlWithId = `${this.userUrl}/${userId}`;
      return this.http.get<User>(urlWithId, httpOptionsBase);
    }
  }

  // Récupérer l'historique d'un utilisateur par son ID
  getUserHistoryById(userId: string): Observable<UserHistory[]> {
    if (this.USE_MOCK) {
      const history = this.mockUserHistories.filter(h => h.userId === userId);
      return of(history);
    } else {
      const urlWithId = `${this.userUrl}/${userId}/history`;
      return this.http.get<UserHistory[]>(urlWithId, httpOptionsBase);
    }
  }

  addUserHistory(newEntry: UserHistory) {
    if (this.USE_MOCK) {
      this.mockUserHistories.push(newEntry);
    } else {
      this.http.post<UserHistory>(this.userHistoryUrl, newEntry, httpOptionsBase).subscribe();
    }
  }

}
