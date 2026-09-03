# Plan: Printable Resume (replace stored PDF)

Status: awaiting confirmation. Do not write code until the plan owner confirms.

---

## 1. Goal

Pressing "Download" in the portfolio's Background section opens the browser's
native print dialog against a purpose-built, print-only rendering of the Resume
record. The stored-PDF path (`pdfStorageId`) is removed from the schema, the
backend, the admin, and the portfolio.

Decision already made by the owner: **remove the stored PDF entirely**, not keep
it as a fallback.

## 2. Approach and why

The Resume is already fully in Convex and already fully rendered on screen by
`ResumeModal`. The only missing piece is a paper-shaped rendering of it.

Chosen mechanism: **`window.print()` plus a print-only DOM node.** No library, no
new dependency, no backend, no client-side PDF generation. The browser's print
dialog already offers "Save as PDF" on macOS, Windows, iOS, and Android, which is
what "download" means here.

Rejected alternatives, recorded so they are not re-litigated:

| Alternative | Why not |
| --- | --- |
| `jspdf` / `react-pdf` / `html2canvas` | A new dependency and a second layout to maintain, to reproduce what the browser does natively. |
| Print the existing `ResumeModal` markup | The modal is dark-themed, portaled, sticky-headed, and scroll-locked. Making it print correctly means a wall of `!important` overrides, and it only works while the modal is open. |
| A `/resume/print` route | Adds a route, a lazy chunk, and a navigation just to reach markup the Landing page can render inline as `display: none`. |

The print node is rendered once on the Landing page, hidden on screen, revealed
only inside `@media print`. Any button anywhere can then just call
`window.print()` with no state coupling to the modal.

## 3. Files that change

### Create

| File | Purpose |
| --- | --- |
| `apps/portfolio/src/components/ResumeDocument.tsx` | Print-only, light-themed rendering of the whole Resume, plus the exported `printResume()` helper. |

### Modify

| File | Change |
| --- | --- |
| `apps/portfolio/src/index.css` | Add the `@media print` block and the screen-hidden rule for the print node. |
| `apps/portfolio/src/pages/Landing.tsx` | Render `<ResumeDocument resume={resume} />` inside the Background section. |
| `apps/portfolio/src/components/ResumePreview.tsx` | Replace the `pdfUrl` anchor with a print button; drop `useStorageUrl` / `api` imports. |
| `apps/portfolio/src/components/ResumeModal.tsx` | Same replacement in the sticky header; drop `useStorageUrl` / `api` imports. |
| `apps/admin/src/pages/Resume.tsx` | Delete the `PDF` `<Section>`, `handlePdfUpload`, `handleRemovePdf`, `removeResumePdf`, `pdfUrl`, `useUpload`, `useStorageUrl`, `FileUpload`, `FileIndicator`, and `Id` imports if they become unused. |
| `packages/backend/convex/resume.ts` | Remove `pdfStorageId` from `updateResume` args. |
| `packages/backend/convex/storage.ts` | Delete the `removeResumePdf` mutation and its JSDoc. |
| `packages/backend/convex/schema.ts` | Remove `pdfStorageId` from the `resume` table. |

### Explicitly do not touch

- `packages/ui/src/file-upload.tsx` — `FileUpload` / `FileIndicator` are still
  used by `ProjectCreate`, `ProjectEdit`, `BusinessCreate`, `BusinessEdit`.
- `packages/lib/src/use-upload.ts`, `use-storage-url.ts` — still used elsewhere.
- `storage.generateUploadUrl`, `storage.getFileUrl(s)` — still used for images.
- Any other Convex module.

## 4. Execution steps, in order

> **Step 0 is a hard gate. Do not reorder it.** Convex validates existing
> documents against the schema on push. If `pdfStorageId` is removed from
> `schema.ts` while a `resume` document still carries the field, `convex dev` /
> `convex deploy` rejects the push.

### Step 0 — Clear the stored PDF from the live data (manual, owner-run)

Ask the owner to do **one** of these, then confirm before continuing:

- Sign into the admin, open `Resume`, and click **Remove** on the PDF field. This
  runs the existing `removeResumePdf`, which deletes the storage file *and*
  clears the field.
