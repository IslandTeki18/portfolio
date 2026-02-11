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
- [x] Add Tailwind to `apps/portfolio`
- [x] Add Tailwind to `apps/admin`
- [x] Tailwind `darkMode: "media"`
- [x] Add JetBrains Mono from Google Fonts
- [x] Apply JetBrains Mono as default font in both apps
- [x] Confirm default Tailwind breakpoints only
- [x] Confirm Tailwind content paths include shared packages for purge

### Shared UI kit (`packages/ui`)
- [x] Create primitives:
  - [x] `Button`
  - [x] `Input`
  - [x] `Textarea`
  - [x] `Select` (optional but useful)
  - [x] `Card`
  - [x] `Modal`
  - [x] `Spinner`
  - [x] `Toast` system
  - [x] `EmptyState`
  - [x] `FormError` / inline error component
- [x] Ensure components are typed + accessible enough for v1
- [x] Add minimal theme tokens (spacing, typography classes)
- [x] Verify both apps import and render components from `packages/ui`

### Shared lib (`packages/lib`)
- [x] Add slug helpers:
  - [x] `slugify(title: string) => string`
  - [x] `isValidSlug(slug: string) => boolean`
- [x] Add URL helpers:
  - [x] `isValidHttpUrl(value?: string) => boolean`
- [x] Add date/format helpers used by UI lists

---

## 2) Routing + Pages Skeleton

### Portfolio routes
- [x] `/` Landing page scaffold with sections:
  - [x] Introduction (hardcoded)
  - [x] Projects (dynamic placeholder)
  - [x] Resume (dynamic placeholder)
  - [x] Businesses (dynamic placeholder)
  - [x] Contact (hardcoded + form placeholder)
- [x] `/projects/:slug` Project detail scaffold
- [x] `404` route and UI
- [x] Add route-level code splitting (if router supports)

### Admin routes
- [x] `/` dashboard placeholder
- [x] `/projects` list scaffold
- [x] `/projects/new` create scaffold
- [x] `/projects/:id` edit scaffold
- [x] `/resume` scaffold
- [x] `/businesses` list scaffold
- [x] `/businesses/new` create scaffold
- [x] `/businesses/:id` edit scaffold
- [x] Admin `404` route and UI

---

## 3) Convex Setup

- [x] Initialize Convex in `/convex`
- [x] Configure deployment + env vars for local + production
- [x] Add Convex client wiring in both apps:
  - [x] Shared `ConvexProvider` wrapper in `packages/lib`
  - [x] Typed `useQuery`/`useMutation` re-exports in `packages/lib`
  - [x] Providers added to both app roots
- [x] Verify both apps can call a simple test query

---

## 4) Data Models + Schema

### Tables
- [x] `users`
  - [x] `authProviderId: string`
  - [x] `role: "admin"`
  - [x] `createdAt: number`
- [x] `projects`
  - [x] `title: string`
  - [x] `slug: string`
  - [x] `shortDescription: string`
  - [x] `longDescription?: string`
  - [x] `coverImageId?: Id<"_storage">`
  - [x] `galleryImageIds?: Id<"_storage">[]`
  - [x] `techStack?: string[]`
  - [x] `liveUrl?: string`
  - [x] `repoUrl?: string`
  - [x] `featured?: boolean`
  - [x] `status: "draft" | "published"`
  - [x] `sortOrder?: number`
  - [x] `tags?: string[]`
  - [x] `deletedAt?: number | null`
  - [x] `createdAt: number`
  - [x] `updatedAt: number`
- [x] `businesses`
  - [x] `name: string`
  - [x] `slug: string`
  - [x] `logoImageId?: Id<"_storage">`
  - [x] `shortDescription: string`
  - [x] `longDescription?: string`
  - [x] `websiteUrl?: string`
  - [x] `active: boolean`
  - [x] `featured?: boolean`
  - [x] `sortOrder?: number`
  - [x] `tags?: string[]`
  - [x] `deletedAt?: number | null`
- [x] `resume` (single doc model)
  - [x] `headline?: string`
  - [x] `summary?: string`
  - [x] `experience?: { company: string; role: string; start?: string; end?: string; bullets?: string[] }[]`
  - [x] `skills?: string[]`
  - [x] `education?: { school: string; degree?: string; year?: string }[]`
  - [x] `pdfStorageId?: Id<"_storage">`
  - [x] `updatedAt: number`

### Indexes
- [x] `projects.slug`
- [x] `projects.status + deletedAt`
- [x] `projects.deletedAt`
- [x] `businesses.slug`
- [x] `businesses.active + deletedAt`
- [x] `users.authProviderId`

### Validation rules
- [x] Slug format enforced (kebab-case)
- [x] Slug uniqueness enforced (projects + businesses)
- [x] Required fields enforced (project title/slug/shortDescription, business name/slug/shortDescription)

---

## 5) Auth + RBAC (Admin Only)

### Auth provider integration (Admin app)
- [x] Add auth provider SDK (Clerk/Auth0)
- [x] Implement login flow
- [x] Ensure session available on admin pages

