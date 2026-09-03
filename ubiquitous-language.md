# Ubiquitous Language

Canonical vocabulary, flows, entry points, and conventions for this repository.
Purpose: anyone (human or agent) touching this codebase uses the same words for
the same things and follows the patterns that already exist.

---

## 1. What the project is

A personal portfolio for **Landon McKell** (contract full-stack developer,
Spanish Fork UT), plus a private admin panel that manages its content.

Two deployed frontends over one shared backend:

| Surface | Package | Audience | Auth |
| --- | --- | --- | --- |
| Portfolio | `apps/portfolio` | Public (small business owners hiring for contract work) | None |
| Admin | `apps/admin` | Landon only | Clerk sign-in + Convex allowlist |
| Backend | `packages/backend` | Both | Per-function; admin functions call `requireAdmin` |

Content managed: **Projects** (case studies), **Businesses** (ventures he runs),
and a single **Resume**. Visitors can send a **Contact Message**.

---

## 2. Language

The glossary is authoritative. When a term below has an `_Avoid_` line, use the
canonical term in code, comments, commits, and conversation.

### Content

**Project**
A piece of work shown as a case study on the portfolio. Owns a slug, copy, a
cover image, a gallery, tech stack, and optional live/repo links.
_Avoid_: case study (that is the *presentation* of a Project, not the record),
portfolio item, work item.

**Business**
A venture Landon owns or runs, listed under "Ventures". Not a client and not a
Project.
_Avoid_: venture (UI label only), company, client.

**Resume**
The singleton document holding headline, summary, skills, experience entries,
and education entries. There is exactly one row in the `resume` table; the write
path is an upsert, never a create. There is no stored PDF: the portfolio's
"Download resume" button prints `ResumeDocument` through the browser's native
print dialog.
_Avoid_: CV, profile.

**Experience Entry** / **Education Entry**
Embedded objects inside the Resume (`{ company, role, start, end, bullets }` /
`{ school, degree, year }`). They are not tables and have no ids.

**Contact Message**
A visitor submission (`name?`, `email`, `message`) sent as an email through
Resend. Never persisted — there is no `contacts` table.
_Avoid_: inquiry, lead, submission.

**Slug**
The URL identifier for a Project or Business: lowercase alphanumeric with single
internal hyphens (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). Unique per table. The public
site addresses content by Slug; the admin addresses it by Convex `_id`.

### State

**Status** (Projects only)
`"draft" | "published"`. New Projects are always created as `draft`; publishing
is a separate mutation, never a field on create.
_Avoid_: state, visibility, isPublished.

**Active** (Businesses only)
Boolean. The Business equivalent of `published`. Defaults to `true` on create.
Businesses have no draft state, and Projects have no active flag — the two
concepts are deliberately not unified.

**Published** (as a verb/adjective across both)
The condition that makes a record publicly visible. For a Project that means
`status === "published" && deletedAt === null`; for a Business it means
`active === true && deletedAt === null`. Public query names use this word for
both (`listPublishedBusinesses`).

**Featured**
Optional boolean marking emphasis. On the portfolio landing page the *first*
Project in sort order renders as the wide feature card — the `featured` field
is currently metadata surfaced in the admin, not the thing that drives that
layout.

**Soft Delete**
Setting `deletedAt` to a timestamp so the record disappears from public queries
but stays in the database and in the admin list (tagged `deleted`).
Caveat worth knowing: the soft-delete mutations **hard-delete the associated
storage files**. The record is recoverable; its images are not. There is no
restore or purge mutation.

**Sort Order**
Optional number. Ordering rule everywhere: `sortOrder` ascending, records
*without* a `sortOrder` last, then `createdAt` descending (Projects only).
Sorting happens in JS after `.collect()`, not in the index.

### Access

**Admin**
A row in `users` with `role: "admin"`. The only role that exists.

**Auth Provider Id**
The Clerk `identity.subject`. `users.authProviderId` stores it; the
`ADMIN_AUTH_PROVIDER_ID` Convex env var holds the comma-separated **allowlist**
of subjects permitted to self-provision.

