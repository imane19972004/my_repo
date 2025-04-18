import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { serverUrl, httpOptionsBase } from '../configs/server.config';
import { UserHistory } from "../models/user-history.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  serverUrlLoc: string = "http://localhost:9428";
  private userUrl = this.serverUrlLoc + '/users';
  private userHistoryUrl = this.serverUrlLoc + '/userHistories';

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public userSelected$: Subject<User> = new Subject();

  constructor(private http: HttpClient) {
    this.retrieveUsers();  // Charge les utilisateurs dès le démarrage
  }

  // Ajout et mise à jour des utilisateurs
  addUser(user: User) {
    this.http.post<User>(this.userUrl, user, httpOptionsBase).subscribe(() => this.retrieveUsers());
  }

  // Suppression et mise à jour des utilisateurs
  deleteUser(user: User) {
    const urlWithId = this.userUrl + '/' + user.id;
    this.http.delete(urlWithId, httpOptionsBase).subscribe(() => this.retrieveUsers());
  }

  // Récupérer et stocker les utilisateurs
  private retrieveUsers() {
    this.http.get<User[]>(this.userUrl, httpOptionsBase).subscribe((userList) => {
      this.users$.next(userList);
    });
  }

  // Récupérer un utilisateur par son ID
  setSelectedUser(userId: string): void {
    const urlWithId = `${this.userUrl}/${userId}`;
    this.http.get<User>(urlWithId, httpOptionsBase).subscribe((user) => {
      this.userSelected$.next(user);
    });
  }

  // Récupérer l'historique d'un utilisateur par ID
  getUserHistoryById(userId: string): Observable<UserHistory[]> {
    if (userId.length <= 0) {
      console.error('User id must be greater than 0');
      return new Observable<UserHistory[]>();
    }
    const urlWithId = `${this.userUrl}/${userId}/history`
    return this.http.get<UserHistory[]>(urlWithId, httpOptionsBase);
  }

}
