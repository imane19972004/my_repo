// Nouveau fichier: src/app/patient-exercice-list/patient-exercice-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciceService } from '../../../services/exercice.service';
import { UserService } from '../../../services/user.service';
import { Exercice } from '../../../models/exercice.model';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-exercice-list',
  templateUrl: './patient-exercice-list.component.html',
  styleUrls: ['./patient-exercice-list.component.scss']
})
export class PatientExerciceListComponent implements OnInit {
  patientId: string = '';
  patient: User | undefined;
  assignedExercices: Exercice[] = [];
  availableExercices: Exercice[] = [];
  private exercicesSubscription: Subscription | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciceService: ExerciceService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPatientData();
    this.loadExercices();
  }
  
  ngOnDestroy(): void {
    if (this.exercicesSubscription) {
      this.exercicesSubscription.unsubscribe();
    }
  }
  
  loadPatientData(): void {
    this.userService.getUserById(this.patientId).subscribe(user => {
      this.patient = user;
      // Si user n'a pas de propriété assignedExercices, nous l'initialisons
      if (!user.assignedExercices) {
        user.assignedExercices = [];
        this.userService.updateUser(user);
      }
    });
  }
  
  loadExercices(): void {
    this.exercicesSubscription = this.exerciceService.getExercices().subscribe(allExercices => {
      // Pour l'instant, nous simulons les exercices assignés
      // Dans une application réelle, vous auriez une méthode pour récupérer 
      // les exercices assignés à ce patient spécifique
      this.userService.getUserById(this.patientId).subscribe(user => {
        if (user && user.assignedExercices) {
          this.assignedExercices = allExercices.filter(exercice => 
            user.assignedExercices?.includes(exercice.id));
            
          // Filtrer les exercices non assignés pour la section "Ajouter des exercices"
          this.availableExercices = allExercices.filter(exercice => 
            !user.assignedExercices?.includes(exercice.id));
        }
      });
    });
  }
  
  playExercice(exerciceId: string): void {
    this.router.navigate(['/game'], { queryParams: { id: exerciceId } });
  }
  
  removeExercice(exerciceId: string): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cet exercice de la liste du patient ?')) {
      this.userService.getUserById(this.patientId).subscribe(user => {
        if (user && user.assignedExercices) {
          user.assignedExercices = user.assignedExercices.filter(id => id !== exerciceId);
          this.userService.updateUser(user);
          this.loadExercices(); // Recharger les exercices
        }
      });
    }
  }
  
  addExerciceToPatient(exerciceId: string): void {
    this.userService.getUserById(this.patientId).subscribe(user => {
      if (user) {
        if (!user.assignedExercices) {
          user.assignedExercices = [];
        }
        user.assignedExercices.push(exerciceId);
        this.userService.updateUser(user);
        this.loadExercices(); // Recharger les exercices
      }
    });
  }
}