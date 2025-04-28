import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Exercice } from '../../../models/exercice.model';
import { ActivatedRoute } from '@angular/router';
import { ExerciceService } from '../../../services/exercice.service';
import { Item } from '../../../models/item.model';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})

export class GamePageComponent implements OnInit {
  exercice: Exercice;
  itemsInBulk: Item[] = [];  // Items non encore placés
  itemsByCategory: {[category: string]: Item[]} = {};  // Items déjà placés par catégorie
  successMessage: string = '';
  gameCompleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private exerciceService: ExerciceService
  ) {
     // Initialiser avec un exercice vide
    this.exercice = {
      id: '',
      name: "",
      theme: '',
      categories: [],
      items: []
    };
  }
  
  ngOnInit(): void {
    // Récupérer l'ID de l'exercice depuis les paramètres d'URL
    const exerciceId = this.route.snapshot.params['idExercice'];
    if (exerciceId) {
      this.loadExercice(exerciceId);
      return;
    } else {
      console.error('Aucun ID d\'exercice spécifié');
    }
  }
  
  loadExercice(id: string): void {
    // Correction: obtenir l'exercice depuis le service de façon synchrone
    const exercice = this.exerciceService.getExerciceById(id);
    if (exercice) {
      this.exercice = exercice;
      this.initializeGame();
    } else {
      console.error('Exercice introuvable');
    }
  }
  
  initializeGame(): void {
    // Initialiser tous les objets dans le conteneur "en vrac"
    this.itemsInBulk = [...this.exercice.items];

    // Initialiser les conteneurs de catégories vides
    this.itemsByCategory = {};
    this.exercice.categories.forEach(category => {
      this.itemsByCategory[category.name] = [];
    });

    // Mélanger les objets pour plus de fun
    this.shuffleArray(this.itemsInBulk);

    this.gameCompleted = false;
    this.successMessage = '';
  }
  
  // Méthode pour mélanger un tableau
  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Méthode appelée lorsqu'un objet est déplacé
  onItemMoved(item: Item, targetCategory: string): void {
    // Retirer l'objet du conteneur "en vrac"
    this.itemsInBulk = this.itemsInBulk.filter(i => i !== item);

    // Ajouter l'objet à la catégorie cible
    this.itemsByCategory[targetCategory].push(item);

    // Vérifier si la réponse est correcte
    if (item.category === targetCategory) {
      this.successMessage = 'Bien joué !';
    } else {
      this.successMessage = 'Hmm, êtes-vous sûr ?';
    }

    // Effacer le message après 2 secondes
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);

    // Vérifier si le jeu est terminé
    this.checkGameCompletion();
  }

  checkGameCompletion(): void {
    if (this.itemsInBulk.length === 0) {
      // Calculer le score
      let correctAnswers = 0;
      let totalItems = this.exercice.items.length;

      Object.keys(this.itemsByCategory).forEach(category => {
        this.itemsByCategory[category].forEach(item => {
          if (item.category === category) {
            correctAnswers++;
          }
        });
      });

      const score = Math.round((correctAnswers / totalItems) * 100);
      this.gameCompleted = true;
      this.successMessage = `Exercice terminé ! Votre score: ${score}%`;
    }
  }

  // Réinitialiser le jeu
  resetGame(): void {
    this.initializeGame();
  }
}