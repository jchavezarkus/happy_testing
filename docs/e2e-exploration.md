# Exploración E2E - NutriApp

## Objetivo
Explorar la app en `http://localhost:3000` para identificar flujos clave y crear pruebas E2E con Playwright.

## Páginas exploradas
- **/** (home): enlaces a `/register`, `/login`, `/dishes`.
- **/register**: formulario con campos `firstName`, `lastName`, `email`, `nationality`, `phone`, `password` y botón de submit.
- **/login**: formulario con campos `email`, `password`.
- **/dishes**: listado de platos; existe enlace a `/dishes/new`.

## Selectores y convenciones
- Inputs por `name` (ej. `input[name=email]`).
- Botones de submit por `button[type=submit]`.
- En el listado de platos se recomienda usar un atributo data-test `data-test="dish-card"` en cada tarjeta para pruebas (si no existe añadirlo).

## Casos de prueba sugeridos
1. Registro: llenar formulario y verificar que el usuario sea creado.
2. Login: iniciar sesión con `test@nutriapp.com` / `nutriapp123` (seed) y verificar redirect a `/dishes`.
3. Crear plato: iniciar sesión, navegar a `/dishes/new`, crear un nuevo plato, verificar que aparece en la lista.
4. Editar plato: editar un plato existente y verificar cambios.
5. Borrar plato: eliminar y verificar que desaparece.
6. Casos negativos: registro con campos faltantes, login con credenciales inválidas.

## Notas de ejecución
- Playwright MCP no pudo iniciarse desde el entorno remoto; los tests están listos para ejecutarse localmente.
- Para ejecutar localmente instalar dependencias y Playwright:
  ```bash
  npm install -D @playwright/test
  npx playwright install --with-deps
  npx playwright test
  ```

## Archivos creados
- `tests/playwright.config.ts` - configuración de Playwright
- `tests/pom/*.ts` - Page Object Models
- `tests/fixtures/*.ts` - helpers para creación de usuarios
- `tests/e2e/*.spec.ts` - pruebas E2E
- `tests/constants.ts`, `tests/mocks/dishes.ts` - constantes y datos mock

---

Si quieres, puedo:
- Añadir `data-test` attributes en componentes para mejorar selectores (puedo abrir PR si te parece).
- Añadir CI job (GitHub Actions) para ejecutar estas pruebas en cada push.
