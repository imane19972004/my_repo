import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserHistory } from '../../../models/user-history.model';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})

export class UserHistoryComponent implements OnInit {

  userHistory: UserHistory[] = [];
  userId: string | null = null;
  loading: boolean = true; // Add a loading state to manage async requests

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get userId from the route params
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // Fetch the user history from the UserService
      this.userService.getUserHistoryById(this.userId).subscribe(
        (history) => {
          this.userHistory = history;
          this.loading = false;  // Set loading to false after data is fetched
        },
        (error) => {
          console.error('Error fetching user history:', error);
          this.loading = false;  // Set loading to false in case of error
        }
      );
    }
  }
}
