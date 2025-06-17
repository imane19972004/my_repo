import { E2EComponentFixture } from '../e2e-component.fixture';

export class ExerciseSelectionFixture extends E2EComponentFixture {
  exerciseCards(){
    return this.page.locator('.exercice-card');
  }

  firstExercisePlayButton() {
    return this.exerciseCards().first().locator('button.btn-play');
  }

  noExerciseMessage() {
    return this.page.locator('h3', { hasText: 'Attribuer un nouvel exercice' });
  }

  assignFirstExerciseButton() {
    return this.page.locator('ul li button', { hasText: 'Attribuer' }).first();
  }

}
