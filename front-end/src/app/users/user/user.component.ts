import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import {backendUrl} from "../../../configs/server.config";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input()
  user?: User;

  @Input()
  mode: string = 'manage';

  @Output()
  deleteUser: EventEmitter<User> = new EventEmitter<User>();

  @Output()
  goToUser: EventEmitter<User> = new EventEmitter<User>();

  backendUrl = backendUrl

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  delete() {
    this.deleteUser.emit(this.user);
  }

  goToUserHistory() {
    if (this.user) {
      this.router.navigate([`/users/${this.user.id}/history`]);  // Navigate to user history page
    }
  }

}
