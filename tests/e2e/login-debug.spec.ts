import { test, expect } from '@playwright/test';
import { CREDENTIALS } from '../constants';

// Debug helper: comprueba la API de login directamente (sin UI) para determinar si la API responde correctamente.
// Ejecuta: npx playwright test tests/e2e/login-debug.spec.ts --reporter=list

test('API login via request (debug)', async ({ request }) => {
  const resp = await request.post('/api/login', { data: CREDENTIALS.seededUser });
  let body = null;
  try {
    body = await resp.json();
  } catch (e) {
    // ignore
  }
  // Emite en la salida del test para facilitar debugging
  console.log('LOGIN RESP STATUS:', resp.status());
  console.log('LOGIN RESP BODY:', body);

  expect(resp.status()).toBe(200);
});
