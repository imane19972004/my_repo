import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interface simplifiée pour les paramètres du jeu
export interface GameSettings {
  difficulty?: string; // Calculé automatiquement à partir du nombre d'objets
  objectsCount: number;
  textSize: number;
  textStyle: string;
  contrast: number;
  helpType: string;
  errorRetries: number;
  gameDuration: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // Paramètres par défaut
  private defaultSettings: GameSettings = {
    difficulty: 'medium',
    objectsCount: 4,
    textSize: 16,
    textStyle: 'normal',
    contrast: 50,
    helpType: 'text',
    errorRetries: 2,
    gameDuration: 10
  };

  // BehaviorSubject pour suivre les changements de paramètres
  private settingsSubject = new BehaviorSubject<GameSettings>(this.defaultSettings);
  
  // Observable que les composants peuvent souscrire
  public settings$ = this.settingsSubject.asObservable();
  
  constructor() {
    this.loadSettings();
  }

  // Charge les paramètres depuis le localStorage
  private loadSettings(): void {
    const storedSettings = localStorage.getItem('gameSettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        // S'assurer que la difficulté est correctement définie selon le nombre d'objets
        parsedSettings.difficulty = this.calculateDifficulty(parsedSettings.objectsCount);
        this.settingsSubject.next(parsedSettings);
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e);
        // En cas d'erreur, on utilise les paramètres par défaut
        this.settingsSubject.next(this.defaultSettings);
      }
    }
  }

  // Sauvegarde les paramètres
  saveSettings(settings: GameSettings): void {
    // S'assurer que la difficulté est correctement définie selon le nombre d'objets
    settings.difficulty = this.calculateDifficulty(settings.objectsCount);
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    this.settingsSubject.next(settings);
  }

  // Réinitialise les paramètres
  resetSettings(): void {
    localStorage.removeItem('gameSettings');
    this.settingsSubject.next(this.defaultSettings);
  }

  // Récupère les paramètres actuels (valeur courante)
  getCurrentSettings(): GameSettings {
    return this.settingsSubject.value;
  }

  // Met à jour un paramètre spécifique
  updateSetting(key: keyof GameSettings, value: any): void {
    const currentSettings = this.getCurrentSettings();
    const newSettings = { ...currentSettings, [key]: value };
    
    // Si on met à jour le nombre d'objets, recalculer la difficulté
    if (key === 'objectsCount') {
      newSettings.difficulty = this.calculateDifficulty(value);
    }
    
    this.saveSettings(newSettings);
  }
  
  // Calcule la difficulté en fonction du nombre d'objets
  private calculateDifficulty(objectsCount: number): string {
    if (objectsCount <= 3) {
      return 'easy';
    } else if (objectsCount <= 5) {
      return 'medium';
    } else {
      return 'hard';
    }
  }
}