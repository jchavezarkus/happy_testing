import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { CREDENTIALS } from '../constants';

test('Logout should clear session and redirect to login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  const resp = await login.login(CREDENTIALS.seededUser.email, CREDENTIALS.seededUser.password);
  expect(resp.status()).toBe(200);

  // Click logout and expect redirect to /login
  await page.locator('text=Logout').click({ force: true, timeout: 15000 });
  await page.waitForURL('**/login', { timeout: 15000 });

  // Ensure session cookie is removed
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'session');
  expect(sessionCookie).toBeUndefined();
});
