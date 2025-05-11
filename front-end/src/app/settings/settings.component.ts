// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { SettingsService, GameSettings } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isOpen: boolean = false;
  
  // Configuration par défaut
  settings: GameSettings = {
    objectsCount: 4,
    textSize: 16,
    textStyle: 'normal',
    contrast: 50,
    helpType: 'text',
    errorRetries: 2,
    gameDuration: 10
  };

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    // Charger les paramètres sauvegardés au démarrage
    const currentSettings = this.settingsService.getCurrentSettings();
    this.settings = {
      ...this.settings,
      ...currentSettings
    };
  }

  toggleSettings() {
    this.isOpen = !this.isOpen;
  }
  
  // Méthode appelée lorsqu'un paramètre est modifié
  onSettingChange() {
    // Déterminer le niveau de difficulté basé sur le nombre d'objets
    const calculatedDifficulty = this.calculateDifficulty(this.settings.objectsCount);
    
    // Mettre à jour les paramètres
    const updatedSettings: GameSettings = {
      ...this.settings,
      difficulty: calculatedDifficulty
    };
    
    // Appliquer immédiatement les modifications
    this.settingsService.saveSettings(updatedSettings);
  }
  
  saveSettings() {
    // Cette méthode est appelée lors du clic sur le bouton "Enregistrer"
    // Les paramètres sont déjà enregistrés au fur et à mesure, on ferme simplement le panneau
    alert('Paramètres enregistrés !');
    this.toggleSettings(); // Fermer le panneau après sauvegarde
  }
  
  resetSettings() {
    // Réinitialisation des paramètres
    this.settings = {
      objectsCount: 4,
      textSize: 16,
      textStyle: 'normal',
      contrast: 50,
      helpType: 'text',
      errorRetries: 2,
      gameDuration: 10
    };
    
    // Appliquer immédiatement les modifications
    this.onSettingChange();
  }
  
  // Calcule la difficulté en fonction du nombre d'objets
  calculateDifficulty(objectsCount: number): string {
    if (objectsCount <= 3) {
      return 'easy';
    } else if (objectsCount <= 5) {
      return 'medium';
    } else {
      return 'hard';
    }
  
  }

  get difficultyLabel(): string {
  switch (this.settings.difficulty) {
    case 'easy':
      return 'Facile';
    case 'medium':
      return 'Moyen';
    case 'hard':
      return 'Difficile';
    default:
      return 'Inconnu';
  }
}

onObjectsCountChange(): void {
  this.onSettingChange(); // Réutilise ta logique déjà définie
}


  
}