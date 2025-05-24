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

  retrieveUsers(): void {
    if (this.USE_MOCK) {
      this.users$.next([...this.mockUsers]);
    } else {
      this.http.get<User[]>(this.userUrl, httpOptionsBase)
        .pipe(catchError(err => { console.error(err); return of([]); }))
        .subscribe(users => this.users$.next(users));
    }
  }

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

  assignExerciceToUser(userId: string, exerciceId: string): void {
    const users = this.users$.value;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      if (!users[userIndex].assignedExercices) {
        users[userIndex].assignedExercices = [];
      }

      if (!users[userIndex].assignedExercices!.includes(exerciceId)) {
        users[userIndex].assignedExercices!.push(exerciceId);
        this.users$.next([...users]);
      }
    }
  }

  removeExerciceFromUser(userId: string, exerciceId: string): void {
    const users = this.users$.value;
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1 && users[userIndex].assignedExercices) {
      users[userIndex].assignedExercices = users[userIndex].assignedExercices!.filter(
        id => id !== exerciceId
      );
      this.users$.next([...users]);
    }
  }

  getUserAssignedExercices(userId: string): Observable<string[]> {
    return this.users$.pipe(
      map(users => {
        const user = users.find(u => u.id === userId);
        return user?.assignedExercices || [];
      })
    );
  }

  // ---------------------- PRIVATE EXERCICES ----------------------

  getUserPrivateExercices(userId: string): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(`${this.userUrl}/${userId}/private-exercices`, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of([]); }));
  }

  addExerciceToPrivateList(userId: string, exerciceId: string): Observable<any> {
    return this.http.post(`${this.userUrl}/${userId}/private-exercices`, { exerciceId }, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(); }));
  }

  removeExerciceFromPrivateList(userId: string, exerciceId: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${userId}/private-exercices/${exerciceId}`, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(); }));
  }

  isExerciceInPrivateList(userId: string, exerciceId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.userUrl}/${userId}/private-exercices/${exerciceId}/exists`, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(false); }));
  }

  updateUserPrivateExercices(userId: string, exerciceIds: string[]): Observable<any> {
    return this.http.put(`${this.userUrl}/${userId}/private-exercices`, { exerciceIds }, httpOptionsBase)
      .pipe(catchError(err => { console.error(err); return of(); }));
  }

}
