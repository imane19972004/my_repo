import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciceService } from '../../services/exercice.service';
import { Exercice } from '../../models/exercice.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exercice-list',
  templateUrl: './exercice-list.component.html',
  styleUrls: ['./exercice-list.component.scss'],
  standalone: false
})
export class ExerciceListComponent implements OnInit, OnDestroy {
  exercices: Exercice[] = [];
  private exercicesSubscription: Subscription | undefined;
  isLoading: boolean = true;

  constructor(
    private exerciceService: ExerciceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExercices();
  }

  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.exercicesSubscription) {
      this.exercicesSubscription.unsubscribe();
    }
  }

  loadExercices(): void {
    this.isLoading = true;
    this.exercicesSubscription = this.exerciceService.getExercices().subscribe({
      next: (exercices) => {
        this.exercices = exercices;
        this.isLoading = false;
        console.log('Exercices chargés:', this.exercices);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des exercices:', error);
        this.isLoading = false;
      }
    });
  }

  deleteExercice(id: string | undefined): void {
    if (!id) {
      console.error('Impossible de supprimer: ID non défini');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
      this.exerciceService.deleteExercice(id);
      // Le service devrait déjà émettre une mise à jour, mais au cas où:
      setTimeout(() => this.loadExercices(), 100);
    }
  }

  navigateToCreateExercice(): void {
    this.router.navigate(['/create-exercice']);
  }
}