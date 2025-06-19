import { test, expect } from '@playwright/test';
import { HomeFixture } from '../fixtures/home.fixture';
import { UserSelectionFixture } from '../fixtures/user-selection.fixture';
import { ExerciseSelectionFixture } from '../fixtures/exercise-selection.fixture';
import { GamePageFixture } from '../fixtures/game-page.fixture';
import {testUrl} from "../e2e.config";

test.describe('Affichage nom et description après erreurs', () => {
  test('Affiche le nom après 1 erreur et la description après 3 erreurs', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(`${testUrl}`);
    const home = new HomeFixture(page);

    await Promise.all([
      page.waitForURL('**/choose-user'),
      home.playButton().click()
    ]);

    const users = new UserSelectionFixture(page);
    await Promise.all([
      page.waitForURL(/\/\d+\/choose-exercice$/),
      users.firstUserCard().click()
    ]);

    const exo = new ExerciseSelectionFixture(page);
    if (await exo.exerciseCards().count() === 0) {
      await exo.assignFirstExerciseButton().click();
    }

    await Promise.all([
      page.waitForURL(/\/\d+\/game\/\d+$/),
      exo.firstExercisePlayButton().click()
    ]);

    const game = new GamePageFixture(page);
    const item = game.bulkItems().first();
    const itemBox = await item.boundingBox();
    expect(itemBox).not.toBeNull();

    const categories = await game.categoryDropLists().elementHandles();
    if (categories.length < 2) {
      throw new Error("Pas assez de catégories pour tester les erreurs.");
    }

    // Étape 1 : Trouver une catégorie INCORRECTE
    let badCategoryBox = false;
    const catBox = await categories[0].boundingBox();
    if (!catBox) throw new Error("CatBox");

    while (!badCategoryBox) {
      // Tenter un drop test (non destructif)
      await page.mouse.move(itemBox!.x + itemBox!.width / 2, itemBox!.y + itemBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(catBox.x + catBox.width / 2, catBox.y + catBox.height / 2, { steps: 5 });
      await page.mouse.up();

      const msg = (await game.successMessage().textContent())?.trim();
      if (msg && /Ce n'est pas la bonne catégorie/i.test(msg)) {
        badCategoryBox = true;
      }
    }

    await expect(game.itemName()).toBeVisible();

    // Étape 2 : Drop 3x dans la mauvaise catégorie
    for (let i = 1; i <= 3; i++) {
      await page.mouse.move(itemBox!.x + itemBox!.width / 2, itemBox!.y + itemBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(catBox.x + catBox.width / 2, catBox.y + catBox.height / 2, { steps: 5 });
      await page.mouse.up();

      await expect(game.successMessage()).toHaveText(/Ce n'est pas la bonne catégorie/i, { timeout: 2000 });
    }

    await expect(game.itemDescription()).toBeVisible();
  });
});
