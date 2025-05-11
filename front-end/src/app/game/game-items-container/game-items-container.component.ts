import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Item } from '../../../models/item.model';
import { SettingsService, GameSettings } from '../../../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-items-container',
  templateUrl: './game-items-container.component.html',
  styleUrls: ['./game-items-container.component.scss']
})

export class GameItemsContainerComponent implements OnInit , OnDestroy{
  @Input() itemsInBulk: Item[] = [];
  @Input() connectedDropListsIds: string[] = [];
  @Output() itemDropped = new EventEmitter<CdkDragDrop<Item[]>>();

 // Variables pour stocker les paramètres du jeu
  settings: GameSettings | null = null;
  private subscription: Subscription | null = null;

  // Variables calculées pour CSS dynamique
  imageSize = '150px';
  animationSpeed = '0.3s';

  constructor(private settingsService: SettingsService) {}
  
  ngOnInit(): void {
    // S'abonner aux changements de paramètres
    this.subscription = this.settingsService.settings$.subscribe(newSettings => {
      this.settings = newSettings;
      this.updateDynamicStyles();
    });
    
    // Initialiser les styles avec les paramètres actuels
    this.settings = this.settingsService.getCurrentSettings();
    this.updateDynamicStyles();
  }
  
  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  // Mettre à jour les styles dynamiques basés sur les paramètres
  private updateDynamicStyles(): void {
    if (this.settings) {
      // Ajuster la taille des images en fonction de la difficulté
      this.imageSize = `${this.settings.imageSize || 150}px`;
      
      // Ajuster la vitesse d'animation en fonction de la difficulté
      this.animationSpeed = `${this.settings.animationSpeed || 0.3}s`;
      
      // Appliquer les changements de style aux éléments du DOM via le style dynamique
      this.applyDynamicStyles();
    }
  }
  
  // Appliquer les styles aux éléments du DOM
  private applyDynamicStyles(): void {
    // Création d'une feuille de style dynamique
    const styleTag = document.createElement('style');
    styleTag.id = 'dynamic-game-styles';
    
    // Supprimer l'ancienne feuille de style si elle existe
    const oldStyle = document.getElementById('dynamic-game-styles');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // Définir les nouveaux styles CSS dynamiques
    styleTag.innerHTML = `
      .object-image {
        width: ${this.imageSize} !important;
        height: ${this.imageSize} !important;
        transition: transform ${this.animationSpeed} ease-in-out !important;
      }
      
      .cdk-drag-preview {
        width: ${this.imageSize} !important;
        height: ${this.imageSize} !important;
      }
    `;
    
    // Ajouter la feuille de style au document
    document.head.appendChild(styleTag);
  }
}
