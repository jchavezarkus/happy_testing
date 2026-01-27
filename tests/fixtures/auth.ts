import { request } from '@playwright/test';

export async function createUser(apiRequest: any, user: any) {
  // Calls the app's register API directly to create a user
  const resp = await apiRequest.post('/api/register', { data: user });
  return resp;
}

export async function loginAndGetStorageState(apiRequest: any, credentials: { email: string; password: string; }) {
  const resp = await apiRequest.post('/api/login', { data: credentials });
  // If login returns cookies, Playwright's request doesn't provide browser cookies directly.
  // Tests should use the UI login flow to get an authenticated page, or call /api/login and then set auth cookie via page.addCookies
  return resp;
}
