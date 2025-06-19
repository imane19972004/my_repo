import { test, expect, Locator} from '@playwright/test';
import {HomeFixture} from '../fixtures/home.fixture';
import {UserSelectionFixture} from '../fixtures/user-selection.fixture';
import {ExerciseSelectionFixture} from '../fixtures/exercise-selection.fixture';
import {GamePageFixture} from '../fixtures/game-page.fixture';
import {testUrl} from "../e2e.config";

test.describe('Parcours JOUER complet', () => {

  test('De l’accueil à la fin de partie', async ({page}) => {
    test.setTimeout(40000);
    // Accueil > Choix utilisateur
    await page.goto(`${testUrl}`);
    const home = new HomeFixture(page);

    await Promise.all([
      page.waitForURL('**/choose-user'),
      home.playButton().click()
    ]);

    const users = new UserSelectionFixture(page);
    const userCount = await users.userCards().count();
    expect(userCount).toBeGreaterThan(0);

    await Promise.all([
      page.waitForURL(/\/\d+\/choose-exercice$/),
      users.firstUserCard().click()
    ]);

    // Choix de l’exercice
    const exo = new ExerciseSelectionFixture(page);
    const cardCount = await exo.exerciseCards().count();

    if (cardCount === 0) {
      // Aucun exercice attribué > Attribuer le premier exercice
      await expect(exo.noExerciseMessage()).toBeVisible();
      await expect(exo.assignFirstExerciseButton()).toBeVisible();
      await exo.assignFirstExerciseButton().click();

      await expect(exo.exerciseCards().first()).toBeVisible();
    }

    await Promise.all([
      page.waitForURL(/\/\d+\/game\/\d+$/),
      exo.firstExercisePlayButton().click()
    ]);

    // Déroulement du jeu
    const game = new GamePageFixture(page);
    const itemCount = await game.bulkItems().count();
    const catCount = await game.categoryDropLists().count();

    if (itemCount === 0) {
      throw new Error("L'exercice sélectionné ne contient pas assez d'objets pour lancer le jeu.");
    }
    if (catCount === 0) {
      throw new Error("L'exercice sélectionné ne contient pas assez de catégories pour lancer le jeu.");
    }

    expect(itemCount).toBeGreaterThan(0);
    expect(catCount).toBeGreaterThan(0);

    while (await game.bulkItems().count() > 0) {
      const item = game.bulkItems().first();
      const itemBox = await item.boundingBox();
      expect(itemBox).not.toBeNull();

      let dropped = false;

      const categories = await game.categoryDropLists().elementHandles();
      for (const cat of categories) {
        const catBox = await cat.boundingBox();
        if (!catBox) continue;

        // Drag & Drop rapide
        await page.mouse.move(itemBox!.x + itemBox!.width / 2, itemBox!.y + itemBox!.height / 2);
        await page.mouse.down();
        await page.mouse.move(catBox.x + catBox.width / 2, catBox.y + catBox.height / 2, { steps: 5 });
        await page.mouse.up();

        await expect(game.successMessage()).toBeVisible({ timeout: 2000 });
        const msg = (await game.successMessage().textContent())?.trim();

        if (msg === 'Bien joué !') {
          dropped = true;
          break;
        } else {
          await expect(game.successMessage()).toHaveText(/Ce n'est pas la bonne catégorie. Réessayez !/i, { timeout: 1000 });
          return;
        }
      }

      expect(dropped).toBeTruthy();
    }

    await page.evaluate(() => (window as any).angularComponent?.checkGameCompletion?.());
    await expect(game.successMessage()).toContainText(/Exercice terminé/i);

    await expect(game.restartButton()).toBeVisible();
    await expect(game.quitButton()).toBeVisible();

    await game.restartButton().click();

    const newCount = await game.bulkItems().count();
    expect(newCount).toBeGreaterThan(0);
  });
});
