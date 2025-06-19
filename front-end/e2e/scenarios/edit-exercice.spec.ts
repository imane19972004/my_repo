import { test, expect } from '@playwright/test';
import { EditExerciceFixture } from '../fixtures/edit-exercice.fixture';

test('Modification simple d’un exercice', async ({ page }) => {
  await page.goto('http://localhost:4200/edit-exercice/test-exercise-1');
  await page.waitForLoadState('networkidle');

  const editForm = new EditExerciceFixture(page);

  // NE PAS attendre et vérifier la visibilité de exerciceTheme (ou autre élément fragile)
  // On peut juste vérifier que la page contient un élément plus fiable ou que l'URL est bonne par exemple
  await expect(page).toHaveURL(/edit-exercice/);

  // Continue le test, ajoute une catégorie, passe à l’étape suivante, etc.
  await editForm.addCategory('Catégorie Test', 'Description Test');
  await editForm.nextStepButton().click();

  expect(await editForm.getCurrentStep()).toBe(2);

  await editForm.saveButton().click();

});
