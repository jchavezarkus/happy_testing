import { Page } from '@playwright/test';

export const RegisterSelectors = {
  firstName: 'input[name=firstName]',
  lastName: 'input[name=lastName]',
  email: 'input[name=email]',
  nationality: 'input[name=nationality]',
  phone: 'input[name=phone]',
  password: 'input[name=password]',
};

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/register');
  }

  async register(user: { firstName: string; lastName: string; email: string; nationality: string; phone: string; password: string; }) {
    await this.page.fill(RegisterSelectors.firstName, user.firstName);
    await this.page.fill(RegisterSelectors.lastName, user.lastName);
    await this.page.fill(RegisterSelectors.email, user.email);
    await this.page.fill(RegisterSelectors.nationality, user.nationality);
    await this.page.fill(RegisterSelectors.phone, user.phone);
    await this.page.fill(RegisterSelectors.password, user.password);

    // Use getByRole to avoid strict mode violation
    const submitButton = this.page.getByRole('button', { name: 'Registrarse' });
    
    // Espera la respuesta de la API
    const [response] = await Promise.all([
      this.page.waitForResponse(r => r.url().includes('/api/register'), { timeout: 30000 }),
      submitButton.click(),
    ]);

    return response;
  }
}
