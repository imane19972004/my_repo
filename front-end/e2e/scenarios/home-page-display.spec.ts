import { test, expect } from '@playwright/test';
import { testUrl } from 'e2e/e2e.config';
import { AppFixture } from 'src/app/app.fixture';

// https://playwright.dev/docs/locators
test.describe('Home page display', () => {
  test('Basic test', async ({ page }) => {
    await page.goto(testUrl);
    const appComponentFixture = new AppFixture(page);
    // Using locators functions:
    // Using page element role: see the function declaration
    const title = appComponentFixture.getTitle();

    // Search by text content. Partial and exact text.
    const description1 = page.getByText('détente tout en entraînant');

    // For exact text: see the function declaration
    const description2 = appComponentFixture.getDescription();

    // Using page.locator
    const description3 = page.locator(
      'p.description:has-text("Passez un moment de détente tout en entraînant votre mémoire !")'
    );

    await expect(title).toBeVisible();
    await expect(description1).toBeVisible();
    await expect(description2).toBeVisible();
    await expect(description3).toBeVisible();

    // Error case : uncomment the two lines below : "Starting" does not exist
    // const description4 = await page.getByText('Starting your first app');
    // expect(description4).toBeVisible();

    // Success not visible
    /*let success = await appComponentFixture.getPlayMessage();

    // Success message should not be visible - we haven't clicked yet.
    expect(success).not.toBeVisible();

    // Triggers events
    const showSuccessButton = await appComponentFixture.getShowButton();
    await showSuccessButton.click();
    success = await appComponentFixture.getPlayMessage();

    // Success message should be visible now!
    expect(success).toBeVisible();

    // Another way to click on a button is to expose a function doing the click directly and avoid the two lines 35 and 36.
    await appComponentFixture.clickOnShowButton();
    success = await appComponentFixture.getPlayMessage();
    // Success message shouldn't be visible again.
    expect(success).not.toBeVisible();*/
  });

  // TO GO FURTHER :
  // Check the PS6-CORRECTION repo : https://github.com/NablaT/ps6-correction-td1-td2-v2/blob/master/front-end/e2e/scenarios/create-quiz.spec.ts
});
