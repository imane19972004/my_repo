import { test, expect } from '@playwright/test';
import { GameSettingsFixture } from '../fixtures/game-settings.fixture';
import { testUrl } from '../e2e.config';  // <-- import la variable

test.describe('Paramètres de jeu', () => {
  let fixture: GameSettingsFixture;

  test.beforeEach(async ({ page }) => {
    fixture = new GameSettingsFixture(page);
    await page.goto(testUrl + '/game');  // <-- ici on utilise testUrl
    await fixture.openSettings();
  });

//   test('Changer le nombre d’objets', async () => {
//     await fixture.setObjectCount(3);
//     expect(await fixture.getDisplayedObjectsCount()).toBe(3);
//   });


  test('Modifier la durée du jeu', async () => {
    await fixture.setGameDuration(10);
    // Ici tu peux ajouter des assertions spécifiques si possible
  });

  test('Modifier la durée du message', async () => {
    await fixture.setMessageDuration(5);
    // Assertion spécifique si possible
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
  // récupère la valeur du slider et vérifie
  const sliderValue = await fixture.contrastSlider().evaluate(el => (el as HTMLInputElement).valueAsNumber);
  expect(sliderValue).toBe(validContrast);
});

  test('Réinitialiser les paramètres', async () => {
    await fixture.resetSettings();
    // Ici, ajoute les assertions pour vérifier les valeurs par défaut
  });
});
