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
  // Nouvelles propriétés liées à la difficulté
  imageSize?: number;        // Taille des images d'objets
  animationSpeed?: number;   // Vitesse des animations
  timeBonus?: number;        // Bonus de temps pour les réponses correctes
  mistakesAllowed?: number;  // Nombre d'erreurs autorisées avant pénalité
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
    gameDuration: 10,
    imageSize: 150,
    animationSpeed: 0.3,
    timeBonus: 5,
    mistakesAllowed: 3,
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
        // Calcul de la difficulté et des paramètres associés
        const difficulty = this.calculateDifficulty(parsedSettings.objectsCount);
        const adjustedSettings = this.adjustSettingsBasedOnDifficulty({...parsedSettings, difficulty});
        
        this.settingsSubject.next(adjustedSettings);
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
    const difficulty = this.calculateDifficulty(settings.objectsCount);
    const adjustedSettings = this.adjustSettingsBasedOnDifficulty({...settings, difficulty});
    
    localStorage.setItem('gameSettings', JSON.stringify(adjustedSettings));
    this.settingsSubject.next(adjustedSettings);
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
    
    // Si on met à jour le nombre d'objets, recalculer la difficulté et ajuster les paramètres
    if (key === 'objectsCount') {
      const difficulty = this.calculateDifficulty(value);
      const adjustedSettings = this.adjustSettingsBasedOnDifficulty({...newSettings, difficulty});
      this.saveSettings(adjustedSettings);
    } else {
      this.saveSettings(newSettings);
    }
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

  // Ajuste automatiquement les paramètres en fonction de la difficulté
  private adjustSettingsBasedOnDifficulty(settings: GameSettings): GameSettings {
    const { difficulty } = settings;
    const adjustedSettings = { ...settings };

    // Ajustement selon le niveau de difficulté
    switch (difficulty) {
      case 'easy':
        // Pour un niveau facile, tout est plus grand et plus lent
        adjustedSettings.textSize = Math.max(settings.textSize, 20); // Texte plus grand
        adjustedSettings.imageSize = 180; // Images plus grandes
        adjustedSettings.animationSpeed = 0.5; // Animations plus lentes
        adjustedSettings.timeBonus = 8; // Plus de bonus de temps
        adjustedSettings.mistakesAllowed = 5; // Plus d'erreurs permises
        adjustedSettings.contrast = Math.max(settings.contrast, 70); // Contraste plus élevé
        break;
      
      case 'medium':
        // Paramètres standards
        adjustedSettings.textSize = Math.max(settings.textSize, 16); // Texte standard
        adjustedSettings.imageSize = 150; // Images standard
        adjustedSettings.animationSpeed = 0.3; // Vitesse d'animation standard
        adjustedSettings.timeBonus = 5; // Bonus de temps standard
        adjustedSettings.mistakesAllowed = 3; // Nombre d'erreurs standard
        adjustedSettings.contrast = Math.max(settings.contrast, 50); // Contraste standard
        break;
      
      case 'hard':
        // Pour un niveau difficile, tout est plus petit et plus rapide
        adjustedSettings.textSize = Math.min(settings.textSize, 14); // Texte plus petit
        adjustedSettings.imageSize = 120; // Images plus petites
        adjustedSettings.animationSpeed = 0.2; // Animations plus rapides
        adjustedSettings.timeBonus = 3; // Moins de bonus de temps
        adjustedSettings.mistakesAllowed = 2; // Moins d'erreurs permises
        adjustedSettings.contrast = Math.min(settings.contrast, 40); // Contraste plus faible
        break;
    }

    return adjustedSettings;
  }
}