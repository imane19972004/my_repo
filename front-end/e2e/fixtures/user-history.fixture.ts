import { E2EComponentFixture } from '../e2e-component.fixture';

export class UserHistoryFixture extends E2EComponentFixture {
  userName() { return this.page.locator('.user-info-inline p').first(); }
  userAge() { return this.page.locator('.user-info-inline p').nth(1); }
  userRole() { return this.page.locator('.user-info-inline p').nth(2); }
  userParticularity() { return this.page.locator('.particularity'); }

  noHistoryForEncadrant() {
    return this.page.locator('.message-historique', { hasText: "Pas d'historique pour les encadrants" });
  }
  noExercisesMessage() {
    return this.page.locator('.message-historique', { hasText: 'Aucun exercice joué pour cet utilisateur.' });
  }

  exerciseSelect() { return this.page.locator('#exerciseSelect'); }
  selectedExerciseTitle() { return this.page.locator('.exercise-block h3'); }
  exerciseCanvas() { return this.page.locator('.exercise-block canvas').first(); }

  lastAttemptBlock() { return this.page.locator('.last-attempt'); }
  successCount() { return this.page.locator('.card.super-compact p', { hasText: 'Objets bien placés' }); }
  failureCount() { return this.page.locator('.card.super-compact p', { hasText: 'Mauvais placements' }); }

  errorItemList() { return this.page.locator('.compact-object-list li'); }
  clickOnItemButton(itemName: string) {
    return this.page.locator('.compact-object-list button', { hasText: itemName }).click();
  }
  itemCanvas() { return this.page.locator('canvas').nth(1);}
  selectedItemTitle() {
    return this.page.locator('h4', { hasText: 'Historique pour l\'objet :' });
  }
}
