import { Page } from '@playwright/test';

export const LoginSelectors = {
  email: 'input[name=email]',
  password: 'input[name=password]',
  submit: 'button[type=submit]'
};

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    // Ensure a clean session so previous auth doesn't skip the request
    await this.page.context().clearCookies();

    await this.page.fill(LoginSelectors.email, email);
    await this.page.fill(LoginSelectors.password, password);

    // Use getByRole to avoid strict mode violation (multiple button[type=submit] exist)
    const submitButton = this.page.getByRole('button', { name: 'Iniciar sesión' });

    // Click submit and wait for the login API response
    const [response] = await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/api/login'), { timeout: 50000 }),
      submitButton.click(),
    ]);

    // If login succeeded (200), wait for the client navigation to /dishes
    if (response.status() === 200) {
      await this.page.waitForURL('**/dishes', { timeout: 10000 });
    } else {
      // Wait for an error message to appear so test fails with visible reason
      await this.page.locator('text=Credenciales incorrectas').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }

    return response;
  }
}
