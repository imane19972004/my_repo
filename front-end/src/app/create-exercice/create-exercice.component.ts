// create-exercice.component.ts
import { Component } from '@angular/core';
import { ExerciceService } from '../../services/exercice.service';
import { Exercice } from '../../models/exercice.model';
import { Category } from '../../models/category.model';
import { Item } from '../../models/item.model';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-create-exercice',
  templateUrl: './create-exercice.component.html',
  styleUrls: ['./create-exercice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateExerciceComponent {
  exercice: Exercice = {
    id: '', // L'ID sera généré par le service
    name: '',
    theme: '',
    description: '',
    categories: [],
    items: []
  };

  // Modèles de noms amusants pour les suggestions
  themeSuggestions = [
    "Objets et pièces de la maison",
    "Vêtements et parties du corps",
    "Vêtements et saisons",
    "Monuments et capitales", 
    "Ingrédients et plats"
  ];

  nameSuggestions = [
    "Rangeons notre maison !",
    "À chacun son vêtement !",
    "Habillons-nous selon la saison !",
    "Voyage autour du monde !",
    "Préparons un festin !"
  ];

  // Objets temporaires pour le formulaire
  categoryInput: Category = { name: '', description: '', imagePath: '' };
  itemInput: any = { name: '', description: '', imagePath: '', category: '' };
  
  // Variables pour les messages
  exerciceCreated: boolean = false;

  // Variables pour la gestion des fichiers
  categoryImageFile: File | null = null;
  itemImageFile: File | null = null;

  constructor(private exerciceService: ExerciceService) {}

  // Suggère un nom amusant en fonction du thème sélectionné
  suggestName(): void {
    const index = this.themeSuggestions.indexOf(this.exercice.theme);
    if (index !== -1) {
      this.exercice.name = this.nameSuggestions[index];
    }
  }

  // Gestion du téléchargement d'images pour les catégories
  onCategoryImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.categoryImageFile = file;
      
      // Lecture du fichier pour prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryInput.imagePath = e.target.result;
      };
      reader.readAsDataURL(file); // Passage du fichier directement, pas de la variable qui peut être null
    }
  }

  // Gestion du téléchargement d'images pour les items
  onItemImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.itemImageFile = file;
      
      // Lecture du fichier pour prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.itemInput.imagePath = e.target.result;
      };
      reader.readAsDataURL(file); // Passage du fichier directement, pas de la variable qui peut être null
    }
  }

  // Fonction pour ajouter une catégorie
  addCategory(): void {
    if (this.categoryInput.name && this.categoryInput.description) {
      // Ajout de la catégorie dans la liste des catégories de l'exercice
      this.exercice.categories.push({ ...this.categoryInput });

      // Réinitialisation du formulaire de catégorie
      this.categoryInput = { name: '', description: '', imagePath: '' };
      this.categoryImageFile = null;
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
      this.itemImageFile = null;
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
    if (this.exercice.name && this.exercice.theme && this.exercice.categories.length > 0) {
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
    this.exercice = { id: '', name: '', theme: '', description: '', categories: [], items: [] };
    this.categoryInput = { name: '', description: '', imagePath: '' };
    this.itemInput = { name: '', description: '', imagePath: '', category: '' };
    this.categoryImageFile = null;
    this.itemImageFile = null;
  }
}