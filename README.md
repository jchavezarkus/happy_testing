

# NutriApp

Web application built with Next.js and PostgreSQL for managing healthy dishes.

**Goals:**
- Explore the application features and flows.
- Analyze and design test cases for different user scenarios and dish management operations.
- Practice creating end-to-end automated tests using Cypress.io and modern development best practices.


## Features
- User registration and login (email/username and password)
- List, create, edit, and delete dishes
- Modern and responsive interface

## Requirements
* Node.js (v20.x or higher recommended)
* PostgreSQL (v15.x or higher recommended)

### How to install Node.js and PostgreSQL

#### Windows
- Download Node.js from [nodejs.org](https://nodejs.org/en/download/) and run the installer.
- Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/) and run the installer.

#### macOS
- Install Node.js using Homebrew:
	```bash
	brew install node
	```
- Install PostgreSQL using Homebrew:
	```bash
	brew install postgresql
	```

#### Linux (Debian/Ubuntu)
- Install Node.js:
	```bash
	sudo apt update
	sudo apt install nodejs npm
	```
- Install PostgreSQL:
	```bash
	sudo apt update
	sudo apt install postgresql postgresql-contrib
	```

## Main Structure
- `/register`: User registration
- `/login`: Login
- `/dishes`: Dishes list
- `/dishes/new`: Create dish
- `/dishes/[id]`: Edit dish

## API
- `/api/register`: User registration
- `/api/login`: User login
- `/api/dishes`: List and create dishes
- `/api/dishes/[id]`: Edit and delete dishes

## Customization
You can modify the components in `src/app` to adapt the app to your needs.

## How to Start the Application from Scratch

1. Clone the repository and enter the directory:
	```bash
	git clone https://github.com/Academy-QA/happy_testing.git
	cd happy_testing
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Set up your PostgreSQL database and configure the `DATABASE_URL` variable in `.env`:
	```env
	DATABASE_URL="postgresql://user:password@localhost:5432/nutriapp"
	```
4. Run migrations:
	```bash
	npx prisma migrate dev --name init
	```
5. Generate Prisma Client:
	```bash
	npx prisma generate
	```
6. (Optional) Run the seed script to populate the database with sample data:
	```bash
	node --loader ts-node/esm seed.ts
	```

---

### Run with Docker (recommended if you want a reproducible dev DB)

1. Start services (Postgres + app):
```bash
npm run docker:up
```

This will build the app image, start Postgres and run the dev server. The app will be reachable at http://localhost:3000.

2. Run migrations or seed if needed:
```bash
npm run docker:migrate
npm run docker:seed
```

3. Stop the environment:
```bash
npm run docker:down
```

---

7. Start the application (without Docker):
	```bash
	npm run dev
	```
8. Open [http://localhost:3000](http://localhost:3000) in your browser


## Challenge: Automated Testing with Cypress.io


Add end-to-end tests using [Cypress.io](https://www.cypress.io/):

Official documentation: [https://docs.cypress.io/](https://docs.cypress.io/)

1. Install Cypress:
	 ```bash
	 npm install cypress --save-dev
	 ```
2. Add a script to `package.json`:
	 ```json
	 "scripts": {
		 ...
		 "cypress": "cypress open"
	 }
	 ```
3. Run Cypress:
	 ```bash
	 npm run cypress
	 ```
4. Create your tests in the `cypress/e2e` folder.

**Example test:**

```js
// cypress/e2e/login.cy.js

describe('Login', () => {
	it('should log in with valid credentials', () => {
		cy.visit('/login');
		cy.get('input[name=email]').type('test@nutriapp.com');
		cy.get('input[name=password]').type('nutriapp123');
		cy.get('button[type=submit]').click();
		cy.url().should('include', '/dishes');
	});
});
```

Add more tests to validate user flows and dish management!
