# Execution Steps (Hostinger Shared Hosting)

## Step 1: Database Migration
- [ ] Modify `packages/db/prisma/schema.prisma` to use **MySQL** instead of SQLite.
- [ ] Create initial migration for MySQL structure.
- [ ] Document local MySQL setup (e.g., using XAMPP/WAMP or native).

## Step 2: Backend Security & Validation
- [ ] Install `zod`, `helmet`, `express-rate-limit`, `winston`, `morgan` in `apps/api`.
- [ ] Add `validate.ts` middleware using Zod.
- [ ] Add Helmet and rate limiting in `apps/api/src/index.ts`.
- [ ] Add Winston logger setup configured for file logging.

## Step 3: API Documentation
- [ ] Install `swagger-ui-express` and `swagger-jsdoc`.
- [ ] Set up a `/api/docs` endpoint with OpenAPI specs.

## Step 4: Frontend Architecture
- [ ] Install `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, and `zod` in `apps/web`.
- [ ] Set up `QueryClientProvider` in Next.js layout.
- [ ] Setup `shadcn/ui` base and initialize core components (button, input, form).

## Step 5: Testing Setup
- [ ] Install `vitest` and `supertest` in `apps/api`.
- [ ] Write initial unit test for the health endpoint.
- [ ] Install `playwright` in `apps/web` for E2E tests.

## Step 6: CI/CD & Deployment Prep
- [ ] Create `.github/workflows/ci.yml`.
- [ ] Configure it to run `npm run lint`, `npm run check-types`, and tests on push/PR.
- [ ] Create deployment documentation (`HOSTINGER_DEPLOY.md`) tailored to the Hostinger Node.js app runner.
