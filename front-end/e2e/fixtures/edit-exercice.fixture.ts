import { Page, Locator } from '@playwright/test';

export class EditExerciceFixture {
  constructor(private readonly page: Page) {}

  // Exercice (étape 1)
  exerciceTheme(): Locator {
    // Sélecteur plus simple, texte 'Thème' quelque part visible
    return this.page.locator('text=Thème').first();
  }

  exerciceName(): Locator {
    return this.page.locator('text=Nom').first();
  }

  exerciceDescription(): Locator {
    return this.page.locator('text=Description').first();
  }

  // Catégories (étape 1)
  categoriesList(): Locator {
    return this.page.locator('.category');
  }

  categoryName(index: number): Locator {
    return this.page.locator(`.category:nth-child(${index + 1}) .category-name`);
  }

  addCategoryButton(): Locator {
    return this.page.locator('button:has-text("Ajouter cette catégorie")');
  }

  categoryNameInput(): Locator {
    return this.page.locator('input[name="categoryName"]').last();
  }

  categoryDescriptionInput(): Locator {
    return this.page.locator('input[name="categoryDescription"]').last();
  }

  // Navigation
  nextStepButton(): Locator {
    return this.page.locator('button:has-text("Étape suivante")');
  }

  prevStepButton(): Locator {
    return this.page.locator('button:has-text("Étape précédente")');
  }

  saveButton(): Locator {
    return this.page.locator('button:has-text("Sauvegarder")');
  }

  // Méthodes utiles
  async addCategory(name: string, description: string) {
    await this.categoryNameInput().fill(name);
    await this.categoryDescriptionInput().fill(description);
    await this.addCategoryButton().click();
  }

  async getCurrentStep(): Promise<number> {
    if (await this.page.locator('[data-step="1"]').isVisible()) return 1;
    if (await this.page.locator('[data-step="2"]').isVisible()) return 2;
    if (await this.page.locator('[data-step="3"]').isVisible()) return 3;
    return 0;
  }
}
