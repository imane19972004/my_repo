import { test, expect } from '@playwright/test';
import { HomeFixture } from '../fixtures/home.fixture';
import { UserSelectionFixture } from '../fixtures/user-selection.fixture';
import { ExerciseSelectionFixture } from '../fixtures/exercise-selection.fixture';
import { GameSettingsFixture } from '../fixtures/game-settings.fixture';

test.describe('Paramètres du jeu - Parcours complet', () => {
  let fixture: GameSettingsFixture;

  test.beforeEach(async ({ page }) => {
    // Étape 1 : Accueil → Choix utilisateur
    await page.goto('http://localhost:4200/');
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
    await fixture.waitForGameToLoad();
    await fixture.openSettings();
  });

  // test('Changer la taille du texte', async () => {
  //   const newSize = 20;
  //   await fixture.setTextSize(newSize);
  //   const sliderValue = await fixture.getTextSizeSliderValue();
  //   expect(sliderValue).toBe(newSize);
  // });

  test('Modifier la durée du jeu', async () => {
    await fixture.setGameDuration(10);
    // Ajoute une assertion si possible ici
  });

  test('Modifier la durée du message', async () => {
    await fixture.setMessageDuration(5);
    // Ajoute une assertion si nécessaire
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

  test('Réinitialiser les paramètres', async () => {
    await fixture.resetSettings();
    // Ajoute ici les assertions de valeurs par défaut attendues
  });
});
