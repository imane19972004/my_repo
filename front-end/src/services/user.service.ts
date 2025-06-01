import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
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

  private serverUrlLoc = serverUrl;
  private userUrl = `${this.serverUrlLoc}/users`;
  private userHistoryUrl = `${this.serverUrlLoc}/users`; // Corrected base for user history

  // à désactiver pour tester le back-end coté users
  private USE_MOCK = false;

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public userSelected$: Subject<User> = new Subject<User>();

  private mockUsers = [...MOCK_USERS];
  private mockUserHistories = [...MOCK_USER_HISTORY];

  constructor(private http: HttpClient) {
    this.retrieveUsers();
  }

  // Ajoute un nouvel utilisateur
  addUser(user: User | FormData): void {
    if (this.USE_MOCK) {
      const newUser: User = user as User;
      newUser.id = Math.floor(Math.random() * 100000).toString();
      this.mockUsers.push(newUser);
      const emptyHistory: UserHistory = {
        userId: newUser.id,
        exerciceId: '',
        date: '',
        exerciceName: '',
        success: 0,
        failure: 0
      };
      this.mockUserHistories.push(emptyHistory);
      this.retrieveUsers();
    } else {
      // Si c'est un FormData, on ne met pas les httpOptionsBase (car ils définissent Content-Type: application/json)
      const request = user instanceof FormData
        ? this.http.post<User>(this.userUrl, user)
        : this.http.post<User>(this.userUrl, user, httpOptionsBase);

      request.pipe( catchError(err => {
        console.error('Erreur HTTP lors de la création d\'utilisateur :', JSON.stringify(err, null, 2));return of();
        })).subscribe(() => this.retrieveUsers());
    }
  }

  // Supprime un utilisateur et son historique
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

  // Récupère tous les utilisateurs
  retrieveUsers(): void {
    if (this.USE_MOCK) {
      this.users$.next([...this.mockUsers]);
    } else {
      this.http.get<User[]>(this.userUrl, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }))
        .subscribe(users => this.users$.next(users));
    }
  }

  // Définit un utilisateur sélectionné
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

  // Récupère un utilisateur par son ID
  getUserById(userId: string): Observable<User | undefined> {
    if (this.USE_MOCK) {
      const user = this.mockUsers.find(u => u.id === userId);
      return of(user);
    } else {
      return this.http.get<User>(`${this.userUrl}/${userId}`, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(undefined); }));
    }
  }

  // Récupère l'historique d’un utilisateur
  getUserHistoryById(userId: string): Observable<UserHistory[]> {
    if (this.USE_MOCK) {
      const history = this.mockUserHistories.filter(h => h.userId === userId);
      return of(history);
    } else {
      const urlWithId = `${this.userHistoryUrl}/${userId}/history`;
      return this.http.get<UserHistory[]>(urlWithId, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }));
    }
  }

  // Ajoute une entrée à l'historique
  addUserHistory(newEntry: UserHistory): void {
    if (this.USE_MOCK) {
      this.mockUserHistories.push(newEntry);
    } else {
      const url = `${this.userHistoryUrl}/${newEntry.userId}/history`;
      this.http.post<UserHistory>(url, newEntry, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of(); }))
        .subscribe();
    }
  }
}
