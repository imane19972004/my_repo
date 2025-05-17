// src/services/settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameSettings {
  // Nombre d'objets à afficher
  objectsCount: number;
  
  // Paramètres de durée
  messageDuration: number;        // Durée d'affichage des messages (en secondes)
  gameDurationMinutes: number;    // Durée totale du jeu (en minutes)
  animationSpeed: number;         // Vitesse d'animation (multiplicateur)
  
  // Paramètres visuels
  textSize: number;               // Taille du texte (en px)
  textStyle: 'normal' | 'bold' | 'italic';  // Style du texte
  contrast: number;               // Niveau de contraste (en %)
  highVisibility: boolean;        // Mode haute visibilité
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // Paramètres par défaut
  private defaultSettings: GameSettings = {
    objectsCount: 5,
    messageDuration: 3,
    gameDurationMinutes: 5,
    animationSpeed: 1,
    textSize: 16,
    textStyle: 'normal',
    contrast: 100,
    highVisibility: false
  };

  // BehaviorSubject pour notifier les composants des changements
  private settingsSubject = new BehaviorSubject<GameSettings>(this.loadSettings());
  
  // Observable exposé pour les composants
  public settings$ = this.settingsSubject.asObservable();

  constructor() {}

  // Récupère les paramètres actuels
  getCurrentSettings(): GameSettings {
    return this.settingsSubject.getValue();
  }

  // Sauvegarde les paramètres
  saveSettings(settings: GameSettings): void {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    this.settingsSubject.next(settings);
  }

  // Charge les paramètres depuis localStorage ou utilise les défauts
  private loadSettings(): GameSettings {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        return { ...this.defaultSettings, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Erreur de chargement des paramètres', e);
        return { ...this.defaultSettings };
      }
    }
    return { ...this.defaultSettings };
  }

  // Réinitialise les paramètres
  resetSettings(): void {
    localStorage.removeItem('gameSettings');
    this.settingsSubject.next({ ...this.defaultSettings });
  }
}