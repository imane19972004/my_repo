// src/app/patient-exercice-list/patient-exercice-list/patient-exercice-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Exercice } from '../../../models/exercice.model';
import { ExerciceService } from '../../../services/exercice.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-patient-exercice-list',
  templateUrl: './patient-exercice-list.component.html',
  styleUrls: ['./patient-exercice-list.component.scss']
})
export class PatientExerciceListComponent implements OnInit, OnDestroy {
  patientId: string = '';
  patientName: string = '';
  exercices: Exercice[] = [];
  allExercices: Exercice[] = [];
  private subscriptions: Subscription[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciceService: ExerciceService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    // Récupérer l'ID du patient depuis l'URL
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.patientId) {
      // Charger les informations du patient
      this.loadPatientInfo();
      
      // Charger les exercices du patient
      this.loadPatientExercices();
      
      // Charger tous les exercices pour l'attribution
      this.loadAllExercices();
    } else {
      this.router.navigate(['/user-list']);
    }
  }
  
  loadPatientInfo(): void {
    // Cette méthode serait implémentée en fonction de votre UserService
    const userSub = this.userService.getUserById(this.patientId).subscribe({
      next: (user) => {
        if (user) {
          this.patientName = `${user.firstName} ${user.lastName}`;
        }
      },
      error: (err) => console.error('Erreur lors du chargement des informations du patient', err)
    });
    
    this.subscriptions.push(userSub);
  }
  
  loadPatientExercices(): void {
    const exerciceSub = this.exerciceService.getPatientExercices(this.patientId).subscribe({
      next: (exercices) => {
        this.exercices = exercices;
      },
      error: (err) => console.error('Erreur lors du chargement des exercices du patient', err)
    });
    
    this.subscriptions.push(exerciceSub);
  }
  
  loadAllExercices(): void {
    const allExercicesSub = this.exerciceService.getExercices().subscribe({
      next: (exercices) => {
        this.allExercices = exercices;
      },
      error: (err) => console.error('Erreur lors du chargement de tous les exercices', err)
    });
    
    this.subscriptions.push(allExercicesSub);
  }
  
  playExercice(exercice: Exercice): void {
    this.exerciceService.setSelectedExercice(exercice.id);
    this.router.navigate([`/${this.patientId}/game/${exercice.id}`]);
  }
  
  removeExercice(exercice: Exercice): void {
    if (confirm(`Êtes-vous sûr de vouloir retirer l'exercice "${exercice.name}" de ce patient ?`)) {
      this.exerciceService.removeExerciceFromPatient(exercice.id, this.patientId);
      this.loadPatientExercices(); // Recharger la liste
    }
  }
  
  deleteExercice(exercice: Exercice): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'exercice "${exercice.name}" ?`)) {
      this.exerciceService.deleteExercice(exercice.id);
      this.loadPatientExercices(); // Recharger la liste
    }
  }
  
  assignExercice(exerciceId: string): void {
    this.exerciceService.assignExerciceToPatient(exerciceId, this.patientId);
    this.loadPatientExercices(); // Recharger la liste
  }
  
  isExerciceAssigned(exerciceId: string): boolean {
    return this.exercices.some(ex => ex.id === exerciceId);
  }
  
  navigateToCreateExercice(): void {
    this.router.navigate(['/create-exercice']);
  }
  
  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}