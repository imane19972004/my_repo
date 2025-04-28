import { Component ,OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public title: string = 'MemoLink';
  public showSuccess = false;

  constructor() {

  }
  ngOnInit() {

  }



  showHideSuccess() {
    this.showSuccess = !this.showSuccess;
  }
}
