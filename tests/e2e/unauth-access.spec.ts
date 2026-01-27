import { test, expect } from '@playwright/test';

test('Acceso no autorizado a /dishes/new debe redirigir a /login', async ({ page }) => {
  // No levantamos sesión
  await page.goto('/dishes/new');

  // La página debe redirigir a /login (server-side redirect)
  await page.waitForURL('**/login', { timeout: 5000 });

  // Comprobamos que se muestra el formulario de login
  await expect(page.locator('input[name=email]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible();
});
