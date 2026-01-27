# Test cases — Happy Testing

Total test cases (E2E): **13**

## Resumen por archivo

- **tests/e2e/registration.spec.ts**
  1. **Debería registrar un usuario nuevo a través del formulario** — Registro exitoso; redirige a `/login` y no muestra "Missing fields".
  2. **No debe registrarse con campos faltantes** — Envía formulario incompleto; la API devuelve **400** con `{ error: 'Missing fields' }` y el mensaje se muestra en la UI.
  3. **No debe permitir registro con email duplicado** — Creación por API seguida de intento por UI; la API responde **409** con `{ error: 'El email ya está registrado' }` y se muestra el mensaje.
  4. **Después de registrarse, el usuario puede iniciar sesión** — Se registra y luego inicia sesión con esas credenciales (login 200).

- **tests/e2e/login.spec.ts**
  5. **Login con usuario seed** — Login con credenciales seed (`test@nutriapp.com / nutriapp123`); espera 200 y redirección a `/dishes`.

- **tests/e2e/dishes.spec.ts**
  6. **Debería ver lista de platos y navegar a nuevo plato (requiere login)** — Login y comprobación de la lista; navegación a `/dishes/new`.

- **tests/e2e/full_flow.spec.ts**
  7. **should create, view, edit and delete a dish** — Flujo completo (crear → ver → editar → eliminar) usando UI.

- **tests/e2e/login-debug.spec.ts**
  8. **API login via request (debug)** — POST directo a `/api/login` para verificar que la API responde correctamente (imprime status y body).

- **tests/e2e/logout.spec.ts** *(nuevo)*
  9. **Logout should clear session and redirect to login** — Login mediante UI, click en "Logout" → redirección a `/login` y cookie `session` eliminada.

- **tests/e2e/unauth-access.spec.ts** *(nuevo)*
  10. **Acceso no autorizado a /dishes/new debe redirigir a /login** — Intento de acceso sin sesión debe redirigir al login (server-side redirect).

- **tests/e2e/dish-edit.spec.ts** *(nuevo)*
  11. **Editar un plato existente y verificar los cambios** — Crear plato (UI), editar descripción (UI) y verificar el cambio en la tarjeta.

- **tests/e2e/dish-delete.spec.ts** *(nuevo)*
  12. **Eliminar un plato creado y verificar que desaparece del listado** — Crear plato (UI), eliminar (UI) y comprobar que ya no aparece.

- **tests/e2e/validation.spec.ts** *(nuevo)*
  13. **Validaciones del servidor para crear plato: campos faltantes -> 400** — Login, eliminar `required` del formulario para forzar envío, esperar **400** y `{ error: 'Missing fields' }` visible en UI.

---

## Notas y recomendaciones

- Ejecuta pruebas individuales en modo depuración para investigar fallos: `npx playwright test tests/e2e/<archivo>.spec.ts --headed --trace on`.
- Considerar agregar `data-test` attributes al markup para hacer selectores más robustos en POMs.
- Priorizar estabilizar flakiness en login y redirecciones (recomendado: ejecutar en CI y revisar traces si fallan).