**Allowlist**
The env-var list checked by `users.upsertMe`. A signed-in user not on it gets no
`users` row, therefore no role, therefore the `NotAuthorized` page. Adding an
admin means editing this env var in the Convex dashboard.

**Storage Id**
A Convex `_storage` id. Images are referenced by Storage Id on the record
(`coverImageId`, `galleryImageIds`, `logoImageId`) and resolved to URLs at
render time.

### Presentation

Design vocabulary is defined in `DESIGN.md`; these are the terms that appear in
code.

**Eyebrow** — the small uppercase mono label above a section heading.
**Reveal** — the scroll-triggered fade-up wrapper (`Reveal.tsx`).
**Status Pill** — admin's neutral pill with a dot: published/draft, active/inactive.
**Section** — admin's two-column form block (mono label left, fields right).
**Chip** — a small bordered mono pill for a tech-stack entry or tag.

---

## 3. Architecture

```
apps/portfolio ──┐                     ┌── @repo/ui      (presentational primitives)
                 ├── packages/backend ─┤
apps/admin ──────┘   (Convex)          └── @repo/lib     (hooks + pure helpers)
```

- **Turborepo + pnpm workspaces.** Packages are consumed **from source** — no
  build step for `@repo/ui` or `@repo/lib` in dev or in CI builds.
- **Convex is the whole backend.** Database, file storage, auth checks, and the
  one outbound email action all live in `packages/backend/convex/`. There is no
  API server, no REST layer, no server-side rendering.
- **Clerk is admin-only.** The portfolio app has no auth dependency at all; its
  Convex client is a plain `ConvexProvider`.
- **Vite + React 19 + React Router 7** in both apps, client-rendered SPAs
  deployed to Vercel with a catch-all rewrite to `index.html`.
- **Tailwind v4, CSS-first.** All tokens live in `@theme` blocks. There is no
  `tailwind.config.js` anywhere.

### Path aliases

Declared per app in `tsconfig.json` and resolved at build time by
`vite-tsconfig-paths`:

| Alias | Resolves to |
| --- | --- |
| `@repo/ui/*` | `packages/ui/src/*` |
| `@repo/lib/*` | `packages/lib/src/*` |
| `@backend/*` | `packages/backend/convex/*` |

Note the shape: it is `@backend/_generated/api`, **not**
`@backend/convex/_generated/api`.

---

## 4. Entry points

| Concern | File |
| --- | --- |
| Portfolio bootstrap | `apps/portfolio/src/main.tsx` |
| Portfolio routes | `apps/portfolio/src/App.tsx` |
| Portfolio convex client | `apps/portfolio/src/lib/convex.ts` |
| Static site copy | `apps/portfolio/src/content.ts` (`SITE`) |
| Portfolio design tokens | `apps/portfolio/src/index.css` |
| Admin bootstrap | `apps/admin/src/main.tsx` |
| Admin routes | `apps/admin/src/App.tsx` |
| Admin auth boundary | `apps/admin/src/components/AuthGate.tsx` |
| Admin chrome + layout primitives | `apps/admin/src/components/AdminLayout.tsx` |
| Admin palette override | `apps/admin/src/index.css` |
| Data model | `packages/backend/convex/schema.ts` |
| Admin guard | `packages/backend/convex/auth.ts` (`requireAdmin`) |
| Shared design tokens | `packages/ui/src/styles.css` |
| Build checklist / project history | `docs/TASKS.md` |
| Visual language | `DESIGN.md` |
| Deploy runbook | `DEPLOYMENT.md` |

Provider nesting differs between the apps and matters:

```
portfolio: StrictMode > BrowserRouter > ConvexClientProvider > ToastProvider > App
admin:     StrictMode > ClerkProvider > ConvexProviderWithClerk > BrowserRouter > ToastProvider > App
```

---

## 5. Main flows

### 5.1 Public read

1. A page calls `useQuery(api.<module>.<publicQuery>)` from `@repo/lib/convex`.
2. Convex returns `undefined` while loading → render `<Spinner>`; empty array →
   render an empty-state line; `null` from a by-slug query → `<Navigate to="/404">`.
3. Storage Ids on the record are resolved separately via `useStorageUrl` /
   `useStorageUrls` against `api.storage.getFileUrl(s)`.

