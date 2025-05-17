import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerciceService } from '../../../services/exercice.service';
import { UserService } from '../../../services/user.service';
import { Exercice } from '../../../models/exercice.model';
import { Item } from '../../../models/item.model';
import { UserHistory } from '../../../models/user-history.model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

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

  constructor(
    private route: ActivatedRoute,
    private exerciceService: ExerciceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const exerciceId = this.route.snapshot.params['idExercice'];
    this.userID = this.route.snapshot.params['idUser'];
    if (exerciceId) this.loadExercice(exerciceId);
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
    this.itemsInBulk = [...this.exercice.items];
    this.itemsByCategory = {};
    this.exercice.categories.forEach(c => this.itemsByCategory[c.name] = []);
    this.connectedDropListsIds = ['bulk-list', ...this.exercice.categories.map(c => `category-${c.name}`)];
    this.shuffleArray(this.itemsInBulk);
    this.gameCompleted = false;
    this.successMessage = '';
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
    this.messageColor = 'green';
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
