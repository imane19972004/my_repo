import { test, expect } from '@playwright/test';
import { HomeFixture } from '../fixtures/home.fixture';
import { UserSelectionFixture } from '../fixtures/user-selection.fixture';
import { ExerciseSelectionFixture } from '../fixtures/exercise-selection.fixture';
import { GameSettingsFixture } from '../fixtures/game-settings.fixture';
import {testUrl} from "../e2e.config";

test.describe('Paramètres du jeu - Parcours complet', () => {
  let fixture: GameSettingsFixture;

  test.beforeEach(async ({ page }) => {
    // Étape 1 : Accueil → Choix utilisateur
    await page.goto(testUrl);
    const home = new HomeFixture(page);

    await Promise.all([
      page.waitForURL('**/choose-user'),
      home.playButton().click()
    ]);

    // Étape 2 : Choisir un utilisateur
    const users = new UserSelectionFixture(page);
    await expect(users.userCards().first()).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/\d+\/choose-exercice$/),
      users.firstUserCard().click()
    ]);

    // Étape 3 : Choisir un exercice
    const exo = new ExerciseSelectionFixture(page);
    const cardCount = await exo.exerciseCards().count();

    if (cardCount === 0) {
      await exo.assignFirstExerciseButton().click();
    }

    await Promise.all([
      page.waitForURL(/\/\d+\/game\/\d+$/),
      exo.firstExercisePlayButton().click()
    ]);

    // Étape 4 : Initialiser la fixture paramètres
    fixture = new GameSettingsFixture(page);
    await fixture.openSettings();
  });

  test('Changer le nombre d’objets', async () => {
    await fixture.setObjectCount(3);
    expect(await fixture.getDisplayedObjectsCount()).toBe(3);
  });


  test('Activer et désactiver le timer', async () => {
    await fixture.toggleShowTimer();
    expect(await fixture.isTimerVisible()).toBe(true);

    await fixture.toggleShowTimer();
    expect(await fixture.isTimerVisible()).toBe(false);
  });

  test('Modifier le contraste', async () => {
    const validContrast = 25;
    await fixture.setContrast(validContrast);
    const sliderValue = await fixture.contrastSlider().evaluate(el => (el as HTMLInputElement).valueAsNumber);
    expect(sliderValue).toBe(validContrast);
  });

});
