import { Component } from '@angular/core';
import { ExerciceService } from '../../../services/exercice.service';
import { Exercice } from '../../../models/exercice.model';
import { Category } from '../../../models/category.model';
import { ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-exercice',
  templateUrl: './create-exercice.component.html',
  styleUrls: ['./create-exercice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateExerciceComponent {
  exercice: Exercice = {
    id: '',
    name: '',
    theme: '',
    description: '',
    categories: [],
    items: []
  };

  currentStep = 1;

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

  categoryInput: Category = { name: '', description: '', imagePath: '' };
  itemInput: any = { name: '', description: '', imagePath: '', category: '' };

  exerciceCreated: boolean = false;

  constructor(private exerciceService: ExerciceService) {}

  // Suggère un nom amusant en fonction du thème sélectionné
  suggestName(): void {
    const index = this.themeSuggestions.indexOf(this.exercice.theme);
    if (index !== -1) {
      this.exercice.name = this.nameSuggestions[index];
    }
  }

  // Fonction pour ajouter une catégorie
  addCategory(): void {
    if (this.exercice.categories.length >= 3) {
      alert('Vous ne pouvez pas ajouter plus de 3 catégories.');
      return;
    }
    if (this.categoryInput.name && this.categoryInput.description) {
      this.exercice.categories.push({ ...this.categoryInput });
      this.categoryInput = { name: '', description: '', imagePath: '' };
    } else {
      alert('Veuillez remplir tous les champs de la catégorie.');
    }
  }

  addItem(): void {
    if (this.itemInput.name && this.itemInput.description && this.itemInput.category) {
      this.exercice.items.push({ ...this.itemInput });
      this.itemInput = { name: '', description: '', imagePath: '', category: '' };
    } else {
      alert('Veuillez remplir tous les champs de l\'objet.');
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

  nextStep(): void {
    if (this.currentStep === 1 && this.exercice.categories.length === 0) {
      alert('Veuillez ajouter au moins une catégorie avant de passer à l’étape suivante.');
      return;
    }
    if (this.currentStep === 2 && this.exercice.items.length === 0) {
      alert('Veuillez ajouter au moins un objet avant de passer à l’étape suivante.');
      return;
    }
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.exercice.name && this.exercice.theme && this.exercice.categories.length > 0) {
      this.exerciceService.addExercice(this.exercice);
      this.showSuccessMessage();
      this.resetForm();
      this.currentStep = 1;
    } else {
      alert('Le formulaire est incomplet.');
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
  }

  onCategoryImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadImage(file).subscribe(path => {
        this.categoryInput.imagePath = path;
      });
    }
  }

  onItemImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadImage(file).subscribe((path: string) => {
        if (path) {
          this.itemInput.imagePath = path;
        } else {
          alert("Échec de chargement de l'image.");
        }
      });
    }
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.exerciceService.uploadImage(formData);
  }
}
