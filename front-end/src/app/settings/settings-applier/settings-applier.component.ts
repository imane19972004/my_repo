// src/app/settings/settings-applier/settings-applier.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService, GameSettings } from '../../../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings-applier',
  template: `
    <div [ngStyle]="applySettings()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class SettingsApplierComponent implements OnInit, OnDestroy {
  settings: GameSettings | null = null;
  private subscription: Subscription | null = null;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    // S'abonner aux changements de paramètres
    this.subscription = this.settingsService.settings$.subscribe(newSettings => {
      this.settings = newSettings;
    });
  }

  ngOnDestroy() {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  applySettings() {
    if (!this.settings) return {};

    // Appliquer tous les paramètres visuels
    return {
      fontSize: this.settings.textSize ? `${this.settings.textSize}px` : '16px',
      fontStyle: this.settings.textStyle || 'normal',
      filter: this.settings.contrast ? `contrast(${this.settings.contrast}%)` : 'none',
      // Si le style est en gras, l'appliquer
      fontWeight: this.settings.textStyle === 'bold' ? 'bold' : 'normal',
      // Transition pour des changements fluides
      transition: 'all 0.3s ease-in-out'
    };
  }
}