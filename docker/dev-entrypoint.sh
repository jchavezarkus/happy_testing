#!/usr/bin/env bash
set -euo pipefail

# Wait for DB to be available
echo "Waiting for Postgres..."
# Simple wait loop
for i in {1..30}; do
  if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
    echo "Postgres is up"
    break
  fi
  echo "Waiting for Postgres to be ready ($i/30)..."
  sleep 1
done

# Run migrations and seed
echo "Generating Prisma client..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate deploy || true

# Run seed if seed file exists
if [ -f ./seed.ts ]; then
  echo "Running seed script..."
  node --loader ts-node/esm seed.ts || true
fi

# Start the dev server
exec npm run dev
