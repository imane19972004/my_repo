// src/app/settings/settings-applier/settings-applier.component.ts
import { Component, OnInit } from '@angular/core';

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
  settings: any = {};

  constructor() {}

  ngOnInit() {
    // Charger les paramètres du localStorage
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }

  applySettings() {
    if (!this.settings) return {};

    return {
      fontSize: this.settings.textSize ? `${this.settings.textSize}px` : '16px',
      fontStyle: this.settings.textStyle || 'normal',
      filter: this.settings.contrast ? `contrast(${this.settings.contrast}%)` : 'none'
    };
  }
}