// Dans src/app/users/user/user.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input()
  user?: User;

  @Output()
  deleteUser: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  goToUser: EventEmitter<User> = new EventEmitter<User>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  delete() {
    this.deleteUser.emit(this.user);
  }

  goToUserHistory() {
    if (this.user) {
      this.router.navigate([`/users/${this.user.id}/history`]);
    }
  }

  // Ajoutez cette méthode
  goToUserExercices() {
    if (this.user) {
      this.router.navigate([`/users/${this.user.id}/exercices`]);
    }
  }

  selectUser() {
    if (this.user) {
      this.goToUser.emit(this.user);
    }
  }
}