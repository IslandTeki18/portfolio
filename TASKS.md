# TODO

Use this as a build checklist. Check items only when complete and verified.

---

## 0) Repo + Tooling

- [x] Create Turborepo workspace
- [x] Create apps:
  - [x] `apps/portfolio`
  - [x] `apps/admin`
- [x] Create packages:
  - [x] `packages/ui`
  - [x] `packages/lib`
- [x] Configure workspace TS path aliases (root + per-app)
- [x] Ensure both apps build and run locally
- [x] Add shared lint/format config (ESLint + Prettier or Biome)
- [x] Add shared typecheck script at root
- [x] Add consistent env loading approach across apps

---

## 1) Styling + UI Foundations

### Tailwind + dark mode + font

- [ ] Add Tailwind to `apps/portfolio`
- [ ] Add Tailwind to `apps/admin`
- [ ] Tailwind `darkMode: "media"`
- [ ] Add JetBrains Mono from Google Fonts
- [ ] Apply JetBrains Mono as default font in both apps
- [ ] Confirm default Tailwind breakpoints only
- [ ] Confirm Tailwind content paths include shared packages for purge

### Shared UI kit (`packages/ui`)

- [ ] Create primitives:
  - [ ] `Button`
  - [ ] `Input`
  - [ ] `Textarea`
  - [ ] `Select` (optional but useful)
  - [ ] `Card`
  - [ ] `Modal`
  - [ ] `Spinner`
  - [ ] `Toast` system
  - [ ] `EmptyState`
  - [ ] `FormError` / inline error component
- [ ] Ensure components are typed + accessible enough for v1
- [ ] Add minimal theme tokens (spacing, typography classes)
- [ ] Verify both apps import and render components from `packages/ui`

### Shared lib (`packages/lib`)

- [ ] Add slug helpers:
  - [ ] `slugify(title: string) => string`
  - [ ] `isValidSlug(slug: string) => boolean`
- [ ] Add URL helpers:
  - [ ] `isValidHttpUrl(value?: string) => boolean`
- [ ] Add date/format helpers used by UI lists

---

## 2) Routing + Pages Skeleton

### Portfolio routes

- [ ] `/` Landing page scaffold with sections:
  - [ ] Introduction (hardcoded)
  - [ ] Projects (dynamic placeholder)
  - [ ] Resume (dynamic placeholder)
  - [ ] Businesses (dynamic placeholder)
  - [ ] Contact (hardcoded + form placeholder)
- [ ] `/projects/:slug` Project detail scaffold
- [ ] `404` route and UI
- [ ] Add route-level code splitting (if router supports)

### Admin routes

- [ ] `/` dashboard placeholder
- [ ] `/projects` list scaffold
- [ ] `/projects/new` create scaffold
- [ ] `/projects/:id` edit scaffold
- [ ] `/resume` scaffold
- [ ] `/businesses` list scaffold
- [ ] `/businesses/new` create scaffold
- [ ] `/businesses/:id` edit scaffold
- [ ] Admin `404` route and UI

---

## 3) Convex Setup

- [ ] Initialize Convex in `/convex`
- [ ] Configure deployment + env vars for local + production
- [ ] Add Convex client wiring in both apps:
  - [ ] Shared `ConvexProvider` wrapper in `packages/lib`
  - [ ] Typed `useQuery`/`useMutation` re-exports in `packages/lib`
  - [ ] Providers added to both app roots
- [ ] Verify both apps can call a simple test query

---

## 4) Data Models + Schema

### Tables

- [ ] `users`
  - [ ] `authProviderId: string`
  - [ ] `role: "admin"`
  - [ ] `createdAt: number`
- [ ] `projects`
  - [ ] `title: string`
  - [ ] `slug: string`
  - [ ] `shortDescription: string`
  - [ ] `longDescription?: string`
  - [ ] `coverImageId?: Id<"_storage">`
  - [ ] `galleryImageIds?: Id<"_storage">[]`
  - [ ] `techStack?: string[]`
  - [ ] `liveUrl?: string`
  - [ ] `repoUrl?: string`
  - [ ] `featured?: boolean`
  - [ ] `status: "draft" | "published"`
  - [ ] `sortOrder?: number`
  - [ ] `tags?: string[]`
  - [ ] `deletedAt?: number | null`
  - [ ] `createdAt: number`
  - [ ] `updatedAt: number`
