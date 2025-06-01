// settings.component.ts - avec sauvegarde automatique
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { SettingsService, GameSettings } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  isOpen: boolean = false;
  settings: GameSettings;
  
// Options pour le nombre d'objets (de 2 à 12)
  objectsOptions: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  constructor(
    private settingsService: SettingsService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.settings = this.settingsService.getCurrentSettings();
  }

  ngOnInit() {
    // Charger les paramètres sauvegardés au démarrage
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
    });
    
    // Assurer que le composant est ajouté à la fin du body pour garantir le positionnement
    this.ensureAppendedToBody();
  }
  
  // Cette méthode garantit que le composant est bien attaché au body
  private ensureAppendedToBody() {
    // Obtenir le panneau des paramètres
    const settingsPanel = this.el.nativeElement.querySelector('.settings-panel');
    const settingsToggle = this.el.nativeElement.querySelector('.settings-toggle');
    
    if (settingsPanel && settingsToggle) {
      // Déplacer le panneau et le bouton directement dans le body
      this.renderer.appendChild(document.body, settingsPanel);
      this.renderer.appendChild(document.body, settingsToggle);
    }
  }

  toggleSettings() {
    this.isOpen = !this.isOpen;
  }
  
  // NOUVELLE MÉTHODE: Appelée automatiquement à chaque changement
  onSettingChange() {
    // Sauvegarde automatique des paramètres
    this.settingsService.saveSettings(this.settings);
  }
  
  resetSettings() {
    // Réinitialisation des paramètres via le service
    this.settingsService.resetSettings();
    this.settings = this.settingsService.getCurrentSettings();
  }
}