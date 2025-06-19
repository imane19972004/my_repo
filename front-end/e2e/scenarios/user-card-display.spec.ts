import { test, expect } from '@playwright/test';
import { UserListFixture } from '../fixtures/user-list.fixture';
import {testUrl} from "../e2e.config";

test.describe('User list', () => {

  test('Toutes les cartes sont correctement affichées', async ({ page }) => {
    await page.goto(`${testUrl}/user-list`);
    const users = new UserListFixture(page);

    const nbCards = await users.count();
    expect(nbCards).toBeGreaterThan(0);

    for (let i = 0; i < nbCards; i++) {
      const card = users.card(i);

      await expect(card.name()).toBeVisible();
      await expect(card.name()).not.toBeEmpty();

      await expect(card.avatar()).toBeVisible();
      await expect(card.avatar())
        .toHaveAttribute('src', /(\/uploads\/.+)|(assets\/defaultIcon\.jpg)$/);

      await expect(card.historyButton()).toBeVisible();
      await expect(card.historyButton()).toContainText(/HISTORIQUE DE/i);

      await expect(card.deleteButton()).toBeVisible();
    }
  });

  test('Redirection vers la page historique', async ({ page }) => {
    await page.goto(`${testUrl}/user-list`);
    const users = new UserListFixture(page);
    const card0 = users.firstCard();
    const fullName = (await card0.name().innerText()).trim();

    await Promise.all([
      page.waitForURL(/\/users\/\d+\/history$/),
      card0.historyButton().click()
    ]);

    await expect(page.getByRole('heading', { name: "Détails de l'utilisateur" })).toBeVisible();
    await expect(page.locator('.user-info-inline')).toContainText(fullName);
  });

  test('Suppression d’un utilisateur retire la carte', async ({ page }) => {
    await page.goto(`${testUrl}/user-list`);
    const users = new UserListFixture(page);

    const initialCount = await users.count();
    const firstCard = users.firstCard();
    const firstNameText = (await firstCard.name().innerText()).trim();

    page.once('dialog', d => d.accept());
    await firstCard.deleteButton().click();

    await expect(users.cards()).toHaveCount(initialCount - 1);
    await expect(page.locator('.user-card', { hasText: firstNameText })).toHaveCount(0);
  });

});