- Or, in the Convex dashboard, run `storage:removeResumePdf` with `{}`.

Then verify the field is gone before touching the schema:

```
npx convex run resume:getPublicResume
```

Expect no `pdfStorageId` key in the output. If the key is present, stop and
report; do not proceed to Step 5.

If the deployment has never had a PDF uploaded, `removeResumePdf` still succeeds
(it no-ops on the storage delete) and this step is trivially satisfied.

### Step 1 — `ResumeDocument.tsx`

New file at `apps/portfolio/src/components/ResumeDocument.tsx`.

Requirements:

- Default export `ResumeDocument`, props `{ resume: Resume }` typed from
  `../types/convex`, matching the existing component convention.
- Also export a named `printResume()` helper:
  ```ts
  export function printResume() {
    const previous = document.title;
    document.title = `${SITE.name} — Resume`;
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }
  ```
  Rationale: browsers use `document.title` as the default filename in the
  Save-as-PDF dialog. Without this the file saves as the page title.
- Root element: `<div id="resume-print">`. The id is the contract with the CSS in
  Step 2. Do not use a class, and do not add `aria-hidden` (the node is already
  `display: none` on screen, so it is out of the accessibility tree).
- Content, in order, each section rendered only when the data exists:
  1. Header: `SITE.name`, `resume.headline`, then a contact line with
     `SITE.contact.email`, `SITE.contact.location`, and
     `SITE.links.github.replace(/^https?:\/\//, "")` — the same three values and
     the same `replace` that `ResumeModal` already uses.
  2. `resume.summary`.
  3. Experience: for each entry, `role`, `company`, `start — end || "present"`,
     then `bullets` as a `<ul>`.
  4. Skills: a single comma-joined line, not chips. Chips are a screen device and
     waste vertical space on paper.
  5. Education: `school`, `degree`, `year`.
- Styling: plain Tailwind utilities with **explicit black-on-white values**
  (`text-black`, `bg-white`, `border-black/20`, etc.), **not** the portfolio's
  semantic tokens (`text-fg`, `bg-ink`, `border-line`). Those tokens are dark and
  would print as dark. Set the serif/sans face explicitly; do not inherit
  `--font-display` (JetBrains Mono) for body copy on paper.
- Add `break-inside-avoid` to each experience and education entry so entries are
  not split across pages.
- No `Reveal`, no animation, no `Chip`, no `CARD`. Nothing from `styles.ts`.

Mark the deliberate simplification with a `ponytail:` comment at the top of the
file, e.g. `// ponytail: print-only duplicate of ResumeModal's content; browser print dialog replaces PDF generation.`

### Step 2 — Print CSS

In `apps/portfolio/src/index.css`, append after the existing `@layer base` block:

```css
#resume-print {
  display: none;
}

@media print {
  #root {
    display: none !important;
  }
  #resume-print {
    display: block !important;
  }
  body {
    background: #fff !important;
    color: #000 !important;
  }
  @page {
    margin: 14mm;
  }
}
```

Notes for the executing agent:

- `#root` is the Vite mount node in `apps/portfolio/index.html`. **Verify the id
  in that file before writing this rule**; if it differs, use the actual id.
- Hiding `#root` also hides any open `ResumeModal`, since the modal portals to
  `document.body`, not into `#root`. That is a problem: the modal is a *sibling*
  of `#root`, so it survives the rule. Add
  `body > *:not(#resume-print) { display: none !important; }` inside the print
  block **instead of** the `#root` rule, and keep `#resume-print` visible. This
  handles the portal and the app root in one rule. Prefer this form.
- Do not add `-webkit-print-color-adjust`. The document is intentionally black on
  white, so there is no background colour to force.

### Step 3 — Landing page

In `apps/portfolio/src/pages/Landing.tsx`, inside the `{resume && ( ... )}`
Background section, after `<ResumeModal ... />`:

```tsx
<ResumeDocument resume={resume} />
```

It renders unconditionally within that guard, no state, no props beyond `resume`.

