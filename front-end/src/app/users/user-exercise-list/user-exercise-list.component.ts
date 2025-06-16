import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercice } from '../../../models/exercice.model';
import { ExerciceService } from '../../../services/exercice.service';
import { UserService } from '../../../services/user.service';
import { UserExerciseList } from '../../../models/user-exercise-list.model';

@Component({
  selector: 'app-user-exercise-list',
  templateUrl: './user-exercise-list.component.html',
  styleUrls: ['./user-exercise-list.component.scss']
})
export class UserExerciseListComponent implements OnInit {
  userId: string = '';
  userName: string = '';
  userExerciseList: UserExerciseList = {
    userId: '',
    userExerciceList: []
  };
  allExercises: Exercice[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciceService: ExerciceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('idUser') || '';

    if (this.userId != '') {
      this.userExerciseList.userId = this.userId;
      this.loadUserName();
      this.loadUserExercises();
      this.loadAllExercices();
    } else {
      this.router.navigate(['/user-list']);
    }
  }

  loadUserName(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => { this.userName = `${user?.firstName} ${user?.lastName}`; },
      error: (err) => console.error('Erreur lors du chargement du nom d\'utilisateur', err)
    });
  }

  loadUserExercises(): void {
    this.exerciceService.getUserExercisesByUserId(this.userId).subscribe({
      next: (data: UserExerciseList) => { this.userExerciseList = data; },
      error: (err: any) => console.error('Erreur lors du chargement des exercices', err)
    });
  }

  loadAllExercices(): void {
    this.exerciceService.exercices$.subscribe({
      next: (exercices) => { this.allExercises = exercices; },
      error: (err) => console.error('Erreur lors du chargement de tous les exercices', err)
    });
  }

  isAssigning = false;

  assignExercice(exercice: Exercice): void {
    if (this.isExerciceAssigned(exercice)) {
      alert('Cet exercice est déjà attribué à l’utilisateur.');
      return;
    }

    this.isAssigning = true;
    this.exerciceService.assignExerciceToUser(exercice, this.userId).subscribe({
      next: () => {
        this.loadUserExercises(); // Rechargement de la liste
        this.isAssigning = false;
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'attribution de l\'exercice', err);
        this.isAssigning = false;
      }
    });
  }


  removeExercice(exerciceId: string): void {
    if (confirm('Voulez-vous retirer cet exercice de l’utilisateur ?')) {
      this.exerciceService.removeExerciceFromUser(exerciceId, this.userId).subscribe({
        next: () => this.loadUserExercises(),
        error: (err: any) => console.error('Erreur lors de la suppression de l\'exercice', err)
      });
    }
  }

  isExerciceAssigned(exercice: Exercice): boolean {
    return this.userExerciseList.userExerciceList?.some(e => String(e.id) === String(exercice.id));
  }


  navigateToCreateExercice(): void {
    this.router.navigate(['/create-exercice']);
  }

  navigateBackToUserList(): void {
    this.router.navigate(['/choose-user']);
  }

  playExercice(exercice: Exercice): void {
    this.exerciceService.setSelectedExercice(exercice.id);

    if (this.userId) {
      console.log('Player ID before navigation:', this.userId);
      console.log('Exercice ID:', exercice.id);

      // Redirection selon le mode 'play' avec l'ID du joueur et l'ID de l'exercice
      this.router.navigate([`/${this.userId}/game/${exercice.id}`]);
    } else {
      console.log('Player ID is not defined');
      this.router.navigate(['/choose-user']);
    }
  }

}
