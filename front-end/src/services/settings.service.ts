// Vérifiez si votre service de paramètres contient bien toutes les propriétés nécessaires
// Voici comment le fichier devrait être (ou similaire):

// src/services/settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameSettings {
  objectsCount: number;
  textSize: number;
  textStyle: string;
  contrast: number;
  helpType: string;
  errorRetries: number;
  gameDuration: number;
  imageSize?: number;
  animationSpeed?: number;
  difficulty?: string;
  timeBonus?: number;
  mistakesAllowed?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // Paramètres par défaut
  private defaultSettings: GameSettings = {
    objectsCount: 4,
    textSize: 16,
    textStyle: 'normal',
    contrast: 50,
    helpType: 'text',
    errorRetries: 2,
    gameDuration: 10,
    imageSize: 150,
    animationSpeed: 0.3,
    difficulty: 'medium'
  };

  // Subject pour observer les changements
  private settingsSubject = new BehaviorSubject<GameSettings>(this.defaultSettings);
  
  // Observable pour s'abonner aux changements
  settings$ = this.settingsSubject.asObservable();

  constructor() {
    // Charger les paramètres depuis le localStorage au démarrage
    this.loadSettings();
  }

  // Obtenir les paramètres actuels
  getCurrentSettings(): GameSettings {
    return this.settingsSubject.getValue();
  }

  // Sauvegarder de nouveaux paramètres
  saveSettings(settings: GameSettings): void {
    // Mettre à jour les paramètres dans le BehaviorSubject
    this.settingsSubject.next(settings);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }

  // Charger les paramètres depuis le localStorage
  private loadSettings(): void {
    const savedSettings = localStorage.getItem('gameSettings');
    
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Fusionner avec les paramètres par défaut pour assurer la présence de toutes les propriétés
        const mergedSettings = { ...this.defaultSettings, ...parsedSettings };
        this.settingsSubject.next(mergedSettings);
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e);
        // En cas d'erreur, utiliser les paramètres par défaut
        this.resetSettings();
      }
    }
  }

  // Réinitialiser les paramètres
  resetSettings(): void {
    this.settingsSubject.next(this.defaultSettings);
    localStorage.removeItem('gameSettings');
  }
}