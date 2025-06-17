import { E2EComponentFixture } from "e2e/e2e-component.fixture";
import { testUrl } from "e2e/e2e.config";

export class CreateExerciceFixture extends E2EComponentFixture {
  async gotoCreateExercicePage() {
    await this.page.goto(`${testUrl}/create-exercice`);
    await this.page.waitForSelector('#theme');
  }

  async acceptNextDialog() {
    this.page.once('dialog', dialog => dialog.accept());
  }

  async handleNextDialog(callback: (message: string) => void) {
    this.page.once('dialog', dialog => {
      callback(dialog.message());
      dialog.accept();
    });
  }

  getNextButton() {
    return this.page.getByRole('button', { name: 'Suivant' });
  }

  getPreviousButton() {
    return this.page.getByRole('button', { name: 'Précédent' });
  }

  getSubmitButton() {
    return this.page.getByRole('button', { name: 'Créer l\'exercice' });
  }

  getThemeInput() {
    return this.page.locator('#theme');
  }

  getNameInput() {
    return this.page.locator('#name');
  }

  getItems() {
    return this.page.locator('li.item-list');
  }

  getCategories() {
    return this.page.locator('li.category-item');
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
    return this.page.locator(`.category-item`).nth(index).locator('button.btn-remove');
  }

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
    return this.page.locator(`.item-list`).nth(index).locator('button.btn-remove');
  }

  getSuccessMessage() {
    return this.page.locator('text=Exercice créé avec succès');
  }

  async fillExerciceBasicInfo(name: string, theme: string, description?: string) {
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
    await this.waitForCategoryAdded();
    await this.getAddCategoryButton().click();
  }

  async addItem(name: string, description: string, category: string, imagePath: string) {
    await this.getItemNameInput().fill(name);
    await this.getItemDescriptionInput().fill(description);
    await this.getItemCategorySelect().selectOption(category);
    await this.getItemImageInput().setInputFiles(imagePath);
    await this.waitForItemAdded();
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

  async getCurrentStep() {
    const step1Visible = await this.page.locator('[data-testid="step-1"]').isVisible();
    const step2Visible = await this.page.locator('[data-testid="step-2"]').isVisible();
    const step3Visible = await this.page.locator('[data-testid="step-3"]').isVisible();

    if (step1Visible) return 1;
    if (step2Visible) return 2;
    if (step3Visible) return 3;
    return 0;
  }

  async waitForStep(stepNumber: number, timeout = 5000) {
    await this.page.waitForSelector(`[data-testid="step-${stepNumber}"]`, { timeout });
  }

  async waitForCategoryAdded() {
    // Remplace l'attente directe par une méthode accessible
    await this.wait(500);
  }

  async waitForItemAdded() {
    // Remplace l'attente directe par une méthode accessible
    await this.wait(500);
  }

  // Méthode publique pour remplacer les accès directs à `page.waitForTimeout`
  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }
}