- [ ] `businesses`
  - [ ] `name: string`
  - [ ] `slug: string`
  - [ ] `logoImageId?: Id<"_storage">`
  - [ ] `shortDescription: string`
  - [ ] `longDescription?: string`
  - [ ] `websiteUrl?: string`
  - [ ] `active: boolean`
  - [ ] `featured?: boolean`
  - [ ] `sortOrder?: number`
  - [ ] `tags?: string[]`
  - [ ] `deletedAt?: number | null`
- [ ] `resume` (single doc model)
  - [ ] `headline?: string`
  - [ ] `summary?: string`
  - [ ] `experience?: { company: string; role: string; start?: string; end?: string; bullets?: string[] }[]`
  - [ ] `skills?: string[]`
  - [ ] `education?: { school: string; degree?: string; year?: string }[]`
  - [ ] `pdfStorageId?: Id<"_storage">`
  - [ ] `updatedAt: number`

### Indexes

- [ ] `projects.slug`
- [ ] `projects.status + deletedAt`
- [ ] `projects.deletedAt`
- [ ] `businesses.slug`
- [ ] `businesses.active + deletedAt`
- [ ] `users.authProviderId`

### Validation rules

- [ ] Slug format enforced (kebab-case)
- [ ] Slug uniqueness enforced (projects + businesses)
- [ ] Required fields enforced (project title/slug/shortDescription, business name/slug/shortDescription)

---

## 5) Auth + RBAC (Admin Only)

### Auth provider integration (Admin app)

- [ ] Add auth provider SDK (Clerk/Auth0)
- [ ] Implement login flow
- [ ] Ensure session available on admin pages

### Convex: user provisioning

- [ ] `upsertMe()` mutation:
  - [ ] requires authenticated identity
  - [ ] reads `ADMIN_AUTH_PROVIDER_ID` env allowlist
  - [ ] upserts `users` row by `authProviderId`
  - [ ] sets role `"admin"` for allowlisted identity only
- [ ] `getMyRole()` query returns `"admin"` or null

### Convex: guard helper

- [ ] Implement `requireAdmin(ctx)`:
  - [ ] asserts authenticated
  - [ ] loads `users` by `authProviderId`
  - [ ] throws Unauthorized if not admin
- [ ] Apply guard to all admin-only queries/mutations

### Admin route gating

- [ ] App-level gate:
  - [ ] unauthenticated => redirect/login screen
  - [ ] authenticated but not admin => Not Authorized page
- [ ] Confirm non-admin cannot access data or mutations (server-side)

---

## 6) Public Portfolio Queries + UI Wiring

### Convex (public)

- [ ] `listPublishedProjects()`
  - [ ] filters: `status="published"`, `deletedAt=null`
  - [ ] sorts: `sortOrder asc (null last)`, then `createdAt desc`
- [ ] `getPublishedProjectBySlug(slug)`
  - [ ] returns null if missing/draft/deleted
- [ ] `listPublishedBusinesses()`
  - [ ] filters: `active=true`, `deletedAt=null`
  - [ ] sorts: `sortOrder asc (null last)`
- [ ] `getResume()`
  - [ ] returns singleton resume doc or null

### Portfolio UI

- [ ] Projects section:
  - [ ] loading state
  - [ ] empty state
  - [ ] grid cards with link to details
- [ ] Project details page:
  - [ ] loading state
  - [ ] null => 404
  - [ ] render title, longDescription, techStack, links, gallery
- [ ] Businesses section:
  - [ ] loading/empty
  - [ ] cards with logo placeholder, name, description, website link
- [ ] Resume section:
  - [ ] loading/empty
  - [ ] condensed preview
  - [ ] modal view full resume
  - [ ] PDF download link when present

---

## 7) Admin Read APIs + Screens

### Convex (admin queries)

- [ ] `listAllProjects()`
- [ ] `getProjectById(id)`
- [ ] `listAllBusinesses()`
- [ ] `getBusinessById(id)`
- [ ] `getResumeAdmin()` (optional if same as getResume but gated)

### Admin UI (read-only first)

- [ ] Projects list page renders table
- [ ] Businesses list page renders table
- [ ] Resume page renders current data

---

