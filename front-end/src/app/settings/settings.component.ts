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
  settings: GameSettings;
  
  // Options pour le nombre d'objets
  objectsOptions: number[] = [2, 3, 4, 5, 6, 8, 10];

  constructor(private settingsService: SettingsService) {
    this.settings = this.settingsService.getCurrentSettings();
  }

  ngOnInit() {
    // Charger les paramètres sauvegardés au démarrage
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
    });
  }

  toggleSettings() {
    this.isOpen = !this.isOpen;
  }
  
  saveSettings() {
    // Sauvegarde des paramètres via le service
    this.settingsService.saveSettings(this.settings);
    alert('Paramètres enregistrés !');
    this.toggleSettings(); // Fermer le panneau après sauvegarde
  }
  
  resetSettings() {
    // Réinitialisation des paramètres via le service
    this.settingsService.resetSettings();
    this.settings = this.settingsService.getCurrentSettings();
  }
}