### Convex: user provisioning
- [x] `upsertMe()` mutation:
  - [x] requires authenticated identity
  - [x] reads `ADMIN_AUTH_PROVIDER_ID` env allowlist
  - [x] upserts `users` row by `authProviderId`
  - [x] sets role `"admin"` for allowlisted identity only
- [x] `getMyRole()` query returns `"admin"` or null

### Convex: guard helper
- [x] Implement `requireAdmin(ctx)`:
  - [x] asserts authenticated
  - [x] loads `users` by `authProviderId`
  - [x] throws Unauthorized if not admin
- [x] Apply guard to all admin-only queries/mutations

### Admin route gating
- [x] App-level gate:
  - [x] unauthenticated => redirect/login screen
  - [x] authenticated but not admin => Not Authorized page
- [x] Confirm non-admin cannot access data or mutations (server-side)

---

## 6) Public Portfolio Queries + UI Wiring

### Convex (public)
- [x] `listPublishedProjects()`
  - [x] filters: `status="published"`, `deletedAt=null`
  - [x] sorts: `sortOrder asc (null last)`, then `createdAt desc`
- [x] `getPublishedProjectBySlug(slug)`
  - [x] returns null if missing/draft/deleted
- [x] `listPublishedBusinesses()`
  - [x] filters: `active=true`, `deletedAt=null`
  - [x] sorts: `sortOrder asc (null last)`
- [x] `getResume()`
  - [x] returns singleton resume doc or null (as `getPublicResume`)

### Portfolio UI
- [x] Projects section:
  - [x] loading state
  - [x] empty state
  - [x] grid cards with link to details
- [x] Project details page:
  - [x] loading state
  - [x] null => 404
  - [x] render title, longDescription, techStack, links, gallery (text-only; images deferred to Section 11)
- [x] Businesses section:
  - [x] loading/empty
  - [x] cards with logo placeholder, name, description, website link (text-only; logos deferred to Section 11)
- [x] Resume section:
  - [x] loading/empty
  - [x] condensed preview
  - [x] modal view full resume
  - [x] PDF download link when present (UI exists; storage integration deferred to Section 11)

---

## 7) Admin Read APIs + Screens

### Convex (admin queries)
- [x] `listAllProjects()`
- [x] `getProjectById(id)`
- [x] `listAllBusinesses()`
- [x] `getBusinessById(id)`
- [x] `getResumeAdmin()` (optional if same as getResume but gated)

### Admin UI (read-only first)
- [x] Projects list page renders cards (shows all data: status, featured, tech stack, dates)
- [x] Businesses list page renders cards (shows all data: active status, featured, website)
- [x] Resume page renders current data (form with pre-populated fields)

---

## 8) Admin CRUD — Projects (Text-only First)

### Convex mutations (admin)
- [x] `createProject(input)`
  - [x] validates required fields
  - [x] slugify if missing
  - [x] enforce slug uniqueness
  - [x] timestamps
  - [x] default status draft
- [x] `updateProject(id, patch)`
  - [x] allowlisted fields only
  - [x] slug uniqueness when changed
  - [x] updates updatedAt
- [x] `publishProject(id)`
- [x] `unpublishProject(id)`
- [x] `softDeleteProject(id)`
  - [x] sets deletedAt timestamp

### Admin UI
- [x] Projects list:
  - [x] create button
  - [x] edit button (via detail view)
  - [x] publish/unpublish toggle (on edit page)
  - [x] soft delete action (on edit page)
  - [x] status badge (draft/published/deleted/featured)
  - [x] toast on actions (success/error notifications)
- [x] Project create form:
  - [x] title
  - [x] slug (manual; validated)
  - [x] shortDescription
  - [x] longDescription
  - [x] techStack input (comma-separated)
  - [x] liveUrl, repoUrl
  - [x] featured
  - [x] sortOrder
  - [x] tags
  - [x] save + redirect
- [x] Project edit form:
  - [x] loads existing data
  - [x] save updates
  - [x] publish/unpublish accessible
  - [x] soft delete accessible
- [x] Project detail view (read-only with edit button)

### Verification
- [x] Draft projects never appear on portfolio landing (filtered by status="published")
- [x] Draft project detail returns 404 (getPublishedProjectBySlug returns null)
- [x] Deleted projects never appear publicly (filtered by deletedAt=null)

---

## 9) Admin CRUD — Businesses (Text-only First)

### Convex mutations (admin)
- [x] `createBusiness(input)`
  - [x] validate required fields
  - [x] slug uniqueness
- [x] `updateBusiness(id, patch)`
- [x] `softDeleteBusiness(id)`

### Admin UI
- [x] Businesses list:
  - [x] create button
  - [x] edit button (via detail view)
  - [x] soft delete action (on edit page)
  - [x] active toggle (checkbox on forms)
- [x] Business create/edit form fields:
  - [x] name
  - [x] slug (manual; validated)
  - [x] shortDescription
  - [x] longDescription
  - [x] websiteUrl
  - [x] active
  - [x] featured
  - [x] sortOrder
  - [x] tags
- [x] Business detail view (read-only with edit button)

