import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class CreateExerciceFixture extends E2EComponentFixture {
  
  // Navigation entre les étapes
  getNextButton() {
    return this.page.getByRole('button', { name: 'Suivant' });
  }
  
  getPreviousButton() {
    return this.page.getByRole('button', { name: 'Précédent' });
  }
  
  getSubmitButton() {
    return this.page.getByRole('button', { name: 'Créer l\'exercice' });
  }

  // Étape 1 - Informations générales et catégories
  getThemeInput() {
    return this.page.locator('#theme');
  }
  
  getNameInput() {
    return this.page.locator('#name');
  }
  
  getDescriptionInput() {
    return this.page.locator('#description');
  }
  
  getCategoryNameInput() {
    return this.page.locator('input[name="categoryName"]');
  }
  
  getCategoryDescriptionInput() {
    return this.page.locator('input[name="categoryDescription"]');
  }
  
  getCategoryImageInput() {
    return this.page.locator('input[name="categoryImage"]');
  }
  
  getAddCategoryButton() {
    return this.page.getByRole('button', { name: 'Ajouter cette catégorie' });
  }
  
  getCategoryList() {
    return this.page.locator('.category-item');
  }
  
  getCategoryRemoveButton(index: number) {
    return this.page.locator(`.category-item >> nth=${index} >> button.btn-remove`);
  }

  // Étape 2 - Items
  getItemNameInput() {
    return this.page.locator('input[name="itemName"]');
  }
  
  getItemDescriptionInput() {
    return this.page.locator('input[name="itemDescription"]');
  }
  
  getItemImageInput() {
    return this.page.locator('input[name="itemImage"]');
  }
  
  getItemCategorySelect() {
    return this.page.locator('select[name="itemCategory"]');
  }
  
  getAddItemButton() {
    return this.page.getByRole('button', { name: 'Ajouter cet objet' });
  }
  
  getItemList() {
    return this.page.locator('.item-list');
  }
  
  getItemRemoveButton(index: number) {
    return this.page.locator(`.item-list >> nth=${index} >> button.btn-remove`);
  }

  // Messages de succès et d'erreur
  getSuccessMessage() {
    return this.page.locator('.success-message');
  }
  
  getImageOkMessage() {
    return this.page.locator('.image-ok');
  }

  // Actions métier
  async fillExerciceBasicInfo(name: string, theme: string, description?: string) {
    // await this.getNameInput().fill(name);
    await this.getThemeInput().fill(theme);
    await this.getNameInput().fill(name);
    if (description) {
      await this.getDescriptionInput().fill(description);
    }
  }
  
  async addCategory(name: string, description: string, imagePath: string) {
    await this.getCategoryNameInput().fill(name);
    await this.getCategoryDescriptionInput().fill(description);
    await this.getCategoryImageInput().setInputFiles(imagePath);
    await this.getAddCategoryButton().click();
  }
  
  async addItem(name: string, description: string, category: string, imagePath: string) {
    await this.getItemNameInput().fill(name);
    await this.getItemDescriptionInput().fill(description);
    await this.getItemCategorySelect().selectOption(category);
    await this.getItemImageInput().setInputFiles(imagePath);
    await this.getAddItemButton().click();
  }
  
  async goToNextStep() {
    await this.getNextButton().click();
  }
  
  async goToPreviousStep() {
    await this.getPreviousButton().click();
  }
  
  async submitExercice() {
    await this.getSubmitButton().click();
  }
  
  async getCurrentStepElements() {
    const step1 = await this.page.locator('div[*ngIf="currentStep === 1"]').isVisible();
    const step2 = await this.page.locator('div[*ngIf="currentStep === 2"]').isVisible();
    const step3 = await this.page.locator('div[*ngIf="currentStep === 3"]').isVisible();
    
    if (step1) return 1;
    if (step2) return 2;
    if (step3) return 3;
    return 0;
  }
}