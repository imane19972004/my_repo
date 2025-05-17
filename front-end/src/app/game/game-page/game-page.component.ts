// game-page.component.ts - modifié
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
  
  // Variables pour le minuteur (maintenant invisible)
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
    
    // Démarrer le minuteur (toujours fonctionnel mais invisible)
    this.startTimer();
  }
  
  // Ajuster le nombre d'éléments en fonction des paramètres
  adjustItemsCount(): void {
    // S'assurer qu'on n'a pas plus d'éléments que le nombre spécifié dans les paramètres
    if (this.itemsInBulk.length > this.settings.objectsCount) {
      this.itemsInBulk = this.itemsInBulk.slice(0, this.settings.objectsCount);
    }
  }
  
  // Démarrer le minuteur de jeu (invisible)
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
  
  // Fonction formatTime gardée pour compatibilité, mais non utilisée dans l'interface
  formatTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Terminer le jeu en raison du timeout avec un message plus doux
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
    
    // Afficher le message de fin plus doux
    this.successMessage = `Temps écoulé ! Vous avez placé correctement ${correct} objets. Bien joué !`;
    this.messageColor = '#4CAF50'; // Vert plus doux
    
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
    
    const item = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) return;

    if (targetCategory) {
      if (item.category === targetCategory) {
        if (!this.itemsByCategory[targetCategory].includes(item)) {
          this.itemsInBulk = this.itemsInBulk.filter(i => i !== item);
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
          this.onItemMoved(item, targetCategory);
        }
      } else {
        // Mauvaise catégorie
        this.successMessage = 'Ce n\'est pas la bonne catégorie. Réessayez !';
        this.messageColor = 'red';
        this.numberOfFailure++;
        if (!this.itemFailureTracker[item.name]) {
          this.itemFailureTracker[item.name] = 1;
        } else {
          this.itemFailureTracker[item.name]++;
        }

        transferArrayItem(event.previousContainer.data, this.itemsInBulk, event.previousIndex, event.currentIndex);
        Object.keys(this.itemsByCategory).forEach(cat => {
          this.itemsByCategory[cat] = this.itemsByCategory[cat].filter(i => i !== item);
        });
        
        // Afficher le message d'erreur pendant la durée spécifiée dans les paramètres
        setTimeout(() => this.successMessage = '', this.settings.messageDuration * 1000);
      }
    }

    if (!targetCategory && event.container.id === 'bulk-list') {
      Object.keys(this.itemsByCategory).forEach(cat => {
        this.itemsByCategory[cat] = this.itemsByCategory[cat].filter(i => i !== item);
      });
      transferArrayItem(event.previousContainer.data, this.itemsInBulk, event.previousIndex, event.currentIndex);
    }

    this.removeDuplicatesInCategories();
  }

  // Vérifie et affiche le score si terminé
  onItemMoved(item: Item, targetCategory: string): void {
    this.successMessage = item.category === targetCategory ? 'Bien joué !' : 'Hmm, êtes-vous sûr ?';
    this.messageColor = 'green';
    
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

      this.successMessage = `Félicitations ! Vous avez terminé l'exercice avec ${Math.round((correct / total) * 100)}% de réussite !`;
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