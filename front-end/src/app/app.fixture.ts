import { E2EComponentFixture } from "e2e/e2e-component.fixture";

export class AppFixture extends E2EComponentFixture {
  getTitle() {
    return this.page.getByRole('heading', { name: 'MemoLink', exact: true });
  }

  getDescription() {
    return this.page.getByText('Passez un moment de détente tout en entraînant votre mémoire !', { exact: true });
  }

  getShowButton() {
    return this.page.getByRole('button', { name: 'Jouer' });
  }

  clickOnShowButton() {
      return this.getShowButton().click();
  }

  getPlayMessage() {
    return this.page.getByText('Veuillez appuyer sur un utilisateur pour le sélectionner');
  }
}
