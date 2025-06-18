import { E2EComponentFixture } from '../e2e-component.fixture';

export class UserFormFixture extends E2EComponentFixture {
  firstNameInput() { return this.page.getByLabel('Prénom'); }
  lastNameInput() { return this.page.getByRole('textbox', { name: 'Nom', exact: true }); }
  photoInput() { return this.page.locator('input[type="file"]#photo'); }
  nextStepButton() { return this.page.getByRole('button', { name: 'Suivant' }); }
  photoPreview() { return this.page.locator('.photo-preview'); }
  photoPreviewSuccessMessage() { return this.page.locator('.photo-success'); }
  firstNameError() { return this.page.locator('#firstName + .error'); }
  lastNameError() { return this.page.locator('#lastName + .error'); }


  ageInput() { return this.page.getByLabel('Âge'); }
  particularityInput() { return this.page.getByLabel('Particularité'); }
  roleSelect() { return this.page.getByLabel('Rôle'); }
  defaultRole() { return this.page.locator('select#role option') }
  createButton() { return this.page.getByRole('button', { name: /Créer l'utilisateur/i }); }
  successMessage() { return this.page.locator('.last-user-section h3');}
}
