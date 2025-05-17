// src/app/settings/settings-applier/settings-applier.component.ts
import { Component, OnInit } from '@angular/core';
import { SettingsService, GameSettings } from '../../../services/settings.service';

@Component({
  selector: 'app-settings-applier',
  template: `
    <div [ngStyle]="applySettings()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class SettingsApplierComponent implements OnInit {
  settings: GameSettings;

  constructor(private settingsService: SettingsService) {
    this.settings = this.settingsService.getCurrentSettings();
  }

  ngOnInit() {
    // S'abonner aux changements de paramètres
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
    });
  }

  applySettings() {
    if (!this.settings) return {};

    return {
      fontSize: `${this.settings.textSize}px`,
      fontWeight: this.settings.textStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: this.settings.textStyle === 'italic' ? 'italic' : 'normal',
      filter: `contrast(${this.settings.contrast}%)`,
      transition: `all ${0.3 / this.settings.animationSpeed}s ease-in-out`,
      backgroundColor: this.settings.highVisibility ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
      color: this.settings.highVisibility ? '#000' : 'inherit'
    };
  }
}