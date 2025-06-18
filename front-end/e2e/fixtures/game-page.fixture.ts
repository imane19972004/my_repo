import { E2EComponentFixture } from "../e2e-component.fixture";
import {Locator} from "@playwright/test";

export class GamePageFixture extends E2EComponentFixture {

  bulkItems() {
    return this.page.locator('[cdkDrag] .object-image');
  }

  categoryDropLists() {
    return this.page.locator('[cdkDropList][id^="category-"]');
  }

  successMessage() { return this.page.locator('.message'); }
  restartButton()  { return this.page.locator('button.restart-button'); }
  quitButton()     { return this.page.locator('button.quit-button'); }

  itemName(): Locator {
    return this.page.locator('.object-container p:not(:has(em))');
  }

  itemDescription(): Locator {
    return this.page.locator('.object-container p:has(em)');
  }
}
