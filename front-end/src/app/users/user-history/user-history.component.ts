import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserHistory } from '../../../models/user-history.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {

  userHistory: UserHistory[] = [];
  userId: string | null = null;
  loading: boolean = true;
  user: User | null = null;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // Récupérer l'utilisateur
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.user = user ?? null;
      });

      // Récupérer son historique
      this.userService.getUserHistoryById(this.userId).subscribe(
        (history) => {
          this.userHistory = history;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching user history:', error);
          this.loading = false;
        }
      );
    }
  }

}
