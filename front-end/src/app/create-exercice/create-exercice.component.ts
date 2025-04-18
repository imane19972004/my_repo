// create-exercice.component.ts
import { Component } from '@angular/core';
import { ExerciceService } from '../../services/exercice.service';
import { Exercice } from '../../models/exercice.model';
import { Category } from '../../models/category.model';
import {  ViewEncapsulation } from '@angular/core';



@Component({
  selector: 'app-create-exercice',
  template: './create-exercice.component.html',
  styleUrls: ['./create-exercice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateExerciceComponent {
  quiz: Exercice = {
    id: '', // L'ID sera généré par le service
    name: '',
    categories: [],
    items: []
  };

  // Déclaration de categoryInput comme un objet de type Category
  categoryInput: Category = { name: '', description: '', imagePath: '' };

  constructor(private exerciceService: ExerciceService) {}

  // Fonction pour ajouter une catégorie
  addCategory(): void {
    if (this.categoryInput.name && this.categoryInput.description && this.categoryInput.imagePath) {
      // Ajout de la catégorie dans la liste des catégories de l'exercice
      this.quiz.categories.push({ ...this.categoryInput });

      // Réinitialisation du formulaire
      this.categoryInput = { name: '', description: '', imagePath: '' };
    } else {
      console.log('Veuillez remplir tous les champs de la catégorie.');
    }
  }

  // Soumettre l'exercice (ajouter à la liste globale via le service)
  onSubmit(): void {
    if (this.quiz.name && this.quiz.categories.length > 0) {
      this.exerciceService.addExercice(this.quiz);
      this.resetForm();
    } else {
      console.log('Le formulaire est incomplet.');
    }
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.quiz = { id: '', name: '', categories: [], items: [] };
    this.categoryInput = { name: '', description: '', imagePath: '' };
  }
  addItem(): void {
    this.quiz.items.push({
      name: '',
      description: '',
      imagePath: '',
      category: ''
    });
  }
  
}
