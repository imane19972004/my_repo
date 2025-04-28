import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interface pour les paramètres du jeu
export interface GameSettings {
  difficulty: string;
  objectsCount: number;
  textSize: number;
  textStyle: string;
  contrast: number;
  musicVolume: number;
  effectsVolume: number;
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
    musicVolume: 50,
    effectsVolume: 50,
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
    this.saveSettings(newSettings);
  }
}