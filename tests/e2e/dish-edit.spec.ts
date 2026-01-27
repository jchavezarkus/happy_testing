import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { DishesPage } from '../pom/DishesPage';
import { CREDENTIALS } from '../constants';

test('Editar un plato existente y verificar los cambios', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  const resp = await login.login(CREDENTIALS.seededUser.email, CREDENTIALS.seededUser.password);
  expect(resp.status()).toBe(200);

  const dishes = new DishesPage(page);
  await dishes.goto();

  // Verificar que existen platos en el listado
  const count = await dishes.countDishes();
  if (count === 0) {
    test.skip();
  }

  // Usar un plato existente (el primero del listado)
  // Obtener el nombre del primer plato visible
  let firstDishName = await page.locator('main h2').first().textContent();
  expect(firstDishName).toBeTruthy();
  firstDishName = firstDishName!.trim();

  // Ir a editar el primer plato
  await dishes.clickEdit(firstDishName);
  
  // Wait for edit page to load
  await page.waitForLoadState('networkidle', { timeout: 10000 });

  // Cambiar la descripción
  const newDescription = `E2E edited at ${Date.now()}`;
  await page.fill('textarea[name=description]', newDescription);

  // Guardar cambios y esperar la respuesta de la API
  const submitButton = page.getByRole('button', { name: 'Guardar' });
  
  const [updateResponse] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/dishes/') && r.request().method() === 'PUT', { timeout: 10000 }),
    submitButton.click(),
  ]);
  
  expect(updateResponse.status()).toBe(200);

  // Esperar a que la página esté lista
  await page.waitForLoadState('networkidle', { timeout: 10000 });

  // Verificar el cambio en la tarjeta del plato (usar .first() para strict mode)
  await expect(page.locator('div.bg-white.rounded-2xl', { has: page.locator('h2', { hasText: new RegExp(`^${firstDishName}$`) }) }).locator('p').first()).toContainText('E2E edited');
});
