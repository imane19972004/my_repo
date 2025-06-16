import { Component, OnInit } from '@angular/core';
import { User } from "../../../models/user.model";
import { UserService } from "../../../services/user.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public userList: User[] = [];
  public mode: 'play' | 'manage' = 'manage';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.some(seg => seg.path === 'choose-user')) {
        this.mode = 'play';
      }
    });

    this.userService.users$.subscribe((users: User[]) => {
      this.userList = users;
    });
  }

  ngOnInit() {}

  deleteUser(user: User) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      this.userService.deleteUser(user);
    }
  }

  goToUserHistory(userId: string) {
    this.router.navigate(['/users', userId, 'history']);
  }

  // Méthode pour sélectionner un utilisateur
  selectUser(user: User) {
    this.userService.setSelectedUser(user); // On passe l'objet utilisateur complet ici

    if (this.mode === 'play') {
      // Redirection vers la page de choix d'exercice avec l'ID de l'utilisateur
      this.router.navigate([`/${user.id}/choose-exercice`]);
    } else {
      this.goToUserHistory(user.id);
    }
  }

  goToCreateUser() {
    this.router.navigate(['/create-user']);
  }
}
