import { Component, ViewEncapsulation } from '@angular/core';
import { ExerciceService } from '../../../services/exercice.service';
import { Exercice } from '../../../models/exercice.model';
import { Category } from '../../../models/category.model';
import { Observable } from 'rxjs';
import {Item} from "../../../models/item.model";

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

  customTheme: string = '';
  currentStep = 1;

  categoryInput: Category = { name: '', description: '', imagePath: '' };
  itemInput: Item = { name: '', description: '', imagePath: '', category: '' };

  exerciceCreated: boolean = false;

  categoryAddedMessage: string = '';
  itemAddedMessage: string = '';

  constructor(private exerciceService: ExerciceService) {}

  addCategory(): void {
    if (this.exercice.categories.length >= 3) {
      alert('Vous ne pouvez pas ajouter plus de 3 catégories.');
      return;
    }
    if (!this.categoryInput.imagePath?.trim()) {
      alert('Veuillez mettre l\'image de la catégorie !');
      return;
    }
    if (this.categoryInput.name && this.categoryInput.description) {
      this.exercice.categories.push({ ...this.categoryInput });
      this.categoryInput = { name: '', description: '', imagePath: '' };
      this.categoryAddedMessage = '✅ Catégorie ajoutée avec succès !';
      setTimeout(() => this.categoryAddedMessage = '', 3000);
    } else {
      alert('Veuillez remplir tous les champs de la catégorie !');
    }
  }

  addItem(): void {
    if (!this.itemInput.name || !this.itemInput.description || !this.itemInput.category) {
      alert('Veuillez remplir tous les champs de l\'objet.');
      return;
    }

    if (!this.itemInput.description.trim()) {
      alert('La description de l\'objet est obligatoire.');
      return;
    }

    if (!this.itemInput.imagePath?.trim()) {
      alert('Veuillez ajouter la photo de l\'objet que vous êtes entrain de créer!');
      return;
    }
    const itemsInCategory = this.exercice.items.filter(item => item.category === this.itemInput.category);

    if (itemsInCategory.length >= 4) {
      alert(`La catégorie "${this.itemInput.category}" ne peut contenir que 4 objets au maximum.`);
      return;
    }

    this.exercice.items.push({ ...this.itemInput });
    this.itemInput = { name: '', description: '', imagePath: '', category: '' };
    this.itemAddedMessage = '✅ Objet ajouté avec succès !';
    setTimeout(() => this.itemAddedMessage = '', 3000);
  }


  removeCategory(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const removed = this.exercice.categories.splice(index, 1)[0];

      this.exercice.items = this.exercice.items.filter(
        item => item.category !== removed.name
      );

      if (this.exercice.categories.length === 0) {
        this.currentStep = 1;
      }
    }
  }


  removeItem(index: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet objet ?")) {
      this.exercice.items.splice(index, 1);
    }
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.exercice.categories.length === 0) {
      alert('Ajoutez au moins une catégorie.');
      return;
    }
    if (this.currentStep === 2) {
      if (this.exercice.items.length === 0) {
        alert('Ajoutez au moins un objet.');
        return;
      }
      // Vérifier qu’au moins un objet par catégorie
      const emptyCats = this.exercice.categories
        .filter(cat => !this.exercice.items.some(it => it.category === cat.name));
      if (emptyCats.length) {
        alert('Chaque catégorie doit contenir au moins un objet.');
        return;
      }
    }
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getFinalTheme(): string {
    return this.exercice.theme === 'autre' ? this.customTheme.trim() : this.exercice.theme;
  }

  onSubmit(): void {
    if (!this.exercice.name || !this.getFinalTheme()) {
      alert('Nom et thème requis.');
      return;
    }
    if (this.exercice.categories.length === 0) {
      alert('Ajoutez au moins une catégorie.');
      return;
    }
    if (this.exercice.items.length === 0) {
      alert('Ajoutez au moins un objet.');
      return;
    }
    const emptyCats = this.exercice.categories
      .filter(cat => !this.exercice.items.some(it => it.category === cat.name));
    if (emptyCats.length) {
      alert('Toutes les catégories doivent avoir au moins un objet.');
      return;
    }

    this.exerciceService.addExercice(this.exercice);
    this.showSuccessMessage();
    this.resetForm();
    this.currentStep = 1;
  }

  showSuccessMessage(): void {
    this.exerciceCreated = true;
    setTimeout(() => {
      this.exerciceCreated = false;
    }, 3000);
  }

  resetForm(): void {
    this.exercice = {
      id: '',
      name: '',
      theme: '',
      description: '',
      categories: [],
      items: []
    };
    this.customTheme = '';
    this.categoryInput = { name: '', description: '', imagePath: '' };
    this.itemInput = { name: '', description: '', imagePath: '', category: '' };
    this.categoryAddedMessage = '';
    this.itemAddedMessage = '';
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
  // Ajoutez cette méthode dans create-exercice.component.ts

getItemsInCategory(categoryName: string): Item[] {
  return this.exercice.items.filter(item => item.category === categoryName);
}
}
