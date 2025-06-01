import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PersonalExercice } from '../../../models/personal-exercice.model';
import { User } from '../../../models/user.model';
import { PersonalExerciceService } from '../../../services/personal-exercice.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-personal-exercice-list',
  templateUrl: './personal-exercice-list.component.html',
  styleUrls: ['./personal-exercice-list.component.scss']
})
export class PersonalExerciceListComponent implements OnInit, OnDestroy {
  public personalExercices: PersonalExercice[] = [];
  public currentUser: User | null = null;
  public userId: string = '';
  public isLoading: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalExerciceService: PersonalExerciceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['idUser'];
    
    if (this.userId) {
      this.loadUserData();
      this.loadPersonalExercices();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserData(): void {
    const userSub = this.userService.getUserById(this.userId).subscribe(user => {
      this.currentUser = user || null;
    });
    this.subscriptions.push(userSub);
  }

  private loadPersonalExercices(): void {
    const exercicesSub = this.personalExerciceService.getPersonalExercicesByUserId(this.userId)
      .subscribe(exercices => {
        this.personalExercices = exercices;
        this.isLoading = false;
      });
    this.subscriptions.push(exercicesSub);
  }

  createPersonalExercice(): void {
    this.router.navigate([`/${this.userId}/create-personal-exercice`]);
  }

  assignFromGeneral(): void {
    this.router.navigate([`/${this.userId}/assign-exercices`]);
  }

  playExercice(exercice: PersonalExercice): void {
    this.personalExerciceService.setSelectedPersonalExercice(exercice.id);
    this.router.navigate([`/${this.userId}/game/personal/${exercice.id}`]);
  }

  editExercice(exercice: PersonalExercice): void {
    this.router.navigate([`/${this.userId}/edit-personal-exercice/${exercice.id}`]);
  }

  deleteExercice(exercice: PersonalExercice): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'exercice "${exercice.name}" ?`)) {
      this.personalExerciceService.deletePersonalExercice(exercice.id);
      this.loadPersonalExercices();
    }
  }

  duplicateExercice(exercice: PersonalExercice): void {
    const duplicated: Omit<PersonalExercice, 'id' | 'createdAt' | 'modifiedAt'> = {
      userId: this.userId,
      name: `${exercice.name} (Copie)`,
      theme: exercice.theme,
      description: exercice.description,
      categories: [...exercice.categories],
      items: [...exercice.items],
      isFromGeneral: false
    };

    this.personalExerciceService.createPersonalExercice(duplicated);
    setTimeout(() => this.loadPersonalExercices(), 500);
  }

  goBack(): void {
    this.router.navigate(['/user-list']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  // ✅ Ajouté pour corriger l'erreur de template
  getOriginalExerciceName(originalId: string): string {
    // Remplacez ceci par une vraie logique si besoin
    return `#${originalId}`;
  }
}
