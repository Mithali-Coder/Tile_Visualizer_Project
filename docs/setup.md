# Setup Guide

## Prerequisites

- Node.js 18.11 or newer (the server dev script uses `node --watch`)
- npm 9 or newer (npm workspaces)

Check your versions:

```bash
node --version
npm --version
```

## Install

From the repository root:

```bash
npm install
```

This installs the `client`, `server`, and `shared` workspaces and links them.

## Development

```bash
# Client and server together
npm run dev

# Individually
npm run dev:client   # Vite dev server → http://localhost:5173
npm run dev:server   # Express API       → http://localhost:4000
```

The demo admin login is `admin` / `admin123` (hidden in `client/src/features/auth/auth.constants.js`, not shown on the sign-in screen).

## Build and preview

```bash
npm run build     # production build of the client → client/dist/
npm run preview   # serve the production build
```

## Environment variables

Copy the relevant example and fill in real values (never commit `.env`):

```bash
# Client
cp client/.env.example client/.env

# Server
cp server/.env.example server/.env
```

| Variable        | Workspace | Default           | Purpose                                  |
| --------------- | --------- | ----------------- | ---------------------------------------- |
| `VITE_API_URL`  | client    | `http://localhost:4000` | Base URL of the backend API (future) |
| `PORT`          | server    | `4000`            | HTTP port for the API                    |
| `NODE_ENV`      | server    | `development`     | Runtime environment                      |
| `MONGODB_URI`   | server    | *(none)*          | MongoDB connection string (optional locally; enables the Phase 1 Mongoose layer) |

If `MONGODB_URI` is unset, the API runs on disk storage (`server/storage/`)
as before. Set it to connect MongoDB and seed the database:

```bash
cd server && npm run seed   # or from the root: npm run db:seed
```

## Tests

Server tests use Node's built-in `node:test` runner (no third-party framework):

```bash
npm test   # runs npm test --workspace server → node --test tests/*.test.js
```

The suites live in `server/tests/`: `layouts.test.js` (LayoutStorage unit
tests), `integration.test.js` (HTTP-level API tests), `models.test.js`
(Mongoose model registration) and `schemas.test.js` (shared Zod schemas). All
run without a live MongoDB. There is no linter or type-check step configured
yet.

## Wiring the client to the API (future)

Once the server exposes real endpoints, add a fetch wrapper in
`client/src/services/` and point it at `import.meta.env.VITE_API_URL`.
