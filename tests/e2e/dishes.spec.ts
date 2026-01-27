import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { DishesPage } from '../pom/DishesPage';
import { sampleDish } from '../mocks/dishes';

// NOTE: To create/edit/delete dishes we need to be authenticated. This test logs in using seeded user.

test.describe('Dishes flow', () => {
  test('Debería ver lista de platos y navegar a nuevo plato (requiere login)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('test@nutriapp.com', 'nutriapp123');

    const dishes = new DishesPage(page);
    await dishes.goto();

    // cuenta los platos existentes
    const count = await dishes.countDishes();
    expect(count).toBeGreaterThanOrEqual(0);

    // intenta ir a crear nuevo plato
    await dishes.clickNew();
    await expect(page).toHaveURL(/dishes\/?new/);
  });
});
