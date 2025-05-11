// Dans front-end/src/app/game/game-page/game-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerciceService } from '../../../services/exercice.service';
import { UserService } from '../../../services/user.service';
import { SettingsService, GameSettings } from '../../../services/settings.service';
import { Exercice } from '../../../models/exercice.model';
import { Item } from '../../../models/item.model';
import { UserHistory } from '../../../models/user-history.model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

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
  gameCompleted: boolean = false;
  numberOfFailure: number = 0;
  
  // Ajouter cette propriété pour stocker les paramètres
  settings: GameSettings | null = null;
  private settingsSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private exerciceService: ExerciceService,
    private userService: UserService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements de paramètres
    this.settingsSubscription = this.settingsService.settings$.subscribe(newSettings => {
      this.settings = newSettings;
      if (this.exercice.id) {
        // Réinitialiser le jeu si les paramètres changent
        this.initializeGame();
      }
    });
    
    // Charger les paramètres actuels
    this.settings = this.settingsService.getCurrentSettings();
    
    const exerciceId = this.route.snapshot.params['idExercice'];
    this.userID = this.route.snapshot.params['idUser'];
    if (exerciceId) this.loadExercice(exerciceId);
  }
  
  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
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
    // Filtrer les items en fonction du paramètre objectsCount
    const objectsCount = this.settings?.objectsCount || 4; // Utilise 4 comme valeur par défaut
    
    // Copier puis mélanger tous les items
    const allItems = [...this.exercice.items];
    this.shuffleArray(allItems);
    
    // Limiter le nombre d'items selon le paramètre objectsCount
    this.itemsInBulk = allItems.slice(0, objectsCount);
    
    // Initialiser les catégories vides
    this.itemsByCategory = {};
    this.exercice.categories.forEach(c => this.itemsByCategory[c.name] = []);
    
    // Connecter les zones de drop
    this.connectedDropListsIds = ['bulk-list', ...this.exercice.categories.map(c => `category-${c.name}`)];
    
    // Réinitialiser l'état du jeu
    this.gameCompleted = false;
    this.successMessage = '';
    this.numberOfFailure = 0;
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
        this.numberOfFailure++;
        transferArrayItem(event.previousContainer.data, this.itemsInBulk, event.previousIndex, event.currentIndex);
        Object.keys(this.itemsByCategory).forEach(cat => {
          this.itemsByCategory[cat] = this.itemsByCategory[cat].filter(i => i !== item);
        });
        setTimeout(() => this.successMessage = '', 2000);
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
    setTimeout(() => this.successMessage = '', 2000);
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

      this.successMessage = `Exercice terminé ! Votre score: ${Math.round((correct / total) * 100)}%`;
      this.gameCompleted = true;

      const newHistory: UserHistory = {
        userId: this.userID,
        exerciceId: this.exercice.id,
        exerciceName: this.exercice.name,
        date: new Date().toISOString(),
        success: correct,
        failure: this.numberOfFailure,
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
