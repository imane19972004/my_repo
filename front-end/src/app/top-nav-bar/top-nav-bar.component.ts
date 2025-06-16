import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent {
  @Input() showBackToUsers = false;
  @Input() showCreateExercice = false;
  @Input() showBackToExercices = false;
  @Input() showBackToHome = false;
  @Input() showGoToCreateUser = false;

  constructor(private router: Router) {}

  navigateBackToUserList() {
    this.router.navigate(['/user-list']);
  }

  navigateToCreateExercice() {
    this.router.navigate(['/create-exercice']);
  }

  navigateBackToExerciceList() {
    this.router.navigate(['/exercice-list-manager']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }
}
