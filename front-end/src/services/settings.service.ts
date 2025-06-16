import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { httpOptionsBase, serverUrl } from '../configs/server.config';


export interface GameSettings {
  objectsCount: number;
  textSize: number;
  textStyle: string;
  contrast: number;
  highVisibility: boolean;
  messageDuration: number;
  gameDurationMinutes: number;
  showTimer: boolean; // Nouveau paramètre pour afficher/masquer le timer
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'gameSettings';
  private settingsSubject = new BehaviorSubject<GameSettings>(this.getDefaultSettings());
  public settings$ = this.settingsSubject.asObservable();

  private serverUrl = serverUrl;
  private settingsUrl = `${this.serverUrl}/settings`; 

  constructor() {
    // Charger les paramètres depuis le localStorage au démarrage
    this.loadSettings();
  }

  private getDefaultSettings(): GameSettings {
    return {
      objectsCount: 4,
      textSize: 16,
      textStyle: 'normal',
      contrast: 100,
      highVisibility: false,
      messageDuration: 3,
      gameDurationMinutes: 10,
      showTimer: true // Par défaut, le timer est affiché
    };
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem(this.STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        this.settingsSubject.next({
          ...this.getDefaultSettings(),
          ...parsedSettings
        });
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres:', e);
        this.settingsSubject.next(this.getDefaultSettings());
      }
    }
  }

  public getCurrentSettings(): GameSettings {
    return this.settingsSubject.value;
  }

  public saveSettings(settings: GameSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    this.settingsSubject.next(settings);
  }

  public resetSettings(): void {
    const defaultSettings = this.getDefaultSettings();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultSettings));
    this.settingsSubject.next(defaultSettings);
  }
}