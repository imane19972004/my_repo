import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'Welcome';
  showSuccess = false;

  showHideSuccess() {
    this.showSuccess = !this.showSuccess;
  }

  constructor() {};

}
