import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerciceService } from '../../../services/exercice.service';
import { UserService } from '../../../services/user.service';
import { SettingsService, GameSettings } from '../../../services/settings.service';
import { Exercice } from '../../../models/exercice.model';
import { Item } from '../../../models/item.model';
import { UserHistory } from '../../../models/user-history.model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {
  exercice: Exercice = { id: '', name: '', theme: '', categories: [], items: [] };
  userID!: string;
  itemsInBulk: Item[] = [];
  itemsByCategory: { [category: string]: Item[] } = {};
  connectedDropListsIds: string[] = [];
  successMessage: string = '';
  messageColor: string = '';
  gameCompleted: boolean = false;
  numberOfFailure: number = 0;
  itemFailureTracker: { [itemName: string]: number } = {};
  
  // Paramètres du jeu
  settings: GameSettings;
  
  // Variables pour le minuteur
  timerSubscription: Subscription | null = null;
  remainingTime: number = 0; // en secondes
  timeoutTriggered: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private exerciceService: ExerciceService,
    private userService: UserService,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getCurrentSettings();
  }

  ngOnInit(): void {
    const exerciceId = this.route.snapshot.params['idExercice'];
    this.userID = this.route.snapshot.params['idUser'];
    
    // S'abonner aux changements de paramètres
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
      
      // Si le jeu est déjà initialisé, mettre à jour les éléments en fonction du nombre d'objets
      if (this.exercice.items.length > 0) {
        this.adjustItemsCount();
      }
    });
    
    if (exerciceId) this.loadExercice(exerciceId);
  }
  
  ngOnDestroy(): void {
    // Annuler le minuteur si on quitte la page
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Récupère l'exercice à partir de l'ID
  loadExercice(id: string): void {
    this.exerciceService.getExerciceById(id).subscribe(exercice => {
      if (exercice) {
        this.exercice = exercice;
        this.initializeGame();
      }
    });
  }

  // Initialise les listes et connecte les zones de drop
  initializeGame(): void {
    // Réinitialiser l'état du jeu
    this.itemsInBulk = [...this.exercice.items];
    this.adjustItemsCount();
    this.itemsByCategory = {};
    this.exercice.categories.forEach(c => this.itemsByCategory[c.name] = []);
    this.connectedDropListsIds = ['bulk-list', ...this.exercice.categories.map(c => `category-${c.name}`)];
    this.shuffleArray(this.itemsInBulk);
    this.gameCompleted = false;
    this.successMessage = '';
    this.numberOfFailure = 0;
    this.itemFailureTracker = {};
    this.timeoutTriggered = false;
    
    // Démarrer le minuteur
    this.startTimer();
  }
  
  // Ajuster le nombre d'éléments en fonction des paramètres
  adjustItemsCount(): void {
    // S'assurer qu'on n'a pas plus d'éléments que le nombre spécifié dans les paramètres
    if (this.itemsInBulk.length > this.settings.objectsCount) {
      this.itemsInBulk = this.itemsInBulk.slice(0, this.settings.objectsCount);
    }
  }
  
  // Démarrer le minuteur de jeu
  startTimer(): void {
    // Annuler tout minuteur existant
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    // Convertir les minutes en secondes
    this.remainingTime = this.settings.gameDurationMinutes * 60;
    
    // Créer un nouvel intervalle qui décrémente toutes les secondes
    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;
      
      // Si le temps est écoulé, terminer le jeu
      if (this.remainingTime <= 0) {
        this.endGameDueToTimeout();
        this.timerSubscription?.unsubscribe();
      }
    });
  }
  
  // Terminer le jeu en raison du timeout
  endGameDueToTimeout(): void {
    if (this.timeoutTriggered) return; // Éviter les appels multiples
    
    this.timeoutTriggered = true;
    this.gameCompleted = true;
    
    // Compter le score actuel
    let correct = 0;
    const total = this.itemsInBulk.length + Object.values(this.itemsByCategory)
      .reduce((sum, items) => sum + items.length, 0);
    
    Object.keys(this.itemsByCategory).forEach(cat => {
      this.itemsByCategory[cat].forEach(item => {
        if (item.category === cat) correct++;
      });
    });
    
    // Afficher le message de fin
    this.successMessage = `Temps écoulé ! Votre score: ${Math.round((correct / total) * 100)}%`;
    this.messageColor = '#FF9800'; // Orange pour indiquer le timeout
    
    // Enregistrer l'historique
    const newHistory: UserHistory = {
      userId: this.userID,
      exerciceId: this.exercice.id,
      exerciceName: this.exercice.name,
      date: new Date().toISOString(),
      success: correct,
      failure: this.numberOfFailure,
      itemFailures: this.itemFailureTracker
    };
    
    this.userService.addUserHistory(newHistory);
  }

  // Mélange aléatoirement les items
  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Gère les déplacements entre les listes
  drop(event: CdkDragDrop<Item[]>, targetCategory?: string): void {
    // Ne pas permettre les actions si le jeu est terminé
    if (this.gameCompleted) return;
    
    if (!event.container.data || !event.previousContainer.data) return;
    
    const item = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) return;

    if (targetCategory) {
      if (item.category === targetCategory) {
        if (!this.itemsByCategory[targetCategory].includes(item)) {
          // Retirer l'élément du conteneur principal seulement s'il y est
          if (this.itemsInBulk.includes(item)) {
            this.itemsInBulk = this.itemsInBulk.filter(i => i !== item);
          }
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
          this.onItemMoved(item, targetCategory);
        }
      } else {
        // Mauvaise catégorie
        this.successMessage = 'Ce n\'est pas la bonne catégorie. Réessayez !';
        this.messageColor = '#F44336'; // Rouge pour les erreurs
        this.numberOfFailure++;
        if (!this.itemFailureTracker[item.name]) {
          this.itemFailureTracker[item.name] = 1;
        } else {
          this.itemFailureTracker[item.name]++;
        }

        // Remettre l'item dans le conteneur principal
        if (!this.itemsInBulk.includes(item)) {
          event.previousContainer.data.splice(event.previousIndex, 1);
          this.itemsInBulk.push(item);
        }
        
        // Afficher le message d'erreur pendant la durée spécifiée dans les paramètres
        setTimeout(() => this.successMessage = '', this.settings.messageDuration * 1000);
      }
    }

    if (!targetCategory && event.container.id === 'bulk-list') {
      // Si on déplace vers le conteneur principal
      Object.keys(this.itemsByCategory).forEach(cat => {
        this.itemsByCategory[cat] = this.itemsByCategory[cat].filter(i => i !== item);
      });
      
      if (!this.itemsInBulk.includes(item)) {
        transferArrayItem(event.previousContainer.data, this.itemsInBulk, event.previousIndex, event.currentIndex);
      }
    }

    this.removeDuplicatesInCategories();
  }

  // Vérifie et affiche le score si terminé
  onItemMoved(item: Item, targetCategory: string): void {
    this.successMessage = item.category === targetCategory ? 'Bien joué !' : 'Hmm, êtes-vous sûr ?';
    this.messageColor = '#4CAF50'; // Vert pour le succès
    
    // Afficher le message de succès pendant la durée spécifiée dans les paramètres
    setTimeout(() => this.successMessage = '', this.settings.messageDuration * 1000);
    
    this.checkGameCompletion();
  }

  checkGameCompletion(): void {
    if (this.itemsInBulk.length === 0) {
      let correct = 0;
      const total = this.exercice.items.length;

      Object.keys(this.itemsByCategory).forEach(cat => {
        this.itemsByCategory[cat].forEach(item => {
          if (item.category === cat) correct++;
        });
      });

      const percentage = Math.round((correct / total) * 100);
      this.successMessage = `Exercice terminé ! Votre score: ${percentage}%`;
      this.messageColor = percentage > 80 ? '#4CAF50' : percentage > 50 ? '#FF9800' : '#F44336';
      this.gameCompleted = true;
      
      // Arrêter le minuteur
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }

      const newHistory: UserHistory = {
        userId: this.userID,
        exerciceId: this.exercice.id,
        exerciceName: this.exercice.name,
        date: new Date().toISOString(),
        success: correct,
        failure: this.numberOfFailure,
        itemFailures: this.itemFailureTracker
      };

      this.userService.addUserHistory(newHistory);
    }
  }

  // Réinitialiser le jeu
  resetGame(): void {
    this.initializeGame();
  }

  // Évite les doublons dans les catégories
  removeDuplicatesInCategories(): void {
    Object.keys(this.itemsByCategory).forEach(cat => {
      const seen = new Set<string>();
      this.itemsByCategory[cat] = this.itemsByCategory[cat].filter(item => {
        if (seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
    });
  }
} 