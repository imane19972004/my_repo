// settings.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  isOpen: boolean = false;
  
  // Configuration par défaut
  settings = {
    difficulty: 'medium',
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
  objectsOptions = {
    easy: [2, 3],
    medium: [4, 5],
    hard: [6, 7, 8]
  };

  toggleSettings() {
    this.isOpen = !this.isOpen;
  }
  
  // Met à jour les options du nombre d'objets quand la difficulté change
  updateObjectsOptions(difficulty: string) {
    // On se contente de changer la difficulté
    // Les options sont automatiquement mises à jour dans le template
    this.settings.difficulty = difficulty;
    
    // On met par défaut la première valeur disponible
    if (this.objectsOptions[difficulty as keyof typeof this.objectsOptions]) {
      this.settings.objectsCount = this.objectsOptions[difficulty as keyof typeof this.objectsOptions][0];
    }
  }
  
  saveSettings() {
    // Sauvegarde des paramètres dans le localStorage
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    alert('Paramètres enregistrés !');
  }
  
  resetSettings() {
    // Réinitialisation des paramètres
    this.settings = {
      difficulty: 'medium',
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