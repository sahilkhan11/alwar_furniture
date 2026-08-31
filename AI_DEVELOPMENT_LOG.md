# AI Development Log & Architecture Handover

**Project:** Alwar Furniture
**Goal:** Enterprise-grade E-Commerce Monorepo for a furniture store.

This document serves as a persistent memory and training context for any AI agents working on this codebase in the future. It details the architectural approach, the current state of the codebase, and the immediate next steps.

---

## 1. Architectural Approach & Tech Stack

### Monorepo Structure (Turborepo)
The project is structured as a Turborepo to share configurations and potentially UI components across multiple applications.
- `apps/api`: Express.js REST API backend.
- `apps/web`: Next.js 16 Web Application (Storefront + Admin Dashboard).
- `apps/flutter_app`: Flutter cross-platform mobile application.
- `packages/db`: Prisma ORM configuration and database schema.

### Database Layer
- **Decision:** Migrated from SQLite to **MySQL**. 
- **Reasoning:** The user intends to deploy this to Hostinger Shared Hosting (No VPS, No Docker). Hostinger provides robust MySQL support via cPanel/hPanel natively. SQLite is unsuitable for concurrent e-commerce writes, and PostgreSQL is not available on basic shared hosting.
- **ORM:** Prisma is used for type-safe database queries.

### Backend (Express.js)
- **Security & Stability:** Integrated `helmet` for HTTP headers, `express-rate-limit` for DDoS protection, and `zod` for strict runtime payload validation.
- **Logging:** Replaced `console.log` with `winston` and `morgan` to write logs to local files (`logs/combined.log`), which is essential for debugging in a shared hosting environment without advanced telemetry.
- **Documentation:** Swagger/OpenAPI (`swagger-ui-express`) is configured at `/api/docs`.

### Web Frontend (Next.js)
- **State Management:** `@tanstack/react-query` is used for all server state (fetching products, placing orders). `zustand` is used for local client state (the Shopping Cart).
- **UI Architecture:** Integrated `shadcn/ui` (Radix primitives + Tailwind CSS) for accessible, rapid UI development.
- **Forms:** `react-hook-form` paired with `@hookform/resolvers/zod` ensures that frontend validation strictly matches backend expectations.

### Mobile App (Flutter)
- **Networking:** Standard `http` (or `dio`) to communicate with the Express API.
- **State Management:** `provider` (scaffolded) to handle authentication and cart state.

---

## 2. Current State of Implementation (What is Built)

### A. Database (`packages/db`)
- Schema defines `User`, `Category`, `Product`, `Order`, and `OrderItem`.
- Provider set to `mysql`.

### B. API (`apps/api`)
- CRUD controllers exist for Auth, Products, Categories, and Orders.
- Middleware for validation (`validate.ts`) and logging (`logger.ts`) is established.

### C. Web App (`apps/web`)
- **Storefront:** Home page, Product Listing (with search), Product Details, Cart, and Checkout form are visually complete and wired to React Query/Zustand.
- **Admin Dashboard:** Exists under `/admin`. Includes sidebar navigation, a Products data table, and a "New Product" creation form.

### D. Mobile App (`apps/flutter_app`)
- `api_service.dart` handles API calls.
- `home_screen.dart` renders the product catalog.
- `product_detail_screen.dart` renders the details view.

---

## 3. Pending Implementation (What Needs to be Built Next)

If you are an AI picking up this task, here is what is missing to reach production readiness:
1. **File Uploads:** The Admin "New Product" form currently sends an empty array for images. A file upload solution (e.g., Multer + Hostinger local storage, or Cloudinary) must be implemented in the API and wired to the frontend.
2. **Admin Auth & RBAC:** The admin dashboard has no login screen. The backend `requireAdmin` middleware must be wired to check actual JWT claims, and the frontend must protect the `/admin` route group.
3. **Flutter Cart & Checkout:** The mobile app's cart is not built. The "Add to Cart" button simply shows a snackbar. Implement local storage/provider for the cart and build the checkout screen.
4. **Payment Gateway:** Checkout currently assumes "Cash on Delivery". Integration with Razorpay/Stripe is required.

---

## 4. Execution Logs

**Iteration 1:**
- Migrated schema to MySQL.
- Hardened Express API (Helmet, Winston, Zod).
- Scaffolded GitHub Actions CI pipeline.
- Authored `HOSTINGER_DEPLOY.md`.

**Iteration 2:**
- Scaffolded Admin Dashboard (`/admin/products`, `/admin/products/new`).
- Scaffolded Storefront (`/products`, `/cart`, `/checkout`).
- Scaffolded Flutter App (`home_screen`, `product_detail_screen`).

**Current Action (Iteration 3):**
- Attempting to initialize the local MySQL database via Prisma so the system can be run locally for testing.
