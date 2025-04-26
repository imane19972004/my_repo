// create-exercice.component.ts
import { Component } from '@angular/core';
import { ExerciceService } from '../../services/exercice.service';
import { Exercice } from '../../models/exercice.model';
import { Category } from '../../models/category.model';
import { Item } from '../../models/item.model';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-exercice',
  templateUrl: './create-exercice.component.html', // Correction de la référence au template
  styleUrls: ['./create-exercice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateExerciceComponent {
  exercice: Exercice = {
    id: '', // L'ID sera généré par le service
    name: '',
    categories: [],
    items: []
  };

  // Objets temporaires pour le formulaire
  categoryInput: Category = { name: '', description: '', imagePath: '' };
  itemInput: any = { name: '', description: '', imagePath: '', category: '' };
  
  // Variables pour les messages
  exerciceCreated: boolean = false;

  constructor(private exerciceService: ExerciceService) {}

  // Fonction pour ajouter une catégorie
  addCategory(): void {
    if (this.categoryInput.name && this.categoryInput.description) {
      // Ajout de la catégorie dans la liste des catégories de l'exercice
      this.exercice.categories.push({ ...this.categoryInput });

      // Réinitialisation du formulaire de catégorie
      this.categoryInput = { name: '', description: '', imagePath: '' };
    } else {
      console.log('Veuillez remplir tous les champs de la catégorie.');
    }
  }

  // Fonction pour ajouter un objet
  addItem(): void {
    if (this.itemInput.name && this.itemInput.description && this.itemInput.category) {
      // Ajout de l'objet dans la liste des objets de l'exercice
      this.exercice.items.push({ ...this.itemInput });

      // Réinitialisation du formulaire d'objet
      this.itemInput = { name: '', description: '', imagePath: '', category: '' };
    } else {
      console.log('Veuillez remplir tous les champs de l\'objet.');
    }
  }

  // Supprimer une catégorie
  removeCategory(index: number): void {
    this.exercice.categories.splice(index, 1);
  }

  // Supprimer un objet
  removeItem(index: number): void {
    this.exercice.items.splice(index, 1);
  }

  // Soumettre l'exercice (ajouter à la liste globale via le service)
  onSubmit(): void {
    if (this.exercice.name && this.exercice.categories.length > 0) {
      this.exerciceService.addExercice(this.exercice);
      this.showSuccessMessage();
      this.resetForm();
    } else {
      console.log('Le formulaire est incomplet.');
    }
  }

  // Afficher un message de succès
  showSuccessMessage(): void {
    this.exerciceCreated = true;
    setTimeout(() => {
      this.exerciceCreated = false;
    }, 3000);
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.exercice = { id: '', name: '', categories: [], items: [] };
    this.categoryInput = { name: '', description: '', imagePath: '' };
    this.itemInput = { name: '', description: '', imagePath: '', category: '' };
  }
}