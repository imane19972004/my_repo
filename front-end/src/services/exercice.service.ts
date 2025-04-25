// exercice.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercice } from '../models/exercice.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  private exercices: Exercice[] = [];
  private exercicesSubject: BehaviorSubject<Exercice[]> = new BehaviorSubject<Exercice[]>([]);
  
  // Propriété observable pour que les composants puissent souscrire aux changements
  public exercices$: Observable<Exercice[]> = this.exercicesSubject.asObservable();

  constructor() {
    // Charger les exercices depuis le localStorage si disponibles
    const savedExercices = localStorage.getItem('exercices');
    if (savedExercices) {
      this.exercices = JSON.parse(savedExercices);
      this.emitExercices();
    }
  }

  // Émettre les exercices à tous les abonnés
  private emitExercices(): void {
    this.exercicesSubject.next([...this.exercices]);
    // Sauvegarder dans le localStorage
    localStorage.setItem('exercices', JSON.stringify(this.exercices));
  }

  // Obtenir tous les exercices
  getExercices(): Observable<Exercice[]> {
    return this.exercices$;
  }

  // Ajouter un nouvel exercice
  addExercice(exercice: Exercice): void {
    // Générer un ID unique
    exercice.id = Date.now().toString();
    this.exercices.push({...exercice});
    this.emitExercices();
  }

  // Mettre à jour un exercice existant
  updateExercice(updatedExercice: Exercice): void {
    const index = this.exercices.findIndex(e => e.id === updatedExercice.id);
    if (index !== -1) {
      this.exercices[index] = {...updatedExercice};
      this.emitExercices();
    }
  }

  // Supprimer un exercice
  deleteExercice(exerciceId: string): void {
    this.exercices = this.exercices.filter(e => e.id !== exerciceId);
    this.emitExercices();
  }

  // Obtenir un exercice par son ID
  getExerciceById(exerciceId: string): Exercice | undefined {
    return this.exercices.find(e => e.id === exerciceId);
  }
}