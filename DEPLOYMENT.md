# Deployment Guide

This guide covers deploying the Portfolio monorepo to Vercel.

## Prerequisites

- Vercel account
- GitHub repository connected to Vercel
- Convex backend deployed (`npx convex deploy`)
- pnpm installed locally (for CLI deployments)

## Environment Variables

### Portfolio App (`apps/portfolio/`)

Required environment variables:

- `VITE_CONVEX_URL`: Your Convex deployment URL
  - Format: `https://<deployment-name>.convex.cloud`
  - Get from Convex dashboard or `npx convex dev`

### Admin App (`apps/admin/`)

Required environment variables:

- `VITE_CONVEX_URL`: Same Convex deployment URL
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk authentication key
  - Format: `pk_test_...` (test) or `pk_live_...` (production)
  - Get from Clerk dashboard

## Vercel Configuration

### Portfolio Project

1. **Root Directory**: `apps/portfolio`
2. **Framework Preset**: Other
3. **Node Version**: 18.x or higher
4. **Build Settings**:
   - Build Command: `cd ../.. && pnpm build --filter=portfolio`
   - Output Directory: `apps/portfolio/dist`
   - Install Command: `cd ../.. && pnpm install --frozen-lockfile`

### Admin Project

1. **Root Directory**: `apps/admin`
2. **Framework Preset**: Other
3. **Node Version**: 18.x or higher
4. **Build Settings**:
   - Build Command: `cd ../.. && pnpm build --filter=admin`
   - Output Directory: `apps/admin/dist`
   - Install Command: `cd ../.. && pnpm install --frozen-lockfile`

## Important: Convex Generated Files

**Critical for Vercel builds**: The `_generated` directory must be committed to git.

```bash
# Already done - _generated is no longer gitignored
git add packages/backend/convex/_generated/
git commit -m "Add Convex generated files for Vercel deployment"
```

Without the generated files, TypeScript will fail to find `@backend/_generated/api` during build.

## Local Deployment Testing

### 1. Verify Build

```bash
# From monorepo root
pnpm build --filter=portfolio

# Verify output
ls -la apps/portfolio/dist/
# Should contain: index.html, assets/, vite.svg
```

### 2. Preview Build

```bash
cd apps/portfolio
pnpm preview
# Opens http://localhost:4173
```

### 3. Test Routes

- Homepage: `/`
- Projects: `/projects`
- Project Detail: `/projects/:slug`
- Business Detail: `/businesses/:slug`
- Resume: `/resume`
- Contact: `/contact`
- 404: Any invalid route

## Vercel CLI Deployment

### Installation

```bash
npm i -g vercel
```

### Portfolio Deployment

```bash
# Navigate to portfolio app
cd apps/portfolio

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Admin Deployment

```bash
# Navigate to admin app
cd apps/admin

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Git Integration

### Automatic Deployments

1. Connect GitHub repository to Vercel project
2. **Production Branch**: `main`
3. **Preview Branches**: All branches
4. Vercel auto-deploys on:
   - Push to `main` → Production deployment
   - Pull request → Preview deployment

### Deployment Triggers

- Push to `main` branch
- Merge pull request
- Manual deployment via Vercel dashboard

## Turborepo Remote Caching

Enable Vercel's Remote Caching for faster builds:

```bash
# From monorepo root
npx turbo login
npx turbo link
```

Add to Vercel environment variables:

- `TURBO_TOKEN`: Auto-generated from `turbo login`
- `TURBO_TEAM`: Your Vercel team slug

## Troubleshooting

### Build Fails: "Cannot find module '@backend/_generated/api'"

**Cause**: Convex generated files not committed to git

**Solution**:
1. Verify `_generated` is NOT in `.gitignore`
2. Commit the generated files: `git add packages/backend/convex/_generated/`
3. Push to repository

### Build Fails: "Cannot find module '@repo/ui'"

**Cause**: Vercel didn't install monorepo dependencies correctly

**Solution**:
1. Verify `installCommand` in vercel.json uses `cd ../.. && pnpm install`
2. Check Root Directory is set to `apps/portfolio` (not root)
3. Ensure `pnpm-lock.yaml` is committed to git

### Environment Variables Not Available

**Cause**: Vite only exposes variables prefixed with `VITE_`

**Solution**:
1. Ensure all variables start with `VITE_` prefix
2. Add variables to correct environment (Production/Preview/Development)
3. Rebuild after adding variables (Vercel caches builds)

### 404 Errors on Client-Side Routes

**Cause**: Missing SPA fallback configuration

**Solution**:
1. Verify `rewrites` section exists in vercel.json
2. Ensure `"source": "/(.*)"` rewrites to `"/index.html"`
3. Check `cleanUrls: true` is set

### Slow Builds

**Cause**: Turborepo not using remote caching

**Solution**:
1. Run `npx turbo login` and `npx turbo link`
2. Add `TURBO_TOKEN` and `TURBO_TEAM` to Vercel environment variables
3. Verify `.turbo/` is in `.gitignore` (should be)

## Deployment Checklist

### Pre-Deployment

- [x] Create vercel.json configuration files
- [x] Commit `_generated` directory to git
- [ ] Deploy Convex backend: `npx convex deploy`
- [ ] Verify local build: `pnpm build --filter=portfolio`
- [ ] Verify local preview: `cd apps/portfolio && pnpm preview`

### Vercel Dashboard

- [ ] Set Root Directory to `apps/portfolio` or `apps/admin`
- [ ] Set Framework Preset to "Other"
- [ ] Add `VITE_CONVEX_URL` (Production)
- [ ] Add `VITE_CONVEX_URL` (Preview)
- [ ] Add `VITE_CLERK_PUBLISHABLE_KEY` (Admin only)
- [ ] Verify Node.js version is 18.x or higher
- [ ] Verify pnpm is detected as package manager

### First Deployment

- [ ] Deploy via Vercel CLI: `vercel` (preview)
- [ ] Test preview deployment URL
- [ ] Verify environment variables work
- [ ] Deploy to production: `vercel --prod`
- [ ] Test production deployment URL

### Git Integration

- [ ] Connect GitHub repository to Vercel project
- [ ] Set production branch to `main`
- [ ] Enable automatic deployments
- [ ] Test push to main triggers production deployment
- [ ] Test pull request triggers preview deployment

### Post-Deployment

- [ ] Test all routes on production
- [ ] Verify Convex data loads
- [ ] Check browser console for errors
- [ ] Test contact form submission
- [ ] Verify 404 page for invalid routes

## Custom Domain (Optional)

1. Add custom domain in Vercel dashboard
2. Update DNS records as instructed
3. Wait for SSL certificate provisioning
4. Verify HTTPS works

## Monitoring

- **Vercel Analytics**: Built-in, enable in dashboard
- **Core Web Vitals**: Monitor in Vercel dashboard
- **Build Times**: Check Turborepo cache effectiveness
- **Error Tracking**: Review deployment logs in Vercel

## Next Steps

1. **Convex Production Deployment**: `npx convex deploy`
2. **Update Environment Variables**: Use production Convex URL
3. **Admin Deployment**: Follow same process for `apps/admin/`
4. **Clerk Production Keys**: Update `VITE_CLERK_PUBLISHABLE_KEY`

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Convex + Vercel Guide](https://docs.convex.dev/production/hosting/vercel)
- [Turborepo Deployment Guide](https://turborepo.dev/docs/handbook/deploying-with-docker)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/production)