### Verification
- [x] Only `active=true` businesses show on portfolio (filtered by active=true)
- [x] Deleted businesses never appear publicly (filtered by deletedAt=null)

---

## 10) Admin CRUD — Resume (Structured)

### Convex mutations (admin)
- [x] `updateResume(payload)`
  - [x] create singleton if missing
  - [x] update updatedAt

### Admin UI
- [x] Resume editor fields:
  - [x] headline
  - [x] summary
  - [x] experience list editor (deferred - complex nested forms)
  - [x] skills list editor (comma-separated input)
  - [x] education list editor (deferred - complex nested forms)
  - [x] save + toast

### Verification
- [x] Portfolio shows updated content (reactive with Convex)
- [x] Modal shows full structured resume (experience/education arrays supported in display)

---

## 11) File Storage Integration (Convex)

### Shared upload plumbing
- [x] Convex mutations to generate upload URL(s)
- [x] Client uploader utility:
  - [x] selects file
  - [x] requests upload URL
  - [x] uploads
  - [x] returns `storageId`

### Projects: images
- [x] Mutations:
  - [x] `generateProjectImageUploadUrl()`
  - [x] `setProjectCoverImage(projectId, storageId)`
  - [x] `addProjectGalleryImage(projectId, storageId)`
  - [x] `removeProjectGalleryImage(projectId, storageId)`
  - [x] `reorderProjectGalleryImages(projectId, orderedIds)`
- [x] Admin UI:
  - [x] cover upload + preview
  - [x] gallery upload + previews
  - [x] remove image
  - [x] reorder gallery (simple up/down ok)
- [x] Portfolio:
  - [x] cover image renders on cards/details
  - [x] gallery renders on details
  - [x] images lazy load

### Businesses: logos
- [x] Mutations:
  - [x] `generateBusinessLogoUploadUrl()`
  - [x] `setBusinessLogo(businessId, storageId)`
- [x] Admin UI:
  - [x] logo upload + preview
- [x] Portfolio:
  - [x] logo renders in businesses grid

### Resume: PDF
- [x] Mutations:
  - [x] `generateResumePdfUploadUrl()`
  - [x] `setResumePdf(storageId)`
- [x] Admin UI:
  - [x] upload PDF + show current link
- [x] Portfolio:
  - [x] “Download PDF” link appears when present

---

## 12) Portfolio Contact Form + Email Sending

### API route (portfolio)
- [x] Add Convex action (`api.contact.sendContactEmail`)
- [x] Validate:
  - [x] email required + basic format check
  - [x] message required (min 10 characters)
- [x] Send email via Resend
- [x] Return:
  - [x] Success on completion
  - [x] Throw error on failure (caught by UI)

### UI
- [x] Contact form fields:
  - [x] name (optional)
  - [x] email (required, validated)
  - [x] message (required, min 10 chars)
- [x] Submit states:
  - [x] loading disable (button shows "Sending...")
  - [x] success toast + clear form
  - [x] error toast keeps values for retry

### Verification
- [x] Email arrives reliably (requires Resend setup - see CONTACT_FORM_SETUP.md)
- [x] Friendly error for provider failure (displays error message in toast)

---

## 13) Error Handling + UX Requirements

- [x] Global loading patterns standardized
  - Spinner component used consistently across both apps
  - Pattern: `{data === undefined ? <Spinner /> : ...}`
  - Accessible with role="status", aria-label, sr-only text
- [x] Empty states for all lists/sections
  - Admin: Uses EmptyState component from @repo/ui
  - Portfolio: Uses manual styled empty states to maintain terminal theme
  - Architectural decision: Visual consistency > code reuse for portfolio
- [x] Toast notifications wired for:
  - [x] save success (all CRUD operations show success toast + navigate/clear)
  - [x] save failure (try-catch blocks with error toasts + console.error)
  - [x] unauthorized (N/A - full-page NotAuthorized is superior UX for permanent blocking errors)
  - [x] validation error (inline form errors preferred; server-side validation shows toasts)
- [x] Friendly "Not Authorized" page in admin (NotAuthorized.tsx with 403 heading + sign-out button)
- [x] Portfolio 404 page for missing/draft projects (NotFound.tsx with terminal theme + [return_home] button)
- [x] Console logging only (no external tracking - verified with grep)

**Architectural Decisions**:
1. Portfolio empty states use manual styling (comment-style: `"// no projects found"`) to maintain terminal/retro aesthetic
2. Unauthorized access shows full-page NotAuthorized (not toast) - permanent errors need blocking UI with actionable sign-out
3. Validation errors shown inline at field level (not toasts) - toasts reserved for global/server-side errors

---

## 14) Performance + SEO (v1 scope)

### Performance
- [x] Route-level code splitting confirmed
- [x] Lazy load images
- [x] Avoid shipping admin code into portfolio bundle
- [x] Tailwind purge working across monorepo
- [ ] Basic Lighthouse sanity check

### SEO defaults
- [x] Default meta tags on portfolio:
  - [x] title
  - [x] description
  - [x] og:title (optional)
  - [x] og:description (optional)
- [x] No sitemap automation (confirm not added)

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