## 8) Admin CRUD — Projects (Text-only First)

### Convex mutations (admin)

- [ ] `createProject(input)`
  - [ ] validates required fields
  - [ ] slugify if missing
  - [ ] enforce slug uniqueness
  - [ ] timestamps
  - [ ] default status draft
- [ ] `updateProject(id, patch)`
  - [ ] allowlisted fields only
  - [ ] slug uniqueness when changed
  - [ ] updates updatedAt
- [ ] `publishProject(id)`
- [ ] `unpublishProject(id)`
- [ ] `softDeleteProject(id)`
  - [ ] sets deletedAt timestamp

### Admin UI

- [ ] Projects list:
  - [ ] create button
  - [ ] edit button
  - [ ] publish/unpublish toggle
  - [ ] soft delete action
  - [ ] status badge
  - [ ] toast on actions
- [ ] Project create form:
  - [ ] title
  - [ ] slug (auto; editable)
  - [ ] shortDescription
  - [ ] longDescription
  - [ ] techStack input (comma or chips)
  - [ ] liveUrl, repoUrl
  - [ ] featured
  - [ ] sortOrder
  - [ ] tags
  - [ ] save + redirect
- [ ] Project edit form:
  - [ ] loads existing data
  - [ ] save updates
  - [ ] publish/unpublish accessible
  - [ ] soft delete accessible

### Verification

- [ ] Draft projects never appear on portfolio landing
- [ ] Draft project detail returns 404
- [ ] Deleted projects never appear publicly

---

## 9) Admin CRUD — Businesses (Text-only First)

### Convex mutations (admin)

- [ ] `createBusiness(input)`
  - [ ] validate required fields
  - [ ] slug uniqueness
- [ ] `updateBusiness(id, patch)`
- [ ] `softDeleteBusiness(id)`

### Admin UI

- [ ] Businesses list:
  - [ ] create button
  - [ ] edit button
  - [ ] soft delete action
  - [ ] active toggle (optional mutation or part of update)
- [ ] Business create/edit form fields:
  - [ ] name
  - [ ] slug (auto; editable)
  - [ ] shortDescription
  - [ ] longDescription
  - [ ] websiteUrl
  - [ ] active
  - [ ] featured
  - [ ] sortOrder
  - [ ] tags

### Verification

- [ ] Only `active=true` businesses show on portfolio
- [ ] Deleted businesses never appear publicly

---

## 10) Admin CRUD — Resume (Structured)

### Convex mutations (admin)

- [ ] `updateResume(payload)`
  - [ ] create singleton if missing
  - [ ] update updatedAt

### Admin UI

- [ ] Resume editor fields:
  - [ ] headline
  - [ ] summary
  - [ ] experience list editor (add/remove)
  - [ ] skills list editor
  - [ ] education list editor
  - [ ] save + toast

### Verification

- [ ] Portfolio shows updated content
- [ ] Modal shows full structured resume

---

## 11) File Storage Integration (Convex)

### Shared upload plumbing

- [ ] Convex mutations to generate upload URL(s)
- [ ] Client uploader utility:
  - [ ] selects file
  - [ ] requests upload URL
  - [ ] uploads
  - [ ] returns `storageId`

### Projects: images

- [ ] Mutations:
  - [ ] `generateProjectImageUploadUrl()`
  - [ ] `setProjectCoverImage(projectId, storageId)`
  - [ ] `addProjectGalleryImage(projectId, storageId)`
  - [ ] `removeProjectGalleryImage(projectId, storageId)`
  - [ ] `reorderProjectGalleryImages(projectId, orderedIds)`
- [ ] Admin UI:
  - [ ] cover upload + preview
  - [ ] gallery upload + previews
  - [ ] remove image
  - [ ] reorder gallery (simple up/down ok)
- [ ] Portfolio:
  - [ ] cover image renders on cards/details
  - [ ] gallery renders on details
  - [ ] images lazy load

### Businesses: logos

- [ ] Mutations:
  - [ ] `generateBusinessLogoUploadUrl()`
  - [ ] `setBusinessLogo(businessId, storageId)`
- [ ] Admin UI:
  - [ ] logo upload + preview
- [ ] Portfolio:
  - [ ] logo renders in businesses grid

### Resume: PDF

