import { test, expect } from '@playwright/test';
import { UserHistoryFixture } from '../fixtures/user-history.fixture';
import {testUrl, serverUrl} from "../e2e.config";

type User = { id: string; name: string; };

test('Should display all user histories', async ({ browser, request }) => {
  const res = await request.get(`${serverUrl}/users`);
  expect(res.ok()).toBeTruthy();

  const users: any[] = await res.json();
  const userList: User[] = users.map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
  }));

  const context = await browser.newContext();

  await Promise.all(userList.map(async (user) => {
    const page = await context.newPage();
    const history = new UserHistoryFixture(page);

    try {
      await page.goto(`${testUrl}/users/${user.id}/history`);
      await page.waitForLoadState('networkidle');

      // --- Infos de base ---
      await expect(history.userName()).toBeVisible();
      await expect(history.userName()).toContainText('Nom :');
      await expect(history.userAge()).toContainText('Âge :');
      await expect(history.userRole()).toContainText('Rôle :');
      await expect(history.userParticularity()).toBeVisible();

      const roleText = (await history.userRole().textContent()) || '';

      if (roleText.includes('Accueilli')) {
        await expect(history.exerciseSelect()).toBeVisible();

        const optionCount = await history.exerciseSelect().locator('option').count();
        if (optionCount === 0) {
          await expect.soft(history.noExercisesMessage()).toBeVisible();
        } else {
          const firstOption = history.exerciseSelect().locator('option').first();
          const exerciseName = (await firstOption.textContent())?.trim() || '';
          await history.exerciseSelect().selectOption({ label: exerciseName });

          await expect(history.selectedExerciseTitle()).toHaveText(exerciseName);
          await expect(history.exerciseCanvas()).toBeVisible();
          await expect(history.lastAttemptBlock()).toBeVisible();
          await expect(history.successCount()).toBeVisible();
          await expect(history.failureCount()).toBeVisible();
        }

        const itemCount = await history.errorItemList().count();
        if (itemCount > 0) {
          const firstItemText = await history.errorItemList().first().textContent();
          const itemName = firstItemText?.split(':')[0].trim() ?? '';

          await history.clickOnItemButton(itemName);
          await expect(history.selectedItemTitle()).toContainText(itemName);
          await expect(history.itemCanvas()).toBeVisible();
        }
      } else {
        await expect(history.noHistoryForEncadrant()).toBeVisible();
      }
    } catch (e) {
      console.error(`Erreur lors du test de ${user.name} (${user.id}):`, e);
    } finally {
      await page.close();
    }
  }));

  await context.close();
});
