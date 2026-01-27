import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { CREDENTIALS } from '../constants';

test('Logout should clear session and redirect to login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  const resp = await login.login(CREDENTIALS.seededUser.email, CREDENTIALS.seededUser.password);
  expect(resp.status()).toBe(200);

  // Click logout and expect redirect to /login
  await Promise.all([
    page.waitForURL('**/login'),
    page.click('text=Logout'),
  ]);

  // Ensure session cookie is removed
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'session');
  expect(sessionCookie).toBeUndefined();
});
