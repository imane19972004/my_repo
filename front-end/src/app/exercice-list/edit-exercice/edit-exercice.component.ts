import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciceService } from '../../../services/exercice.service';
import { Exercice } from '../../../models/exercice.model';
import { Category } from '../../../models/category.model';
import { Item } from '../../../models/item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-exercice',
  templateUrl: './edit-exercice.component.html',
  styleUrls: ['./edit-exercice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditExerciceComponent implements OnInit {
  exercice: Exercice = {
    id: '',
    name: '',
    theme: '',
    description: '',
    categories: [],
    items: []
  };

  currentStep = 1;

  categoryInput: Category = { name: '', description: '', imagePath: '' };
  itemInput: Item = { name: '', description: '', imagePath: '', category: '' };

  // Pour gestion modification catégories
  isEditingCategory = false;
  editingCategoryIndex: number | null = null;

  // Pour gestion modification items
  isEditingItem = false;
  editingItemIndex: number | null = null;

  customTheme: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciceService: ExerciceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.exerciceService.getExerciceById(id).subscribe(found => {
        if (found) {
          this.exercice = JSON.parse(JSON.stringify(found));
          this.exercice.categories = this.exercice.categories || [];
          this.exercice.items = this.exercice.items || [];
        } else {
          alert("Exercice introuvable");
          this.router.navigate(['/exercice-list-manager']);
        }
      });
    }
  }

  getFinalTheme(): string {
    return this.exercice.theme;
  }

  addCategory(): void {
    if (this.exercice.categories.length >= 3) {
      alert('Vous ne pouvez pas ajouter plus de 3 catégories.');
      return;
    }
    if (!this.categoryInput.name || !this.categoryInput.description || !this.categoryInput.imagePath) {
      alert("Tous les champs de la catégorie sont requis.");
      return;
    }
    // Vérifier doublon nom catégorie
    if (this.exercice.categories.some(cat => cat.name === this.categoryInput.name)) {
      alert("Une catégorie avec ce nom existe déjà.");
      return;
    }

    this.exercice.categories.push({ ...this.categoryInput });
    this.resetCategoryInput();
  }

  startEditingCategory(i: number) {
    this.isEditingCategory = true;
    this.editingCategoryIndex = i;
    this.categoryInput = { ...this.exercice.categories[i] };
  }

  cancelEditCategory() {
    this.isEditingCategory = false;
    this.editingCategoryIndex = -1;
    this.categoryInput = { name: '', description: '', imagePath: '' };
  }

  updateCategory(): void {
    if (this.editingCategoryIndex === null) return;

    const oldCategory = this.exercice.categories[this.editingCategoryIndex];

    // On ne remplace que les champs non vides, sinon on garde l'ancien
    const updatedCategory: Category = {
      name: this.categoryInput.name.trim() || oldCategory.name,
      description: this.categoryInput.description.trim() || oldCategory.description,
      imagePath: this.categoryInput.imagePath || oldCategory.imagePath
    };

    // Vérifier doublon sauf l'actuelle
    const duplicate = this.exercice.categories.some(
      (cat, i) => cat.name === updatedCategory.name && i !== this.editingCategoryIndex
    );
    if (duplicate) {
      alert("Une catégorie avec ce nom existe déjà.");
      return;
    }

    // Mettre à jour la catégorie
    const oldName = oldCategory.name;
    this.exercice.categories[this.editingCategoryIndex] = updatedCategory;

    // Mettre à jour les items associés (changer catégorie des items avec l'ancien nom)
    this.exercice.items.forEach(item => {
      if (item.category === oldName) {
        item.category = updatedCategory.name;
      }
    });

    this.resetCategoryInput();
    this.isEditingCategory = false;
    this.editingCategoryIndex = null;
  }

  removeCategory(index: number): void {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ? Tous les objets associés seront aussi supprimés.")) {
      return;
    }

    const removed = this.exercice.categories.splice(index, 1)[0];
    this.exercice.items = this.exercice.items.filter(item => item.category !== removed.name);

    if (this.exercice.categories.length === 0 && this.currentStep > 1) {
      this.currentStep = 1;
    }

    // Si on modifiait cette catégorie, on annule
    if (this.isEditingCategory && this.editingCategoryIndex === index) {
      this.cancelEditCategory();
    }
  }

  resetCategoryInput(): void {
    this.categoryInput = { name: '', description: '', imagePath: '' };
  }

  addItem(): void {
    if (!this.itemInput.name || !this.itemInput.description.trim() || !this.itemInput.imagePath || !this.itemInput.category) {
      alert("Tous les champs de l'objet sont requis.");
      return;
    }

    const itemsInCategory = this.exercice.items.filter(item => item.category === this.itemInput.category);
    if (itemsInCategory.length >= 4) {
      alert(`La catégorie "${this.itemInput.category}" ne peut contenir que 4 objets maximum.`);
      return;
    }

    // Vérifier doublon nom item dans la même catégorie
    if (this.exercice.items.some(item => item.name === this.itemInput.name && item.category === this.itemInput.category)) {
      alert("Un objet avec ce nom existe déjà dans cette catégorie.");
      return;
    }

    this.exercice.items.push({ ...this.itemInput });
    this.resetItemInput();
  }

  editItem(index: number): void {
    const item = this.exercice.items[index];
    this.itemInput = { ...item };
    this.isEditingItem = true;
    this.editingItemIndex = index;
  }

  updateItem(): void {
    if (this.editingItemIndex === null) return;

    if (!this.itemInput.name || !this.itemInput.description.trim() || !this.itemInput.imagePath || !this.itemInput.category) {
      alert("Tous les champs de l'objet sont requis.");
      return;
    }

    // Vérifier doublon sauf l'actuel
    const duplicate = this.exercice.items.some(
      (item, i) =>
        item.name === this.itemInput.name &&
        item.category === this.itemInput.category &&
        i !== this.editingItemIndex
    );
    if (duplicate) {
      alert("Un objet avec ce nom existe déjà dans cette catégorie.");
      return;
    }

    // Vérifier nombre max d'objets dans la catégorie (sauf si on modifie la catégorie existante)
    const itemsInCategory = this.exercice.items.filter(
      (item, i) => item.category === this.itemInput.category && i !== this.editingItemIndex
    );
    if (itemsInCategory.length >= 4) {
      alert(`La catégorie "${this.itemInput.category}" ne peut contenir que 4 objets maximum.`);
      return;
    }

    this.exercice.items[this.editingItemIndex] = { ...this.itemInput };
    this.resetItemInput();
    this.isEditingItem = false;
    this.editingItemIndex = null;
  }

  cancelEditItem(): void {
    this.resetItemInput();
    this.isEditingItem = false;
    this.editingItemIndex = null;
  }

  removeItem(index: number): void {
    if (!confirm("Voulez-vous vraiment supprimer cet objet ?")) {
      return;
    }
    this.exercice.items.splice(index, 1);

    if (this.isEditingItem && this.editingItemIndex === index) {
      this.cancelEditItem();
    }
  }

  resetItemInput(): void {
    this.itemInput = { name: '', description: '', imagePath: '', category: '' };
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
      const emptyCategories = this.exercice.categories
        .filter(cat => !this.exercice.items.some(item => item.category === cat.name));
      if (emptyCategories.length > 0) {
        alert('Chaque catégorie doit contenir au moins un objet.');
        return;
      }
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

  exerciceSaved = false;

  save(): void {
    this.exercice.theme = this.getFinalTheme();

    if (!this.exercice.name || !this.exercice.theme) {
      alert('Nom et thème requis.');
      return;
    }
    if (this.exercice.categories.length === 0) {
      alert('Aucune catégorie.');
      return;
    }
    if (this.exercice.items.length === 0) {
      alert('Aucun objet.');
      return;
    }
    const emptyCategories = this.exercice.categories
      .filter(cat => !this.exercice.items.some(item => item.category === cat.name));
    if (emptyCategories.length > 0) {
      alert('Chaque catégorie doit contenir au moins un objet.');
      return;
    }

    this.exerciceService.updateExercice(this.exercice);
    this.exerciceSaved = true;
    alert('Exercice mis à jour avec succès !');
    this.router.navigate(['/exercice-list-manager']);
  }

  onSubmit(): void {
    this.save();
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
      this.uploadImage(file).subscribe(path => {
        this.itemInput.imagePath = path;
      });
    }
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.exerciceService.uploadImage(formData);
  }
}
