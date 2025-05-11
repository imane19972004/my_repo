import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Item } from '../../../models/item.model';
import { Category } from '../../../models/category.model';
import { SettingsService, GameSettings } from '../../../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-category',
  templateUrl: './game-category.component.html',
  styleUrls: ['./game-category.component.scss']
})

export class GameCategoryComponent implements OnInit, OnDestroy {
  @Input() category!: Category;
  @Input() items: Item[] = [];
  @Input() connectedDropListsIds: string[] = [];
  @Output() itemDropped = new EventEmitter<{ event: CdkDragDrop<Item[]>, category: string }>();

  // Variables pour les paramètres
  settings: GameSettings | null = null;
  private subscription: Subscription | null = null;

  // Variables pour les styles dynamiques
  categoryTitleSize: string = '24px';
  categoryImageSize: string = '150px';
  objectImageSize: string = '125px';
  animationSpeed: string = '0.3s';

  constructor(private settingsService: SettingsService) {}
  
  ngOnInit(): void {
    // S'abonner aux changements des paramètres
    this.subscription = this.settingsService.settings$.subscribe(newSettings => {
      this.settings = newSettings;
      this.updateDynamicStyles();
    });
    
    // Initialiser avec les paramètres actuels
    this.settings = this.settingsService.getCurrentSettings();
    this.updateDynamicStyles();
  }
  
  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onDrop(event: CdkDragDrop<Item[]>) {
    this.itemDropped.emit({ event, category: this.category.name });
  }
  
  // Mettre à jour les styles dynamiques en fonction des paramètres
  private updateDynamicStyles(): void {
    if (this.settings) {
      // Ajuster les tailles en fonction des paramètres
      this.categoryTitleSize = `${Math.max(18, this.settings.textSize + 4)}px`;
      this.categoryImageSize = `${this.settings.imageSize ? this.settings.imageSize * 1.2 : 150}px`;
      this.objectImageSize = `${this.settings.imageSize || 125}px`;
      this.animationSpeed = `${this.settings.animationSpeed || 0.3}s`;
      
      // Appliquer les styles CSS dynamiques
      this.applyDynamicStyles();
    }
  }
  
  // Appliquer les styles CSS dynamiques via une feuille de style
  private applyDynamicStyles(): void {
    const styleId = 'category-dynamic-styles';
    const existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleTag = document.createElement('style');
    styleTag.id = styleId;
    
    styleTag.innerHTML = `
      .category-section h2 {
        font-size: ${this.categoryTitleSize} !important;
      }
      
      .category-section .image {
        height: ${this.categoryImageSize} !important;
      }
      
      .category-section .object-image {
        height: ${this.objectImageSize} !important;
        transition: transform ${this.animationSpeed} ease-in-out !important;
      }
      
      .category-section .object-image:hover {
        transform: scale(1.1);
      }
    `;
    
    document.head.appendChild(styleTag);
  }
}