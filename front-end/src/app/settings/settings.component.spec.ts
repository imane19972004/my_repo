// // settings.component.ts
// import { Component, OnInit } from '@angular/core';
// import { SettingsService, GameSettings } from '../../services/settings.service';

// @Component({
//   selector: 'app-settings',
//   templateUrl: './settings.component.html',
//   styleUrls: ['./settings.component.scss']
// })
// export class SettingsComponent implements OnInit {
//   isOpen: boolean = false;
  
//   // Configuration par défaut
//   settings: GameSettings = {
//     objectsCount: 4,
//     textSize: 16,
//     textStyle: 'normal',
//     contrast: 50,
//     helpType: 'text',
//     errorRetries: 2,
//     gameDuration: 10,
//     imageSize: 150,
//     animationSpeed: 0.3,
//     timeBonus: 5,
//     mistakesAllowed: 3
//   };

//   // Propriété pour afficher le niveau de difficulté actuel
//   difficultyLabel: string = 'Moyen';

//   constructor(private settingsService: SettingsService) {}

//   ngOnInit() {
//     // Charger les paramètres sauvegardés au démarrage
//     const currentSettings = this.settingsService.getCurrentSettings();
//     this.settings = {
//       ...this.settings,
//       ...currentSettings
//     };
    
//     // Mettre à jour l'affichage du niveau de difficulté
//     this.updateDifficultyLabel();
    
//     // S'abonner aux changements de paramètres
//     this.settingsService.settings$.subscribe(newSettings => {
//       this.settings = newSettings;
//       this.updateDifficultyLabel();
//     });
//   }

//   toggleSettings() {
//     this.isOpen = !this.isOpen;
//   }
  
//   // Méthode appelée lorsqu'un paramètre est modifié
//   onSettingChange() {
//     // Mettre à jour les paramètres dans le service
//     this.settingsService.saveSettings(this.settings);
    
//     // Mettre à jour l'affichage du niveau de difficulté
//     this.updateDifficultyLabel();
//   }
  
//   // Mise à jour spécifique du nombre d'objets
//   onObjectsCountChange() {
//     this.onSettingChange();
    
//     // Afficher un message informatif sur le changement de difficulté
//     const difficulty = this.settings.difficulty || 'medium';
//     const message = `Difficulté ajustée: ${this.difficultyLabel}. Les autres paramètres ont été ajustés en conséquence.`;
    
//     // Notification temporaire (peut être remplacée par un toast ou une alerte plus élégante)
//     const notification = document.createElement('div');
//     notification.textContent = message;
//     notification.style.position = 'fixed';
//     notification.style.top = '20px';
//     notification.style.left = '50%';
//     notification.style.transform = 'translateX(-50%)';
//     notification.style.backgroundColor = '#4CAF50';
//     notification.style.color = 'white';
//     notification.style.padding = '10px 20px';
//     notification.style.borderRadius = '5px';
//     notification.style.zIndex = '9999';
    
//     document.body.appendChild(notification);
    
//     // Supprimer la notification après 3 secondes
//     setTimeout(() => {
//       document.body.removeChild(notification);
//     }, 3000);
//   }
  
//   saveSettings() {
//     // Cette méthode est appelée lors du clic sur le bouton "Fermer"
//     // Les paramètres sont déjà enregistrés au fur et à mesure, on ferme simplement le panneau
//     this.toggleSettings(); // Fermer le panneau après sauvegarde
//   }
  
//   resetSettings() {
//     // Réinitialisation des paramètres via le service
//     this.settingsService.resetSettings();
    
//     // Mettre à jour l'interface utilisateur
//     const currentSettings = this.settingsService.getCurrentSettings();
//     this.settings = currentSettings;
    
//     // Mettre à jour l'affichage du niveau de difficulté
//     this.updateDifficultyLabel();
//   }
  
//   // Met à jour l'étiquette de difficulté pour l'affichage
//   private updateDifficultyLabel() {
//     switch (this.settings.difficulty) {
//       case 'easy':
//         this.difficultyLabel = 'Facile';
//         break;
//       case 'medium':
//         this.difficultyLabel = 'Moyen';
//         break;
//       case 'hard':
//         this.difficultyLabel = 'Difficile';
//         break;
//       default:
//         this.difficultyLabel = 'Moyen';
//     }
//   }
// }