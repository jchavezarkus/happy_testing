FROM node:18-bullseye

WORKDIR /usr/src/app

# Install pnpm? Use npm for simplicity
COPY package*.json ./
COPY package-lock.json ./

RUN npm ci --silent

COPY . .

# Generate Prisma client
RUN npx prisma generate

ENV PORT 3000
EXPOSE 3000

# Default entrypoint runs the dev server (good for local dev with volume mount)
CMD ["npm", "run", "dev"]
