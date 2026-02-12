# Portfolio Monorepo

A Turborepo monorepo containing a portfolio website and admin panel built with React, TypeScript, Vite, and Tailwind CSS v4.

**Package Manager**: pnpm (v9.0.0+)
**Node Version**: >=18

## What's Inside

This Turborepo includes the following packages/apps:

### Apps

- `apps/portfolio/`: Main portfolio site (React + Vite)
- `apps/admin/`: Admin panel (React + Vite + Clerk Auth)

### Packages

- `@repo/ui`: Shared React component library
- `@repo/lib`: Shared utilities and Convex hooks
- `@repo/eslint-config`: Shared ESLint configurations
- `@repo/typescript-config`: Shared TypeScript configurations
- `@repo/tailwind-config`: Shared Tailwind v4 theme

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Backend**: Convex (serverless)
- **Authentication**: Clerk (admin only)
- **Component Library**: Custom design system with CVA
- **Monorepo**: Turborepo + pnpm workspaces

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start Convex backend (required)
npx convex dev
```

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm dev --filter=portfolio
pnpm dev --filter=admin
```

**Development URLs**:
- Portfolio: http://localhost:5173
- Admin: http://localhost:5176

### Build

```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm build --filter=portfolio
pnpm build --filter=admin
```

### Type Checking & Linting

```bash
# Type check all packages
pnpm check-types

# Lint all packages
pnpm lint

# Format code
pnpm format
```

### Preview Production Build

```bash
# Build first
pnpm build --filter=portfolio

# Preview
cd apps/portfolio
pnpm preview
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy portfolio (preview)
cd apps/portfolio
vercel

# Deploy to production
vercel --prod
```

**Required Environment Variables**:
- Portfolio: `VITE_CONVEX_URL`
- Admin: `VITE_CONVEX_URL`, `VITE_CLERK_PUBLISHABLE_KEY`

## Project Structure

```
.
├── apps/
│   ├── portfolio/          # Portfolio website
│   │   ├── src/
│   │   ├── vercel.json     # Vercel config
│   │   └── vite.config.ts
│   └── admin/              # Admin panel
│       ├── src/
│       ├── vercel.json     # Vercel config
│       └── vite.config.ts
├── packages/
│   ├── ui/                 # Shared components
│   ├── lib/                # Shared utilities
│   ├── eslint-config/      # ESLint configs
│   ├── typescript-config/  # TypeScript configs
│   └── tailwind-config/    # Tailwind theme
├── backend/                # Convex backend
│   ├── convex/
│   └── convex.json
└── turbo.json              # Turborepo config
```

## Environment Setup

### Portfolio Development

Create `apps/portfolio/.env.local`:

```bash
VITE_CONVEX_URL=https://<your-deployment>.convex.cloud
```

### Admin Development

Create `apps/admin/.env.local`:

```bash
VITE_CONVEX_URL=https://<your-deployment>.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run `pnpm check-types` and `pnpm lint`
4. Submit pull request

## Resources

- [Turborepo Documentation](https://turborepo.dev/docs)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Vercel Deployment Guide](./DEPLOYMENT.md)
