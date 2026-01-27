import { Page } from '@playwright/test';

export const NewDishSelectors = {
  name: 'input[name=name]',
  description: 'textarea[name=description]',
  quickPrep: 'input[name=quickPrep]',
  prepTime: 'input[name=prepTime]',
  cookTime: 'input[name=cookTime]',
  calories: 'input[name=calories]',
  imageUrl: 'input[name=imageUrl]',
  addStep: 'text=+ Agregar paso',
  stepInput: 'input[placeholder^="Paso"]',
};

export class NewDishPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dishes/new');
  }

  async create(dish: any) {
    await this.page.fill(NewDishSelectors.name, dish.name);
    await this.page.fill(NewDishSelectors.description, dish.description);
    if (dish.quickPrep) await this.page.check(NewDishSelectors.quickPrep).catch(() => {});
    await this.page.fill(NewDishSelectors.prepTime, String(dish.prepTime));
    await this.page.fill(NewDishSelectors.cookTime, String(dish.cookTime));
    if (dish.calories) await this.page.fill(NewDishSelectors.calories, String(dish.calories));
    if (dish.imageUrl) await this.page.fill(NewDishSelectors.imageUrl, dish.imageUrl);

    // Ensure enough step inputs
    for (let i = 1; i < dish.steps.length; i++) {
      await this.page.click(NewDishSelectors.addStep);
    }
    const steps = this.page.locator(NewDishSelectors.stepInput);
    for (let i = 0; i < dish.steps.length; i++) {
      await steps.nth(i).fill(dish.steps[i]);
    }

    // Use getByRole to avoid strict mode violation
    const submitButton = this.page.getByRole('button', { name: 'Guardar' });
    
    const [response] = await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/api/dishes'), { timeout: 10000 }),
      submitButton.click(),
    ]);

    // Wait for navigation to /dishes
    await this.page.waitForURL('**/dishes', { timeout: 10000 });
    
    return response;
  }
}
