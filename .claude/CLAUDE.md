# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Vocabulary, flows, and known drift are documented in [`ubiquitous-language.md`](../ubiquitous-language.md). Read it before naming anything new.

## Project Overview

Turborepo monorepo: a public portfolio site and a private admin panel that manages its content, over a single Convex backend.

**Package Manager:** pnpm (v9.0.0+)
**Node Version:** >=18

Convex is the entire backend — database, file storage, auth checks, and one outbound email action. There is no API server and no SSR; both apps are client-rendered SPAs deployed to Vercel.

## Monorepo Structure

```
apps/
  portfolio/    - Public portfolio site (React + Vite, no auth)
  admin/        - Admin panel (React + Vite, Clerk auth)
packages/
  backend/      - Convex functions, schema, storage (@backend/*)
  ui/           - Shared React components + design tokens (@repo/ui)
  lib/          - Shared hooks and pure helpers (@repo/lib)
  eslint-config/       - Shared ESLint configurations
  typescript-config/   - Shared TypeScript configurations (base.json, vite.json, react-library.json)
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

Apps reference shared packages using `workspace:*` protocol in package.json. Packages are consumed **from source** — no build step for `@repo/ui` or `@repo/lib`.

- `@repo/ui` - Deep subpath imports: `import { Button } from "@repo/ui/button"`. The barrel export exists but is unused.
- `@repo/lib` - `@repo/lib/convex` (Convex hooks), `@repo/lib/use-upload`, `@repo/lib/use-storage-url`, `@repo/lib/slug`
- `@repo/eslint-config` - ESLint configs (base.js, next.js, react-internal.js)
- `@repo/typescript-config` - Base TypeScript configurations

### Path Aliases

Declared per app in `tsconfig.json`, resolved at build time by `vite-tsconfig-paths`:

| Alias | Resolves to |
| --- | --- |
| `@repo/ui/*` | `packages/ui/src/*` |
| `@repo/lib/*` | `packages/lib/src/*` |
| `@backend/*` | `packages/backend/convex/*` |

Note the shape: `@backend/_generated/api`, **not** `@backend/convex/_generated/api`.

### Convex Backend

- One module per table: `projects.ts`, `businesses.ts`, `resume.ts`; plus `storage.ts`, `contact.ts`, `users.ts`, `auth.ts`, `validators.ts`.
- Naming: admin reads are `listAll*` / `get*ById`; public reads are `listPublished*` / `getPublished*BySlug`; writes are `create* / update* / softDelete* / publish* / unpublish*`.
- **Every admin function begins with `await requireAdmin(ctx)`.** The client-side `AuthGate` is UX only; this is the real boundary.
- Full `args` validators on every function. JSDoc above each export, prefixed `Admin:` or `Public:`.
- Set `deletedAt: null` explicitly on insert — the `by_*_deletedAt` indexes match on `null`, and `undefined` would not be found.
- Admin access is an env-var allowlist (`ADMIN_AUTH_PROVIDER_ID` on the Convex deployment) checked by `users.upsertMe`.

### React Conventions

- Function components and hooks only. Default export for pages, named exports for shared components.
- Every route is `lazy()` + a `<Suspense>` spinner in `App.tsx`.
- Import Convex hooks from `@repo/lib/convex`, not `convex/react` directly.
- Loading is `data === undefined`; empty is `data.length === 0`. Handle both.
- Errors reach the user through `useToast()`, never `alert()`.
- Forms use `react-hook-form`; edit pages `reset(data)` in a `useEffect` once the query loads. Publish/unpublish/delete are separate mutations with their own buttons, never form fields.

### Tailwind CSS v4

CSS-first. There is no `tailwind.config.js` anywhere — all tokens live in `@theme` blocks.

- Vite plugin: `@tailwindcss/vite`
- Shared tokens: `packages/ui/src/styles.css`
- Apps import it by relative path: `@import "../../../packages/ui/src/styles.css";`
- The two apps **re-point the same semantic tokens rather than forking components**. `apps/admin/src/index.css` overrides `:root` after the import; `apps/portfolio/src/index.css` adds its own `@theme` layer (`ink`, `fg`, `line`, `accent`).
- Use semantic tokens (`bg-background-primary`, `text-label-secondary`, `border-border`, `text-destructive`), not raw palette values.
- Merge classes with `cn()` from `@repo/ui/lib/utils` — never manual string concatenation. `@repo/ui` components use `cva` for variants and `forwardRef`.
- Repeated portfolio class strings live in `apps/portfolio/src/components/styles.ts`. Admin layout primitives (`Section`, `PageHeader`, `StatusPill`, …) live in `apps/admin/src/components/AdminLayout.tsx`. Reuse them rather than hand-rolling.
- Visual language is specified in [`DESIGN.md`](../DESIGN.md).

### Content

Static portfolio copy belongs in `apps/portfolio/src/content.ts` (`SITE`), not inline in JSX.

### Turborepo Task Pipeline

Defined in `turbo.json`:

- `build` - Depends on upstream builds, outputs to `dist/**` and `.next/**`
- `dev` - No caching, runs persistently
- `lint` - Depends on upstream lints
- `check-types` - Depends on upstream type checks

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
6. Conventional commits, scoped: `feat(admin):`, `style(ui):`, `content(portfolio):`

## Turborepo Filters

Use `--filter` (or `-F`) to target specific workspaces:

```bash
turbo build --filter=portfolio
turbo dev --filter=admin
turbo lint --filter=@repo/ui
```
