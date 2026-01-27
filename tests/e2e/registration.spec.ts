import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pom/RegisterPage';
import { LoginPage } from '../pom/LoginPage';

// These tests rely on a running dev server (local or docker). Use `npm run docker:up` to start the env.

test.describe('Registro', () => {
  test('Debería registrar un usuario nuevo a través del formulario', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();

    const random = Math.floor(Math.random() * 100000);
    const user = {
      firstName: 'Test',
      lastName: 'User',
      email: `e2e+${random}@example.com`,
      nationality: 'CL',
      phone: '123456789',
      password: 'test1234',
    };

    const resp = await register.register(user);
    expect(resp.status()).toBe(200);

    // Esperamos redirigir a /login después del registro exitoso
    await expect(page).toHaveURL(/\/login/);

    // Y no debe mostrarse el mensaje de error de campos faltantes
    await expect(page.locator('text=Missing fields')).toHaveCount(0);
  });

  test('No debe registrarse con campos faltantes', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.goto();

    // Intencionalmente no completamos todos los campos
    await page.fill('input[name=firstName]', 'SoloNombre');
    
    // Remover atributos required para forzar envío al servidor
    await page.$$eval('form input, form textarea', (els: HTMLElement[]) => els.forEach(el => el.removeAttribute('required')));
    
    // Click del botón con getByRole y esperar respuesta
    const [resp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/register'), { timeout: 30000 }),
      page.getByRole('button', { name: 'Registrarse' }).click(),
    ]);

    expect(resp.status()).toBe(400);

    const body = await resp.json();
    expect(body).toMatchObject({ error: 'Missing fields' });

    // El mensaje de error debe mostrarse en la UI
    await expect(page.locator('text=Missing fields')).toBeVisible();
  });

  test('No debe permitir registro con email duplicado', async ({ page, request }) => {
    const register = new RegisterPage(page);

    const random = Math.floor(Math.random() * 100000);
    const user = {
      firstName: 'Dup',
      lastName: 'User',
      email: `dup+${random}@example.com`,
      nationality: 'CL',
      phone: '5551234',
      password: 'test1234',
    };

    // Crear el usuario directamente via API para asegurar duplicado
    const createResp = await request.post('/api/register', { data: user });
    expect([200, 201]).toContain(createResp.status());

    await register.goto();
    const resp = await register.register(user);

    expect(resp.status()).toBe(409);

    const body = await resp.json();
    expect(body).toMatchObject({ error: 'El email ya está registrado' });

    // Mensaje visible en UI
    await expect(page.locator('text=El email ya está registrado')).toBeVisible();
  });

  test('Después de registrarse, el usuario puede iniciar sesión', async ({ page }) => {
    const register = new RegisterPage(page);
    const login = new LoginPage(page);

    const random = Math.floor(Math.random() * 100000);
    const user = {
      firstName: 'CanLogin',
      lastName: 'User',
      email: `canlogin+${random}@example.com`,
      nationality: 'CL',
      phone: '987654321',
      password: 'test1234',
    };

    await register.goto();
    await register.register(user);

    // Redirige a login
    await expect(page).toHaveURL(/\/login/);

    // Intentamos iniciar sesión con el nuevo usuario
    await login.goto();
    const loginResp = await login.login(user.email, user.password);
    expect(loginResp.status()).toBe(200);
  });
});
