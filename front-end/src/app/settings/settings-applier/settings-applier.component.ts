// src/app/settings/settings-applier/settings-applier.component.ts
import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings-applier',
  template: `
    <div [ngClass]="getClassList()" [ngStyle]="applySettings()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .high-visibility {
      --image-border-color: #FF0000;
      --background-color: #000000;
      --text-color: #FFFFFF;
      --category-bg: rgba(255, 255, 255, 0.85);
    }
  `]
})
export class SettingsApplierComponent implements OnInit {
  settings: any = {};

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    // S'abonner aux changements de paramètres
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
    });
  }

  getClassList() {
    if (!this.settings) return {};
    
    const classes: {[key: string]: boolean} = {};
    
    if (this.settings.highVisibility) {
      classes['high-visibility'] = true;
    }
    
    return classes;
  }

  applySettings() {
    if (!this.settings) return {};

    const styles: {[key: string]: string} = {
      fontSize: this.settings.textSize ? `${this.settings.textSize}px` : '16px',
      fontStyle: this.settings.textStyle || 'normal',
      filter: this.settings.contrast ? `contrast(${this.settings.contrast}%)` : 'none'
    };
    
    if (this.settings.highVisibility) {
      styles['fontWeight'] = 'bold';
    }
    
    return styles;
  }
}