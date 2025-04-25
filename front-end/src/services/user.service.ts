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

  // Ajout et mise à jour des utilisateurs avec vérification des champs
  // Création d’historique vide
  addUser(user: User) {
    this.http.post<User>(this.userUrl, user, httpOptionsBase).subscribe((createdUser) => {
      if (!createdUser.firstName.trim() && !createdUser.lastName.trim()) {
        // Si prénom et nom vides, on supprime l'utilisateur
        this.deleteUser(createdUser);
      } else {
        // Crée un historique vide pour l'utilisateur, en associant le userId
        const emptyHistory: UserHistory[] = [{
          userId: createdUser.id,
          category: { name: "", description: '', imagePath: '' },
          items: [],  // Liste vide pour l'instant
          success: 0,  // Valeur initiale
          failure: 0   // Valeur initiale
        }];

        const historyUrl = `${this.userHistoryUrl}/${createdUser.id}`;  // Utilisation de l'ID de l'utilisateur pour créer son historique
        this.http.post(this.userHistoryUrl, emptyHistory, httpOptionsBase).subscribe(() => {
          // Met à jour la liste des utilisateurs après la création de l'historique
          this.retrieveUsers();
        });
      }
    });
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
