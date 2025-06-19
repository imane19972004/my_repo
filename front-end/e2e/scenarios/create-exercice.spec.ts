import { test, expect } from '@playwright/test';
import { CreateExerciceFixture } from '../fixtures/create-exercice.fixture';
import * as path from 'path';

const testImagePath = path.join(__dirname, '../../src/assets/resources/objets-et-pieces-de-la-maison/cuisine.png');
const testImagePath2 = path.join(__dirname, '../../src/assets/resources/objets-et-pieces-de-la-maison/salon.png');

test.describe('Create Exercice', () => {
  let fixture: CreateExerciceFixture;

  test.beforeEach(async ({ page }) => {
    fixture = new CreateExerciceFixture(page);
    await fixture.gotoCreateExercicePage();
  });

  test('Should create a complete exercice successfully', async () => {
    test.setTimeout(60000);
    await fixture.fillExerciceBasicInfo(
      'Rangeons notre maison !',
      'Objets et pièces de la maison',
      'Un exercice pour apprendre à ranger les objets dans les bonnes places'
    );

    // Ajout des catégories
    await fixture.addCategory('Cuisine', 'Place où l\'on prépare à manger', testImagePath);
    await expect(fixture.getCategoryList()).toHaveCount(1);

    await fixture.addCategory('Salon', 'Place où l\'on se détend', testImagePath2);
    await expect(fixture.getCategoryList()).toHaveCount(2);

    // Aller à l'étape 2
    await fixture.goToNextStep();
    await fixture.waitForStep(2);
    expect(await fixture.getCurrentStep()).toBe(2);

    // Ajout des items
    await fixture.addItem('Fourchette', 'Ustensile pour manger', 'Cuisine', testImagePath);
    await fixture.waitForItemAdded();

    await fixture.addItem('Télécommande', 'Pour changer de chaîne', 'Salon', testImagePath2);
    await fixture.waitForItemAdded();

    await expect(fixture.getItemList()).toHaveCount(2);

    // Aller à l'étape 3
    await fixture.goToNextStep();
    await fixture.waitForStep(3);
    expect(await fixture.getCurrentStep()).toBe(3);

    // Soumettre l'exercice
    await fixture.submitExercice();

    await expect(fixture.getSuccessMessage()).toBeVisible({ timeout: 10000 });
  });

  test('Should not allow navigation to next step without required data', async () => {
    await expect(fixture.getNextButton()).toBeDisabled();

    await fixture.fillExerciceBasicInfo('Test Exercice', 'Test Theme');
    await expect(fixture.getNextButton()).toBeDisabled();
  });

  test('Should validate category creation requirements', async () => {
    await fixture.fillExerciceBasicInfo('Test Exercice', 'Test Theme');

    await fixture.getCategoryDescriptionInput().fill('Description test');
    await expect(fixture.getAddCategoryButton()).toBeDisabled();

    await fixture.getCategoryNameInput().fill('Test Category');
    await expect(fixture.getAddCategoryButton()).toBeDisabled();

    await fixture.getCategoryImageInput().setInputFiles(testImagePath);
    await fixture.waitForCategoryAdded();
    await expect(fixture.getAddCategoryButton()).toBeEnabled();
  });

  test('Should limit categories to maximum 3', async () => {
    test.setTimeout(60000);
    await fixture.fillExerciceBasicInfo('Test Exercice', 'Test Theme', 'Description test');

    for (let i = 1; i <= 3; i++) {
      await fixture.addCategory(`Catégorie ${i}`, `Description ${i}`, i%2 == 0 ? testImagePath2 : testImagePath);
      await fixture.waitForCategoryAdded();
    }

    await expect(fixture.getCategoryList()).toHaveCount(3);

    // Essayer d’ajouter une 4ème catégorie
    await fixture.getCategoryNameInput().fill('Catégorie 4');
    await fixture.getCategoryDescriptionInput().fill('Description 4');
    await fixture.getCategoryImageInput().setInputFiles('e2e/assets/photo.jpg');

    await expect(fixture.getAddCategoryButton()).toBeDisabled();
  });

  test('Should allow category removal', async () => {
    await fixture.fillExerciceBasicInfo('Test Exercice', 'Test Theme');

    await fixture.addCategory('Cuisine', 'Test cuisine', testImagePath);
    await fixture.waitForCategoryAdded();

    await fixture.addCategory('Salon', 'Test salon', testImagePath2);
    await fixture.waitForCategoryAdded();

    await expect(fixture.getCategoryList()).toHaveCount(2);

    await fixture.acceptNextDialog();
    await fixture.getCategoryRemoveButton(0).click();

    await expect(fixture.getCategoryList()).toHaveCount(1);
  });

  test('Should validate item creation in step 2', async () => {
    await fixture.fillExerciceBasicInfo('Test Exercice', 'Test Theme');

    await fixture.addCategory('Test Category', 'Test Description', testImagePath);
    await fixture.waitForCategoryAdded();

    await fixture.goToNextStep();
    await fixture.waitForStep(2);

    await expect(fixture.getAddItemButton()).toBeDisabled();

    await fixture.getItemNameInput().fill('Test Item');
    await expect(fixture.getAddItemButton()).toBeDisabled();

    await fixture.getItemDescriptionInput().fill('Test Description');
    await fixture.getItemCategorySelect().selectOption('Test Category');
    await fixture.getItemImageInput().setInputFiles(testImagePath);
    await fixture.waitForItemAdded();

    await expect(fixture.getAddItemButton()).toBeEnabled();
  });

  test('Should enforce at least one item per category rule', async () => {
    await fixture.fillExerciceBasicInfo('Test Exercice', 'Test Theme');

    await fixture.addCategory('Cuisine', 'Test cuisine', testImagePath);
    await fixture.waitForCategoryAdded();

    await fixture.addCategory('Salon', 'Test salon', testImagePath2);
    await fixture.waitForCategoryAdded();

    await fixture.goToNextStep();
    await fixture.waitForStep(2);

    await fixture.addItem('Fourchette', 'Ustensile', 'Cuisine', testImagePath);
    await fixture.waitForItemAdded();

    let alertTriggered = false;
    await fixture.handleNextDialog((message) => {
      expect(message).toContain('Chaque catégorie doit contenir au moins un objet');
      alertTriggered = true;
    });

    await fixture.getNextButton().click();

    // Laisser le temps à l'alerte de se déclencher
    await fixture.waitForItemAdded();

    expect(alertTriggered).toBe(true);
    expect(await fixture.getCurrentStep()).toBe(2);
  });

  test('Should allow navigation between steps', async () => {
    await fixture.fillExerciceBasicInfo('Test Exercice', 'Test Theme');

    await fixture.addCategory('Test Category', 'Test Description', testImagePath);
    await fixture.waitForCategoryAdded();

    await fixture.goToNextStep();
    await fixture.waitForStep(2);
    expect(await fixture.getCurrentStep()).toBe(2);

    await fixture.addItem('Test Item', 'Test Description', 'Test Category', testImagePath);
    await fixture.waitForItemAdded();

    await fixture.goToNextStep();
    await fixture.waitForStep(3);
    expect(await fixture.getCurrentStep()).toBe(3);

    await fixture.goToPreviousStep();
    await fixture.waitForStep(2);
    expect(await fixture.getCurrentStep()).toBe(2);

    await fixture.goToPreviousStep();
    await fixture.waitForStep(1);
    expect(await fixture.getCurrentStep()).toBe(1);

    await expect(fixture.getPreviousButton()).toBeDisabled();
  });
});