Also update `SectionHeader`'s `aside="resume.pdf"` on line ~180 to `aside="resume"`.
The old value advertises a stored file that no longer exists.

### Step 4 — Swap the buttons

`ResumePreview.tsx`:

- Delete `const pdfUrl = useStorageUrl(...)` and the `useStorageUrl` and `api`
  imports.
- Replace the `{pdfUrl && (<a href={pdfUrl} …>Download PDF</a>)}` block with an
  unconditional button:
  ```tsx
  <button type="button" onClick={printResume} className={cn(BTN_SECONDARY, "px-[22px] py-3")}>
    Download resume
  </button>
  ```

`ResumeModal.tsx`:

- Same import and `pdfUrl` deletion.
- Replace the `{pdfUrl && (<a … className={cn(BTN_PILL, "hidden sm:inline-flex")}>Download PDF</a>)}`
  block with a `<button type="button" onClick={printResume}>` carrying the same
  classes.

Copy rule: the label is **"Download resume"** in both places. Sentence case, no
`.pdf` extension, per `DESIGN.md` and section 6 of `ubiquitous-language.md`.

### Step 5 — Remove the stored-PDF backend

Only after Step 0 is confirmed.

1. `packages/backend/convex/resume.ts`: delete the
   `pdfStorageId: v.optional(v.id("_storage")),` line from `updateResume` args.
2. `packages/backend/convex/storage.ts`: delete the whole `removeResumePdf`
   export and its JSDoc block (currently ~lines 176-197).
3. `packages/backend/convex/schema.ts`: delete
   `pdfStorageId: v.optional(v.id("_storage")),` from the `resume` table
   (currently line 73).

### Step 6 — Remove the admin PDF UI

In `apps/admin/src/pages/Resume.tsx`:

- Delete the `<Section label="PDF"> … </Section>` block.
- Delete `handlePdfUpload`, `handleRemovePdf`, `const removeResumePdf = …`,
  `const pdfUrl = …`, and the `useUpload` call.
- Remove the now-unused imports: `useUpload`, `useStorageUrl`, `FileUpload`,
  `FileIndicator`, and `Id` — but only if nothing else in the file still uses
  them. Let `pnpm lint` confirm; do not delete an import on assumption.

### Step 7 — Update the vocabulary doc

`ubiquitous-language.md` line ~47 defines the Resume as holding "an optional
PDF", and line ~119 lists `pdfStorageId` under **Storage Id**. Remove both
mentions. This is a required part of the change, not a nice-to-have — the
document is declared authoritative by `CLAUDE.md`.

---

## 5. Assumptions

1. "Download" means the browser's Save-as-PDF flow, not a generated file that
   downloads without a dialog. The print dialog appears; the owner chooses
   Save as PDF or a printer.
2. The Resume record in Convex is the sole source of truth for the printed
   document. Nothing from the old uploaded PDF's design is preserved.
3. The printed document is intentionally black-on-white and plain. It is a
   resume, not a rendering of the dark portfolio design.
4. One-page-ness is not a requirement. The document flows to as many pages as the
   content needs.
5. The site is a client-rendered SPA with no SSR, so `window` is always available
   inside an event handler. No guard is needed.
6. No admin-side print preview is in scope. The admin edits the Resume; the
   portfolio prints it.

## 6. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Schema push rejected because a live `resume` doc still has `pdfStorageId`. | **High** — blocks deploy. | Step 0 gate, verified with `convex run resume:getPublicResume` before Step 5. |
| The stored PDF file is deleted permanently by `removeResumePdf`. There is no restore. | Medium | Tell the owner to download their current PDF from the admin before Step 0 if they want a copy. Flag this explicitly at Step 0. |
| A print rule that hides `body > *` also hides anything else portaled to body — the toast container, for example. | Low | That is the desired behaviour; toasts should not print. Verify no other body-level portal needs to appear on paper. |
| Print output differs across Chrome / Safari / Firefox (margins, page breaks, widow lines). | Medium | Verify in at least Chrome and Safari, per section 7. Keep the layout to plain block flow — no grid, no flex columns — which is where print engines diverge most. |
| Duplicated resume markup: `ResumeModal` and `ResumeDocument` both render the same fields, so a future field addition must be made in two places. | Low, accepted | Deliberate. The two have opposite styling requirements and unifying them means a config-driven renderer, which costs more than the duplication. Recorded as the `ponytail:` comment in Step 1. |
| The print node is in the DOM on every Landing page load, adding markup weight. | Negligible | It is `display: none` text; no images, no queries, no extra network. |

