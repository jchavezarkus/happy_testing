import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { NewDishPage } from '../pom/NewDishPage';
import { DishesPage } from '../pom/DishesPage';
import { sampleDish } from '../mocks/dishes';

test.describe('E2E - Full dish lifecycle (create → view → edit → delete)', () => {
  test('should create, view, edit and delete a dish', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const loginResp = await login.login('test@nutriapp.com', 'nutriapp123');
    expect(loginResp.status()).toBe(200);

    // Create dish with unique name
    const unique = `Flow ${Date.now()}`;
    const dish = { ...sampleDish, name: unique };
    const newDish = new NewDishPage(page);
    await newDish.goto();
    await newDish.create(dish);

    const dishes = new DishesPage(page);
    await dishes.goto();

    // Verify dish is listed
    expect(await dishes.hasDish(unique)).toBeTruthy();

    // View details
    await dishes.clickView(unique);
    
    // Check that we're on the view page and the dish name is displayed
    await expect(page.locator('h1, h2').first()).toContainText(unique, { timeout: 10000 });

    // Edit dish
    await dishes.goto();
    await dishes.clickEdit(unique);
    
    // Change description
    const newDescription = sampleDish.description + ' (editado)';
    await page.fill('textarea[name=description]', newDescription, { timeout: 10000 });
    
    // Wait for PUT response and save
    const submitButton = page.getByRole('button', { name: 'Guardar' });
    
    const [updateResponse] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/dishes') && r.request().method() === 'PUT', { timeout: 10000 }),
      submitButton.click(),
    ]);
    
    expect(updateResponse.status()).toBe(200);
    await page.waitForURL('**/dishes', { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Verify updated
    await expect(page.locator('div.bg-white.rounded-2xl', { has: page.locator('h2', { hasText: new RegExp(`^${unique}$`) }) }).locator('p')).toContainText('editado');

    // Delete dish
    await dishes.clickDelete(unique);
    expect(await dishes.hasDish(unique)).toBeFalsy();
  });
});