- [ ] Mutations:
  - [ ] `generateResumePdfUploadUrl()`
  - [ ] `setResumePdf(storageId)`
- [ ] Admin UI:
  - [ ] upload PDF + show current link
- [ ] Portfolio:
  - [ ] “Download PDF” link appears when present

---

## 12) Portfolio Contact Form + Email Sending

### API route (portfolio)

- [ ] Add `/api/contact`
- [ ] Validate:
  - [ ] email required + basic format check
  - [ ] message required
- [ ] Send email via Resend/SendGrid/Postmark
- [ ] Return:
  - [ ] `{ ok: true }` on success
  - [ ] `{ ok: false, error: string }` on failure

### UI

- [ ] Contact form fields:
  - [ ] name (optional)
  - [ ] email (required)
  - [ ] message (required)
- [ ] Submit states:
  - [ ] loading disable
  - [ ] success toast + clear
  - [ ] error toast keep values

### Verification

- [ ] Email arrives reliably
- [ ] Friendly error for provider failure

---

## 13) Error Handling + UX Requirements

- [ ] Global loading patterns standardized
- [ ] Empty states for all lists/sections
- [ ] Toast notifications wired for:
  - [ ] save success
  - [ ] save failure
  - [ ] unauthorized
  - [ ] validation error
- [ ] Friendly “Not Authorized” page in admin
- [ ] Portfolio 404 page for missing/draft projects
- [ ] Console logging only (no external tracking)

---

## 14) Performance + SEO (v1 scope)

### Performance

- [ ] Route-level code splitting confirmed
- [ ] Lazy load images
- [ ] Avoid shipping admin code into portfolio bundle
- [ ] Tailwind purge working across monorepo
- [ ] Basic Lighthouse sanity check

### SEO defaults

- [ ] Default meta tags on portfolio:
  - [ ] title
  - [ ] description
  - [ ] og:title (optional)
  - [ ] og:description (optional)
- [ ] No sitemap automation (confirm not added)

---

## 15) Testing Plan

### Unit tests

- [ ] Slug generation
- [ ] Slug validation
- [ ] Admin guard:
  - [ ] unauthenticated blocked
  - [ ] non-admin blocked
  - [ ] admin allowed
- [ ] Project slug uniqueness enforcement
- [ ] Business slug uniqueness enforcement

### Integration tests

- [ ] Admin Projects CRUD:
  - [ ] create
  - [ ] edit
  - [ ] publish/unpublish
  - [ ] soft delete
- [ ] Admin Businesses CRUD:
  - [ ] create/edit
  - [ ] active toggle
  - [ ] soft delete
- [ ] Upload flows:
  - [ ] project cover
  - [ ] project gallery
  - [ ] business logo
  - [ ] resume pdf
- [ ] Portfolio behavior:
  - [ ] published projects visible
  - [ ] draft project 404
  - [ ] deleted hidden
- [ ] Resume update reflected immediately

### Manual QA checklist

- [ ] Portfolio:
  - [ ] Landing renders all sections
  - [ ] Projects list only published
  - [ ] Project detail works by slug
  - [ ] Draft detail returns 404
  - [ ] Resume modal works
  - [ ] PDF downloads
  - [ ] Businesses render with links
  - [ ] Contact form sends email
  - [ ] Dark mode follows system
- [ ] Admin:
  - [ ] Login required
  - [ ] Non-admin blocked
  - [ ] CRUD works for projects/businesses/resume
  - [ ] Soft delete hides content publicly
  - [ ] Uploads succeed and preview correctly

---

## 16) Vercel Deployment

- [ ] Set Vercel project for monorepo
- [ ] Configure build commands for turbo
- [ ] Configure output for both apps
- [ ] Set env vars:
  - [ ] Convex deployment URL(s)
  - [ ] Auth provider keys
  - [ ] `ADMIN_AUTH_PROVIDER_ID`
  - [ ] Email provider keys (portfolio)
- [ ] Confirm portfolio domain routing
- [ ] Confirm admin route accessible and protected
- [ ] Production smoke test (public + admin)

---

## 17) Explicit Non-Goals (Confirm Not Implemented)

- [ ] No analytics
- [ ] No draft preview mode
- [ ] No multi-admin user management
- [ ] No advanced SEO / structured data
- [ ] No spam protection
- [ ] No environment separation beyond standard env vars
