import { Locator } from '@playwright/test';

export class UserFixture {
  constructor(private readonly root: Locator) {}

  name()          { return this.root.locator('.user-name'); }
  avatar()        { return this.root.locator('.avatar-img'); }
  historyButton() { return this.root.locator('.button-voir-historique'); }
  deleteButton()  { return this.root.locator('.button-delete'); }
}
