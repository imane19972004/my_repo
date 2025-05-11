import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { ExerciceService } from '../../../../services/exercice.service';
import { Exercice } from '../../../../models/exercice.model';

@Component({
  selector: 'app-user-exercice-view',
  templateUrl: './user-exercice-view.component.html',
  styleUrls: ['./user-exercice-view.component.scss']
})
export class UserExerciceViewComponent implements OnInit {
  userId: string | null = null;
  user: User | null = null;
  assignedExercices: Exercice[] = [];
  availableExercices: Exercice[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private exerciceService: ExerciceService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    
    if (this.userId) {
      // Récupérer les informations de l'utilisateur
      this.userService.getUserById(this.userId).subscribe(user => {
        this.user = user;
      });

      // Charger les exercices attribués à l'utilisateur
      this.loadAssignedExercices();
      
      // Charger tous les exercices disponibles
      this.loadAvailableExercices();
    } else {
      this.router.navigate(['/user-list']);
    }
  }

  loadAssignedExercices(): void {
    if (this.userId) {
      this.exerciceService.getUserExercices(this.userId).subscribe(exercices => {
        this.assignedExercices = exercices;
        this.updateAvailableExercices();
      });
    }
  }

  loadAvailableExercices(): void {
    this.exerciceService.getAllExercices().subscribe(exercices => {
      this.availableExercices = exercices;
      this.updateAvailableExercices();
    });
  }

  // Mettre à jour la liste des exercices disponibles (exclure ceux déjà attribués)
  updateAvailableExercices(): void {
    if (this.assignedExercices.length > 0 && this.availableExercices.length > 0) {
      const assignedIds = this.assignedExercices.map(ex => ex.id);
      this.availableExercices = this.availableExercices.filter(ex => !assignedIds.includes(ex.id));
    }
  }

  assignExerciceToUser(exercice: Exercice): void {
    if (this.userId) {
      this.exerciceService.assignExerciceToUser(this.userId, exercice.id).subscribe(() => {
        // Mettre à jour les listes après attribution
        this.assignedExercices.push(exercice);
        this.availableExercices = this.availableExercices.filter(ex => ex.id !== exercice.id);
      });
    }
  }

  removeExercice(exercice: Exercice): void {
    if (this.userId) {
      this.exerciceService.removeExerciceFromUser(this.userId, exercice.id).subscribe(() => {
        // Mettre à jour les listes après suppression
        this.assignedExercices = this.assignedExercices.filter(ex => ex.id !== exercice.id);
        this.availableExercices.push(exercice);
      });
    }
  }

  playExercice(exercice: Exercice): void {
    if (this.userId) {
      this.router.navigate([`/${this.userId}/game/${exercice.id}`]);
    }
  }
}