# Hostinger Deployment Guide

This guide explains how to deploy the Alwar Furniture API and Web application to Hostinger's Shared / Premium Hosting (without VPS).

## Prerequisites
1. **Node.js Environment**: Ensure your Hostinger plan supports Node.js apps.
2. **Database**: A MySQL database created via hPanel.

## Deploying the Database
1. Go to your hPanel -> Databases -> MySQL Databases.
2. Create a new database, user, and password.
3. Keep the `DATABASE_URL` format ready: `mysql://username:password@localhost:3306/database_name`
4. Locally, run `npx prisma migrate deploy` or `npx prisma db push` with this `DATABASE_URL` if remote access is enabled, or export a `.sql` file locally using `npx prisma migrate dev` and import it into Hostinger via phpMyAdmin.

## Deploying the Express API (`apps/api`)
1. Run `npm run build` locally in `apps/api`. This generates the `dist` folder.
2. Zip the `apps/api/dist`, `apps/api/package.json`, and `apps/api/package-lock.json`.
3. In hPanel, go to "Node.js" and create an app.
4. Set the startup script to `dist/index.js`.
5. Upload and extract your ZIP via File Manager.
6. Install dependencies from the hPanel interface (usually a button or run via SSH).
7. Add `.env` file in the root of the Node app with your `DATABASE_URL` and other secrets.

## Deploying the Next.js Frontend (`apps/web`)
Because Hostinger shared hosting can only run one or two Node apps, you have a few options:
### Option A: Static Export (Recommended for basic Shared Hosting)
1. Add `output: 'export'` to your `apps/web/next.config.js`.
2. Run `npm run build` in `apps/web`.
3. Zip the `apps/web/out` folder.
4. Upload to the `public_html` directory of your Hostinger domain.

### Option B: Node.js App (If Server-Side Rendering is needed)
1. Run `npm run build` in `apps/web`.
2. Zip `apps/web/.next`, `package.json`, and `.env`.
3. Create a second Node.js app in hPanel.
4. Set the startup script to `node_modules/next/dist/bin/next` and arguments to `start`.
