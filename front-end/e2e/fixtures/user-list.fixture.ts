import {E2EComponentFixture} from "../e2e-component.fixture";
import {UserFixture} from "./user.fixture";

export class UserListFixture extends E2EComponentFixture {
  async count() { return this.page.locator('.user-card').count(); }
  card(i: number): UserFixture { return new UserFixture(this.cards().nth(i)); }
  firstCard(): UserFixture { return this.card(0); }
  cards(){ return this.page.locator('.user-card');}
}
