import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { NewDishPage } from '../pom/NewDishPage';
import { DishesPage } from '../pom/DishesPage';
import { CREDENTIALS } from '../constants';
import { sampleDish } from '../mocks/dishes';

test('Eliminar un plato creado y verificar que desaparece del listado', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  const resp = await login.login(CREDENTIALS.seededUser.email, CREDENTIALS.seededUser.password);
  expect(resp.status()).toBe(200);

  const unique = `Del ${Date.now()}`;
  const dish = { ...sampleDish, name: unique };
  const newDish = new NewDishPage(page);
  await newDish.goto();
  await newDish.create(dish);

  const dishes = new DishesPage(page);
  await dishes.goto();

  // Contar platos antes de eliminar
  const countBefore = await dishes.countDishes();
  
  // Eliminar y comprobar que ya no existe
  await dishes.clickDelete(unique);
  
  // Verificar que el plato específico ya no existe
  const exists = await dishes.hasDish(unique);
  expect(exists).toBeFalsy();
  
  // Verificar que el conteo disminuyó en 1
  const countAfter = await dishes.countDishes();
  expect(countAfter).toBe(countBefore - 1);
});
