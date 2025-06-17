import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { CreateExerciceFixture } from '../fixtures/create-exercice.fixture';
import * as path from 'path';

test.describe('Create Exercice', () => {
  let createExerciceFixture: CreateExerciceFixture;

  // Chemins vers les images de test dans le dossier src/assets/resources
  const testImagePath = path.join(__dirname, '../../src/assets/resources/objets-et-pieces-de-la-maison/cuisine.png');
  const testImagePath2 = path.join(__dirname, '../../src/assets/resources/objets-et-pieces-de-la-maison/salon.png');

  test.beforeEach(async ({ page }) => {
    createExerciceFixture = new CreateExerciceFixture(page);
    await page.goto(`${testUrl}/create-exercice`);
  });

  test('Should create a complete exercice successfully', async () => {
    // Étape 1 : Remplir les informations de base
    await createExerciceFixture.fillExerciceBasicInfo(
      'Rangeons notre maison !',
      'Objets et pièces de la maison',
      'Un exercice pour apprendre à ranger les objets dans les bonnes places'
    );

    // Ajouter une première catégorie
    await createExerciceFixture.addCategory(
      'Cuisine',
      'Place où l\'on prépare à manger',
      testImagePath

    );

    // Vérifier que la catégorie est ajoutée
    await expect(createExerciceFixture.getCategoryList()).toHaveCount(1);

    // Ajouter une deuxième catégorie
    await createExerciceFixture.addCategory(
      'Salon',
      'Place où l\'on se détend',
      testImagePath2
    );

    await expect(createExerciceFixture.getCategoryList()).toHaveCount(2);

    // Passer à l'étape 2
    await createExerciceFixture.goToNextStep();

    // Vérifier qu'on est à l'étape 2
    const currentStep = await createExerciceFixture.getCurrentStepElements();
    expect(currentStep).toBe(2);

    // Ajouter des items
    await createExerciceFixture.addItem(
      'Fourchette',
      'Ustensile pour manger',
      'Cuisine',
      testImagePath
    );

    await createExerciceFixture.addItem(
      'Télécommande',
      'Pour changer de chaîne',
      'Salon',
      testImagePath2
    );

    // Vérifier que les items sont ajoutés
    await expect(createExerciceFixture.getItemList()).toHaveCount(2);

    // Passer à l'étape 3
    await createExerciceFixture.goToNextStep();

    // Vérifier qu'on est à l'étape 3 (validation)
    const finalStep = await createExerciceFixture.getCurrentStepElements();
    expect(finalStep).toBe(3);

    // Soumettre l'exercice
    await createExerciceFixture.submitExercice();

    // Vérifier le message de succès
    await expect(createExerciceFixture.getSuccessMessage()).toBeVisible();
  });

  test('Should not allow navigation to next step without required data', async () => {
    // Essayer de passer à l'étape suivante sans ajouter de catégorie
    const nextButton = createExerciceFixture.getNextButton();
    await expect(nextButton).toBeDisabled();

    // Remplir les informations de base mais sans catégorie
    await createExerciceFixture.fillExerciceBasicInfo(
      'Test Exercice',
      'Test Theme'
    );

    // Le bouton suivant devrait toujours être désactivé
    await expect(nextButton).toBeDisabled();
  });

  test('Should validate category creation requirements', async ({ page }) => {
    // Remplir les infos de base
    await createExerciceFixture.fillExerciceBasicInfo(
      'Test Exercice',
      'Test Theme'
    );

    // Essayer d'ajouter une catégorie sans nom
    await createExerciceFixture.getCategoryDescriptionInput().fill('Description test');

    const addCategoryButton = createExerciceFixture.getAddCategoryButton();
    await expect(addCategoryButton).toBeDisabled();

    // Ajouter le nom mais pas d'image
    await createExerciceFixture.getCategoryNameInput().fill('Test Category');
    await expect(addCategoryButton).toBeDisabled();

    // Ajouter l'image - maintenant le bouton devrait être activé
    await createExerciceFixture.getCategoryImageInput().setInputFiles(testImagePath);
    await expect(addCategoryButton).toBeEnabled();
  });

  test('Should limit categories to maximum 3', async ({ page }) => {
    // Remplir les infos de base
    await createExerciceFixture.fillExerciceBasicInfo(
      'Test Exercice',
      'Test Theme'
    );

    // Ajouter 3 catégories
    for (let i = 1; i <= 3; i++) {
      await createExerciceFixture.addCategory(
        `Catégorie ${i}`,
        `Description ${i}`,
        testImagePath
      );
    }

    // Vérifier qu'on a bien 3 catégories
    await expect(createExerciceFixture.getCategoryList()).toHaveCount(3);

    // Le bouton d'ajout devrait être désactivé
    const addCategoryButton = createExerciceFixture.getAddCategoryButton();
    await expect(addCategoryButton).toBeDisabled();
  });

  test('Should allow category removal', async ({ page }) => {
    // Remplir les infos de base et ajouter des catégories
    await createExerciceFixture.fillExerciceBasicInfo(
      'Test Exercice',
      'Test Theme'
    );

    await createExerciceFixture.addCategory(
      'Cuisine',
      'Test cuisine',
      testImagePath
    );

    await createExerciceFixture.addCategory(
      'Salon',
      'Test salon',
      testImagePath2
    );

    await expect(createExerciceFixture.getCategoryList()).toHaveCount(2);

    // Gérer la boîte de dialogue de confirmation
    page.on('dialog', dialog => dialog.accept());

    // Supprimer la première catégorie
    await createExerciceFixture.getCategoryRemoveButton(0).click();

    // Vérifier qu'il ne reste qu'une catégorie
    await expect(createExerciceFixture.getCategoryList()).toHaveCount(1);
  });

  test('Should validate item creation in step 2', async () => {
    // Aller à l'étape 2 (il faut d'abord ajouter une catégorie)
    await createExerciceFixture.fillExerciceBasicInfo(
      'Test Exercice',
      'Test Theme'
    );

    await createExerciceFixture.addCategory(
      'Test Category',
      'Test Description',
      testImagePath
    );

    await createExerciceFixture.goToNextStep();

    // Vérifier que le bouton d'ajout d'item est désactivé sans données complètes
    const addItemButton = createExerciceFixture.getAddItemButton();
    await expect(addItemButton).toBeDisabled();

    // Remplir partiellement
    await createExerciceFixture.getItemNameInput().fill('Test Item');
    await expect(addItemButton).toBeDisabled();

    // Remplir complètement
    await createExerciceFixture.getItemDescriptionInput().fill('Test Description');
    await createExerciceFixture.getItemCategorySelect().selectOption('Test Category');
    await createExerciceFixture.getItemImageInput().setInputFiles(testImagePath);

    await expect(addItemButton).toBeEnabled();
  });

  test('Should enforce at least one item per category rule', async ({ page }) => {
    // Créer un exercice avec 2 catégories
    await createExerciceFixture.fillExerciceBasicInfo(
      'Test Exercice',
      'Test Theme'
    );

    await createExerciceFixture.addCategory('Cuisine', 'Test cuisine', testImagePath);
    await createExerciceFixture.addCategory('Salon', 'Test salon', testImagePath2);

    await createExerciceFixture.goToNextStep();

    // Ajouter un item seulement pour une catégorie
    await createExerciceFixture.addItem(
      'Fourchette',
      'Ustensile',
      'Cuisine',
      testImagePath
    );

    // Essayer de passer à l'étape 3
    const nextButton = createExerciceFixture.getNextButton();

    // Gérer l'alerte
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Chaque catégorie doit contenir au moins un objet');
      dialog.accept();
    });

    await nextButton.click();

    // On devrait toujours être à l'étape 2
    const currentStep = await createExerciceFixture.getCurrentStepElements();
    expect(currentStep).toBe(2);
  });

  test('Should allow navigation between steps', async () => {
    // Préparer l'exercice pour pouvoir naviguer
    await createExerciceFixture.fillExerciceBasicInfo(
      'Test Exercice',
      'Test Theme'
    );

    await createExerciceFixture.addCategory('Test Category', 'Test Description', testImagePath);

    // Aller à l'étape 2
    await createExerciceFixture.goToNextStep();
    expect(await createExerciceFixture.getCurrentStepElements()).toBe(2);

    // Ajouter un item
    await createExerciceFixture.addItem(
      'Test Item',
      'Test Description',
      'Test Category',
      testImagePath
    );

    // Aller à l'étape 3
    await createExerciceFixture.goToNextStep();
    expect(await createExerciceFixture.getCurrentStepElements()).toBe(3);

    // Revenir à l'étape 2
    await createExerciceFixture.goToPreviousStep();
    expect(await createExerciceFixture.getCurrentStepElements()).toBe(2);

    // Revenir à l'étape 1
    await createExerciceFixture.goToPreviousStep();
    expect(await createExerciceFixture.getCurrentStepElements()).toBe(1);

    // Le bouton précédent devrait être désactivé à l'étape 1
    await expect(createExerciceFixture.getPreviousButton()).toBeDisabled();
  });
});
