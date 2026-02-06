# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo containing a portfolio website and admin panel built with React, TypeScript, Vite, and Tailwind CSS v4.

**Package Manager:** pnpm (v9.0.0+)
**Node Version:** >=18

## Monorepo Structure

```
apps/
  portfolio/    - Main portfolio site (React + Vite)
  admin/        - Admin panel (React + Vite)
packages/
  ui/           - Shared React components (@repo/ui)
  eslint-config/       - Shared ESLint configurations
  typescript-config/   - Shared TypeScript configurations (base.json, vite.json, react-library.json)
  tailwind-config/     - Shared Tailwind v4 configuration and theme
```

## Common Commands

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm dev --filter=portfolio
pnpm dev --filter=admin
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=portfolio
pnpm build --filter=admin
```

### Linting & Type Checking

```bash
# Lint all packages
pnpm lint

# Lint specific app
pnpm lint --filter=portfolio

# Type check all packages
pnpm check-types

# Format code
pnpm format
```

### Working with Individual Apps

```bash
# Navigate to app directory
cd apps/portfolio  # or apps/admin

# Run local commands
pnpm dev
pnpm build
pnpm lint
pnpm preview  # Preview production build
```

## Architecture Notes

### Workspace Dependencies

Apps reference shared packages using `workspace:*` protocol in package.json:

- `@repo/ui` - Import components directly from source: `import { Button } from "@repo/ui/button"`
- `@repo/eslint-config` - ESLint configs (base.js, next.js, react-internal.js)
- `@repo/typescript-config` - Base TypeScript configurations
- `@repo/tailwind-config` - Shared Tailwind theme and PostCSS config

### Tailwind CSS v4

This project uses Tailwind CSS v4 with:

- Vite plugin: `@tailwindcss/vite`
- Shared theme in `packages/tailwind-config/shared-styles.css`
- Custom color tokens: `--color-blue-1000`, `--color-purple-1000`, `--color-red-1000`
- Import pattern: `@import "@repo/tailwind-config";` in app CSS files

### Turborepo Task Pipeline

Defined in `turbo.json`:

- `build` - Depends on upstream builds, outputs to `.next/**`
- `dev` - No caching, runs persistently
- `lint` - Depends on upstream lints
- `check-types` - Depends on upstream type checks

### Component Generation

The UI package includes a component generator:

```bash
cd packages/ui
pnpm generate:component
```

## TypeScript Configuration

Apps extend from shared configs:

- Base: `@repo/typescript-config/base.json`
- Vite apps: `@repo/typescript-config/vite.json`
- Library: `@repo/typescript-config/react-library.json`

Key compiler options:

- Strict mode enabled
- ESNext module system
- Bundler module resolution
- Isolated modules

## Development Workflow

1. Install dependencies from root: `pnpm install`
2. Start all apps: `pnpm dev` (or filter specific app)
3. Apps run independently with Vite HMR
4. Shared packages are imported directly from source (no build step required for dev)
5. Before committing: run `pnpm lint` and `pnpm check-types`

## Turborepo Filters

Use `--filter` (or `-F`) to target specific workspaces:

```bash
turbo build --filter=portfolio
turbo dev --filter=admin
turbo lint --filter=@repo/ui
```
