import { Component, OnInit ,OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ExerciceService } from '../../../services/exercice.service';
import { UserService } from '../../../services/user.service';
import { Exercice } from '../../../models/exercice.model';
import { Item } from '../../../models/item.model';
import { UserHistory } from '../../../models/user-history.model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { SettingsService, GameSettings } from '../../../services/settings.service';
import { Subscription, interval } from 'rxjs';


@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
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
  settings: GameSettings;

  private allOriginalItems: Item[] = [];

  // Variables pour le minuteur (maintenant invisible)
  timerSubscription: Subscription | null = null;
  remainingTime: number = 0; // en secondes
  timeoutTriggered: boolean = false;

  failedItemName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private exerciceService: ExerciceService,
    private userService: UserService,
    private settingsService: SettingsService,
    private router: Router)
  {this.settings = this.settingsService.getCurrentSettings();}

  ngOnInit(): void {
    const exerciceId = this.route.snapshot.params['idExercice'];
    this.userID = this.route.snapshot.params['idUser'];
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;

      if (this.exercice.items.length > 0) {
        this.adjustItemsCount();
      }
    });
    if (exerciceId) this.loadExercice(exerciceId);
  }
  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadExercice(id: string): void {
    this.exerciceService.getExerciceById(id).subscribe((exercice: Exercice | undefined) => {
      if (exercice) {
        this.exercice = exercice;
        this.allOriginalItems = [...this.exercice.items];
        this.initializeGame();
      }
    })
  }

  initializeGame(): void {
    this.allOriginalItems = [...this.exercice.items];
    this.itemsInBulk = [...this.allOriginalItems];
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

    // Démarrer le minuteur (toujours fonctionnel, mais invisible)
    this.startTimer();
  }

  adjustItemsCount(): void {
    const targetCount = this.settings.objectsCount;
    const currentTotalItems = this.itemsInBulk.length +
      Object.values(this.itemsByCategory).reduce((sum, items) => sum + items.length, 0);

    if (targetCount < currentTotalItems) {
      // Réduire le nombre d'objets
      this.reduceItemsCount(targetCount);
    } else if (targetCount > currentTotalItems) {
      // Augmenter le nombre d'objets
      this.increaseItemsCount(targetCount);
    }
  }
  private reduceItemsCount(targetCount: number): void {
    const currentTotal = this.itemsInBulk.length + Object.values(this.itemsByCategory).reduce((sum, items) => sum + items.length, 0);
    const itemsToRemove = currentTotal - targetCount;
    let removedCount = 0;

    while (removedCount < itemsToRemove && this.itemsInBulk.length > 0) {
      this.itemsInBulk.pop();
      removedCount++;
    }

    if (removedCount < itemsToRemove) {
      for (const categoryName of Object.keys(this.itemsByCategory)) {
        while (removedCount < itemsToRemove && this.itemsByCategory[categoryName].length > 0) {
          this.itemsByCategory[categoryName].pop();
          removedCount++;
        }
        if (removedCount >= itemsToRemove) break;
      }
    }
  }
  private increaseItemsCount(targetCount: number): void {
    const currentTotal = this.itemsInBulk.length +
      Object.values(this.itemsByCategory).reduce((sum, items) => sum + items.length, 0);
    const itemsToAdd = targetCount - currentTotal;

    const usedItems = new Set([
      ...this.itemsInBulk.map(item => item.name),
      ...Object.values(this.itemsByCategory).flat().map(item => item.name)
    ]);

    const availableItems = this.allOriginalItems.filter(item => !usedItems.has(item.name));

    for (let i = 0; i < itemsToAdd && i < availableItems.length; i++) {
      this.itemsInBulk.push(availableItems[i]);
    }

    this.shuffleArray(this.itemsInBulk);
  }

  startTimer(): void { // Démarrer le minuteur de jeu (invisible)
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.remainingTime = this.settings.gameDurationMinutes * 60;

    this.timerSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;

      // Si le temps est écoulé, terminer le jeu
      if (this.remainingTime <= 0) {
        this.endGameDueToTimeout();
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  formatTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  endGameDueToTimeout(): void {
    if (this.timeoutTriggered) return; // Éviter les appels multiples

    this.timeoutTriggered = true;
    this.gameCompleted = true;

    let correct = 0;

    Object.keys(this.itemsByCategory).forEach(cat => {
      this.itemsByCategory[cat].forEach(item => {
        if (item.category === cat) correct++;
      });
    });

    this.successMessage = `Temps écoulé ! Vous avez placé correctement ${correct} objets. Bien joué !`;
    this.messageColor = '#4CAF50'; // Vert plus doux

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
        this.successMessage = 'Ce n\'est pas la bonne catégorie. Réessayez !';
        this.messageColor = 'green';
        this.numberOfFailure++;
        if (!this.itemFailureTracker[item.name]) {
          this.itemFailureTracker[item.name] = 1;
          this.failedItemName = item.name;
        } else {
          this.itemFailureTracker[item.name]++;
          this.failedItemName = item.name;
        }

        transferArrayItem(event.previousContainer.data, this.itemsInBulk, event.previousIndex, event.currentIndex);
        Object.keys(this.itemsByCategory).forEach(cat => {
          this.itemsByCategory[cat] = this.itemsByCategory[cat].filter(i => i !== item);
        });
        const time = !this.gameCompleted ? this.settings.messageDuration * 1000 : 5000;
        setTimeout(() => this.successMessage = '', time);
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
    setTimeout(() => this.successMessage = '', this.settings.messageDuration * 1000);
      this.checkGameCompletion();
  }

  checkGameCompletion(): void {
    if (this.itemsInBulk.length === 0) {
      let correct = 0;
      const total = this.settings.objectsCount;

      Object.keys(this.itemsByCategory).forEach(cat => {
        this.itemsByCategory[cat].forEach(item => {
          if (item.category === cat) correct++;
        });
      });

      this.successMessage = `Exercice terminé ! Votre score: ${Math.round((correct / total) * 100)}%`;
      this.gameCompleted = true;

      const sortedFailures = Object.fromEntries(
        Object.entries(this.itemFailureTracker).sort(([, a], [, b]) => b - a)
      );

      const newHistory: UserHistory = {
        userId: this.userID,
        exerciceId: this.exercice.id,
        exerciceName: this.exercice.name,
        date: new Date().toISOString(),
        success: correct,
        failure: this.numberOfFailure,
        itemFailures: sortedFailures
      };

      this.userService.addUserHistory(newHistory);
    }
  }

  quitGame(): void {
    if (confirm("Êtes-vous sûr de vouloir quitter l'exercice ?")) {
      this.router.navigate(['/']);
    }
  }

  restartGame(): void {
    this.successMessage = '';
    this.messageColor = '';

    this.numberOfFailure = 0;
    this.itemFailureTracker = {};
    this.failedItemName = null;

    this.gameCompleted = false;
    this.timeoutTriggered = false;

    this.allOriginalItems = [...this.exercice.items];

    this.itemsByCategory = {};
    this.exercice.categories.forEach(c => this.itemsByCategory[c.name] = []);

    // Arrête le timer si actif
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }

    // Relance le jeu comme au départ
    this.initializeGame();
  }


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
