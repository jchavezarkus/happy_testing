import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { CREDENTIALS } from '../constants';

test('Login con usuario seed', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  const response = await login.login(CREDENTIALS.seededUser.email, CREDENTIALS.seededUser.password);

  // Verificar respuesta y redirección a /dishes
  await expect(response.status()).toBe(200);
  await expect(page).toHaveURL(/dishes/);
});
