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

  private serverUrlLoc: string = serverUrl;
  private userUrl = this.serverUrlLoc + '/users';
  private userHistoryUrl = this.serverUrlLoc + '/userHistories';

  // Active les données mockées — à désactiver
  private USE_MOCK = true;

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public userSelected$: Subject<User> = new Subject<User>();

  private mockUsers = [...MOCK_USERS];
  private mockUserHistories = [...MOCK_USER_HISTORY];

  constructor(private http: HttpClient) {
    this.retrieveUsers();
  }

  // Ajoute un nouvel utilisateur
  addUser(user: User) {
    if (this.USE_MOCK) {
      user.id = (Math.random() * 100000).toFixed(0).toString(); // ID simulé
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
      this.http.post<User>(this.userUrl, user, httpOptionsBase).subscribe(() => {
        this.retrieveUsers();
      });
    }
  }

  // Supprime un utilisateur (et son historique)
  deleteUser(user: User) {
    if (this.USE_MOCK) {
      this.mockUsers = this.mockUsers.filter(u => u.id !== user.id);
      this.mockUserHistories = this.mockUserHistories.filter(h => h.userId !== user.id);
      this.retrieveUsers();
    } else {
      const urlWithId = `${this.userUrl}/${user.id}`;
      this.http.delete(urlWithId, httpOptionsBase).subscribe(() => this.retrieveUsers());
    }
  }

  // Récupérer tous les utilisateurs
  retrieveUsers() {
    if (this.USE_MOCK) {
      this.users$.next([...this.mockUsers]);
    } else {
      this.http.get<User[]>(this.userUrl, httpOptionsBase).subscribe((userList) => {
        this.users$.next(userList);
      });
    }
  }

  // Définit un utilisateur sélectionné
  setSelectedUser(user: User) {
    if (this.USE_MOCK) {
      const foundUser = this.mockUsers.find(u => u.id === user.id);
      if (foundUser) {
        this.userSelected$.next(foundUser);
      }
    } else {
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

  // Ajoute une entrée à l’historique
  addUserHistory(newEntry: UserHistory) {
    if (this.USE_MOCK) {
      this.mockUserHistories.push(newEntry);
    } else {
      this.http.post<UserHistory>(this.userHistoryUrl, newEntry, httpOptionsBase).subscribe();
    }
  }

}