Public queries, all filtered to non-deleted:
`projects.listPublishedProjects`, `projects.getPublishedProjectBySlug`,
`businesses.listPublishedBusinesses`, `businesses.getPublishedBusinessBySlug`,
`resume.getPublicResume`, `storage.getFileUrl(s)`.

The landing page issues three queries and renders Work, Ventures, Background,
and Contact from them plus `SITE` copy.

### 5.2 Admin sign-in and authorization

1. `ClerkProvider` renders Clerk's `<SignIn>` when signed out.
2. On sign-in, `AuthGate` fires `users.upsertMe` **once** (ref-guarded).
3. `upsertMe` returns the existing row, or inserts an admin row **only** if
   `identity.subject` is in `ADMIN_AUTH_PROVIDER_ID`. Otherwise it returns
   `null` and writes nothing.
4. `AuthGate` reads `users.getMyRole`; `undefined` → spinner, not `"admin"` →
   `<NotAuthorized>`, `"admin"` → render the app.
5. Every admin Convex function independently calls `requireAdmin(ctx)`. The
   client gate is UX; the server guard is the actual boundary.

### 5.3 Admin write (create / edit)

The five form pages (`ProjectCreate`, `ProjectEdit`, `BusinessCreate`,
`BusinessEdit`, `Resume`) all follow one shape:

1. `useForm<FormData>()` from `react-hook-form`; fields wired with `register()`.
2. Edit pages fetch by `_id` (`getProjectById` / `getBusinessById` /
   `getResume`) and `reset(data)` in a `useEffect` once it loads.
3. Comma-separated inputs (tech stack, tags, skills) are split on submit:
   `value.split(",").map(s => s.trim()).filter(Boolean)`.
4. Submit calls the mutation, shows a toast, and `navigate()`s back to the list.
5. Publish / unpublish / delete are **separate mutations with their own
   buttons**, never fields on the edit form. Delete confirms first.

Server-side, every mutation: `requireAdmin` → required-field validation →
`validateSlugFormat` → slug-uniqueness query on the `by_slug` index → write.
Validation lives in `packages/backend/convex/validators.ts` and throws
user-facing `Error` messages; the client surfaces them in a toast.

### 5.4 File upload

Three steps, wrapped by `useUpload` in `@repo/lib/use-upload`:

1. `storage.generateUploadUrl` (admin-only mutation) returns a short-lived URL.
2. `POST` the `File` to that URL with its `Content-Type`.
3. Read `storageId` from the response and pass it to the record mutation.

Gallery mutations (`addProjectGalleryImage`, `removeProjectGalleryImage`,
`reorderProjectGalleryImages`) and the "remove image" mutations live in
`storage.ts`, not in `projects.ts` / `businesses.ts`. Removal deletes the file
from storage **and** clears the field in one mutation.

### 5.5 Contact

`Landing.tsx` → `useAction(api.contact.sendContactEmail)` → Convex action →
Resend HTTP API. Requires `RESEND_API_KEY` and `CONTACT_EMAIL` set on the Convex
deployment. Validation runs on both sides (react-hook-form client-side, explicit
checks in the action). Nothing is stored.

---

## 6. Conventions to follow

### Convex

- One module per table (`projects.ts`, `businesses.ts`, `resume.ts`), plus
  `storage.ts`, `contact.ts`, `users.ts`, `auth.ts`, `validators.ts`.
- Naming: admin reads are `listAll*` / `get*ById`; public reads are
  `listPublished*` / `getPublished*BySlug`; writes are
  `create* / update* / softDelete* / publish* / unpublish*`.
- Every admin function begins with `await requireAdmin(ctx)`.
- Full `args` validators with `v.*` on every function, `v.optional` for anything
  the schema marks optional.
- JSDoc above each export, prefixed `Admin:` or `Public:`.
- Set `deletedAt: null` explicitly on insert — the `by_*_deletedAt` index
  queries match on `null`, and `undefined` would not be found.
- Timestamps are `Date.now()` numbers. Projects carry `createdAt`/`updatedAt`;
  Businesses carry neither.

