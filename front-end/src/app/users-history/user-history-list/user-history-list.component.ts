import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {UserHistory} from "../../../models/user-history.model";
import {UserComponent} from "../../users/user/user.component";
import {User} from "../../../models/user.model";

@Component({
  selector: "app-user-history-list",
  templateUrl: "./user-history-list.component.html",
  styleUrls: ["./user-history-list.component.scss"]
})
export class UserHistoryListComponent implements OnInit {

  user: User | null = null;
  usersHistoryList: UserHistory[] = [];

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadUserHistory();
  }

  // Method to load user history data
  loadUserHistory(): void {
    this.userService.getUserHistoryById(this.user != null ? this.user.id : "").subscribe(
      (data: UserHistory[]) => {this.usersHistoryList = data;},
      (error) => {console.error("Error fetching user history:", error);}
    );
  }

  // Method to navigate to a detailed page for a specific user's history
  viewUserHistoryDetail(): void {
    this.router.navigate([`/user-history/${this.user}`]);
  }
}
