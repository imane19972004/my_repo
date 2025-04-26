// 

// settings.component.ts
import { Component, OnInit } from '@angular/core';
// Pas besoin d'importer CommonModule et FormsModule ici si c'est fait dans AppModule
// Si le composant est standalone, on conserve ces imports

type DifficultyLevel = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isOpen: boolean = false;
  
  // Configuration par défaut
  settings = {
    difficulty: 'medium' as DifficultyLevel,
    objectsCount: 4,
    textSize: 16,
    textStyle: 'normal',
    contrast: 50,
    musicVolume: 50,
    effectsVolume: 50,
    helpType: 'text',
    errorRetries: 2,
    gameDuration: 10
  };

  // Options pour le nombre d'objets en fonction de la difficulté
  objectsOptions: Record<DifficultyLevel, number[]> = {
    easy: [2, 3],
    medium: [4, 5],
    hard: [6, 7, 8]
  };

  ngOnInit() {
    // Charger les paramètres sauvegardés au démarrage
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.settings = {
          ...this.settings,
          ...parsed
        };
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e);
      }
    }
  }

  toggleSettings() {
    this.isOpen = !this.isOpen;
  }
  
  // Met à jour les options du nombre d'objets quand la difficulté change
  updateObjectsOptions(difficulty: DifficultyLevel) {
    // On se contente de changer la difficulté
    this.settings.difficulty = difficulty;
    
    // On met par défaut la première valeur disponible
    this.settings.objectsCount = this.objectsOptions[difficulty][0];
  }
  
  saveSettings() {
    // Sauvegarde des paramètres dans le localStorage
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    alert('Paramètres enregistrés !');
    this.toggleSettings(); // Fermer le panneau après sauvegarde
  }
  
  resetSettings() {
    // Réinitialisation des paramètres
    this.settings = {
      difficulty: 'medium' as DifficultyLevel,
      objectsCount: 4,
      textSize: 16,
      textStyle: 'normal',
      contrast: 50,
      musicVolume: 50,
      effectsVolume: 50,
      helpType: 'text',
      errorRetries: 2,
      gameDuration: 10
    };
  }
}