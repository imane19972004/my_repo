import { E2EComponentFixture } from '../e2e-component.fixture';

export class HomeFixture extends E2EComponentFixture {
  playButton() { return this.page.getByRole('button', { name: /JOUER/i }); }
}
