import { E2EComponentFixture } from '../e2e-component.fixture';

export class UserSelectionFixture extends E2EComponentFixture {
  userCards()        { return this.page.locator('.user-card'); }
  firstUserCard()    { return this.userCards().first(); }
}
