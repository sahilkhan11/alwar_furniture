# Enterprise Upgrade Plan for Alwar Furniture (Hostinger Shared Hosting)

## Current State Analysis
- **Monorepo**: Turborepo manages `apps` and `packages`.
- **Backend (`apps/api`)**: Basic Express.js server, standard REST routing.
- **Frontend (`apps/web`)**: Next.js 16 app with Tailwind CSS and Zustand.
- **Database (`packages/db`)**: Prisma ORM using SQLite.

## Architecture Enhancements (No-VPS Constraint)

### 1. Database & Persistence Layer
- **MySQL**: Migrate from SQLite to MySQL (natively supported by Hostinger Shared plans).
- **No Redis**: Since we don't have a VPS, we will rely on Node.js in-memory caching or optimized MySQL queries rather than requiring a separate Redis instance.
- **Seeding**: Robust Prisma seed scripts for Admin users and initial catalog data.

### 2. Backend API (Express.js)
- **Validation**: Integrate `zod` for request body, query, and parameter validation.
- **Security**: Apply `helmet` for HTTP headers, `express-rate-limit` to prevent brute-force, and configure CORS strictly.
- **Logging**: Centralized logging via `winston` and request logging via `morgan`. (Logs will be written to local files accessible via Hostinger file manager).
- **RBAC**: Implement Role-Based Access Control middleware for Admin vs. Customer roles.
- **API Documentation**: Add Swagger / OpenAPI specifications using `swagger-ui-express`.

### 3. Frontend Web (Next.js)
- **Server State**: Add `@tanstack/react-query` to handle data fetching, caching, and mutations efficiently.
- **UI Architecture**: Adopt Radix UI / Shadcn UI for accessible, reusable components.
- **Forms**: Use `react-hook-form` and `@hookform/resolvers/zod`.
- **Admin Dashboard**: Build a protected `/admin` route group.

### 4. DevOps, QA & Infrastructure
- **No Docker**: Eliminated Docker requirements. The app will be deployed using standard Hostinger Node.js application configurations (cPanel / hPanel).
- **Testing**:
  - API: Unit and integration tests via `vitest` and `supertest`.
  - UI: Component tests with `@testing-library/react`.
  - E2E: `playwright` for critical flows.
- **CI/CD**: GitHub Actions workflow to run lint, type-checks, and tests automatically before deploying.

## Execution Steps
We will track the step-by-step execution in `EXECUTION_STEPS.md`.
