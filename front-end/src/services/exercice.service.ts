import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercice } from '../models/exercice.model';
import { Category } from '../models/category.model'; // Assurer l'importation de Category
import { Item } from '../models/item.model'; // Assurer l'importation de Item

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  // Liste des exercices avec des données de test (mock)
  private exerciceList: Exercice[] = [
    {
      id: '1',
      name: 'Objets et pièces de la maison',
      items: [
        { name: 'Fourchette', description: 'Ustensile de cuisine', imagePath: 'fourchette.png', category: 'Cuisine' },
        { name: 'Canapé', description: 'Meuble de salon', imagePath: 'canape.png', category: 'Salon' }
      ],
      categories: [{ name: 'Cuisine', description: '', imagePath: '' }, { name: 'Salon', description: '', imagePath: '' }]
    }
  ];

  // BehaviorSubject pour notifier les composants des changements
  private exerciceSubject: BehaviorSubject<Exercice[]> = new BehaviorSubject<Exercice[]>(this.exerciceList);

  constructor() {}

  // Retourne les exercices sous forme d'observable
  getExercices(): Observable<Exercice[]> {
    return this.exerciceSubject.asObservable();
  }

  // Ajouter un exercice
  addExercice(exercice: Exercice): void {
    const newExercice = { ...exercice, id: Math.random().toString(36).substr(2, 9) }; // Générer un ID unique
    this.exerciceList.push(newExercice);
    this.exerciceSubject.next([...this.exerciceList]); // Émettre la nouvelle liste
    console.log('Exercice ajouté :', newExercice);
  }

  // Mettre à jour un exercice existant
  updateExercice(updatedExercice: Exercice): void {
    const index = this.exerciceList.findIndex(ex => ex.id === updatedExercice.id);
    if (index !== -1) {
      this.exerciceList[index] = updatedExercice;
      this.exerciceSubject.next([...this.exerciceList]);
      console.log('Exercice mis à jour :', updatedExercice);
    }
  }

  // Supprimer un exercice par ID
  deleteExercice(id: string): void {
    this.exerciceList = this.exerciceList.filter(ex => ex.id !== id);
    this.exerciceSubject.next([...this.exerciceList]);
    console.log('Exercice supprimé, ID :', id);
  }
}
