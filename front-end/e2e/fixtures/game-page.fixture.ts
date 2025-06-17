import { E2EComponentFixture } from "../e2e-component.fixture";

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
}
