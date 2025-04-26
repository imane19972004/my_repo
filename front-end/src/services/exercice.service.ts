// services/exercice.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercice } from '../models/exercice.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  // BehaviorSubject pour stocker la liste des exercices
  private exercicesSubject = new BehaviorSubject<Exercice[]>([]);
  
  // Clé pour le stockage local
  private readonly STORAGE_KEY = 'memolink_exercices';

  constructor() {
    // Charger les exercices du localStorage au démarrage
    this.loadExercices();
  }

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
      // Initialiser avec des exercices par défaut si aucun n'est trouvé
      this.initDefaultExercices();
    }
  }

  private initDefaultExercices(): void {
    const defaultExercices: Exercice[] = [
      {
        id: uuidv4(),
        name: 'Rangeons notre maison !',
        theme: 'Objets et pièces de la maison',
        description: 'Placez chaque objet dans la pièce où il appartient.',
        categories: [
          { name: 'Cuisine', description: 'Là où on prépare les repas', imagePath: 'cuisine.png' },
          { name: 'Salon', description: 'Pièce de détente et de convivialité', imagePath: 'salon.png' },
          { name: 'Salle de bain', description: 'Lieu d\'hygiène personnelle', imagePath: 'sdb.png' }
        ],
        items: [
          { name: 'Fourchette', description: 'Ustensile pour manger', imagePath: 'fourchette.png', category: 'Cuisine' },
          { name: 'Télévision', description: 'Pour regarder des émissions', imagePath: 'tv.png', category: 'Salon' },
          { name: 'Brosse à dents', description: 'Pour l\'hygiène dentaire', imagePath: 'brosse.png', category: 'Salle de bain' },
          { name: 'Casserole', description: 'Pour faire cuire les aliments', imagePath: 'casserole.png', category: 'Cuisine' },
          { name: 'Canapé', description: 'Meuble pour s\'asseoir', imagePath: 'canape.png', category: 'Salon' },
          { name: 'Savon', description: 'Pour se laver', imagePath: 'savon.png', category: 'Salle de bain' }
        ]
      },
      {
        id: uuidv4(),
        name: 'Habillons-nous selon la saison !',
        theme: 'Vêtements et saisons',
        description: 'Associez chaque vêtement à la saison appropriée.',
        categories: [
          { name: 'Été', description: 'Saison chaude', imagePath: 'ete.png' },
          { name: 'Hiver', description: 'Saison froide', imagePath: 'hiver.png' },
          { name: 'Mi-saison', description: 'Printemps ou automne', imagePath: 'mi-saison.png' }
        ],
        items: [
          { name: 'Maillot de bain', description: 'Pour nager', imagePath: 'maillot.png', category: 'Été' },
          { name: 'Écharpe', description: 'Pour protéger le cou du froid', imagePath: 'echarpe.png', category: 'Hiver' },
          { name: 'Imperméable', description: 'Protège de la pluie', imagePath: 'impermeable.png', category: 'Mi-saison' }
        ]
      }
    ];

    this.exercicesSubject.next(defaultExercices);
    this.saveExercices(defaultExercices);
  }

  private saveExercices(exercices: Exercice[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercices));
  }

  getExercices(): Observable<Exercice[]> {
    return this.exercicesSubject.asObservable();
  }

  getExerciceById(id: string): Observable<Exercice | undefined> {
    return new Observable(observer => {
      const exercices = this.exercicesSubject.value;
      const exercice = exercices.find(e => e.id === id);
      observer.next(exercice);
      observer.complete();
    });
  }

  addExercice(exercice: Exercice): void {
    // Assigner un ID si non défini
    if (!exercice.id) {
      exercice.id = uuidv4();
    }

    const currentExercices = this.exercicesSubject.value;
    const updatedExercices = [...currentExercices, exercice];
    
    this.exercicesSubject.next(updatedExercices);
    this.saveExercices(updatedExercices);
  }

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

  deleteExercice(id: string): void {
    const currentExercices = this.exercicesSubject.value;
    const updatedExercices = currentExercices.filter(exercice => exercice.id !== id);
    
    this.exercicesSubject.next(updatedExercices);
    this.saveExercices(updatedExercices);
  }
}