import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Exercice} from '../models/exercice.model';
import {DEFAULT_EXERCISE_DATA} from "../mocks/exercices-data";

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  // Stockage réactif des exercices
  private exercicesSubject = new BehaviorSubject<Exercice[]>([]);

  // Clé pour le stockage local
  private readonly STORAGE_KEY = 'memolink_exercices';

  constructor() {
    this.clearLocalStorage();
    // Chargement initial des exercices
    this.loadExercices();
  }

  /**
   * Charge les exercices depuis le localStorage.
   * Si absent ou invalide, initialise avec les exercices par défaut.
   */
  private loadExercices(): void {
    const storedExercices = localStorage.getItem(this.STORAGE_KEY);
    if (storedExercices) {
      try {
        const exercices = JSON.parse(storedExercices);
        this.exercicesSubject.next(exercices);
      } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
        this.exercicesSubject.next([]);
      }
    } else {
      this.initDefaultExercices();
    }
  }

  /**
   * Initialise avec les exercices par défaut.
   */
  private initDefaultExercices(): void {
    const defaultExercices: Exercice[] = DEFAULT_EXERCISE_DATA

    this.exercicesSubject.next(defaultExercices);
    this.saveExercices(defaultExercices);
  }

  /**
   * Sauvegarde la liste des exercices dans le localStorage.
   */
  private saveExercices(exercices: Exercice[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercices));
  }

  /**
   * Efface les exercices du localStorage et réinitialise le service.
   */
  clearLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY); // Effacer le stockage local
    this.exercicesSubject.next([]); // Réinitialiser le flux des exercices
    this.initDefaultExercices(); // Recharger les exercices par défaut
  }

  /**
   * Retourne un observable de tous les exercices.
   */
  getExercices(): Observable<Exercice[]> {
    return this.exercicesSubject.asObservable();
  }

  /**
   * Retourne un observable d'un exercice selon son ID.
   */
  getExerciceById(id: string): Observable<Exercice | undefined> {
    return new Observable(observer => {
      const exercices = this.exercicesSubject.value;
      const exercice = exercices.find(e => e.id === id);
      observer.next(exercice);
      observer.complete();
    });
  }

  /**
   * Ajoute un nouvel exercice en générant automatiquement son ID.
   */
  addExercice(exercice: Exercice): void {
    const currentExercices = this.exercicesSubject.value;
    // Assigner un ID unique exo-{n}
    exercice.id = `exo-${currentExercices.length + 1}`;

    const updatedExercices = [...currentExercices, exercice];
    this.exercicesSubject.next(updatedExercices);
    this.saveExercices(updatedExercices);
  }

  /**
   * Met à jour un exercice existant.
   */
  updateExercice(updatedExercice: Exercice): void {
    const currentExercices = this.exercicesSubject.value;
    const index = currentExercices.findIndex(e => e.id === updatedExercice.id);

    if (index !== -1) {
      const updatedExercices = [...currentExercices];
      updatedExercices[index] = updatedExercice;

      this.exercicesSubject.next(updatedExercices);
      this.saveExercices(updatedExercices);
    }
  }

  /**
   * Supprime un exercice par son ID et réattribue tous les IDs.
   */
  deleteExercice(id: string): void {
    const currentExercices = this.exercicesSubject.value;

    // Filtrer l'exercice à supprimer
    let updatedExercices = currentExercices.filter(exercice => exercice.id !== id);

    // Réassigner les IDs proprement
    updatedExercices = updatedExercices.map((exercice, index) => ({
      ...exercice,
      id: `exo-${index + 1}`
    }));

    this.exercicesSubject.next(updatedExercices);
    this.saveExercices(updatedExercices);
  }

  private selectedExerciceSubject$ = new BehaviorSubject<Exercice | null>(null);

  // Sélectionner un exercice
  setSelectedExercice(id: string): void {
    const exercices = this.exercicesSubject.value;
    const selectedExercice = exercices.find(ex => ex.id === id);
    this.selectedExerciceSubject$.next(selectedExercice || null);
  }

  getSelectedExercice() {
    return this.selectedExerciceSubject$.asObservable();
  }

}
