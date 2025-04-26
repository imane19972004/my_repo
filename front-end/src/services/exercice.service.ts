import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercice } from '../models/exercice.model';
import { v4 as uuidv4 } from 'uuid'; // Vous devrez peut-être installer ce package

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  // BehaviorSubject pour stocker la liste des exercices et notifier les abonnés des changements
  private exercicesSubject = new BehaviorSubject<Exercice[]>([]);
  
  constructor() {
    // Charger les exercices du localStorage au démarrage
    this.loadExercicesFromStorage();
  }

  // Obtenir tous les exercices
  getExercices(): Observable<Exercice[]> {
    return this.exercicesSubject.asObservable();
  }

  // Obtenir un exercice par son ID
  getExerciceById(id: string): Observable<Exercice | undefined> {
    return this.exercicesSubject.pipe(
      map(exercices => exercices.find(exercice => exercice.id === id))
    );
  }

  // Ajouter un nouvel exercice
  addExercice(exercice: Exercice): void {
    // Générer un ID unique s'il n'en a pas ou s'il est vide
    const exerciceWithId = {
      ...exercice,
      id: exercice.id && exercice.id.trim() !== '' ? exercice.id : uuidv4()
    };
  
    // Ajouter le nouvel exercice à la liste existante
    const updatedExercices = [...this.exercicesSubject.value, exerciceWithId];
    
    // Mettre à jour le BehaviorSubject
    this.exercicesSubject.next(updatedExercices);
    
    // Sauvegarder dans le localStorage
    this.saveExercicesToStorage(updatedExercices);
    
    console.log('Exercice ajouté avec succès:', exerciceWithId);
  }

  // Supprimer un exercice
  deleteExercice(id: string): void {
    if (!id) {
      console.error('ID d\'exercice invalide pour la suppression');
      return;
    }
    
    // Filtrer la liste pour exclure l'exercice à supprimer
    const updatedExercices = this.exercicesSubject.value.filter(exercice => exercice.id !== id);
    
    // Mettre à jour le BehaviorSubject
    this.exercicesSubject.next(updatedExercices);
    
    // Sauvegarder dans le localStorage
    this.saveExercicesToStorage(updatedExercices);
    
    console.log('Exercice supprimé avec succès:', id);
  }

  // Mettre à jour un exercice existant
  updateExercice(updatedExercice: Exercice): void {
    // Trouver l'index de l'exercice à mettre à jour
    const exercices = this.exercicesSubject.value;
    const index = exercices.findIndex(exercice => exercice.id === updatedExercice.id);
    
    if (index !== -1) {
      // Remplacer l'ancien exercice par le nouveau
      exercices[index] = updatedExercice;
      
      // Mettre à jour le BehaviorSubject
      this.exercicesSubject.next([...exercices]);
      
      // Sauvegarder dans le localStorage
      this.saveExercicesToStorage(exercices);
      
      console.log('Exercice mis à jour avec succès:', updatedExercice);
    } else {
      console.error('Exercice non trouvé pour la mise à jour:', updatedExercice.id);
    }
  }

  // Charger les exercices depuis le localStorage
  private loadExercicesFromStorage(): void {
    try {
      const storedExercices = localStorage.getItem('exercices');
      
      if (storedExercices) {
        const exercices = JSON.parse(storedExercices);
        this.exercicesSubject.next(exercices);
        console.log('Exercices chargés depuis le localStorage:', exercices);
      } else {
        console.log('Aucun exercice trouvé dans le localStorage');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des exercices depuis le localStorage:', error);
    }
  }

  // Sauvegarder les exercices dans le localStorage
  private saveExercicesToStorage(exercices: Exercice[]): void {
    try {
      localStorage.setItem('exercices', JSON.stringify(exercices));
      console.log('Exercices sauvegardés dans le localStorage');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des exercices dans le localStorage:', error);
    }
  }
}