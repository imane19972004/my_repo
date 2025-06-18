import { E2EComponentFixture } from '../e2e-component.fixture';

export class GameSettingsFixture extends E2EComponentFixture {
  settingsToggleButton() { 
    return this.page.locator('.settings-toggle'); 
  }

  settingsPanel() { 
    return this.page.locator('.settings-panel'); 
  }

  closeButton() { 
    return this.page.locator('.close-btn'); 
  }

  objectCountSelect() { 
    return this.page.locator('select').first(); 
  }

  gameDurationInput() { 
    return this.page.locator('input[type="number"]'); 
  }

  messageDurationSlider() { 
    return this.page.locator('input[type="range"]').first(); 
  }

  showTimerCheckbox() { 
    return this.page.locator('input[type="checkbox"]'); 
  }

  textSizeSlider() { 
    return this.page.locator('input[type="range"]').nth(1); 
  }

  textStyleSelect() { 
    return this.page.locator('select').nth(1); 
  }

  contrastSlider() { 
    return this.page.locator('input[type="range"]').nth(2); 
  }

  resetButton() { 
    return this.page.locator('.reset-btn'); 
  }

  timerDisplay() { 
    return this.page.locator('.timer-display'); 
  }

  gameMessage() { 
    return this.page.locator('.message'); 
  }

  itemsContainer() { 
    return this.page.locator('.left'); 
  }

  objectImages() { 
    return this.page.locator('.object-image'); 
  }

  categoryTitles() { 
    return this.page.locator('.right h2'); 
  }

  settingsAppliedElements() { 
    return this.page.locator('app-settings-applier'); 
  }

  async openSettings() {
    await this.settingsToggleButton().click();
    await this.settingsPanel().waitFor({ state: 'visible' });
  }
async waitForObjectCount(expectedCount: number, timeout = 10000) {
  const startTime = Date.now();
  while ((Date.now() - startTime) < timeout) {
    const count = await this.page.evaluate(() => document.querySelectorAll('.object-image').length);
    console.log(`Nombre d'objets détectés: ${count}, attendu: ${expectedCount}`);
    if (count === expectedCount) return;
    await this.page.waitForTimeout(300); // attente courte avant de réessayer
  }
  throw new Error(`Timeout: attendu ${expectedCount} objets, trouvé ${await this.page.evaluate(() => document.querySelectorAll('.object-image').length)}`);
}




  async closeSettings() {
    await this.closeButton().click();
    await this.settingsPanel().waitFor({ state: 'hidden' });
  }

 async setObjectCount(count: number) {
  await this.objectCountSelect().selectOption(count.toString());
  // Pause courte pour laisser le DOM se mettre à jour
  await this.page.waitForTimeout(500);
  await this.waitForObjectCount(count);
}


  async setGameDuration(minutes: number) {
    await this.gameDurationInput().fill(minutes.toString());
  }

//   async setMessageDuration(seconds: number) {
//     await this.messageDurationSlider().fill(seconds.toString());
//   }
async setMessageDuration(seconds: number) {
  await this.messageDurationSlider().evaluate((el, value) => {
    (el as HTMLInputElement).value = value.toString();
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, seconds);
}
  async toggleShowTimer() {
    await this.showTimerCheckbox().click();
  }

//   async setTextSize(size: number) {
//     await this.textSizeSlider().fill(size.toString());
//   }
async setTextSize(size: number) {
  await this.textSizeSlider().evaluate((el, value) => {
    (el as HTMLInputElement).value = value.toString();
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, size);
}

  async setTextStyle(style: string) {
    await this.textStyleSelect().selectOption(style);
  }

 async setContrast(contrast: number) {
  // Utiliser evaluate pour modifier la valeur du slider et déclencher l'input event
  await this.contrastSlider().evaluate((el, value) => {
    (el as HTMLInputElement).value = value.toString();
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, contrast);
}


  async resetSettings() {
    await this.resetButton().click();
  }

  async getDisplayedObjectsCount() {
    return await this.objectImages().count();
  }

  async isTimerVisible() {
    try {
      await this.timerDisplay().waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  async getAppliedTextSize(element = this.categoryTitles().first()) {
    const fontSize = await element.evaluate(el => window.getComputedStyle(el).fontSize);
    return parseInt(fontSize.replace('px', ''));
  }

  async getAppliedTextStyle(element = this.categoryTitles().first()) {
    const fontWeight = await element.evaluate(el => window.getComputedStyle(el).fontWeight);
    const fontStyle = await element.evaluate(el => window.getComputedStyle(el).fontStyle);

    if (fontWeight === 'bold' || fontWeight === '700') return 'bold';
    if (fontStyle === 'italic') return 'italic';
    return 'normal';
  }

  async getAppliedContrast(element = this.itemsContainer()) {
    const filter = await element.evaluate(el => window.getComputedStyle(el).filter);

    if (filter.includes('contrast')) {
      const match = filter.match(/contrast\(([0-9.]+)%?\)/);
      return match ? Math.round(parseFloat(match[1])) : 100;
    }
    return 100;
  }

  async waitForMessageToDismiss(timeout: number = 5000) {
    await this.gameMessage().waitFor({ state: 'visible', timeout: 2000 });
    await this.gameMessage().waitFor({ state: 'hidden', timeout });
  }
}
