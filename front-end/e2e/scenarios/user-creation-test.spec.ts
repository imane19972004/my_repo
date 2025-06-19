import { test, expect } from '@playwright/test';
import { UserFormFixture } from '../fixtures/user-form.fixture';
import {testUrl} from "../e2e.config";

test('Création d’un utilisateur avec photo', async ({ page }) => {
  await page.goto(`${testUrl}/create-user`);
  const form = new UserFormFixture(page);

  // Étape 1
  await form.nextStepButton().click();
  await expect(form.firstNameError()).toHaveText('Le prénom est requis.');
  await expect(form.lastNameError()).toHaveText('Le nom est requis.');

  await form.firstNameInput().fill('Alice');
  await form.lastNameInput().fill('Moineau');

  await form.photoInput().setInputFiles('e2e/assets/photo.jpg');
  await expect(form.photoPreview()).toBeVisible();
  await expect(form.photoPreviewSuccessMessage()).toContainText('Photo ajoutée');
  await form.nextStepButton().click();

  // Étape 2
  await expect(form.ageInput()).toBeVisible();
  await expect(form.roleSelect()).toBeVisible();
  await expect(form.defaultRole()).toHaveCount(4);

  await form.ageInput().fill('80');
  await form.particularityInput().fill('Alzheimer léger');
  await form.roleSelect().selectOption('Accueilli');

  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/users') && resp.status() === 200),
    form.createButton().click(),
  ]);

  await expect(form.successMessage()).toContainText('Utilisateur créé');
});
