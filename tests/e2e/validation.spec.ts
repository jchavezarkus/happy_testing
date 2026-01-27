import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { NewDishPage } from '../pom/NewDishPage';
import { CREDENTIALS } from '../constants';

test('Validaciones del servidor para crear plato: campos faltantes -> 400', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  const resp = await login.login(CREDENTIALS.seededUser.email, CREDENTIALS.seededUser.password);
  expect(resp.status()).toBe(200);

  const newDish = new NewDishPage(page);
  await newDish.goto();

  // Quitar atributos required para forzar envio al servidor con campos vacíos
  await page.$$eval('form input, form textarea', (els: HTMLElement[]) => els.forEach(el => el.removeAttribute('required')));

  const [response] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/dishes') && r.request().method() === 'POST', { timeout: 10000 }),
    page.getByRole('button', { name: 'Guardar' }).click(),
  ]);

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body).toMatchObject({ error: 'Missing fields' });

  // UI debe mostrar el mensaje de error
  await expect(page.locator('text=Missing fields')).toBeVisible();
});
