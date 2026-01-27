import { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const DishesSelectors = {
  newButton: 'a[href="/dishes/new"]',
};

export class DishesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dishes');
  }

  async clickNew() {
    await this.page.click(DishesSelectors.newButton);
  }

  // Returns the container element for a dish with the given name
  private dishContainerByName(name: string) {
    return this.page.locator('div.bg-white.rounded-2xl', { has: this.page.locator('h2', { hasText: new RegExp(`^${name}$`) }) });
  }

  async findDish(name: string) {
    return this.dishContainerByName(name);
  }

  async hasDish(name: string) {
    return await this.dishContainerByName(name).count() > 0;
  }

  async clickView(name: string) {
    const container = this.dishContainerByName(name);
    // Buscar el link "Ver" solo dentro del contenedor del dish
    await container.locator('div').last().locator('a').first().click();
  }

  async clickEdit(name: string) {
    const container = this.dishContainerByName(name);
    // Buscar el link "Editar" solo dentro del contenedor del dish
    const links = container.locator('div').last().locator('a');
    await links.nth(1).click();
  }

  async clickDelete(name: string) {
    const container = this.dishContainerByName(name);
    // Buscar el button "Eliminar" solo dentro del contenedor del dish
    const deleteBtn = container.getByRole('button', { name: 'Eliminar' });
    
    // Esperar la respuesta de DELETE
    const [deleteResponse] = await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/api/dishes/') && r.request().method() === 'DELETE', { timeout: 15000 }),
      deleteBtn.click(),
    ]);

    expect(deleteResponse.status()).toBe(200);
    
    // Esperar a que el plato sea removido del DOM
    await this.dishContainerByName(name).waitFor({ state: 'detached', timeout: 10000 });
  }

  async countDishes() {
    return await this.page.locator('main h2').count();
  }
}
