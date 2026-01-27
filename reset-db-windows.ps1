# Script para resetear la base de datos y corregir el error 500
# Ejecución: .\reset-db-windows.ps1

$ErrorActionPreference = "Stop"

Write-Host "🗑️  Reseteando base de datos..." -ForegroundColor Cyan

# 1. Resetear migraciones de Prisma
Write-Host "1️⃣  Eliminando migraciones y carpeta .prisma..." -ForegroundColor Yellow
try {
  npx prisma migrate reset --force
  Write-Host "✅ Migraciones reseteadas" -ForegroundColor Green
} catch {
  Write-Host "⚠️  Error en reset de migraciones (puede ser esperado)" -ForegroundColor Yellow
}

# 2. Generar cliente de Prisma
Write-Host "2️⃣  Generando cliente de Prisma..." -ForegroundColor Yellow
npx prisma generate

# 3. Aplicar migraciones
Write-Host "3️⃣  Aplicando migraciones..." -ForegroundColor Yellow
npx prisma migrate deploy

# 4. Seed la base de datos
Write-Host "4️⃣  Poblando base de datos con seed..." -ForegroundColor Yellow
node --loader ts-node/esm seed.ts

Write-Host "✅ Base de datos reseteada y poblada correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Ahora ejecuta: npm run dev" -ForegroundColor Cyan