### React

- Function components, hooks only. Default export for pages, named exports for
  shared components.
- Every route is `lazy()` + a `<Suspense>` spinner in `App.tsx`.
- Import Convex hooks from `@repo/lib/convex`, not from `convex/react` directly
  (the admin's `AuthGate` is the one exception).
- Deep subpath imports from the packages (`@repo/ui/button`,
  `@repo/ui/lib/utils`) — the `@repo/ui` barrel exists but is unused.
- Loading is `data === undefined`; empty is `data.length === 0`. Handle both.
- Errors reach the user through `useToast()`, never `alert()`.

### Styling

- Tailwind utilities merged with `cn()` from `@repo/ui/lib/utils` — never manual
  template-string concatenation of classes.
- `@repo/ui` components use `cva` for variants and `forwardRef`.
- Use **semantic tokens** (`bg-background-primary`, `text-label-secondary`,
  `border-border`, `text-destructive`), not raw palette values.
- The two apps re-point the same tokens rather than forking components:
  `apps/admin/src/index.css` overrides `:root` after importing
  `packages/ui/src/styles.css`; `apps/portfolio/src/index.css` adds its own
  `@theme` layer (`ink`, `fg`, `line`, `accent`).
- Repeated portfolio class strings live in `apps/portfolio/src/components/styles.ts`
  (`BTN_PRIMARY`, `CARD`, `EYEBROW`, …). Add to that file rather than repeating.
- Admin layout primitives (`Section`, `PageHeader`, `StatusPill`, `MetaBar`,
  `CheckboxField`, …) live in `AdminLayout.tsx`. Reuse them; do not hand-roll a
  new form section.
- Typography: JetBrains Mono is the portfolio's whole typeface and the admin's
  *label* voice; Instrument Sans is the admin's body voice.

### Copy

- Static portfolio copy belongs in `apps/portfolio/src/content.ts`, not inline
  in JSX. Sentence case. No terminal affectations (`[brackets]`, `//` prefixes,
  `snake_case` names) — `DESIGN.md` rules those out explicitly.

### Workflow

- `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm check-types` from the root;
  add `--filter=portfolio|admin` to target one app.
- Run `pnpm lint` and `pnpm check-types` before committing.
- Conventional commits, scoped: `feat(admin):`, `style(ui):`, `content(portfolio):`.

---

## 7. Known drift (verified, not yet fixed)

These are facts about the current tree, recorded so nobody rediscovers them:

1. **`.claude/CLAUDE.md` is stale.** It documents a
   `packages/tailwind-config` package and an `@import "@repo/tailwind-config"`
   pattern. That package does not exist; tokens live in
   `packages/ui/src/styles.css` and apps import it by relative path. It also
   omits `packages/backend` and `packages/lib` entirely.
2. **Env validation is dead code.** `apps/portfolio/src/env.ts`,
   `apps/admin/src/env.ts`, and `packages/lib/src/env.ts` build Zod validators
   that nothing imports. Both apps read `import.meta.env.*` directly and
   unvalidated. `VITE_SITE_URL` (used in `AdminLayout.tsx`) is in no schema and
   in no `.env.example`.
3. **Unused shared code.** `@repo/lib/date` and `@repo/lib/url` have zero
   importers, as does the `@repo/ui` barrel export.
4. **Debug logging in production auth.** `users.upsertMe` logs the allowlist
   env var and the caller's `identity.subject` on every sign-in.
5. **`--background-gradient` is invalid CSS.** `#ffffff · 1%` in
   `packages/ui/src/styles.css` (light and dark). `--icon-background` is also
   declared twice per block.
6. **Contact email interpolates user input into HTML unescaped** in
   `contact.ts`. Recipient is Landon's own inbox, so impact is limited, but the
   `from` address is still the unverified `onboarding@resend.dev` default.
7. **Soft delete is one-way.** No restore mutation exists, and the associated
   storage files are permanently deleted at soft-delete time.
8. **`listAllProjects` / `listAllBusinesses` return soft-deleted rows** and
   `.collect()` the entire table before sorting in JS. Fine at portfolio scale;
   it is not a pattern to copy for a growing table.
