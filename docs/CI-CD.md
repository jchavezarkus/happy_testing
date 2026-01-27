# CI/CD Setup - GitHub Actions

Este proyecto usa GitHub Actions para ejecutar pruebas E2E automáticamente.

## ✅ Configuración Actualizada

### Workflow: `.github/workflows/e2e.yml`

**Triggers:**
- ✅ Push a `main` o `develop`
- ✅ Pull requests a `main` o `develop`
- ✅ Schedule diario (2 AM UTC)

**Servicios:**
- PostgreSQL 16 (base de datos)
- Node.js 20 (runtime)

**Pasos del Pipeline:**
1. Checkout del código
2. Setup de Node.js con caché npm
3. Install dependencias (`npm ci`)
4. Generar cliente Prisma
5. Esperar a que PostgreSQL esté listo
6. Ejecutar migraciones
7. Seed de base de datos
8. Install navegadores Playwright
9. Ejecutar tests E2E
10. Upload reportes y videos

---

## 🔐 Secretos Necesarios (GitHub)

En `Settings > Secrets and variables > Actions`, agregar si necesario:

```
No required - El workflow usa valores hardcoded seguros.
```

**Nota**: La contraseña PostgreSQL "jennifer" está en el workflow. Para producción, usar secrets:

```yaml
POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 📊 Reportes Generados

**Disponibles en Artifacts:**
- `playwright-report/` → Reporte HTML completo (30 días)
- `playwright-videos/` → Videos de fallos (7 días)

---

## 🚀 Cómo Verificar

1. Pushear código a `main` o `develop`
2. Ir a `GitHub > Actions`
3. Seleccionar workflow "E2E Tests"
4. Ver logs y reportes en tiempo real

---

## 🔧 Variables de Entorno

**En CI/CD (GitHub Actions):**
```
DATABASE_URL=postgresql://postgres:jennifer@localhost:5432/happy_testing?schema=public
```

**En Local:**
```
DATABASE_URL=postgresql://postgres:jennifer@localhost:5432/happy_testing?schema=public
```

---

## ⏱️ Timeouts

- **Test**: 30 minutos total (timeout-minutes)
- **PostgreSQL health check**: 10s intervalo, 5s timeout, 5 reintentos
- **Playwright**: 30s default por test (configurable en `playwright.config.ts`)

---

## 📝 Mejoras Futuras

- [ ] Notificaciones a Slack en caso de fallos
- [ ] Coverage reports
- [ ] Performance benchmarks
- [ ] Deployar automáticamente en staging si tests pasan
- [ ] Retry automático en fallos flaky

---

## 🐛 Troubleshooting

**Problema: PostgreSQL health check fails**
- Solución: Aumentar `health-retries` en workflow

**Problema: Playwright timeout**
- Solución: Aumentar timeout en `playwright.config.ts` o test específico

**Problema: Seed falla**
- Verificar que seed.ts está actualizado con el schema actual

**Problema: Tests pasan local pero fallan en CI**
- Revisar diferencias de DATABASE_URL y variables de entorno
- Usar `headed: false` (ya está en config)
- Añadir logs con `console.log()` para debug
