# Prarit's Canvas CMS

Standalone React + Vite portfolio/CMS project backed by Supabase.

This repo does not need Lovable to run. You can develop, build, and deploy it directly from this codebase.

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- React Query

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SITE_URL`
- `VITE_SITE_TITLE`
- `VITE_SITE_DESCRIPTION`
- `VITE_OG_IMAGE_URL`

## 3. Run locally

```bash
npm run dev
```

Default dev server:

- `http://localhost:8080`

## 4. Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Supabase setup

This project expects:

- a Supabase project
- the SQL migrations inside `supabase/migrations`
- storage buckets used by the app:
  - `portfolio-assets`
  - `project-images`

The frontend uses the public anon key only. Admin access is controlled by Supabase Auth + the `admin_roles` table + the `is_admin()` SQL function.

## Deploy anywhere

This is a static Vite app. You can deploy `dist/` to:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- any VPS + Nginx

Make sure the same `VITE_*` env vars are configured in your deployment platform before building.

## Notes

- The repo still contains `.lovable/plan.md`, but it is not required for runtime.
- Domain-specific SEO files like `public/robots.txt` and `public/sitemap.xml` still reference the current production domain and should be updated if the domain changes.