## 7. Acceptance criteria

Public portfolio:

- [ ] The Background section shows **Read full resume** and **Download resume**.
      No "Download PDF" string remains anywhere in `apps/portfolio`.
- [ ] **Download resume** is visible unconditionally — it no longer depends on a
      file existing.
- [ ] Clicking it opens the browser print dialog.
- [ ] The print preview shows only the resume: black text on white, no site nav,
      no footer, no hero, no modal chrome, no toasts, no dark background.
- [ ] The preview contains, when present in the record: name, headline, contact
      line, summary, every experience entry with its bullets, skills, education.
- [ ] No experience or education entry is split across a page boundary.
- [ ] The Save-as-PDF dialog's default filename is `Landon McKell — Resume`.
- [ ] The same button in the open `ResumeModal` behaves identically, and the
      modal itself does not appear in the print output.
- [ ] On screen, at every breakpoint, nothing from `ResumeDocument` is visible
      and page layout is unchanged from before the change.
- [ ] The `Background` section header aside reads `resume`, not `resume.pdf`.

Admin:

- [ ] The Resume page has no PDF section, no upload control, no remove control.
- [ ] Saving the Resume form still works and still round-trips headline, summary,
      skills, experience, and education.

Backend:

- [ ] `pdfStorageId` appears nowhere in `packages/backend`.
- [ ] `storage.removeResumePdf` no longer exists.
- [ ] `convex dev` pushes the schema without a validation error.

Repo:

- [ ] `grep -rni "pdfStorageId" apps packages` returns nothing outside
      `node_modules` and `_generated`.
- [ ] `ubiquitous-language.md` no longer mentions a Resume PDF.

## 8. Verification plan

No test files. Verification is command output plus manual browser checks.

**Static checks** — run from the repo root, all must pass:

```
pnpm lint
pnpm check-types
pnpm build --filter=portfolio
pnpm build --filter=admin
```

**Grep checks**:

```
grep -rni "pdfStorageId" apps packages --include="*.ts" --include="*.tsx" | grep -v node_modules   # expect empty
grep -rn "Download PDF" apps | grep -v node_modules                                                # expect empty
grep -rn "removeResumePdf" apps packages | grep -v node_modules                                    # expect empty
```

**Backend check**:

```
npx convex dev --once     # must push the schema without a validation error
npx convex run resume:getPublicResume   # no pdfStorageId key in the result
```

**Manual, portfolio (`pnpm dev --filter=portfolio`)**:

1. Scroll to Background. Confirm two buttons, correct labels.
2. Click **Download resume**. In the print preview, walk every item in the
   Acceptance Criteria print list above.
3. Cancel the dialog. Confirm the page is unchanged and still scrollable — no
   leftover `overflow: hidden` on `body`.
4. Open **Read full resume**, click **Download resume** inside the modal, confirm
   the identical preview with no modal chrome. Cancel, confirm the modal is still
   open and closes normally.
5. Repeat step 2 in Safari and in Chrome. Note any divergence in the report.
6. Toggle a mobile viewport in devtools; confirm no stray whitespace or visible
   resume text at the bottom of the page.

**Manual, admin (`pnpm dev --filter=admin`)**:

1. Open Resume. Confirm no PDF section.
2. Edit the headline, save, confirm the success toast.
3. Reload the portfolio, confirm the new headline appears both on screen and in
   the print preview.

**Report back**: paste the actual output of the four static commands and the
three greps. Do not claim completion without them.

---

## 9. Out of scope

- Any change to Projects or Businesses.
- Any change to the contact flow.
- A dedicated `/resume` route or a shareable resume URL.
- Server-side PDF generation.
- Tests.
- The unrelated drift items listed in `ubiquitous-language.md` section 7.
