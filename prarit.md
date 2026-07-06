# Prarit Sidana — Portfolio Website: Full Project Reference

> **Read this first.** This single file explains everything about this project: what it is,
> what it does, why it exists, how it is built, where it is hosted, how to change content,
> how to deploy code, and every command needed to operate it. It is written so a new person
> — or a new AI agent — can pick up the project with zero prior context.

**Live site:** https://praritsidana.com
**GitHub repo:** https://github.com/prarit0097/Prarit-Portfolio
**Owner:** Prarit Sidana — AI Engineer & Full-Stack Developer (Delhi, India)

---

## Table of contents
1. [What this project is](#1-what-this-project-is)
2. [Why it was needed](#2-why-it-was-needed)
3. [History / how we got here](#3-history--how-we-got-here)
4. [Tech stack](#4-tech-stack)
5. [Architecture (how it works)](#5-architecture-how-it-works)
6. [The database (Supabase)](#6-the-database-supabase)
7. [Admin panel — how to change content](#7-admin-panel--how-to-change-content)
8. [Hosting & DNS (the full path from browser to server)](#8-hosting--dns)
9. [How to deploy code changes](#9-how-to-deploy-code-changes)
10. [VPS command reference](#10-vps-command-reference)
11. [Secrets & credentials (where they live)](#11-secrets--credentials)
12. [Pros & cons of this setup](#12-pros--cons-of-this-setup)
13. [Known issues & gotchas](#13-known-issues--gotchas)
14. [Project structure](#14-project-structure)
15. [Quick-start for a new developer / agent](#15-quick-start)

---

## 1. What this project is

A **personal portfolio website with a full self-hosted CMS (content management system)**.

- The **public site** shows Prarit's profile, skills, experience, projects, and a blog. It is a
  single-page React app.
- The **admin panel** (at `/admin`) lets the owner edit every piece of content — profile, skills,
  experience, projects, testimonials, services, blog posts, and site settings — without touching code.
- All content lives in a **cloud database (Supabase)**, so the public site renders whatever is in the
  database. Change content in the admin panel → it updates live on the site.

In short: **a code-free-editable portfolio.** The developer ships the design once; the owner manages
content forever through a friendly dashboard.

---

## 2. Why it was needed

- Prarit needed a **professional portfolio** to present himself as an **AI Engineer & Full-Stack
  Developer** (not just a static resume) to recruiters and clients, with links to live products and
  GitHub repos.
- It had to be **self-editable** — add a project, update the resume, change the tagline — without a
  developer or a redeploy each time. That is why it is backed by a CMS/database rather than being a
  plain static site.
- It had to be **owned and controlled** by Prarit on his own infrastructure (his VPS), not locked
  inside a third-party builder.

---

## 3. History / how we got here

This project has moved through a few stages. Understanding this prevents confusion.

1. **Built on Lovable.** The site was originally generated with [Lovable](https://lovable.dev)
   (an AI app builder). All early git commits are from `gpt-engineer-app[bot]`. Lovable hosted it and
   connected the custom domain to Lovable's servers (behind Cloudflare).
2. **Old GitHub repo deleted.** The original repo (`prarits-canvas-cms`) was accidentally deleted.
3. **New repo created.** Code was pushed to a fresh repo: **https://github.com/prarit0097/Prarit-Portfolio**.
4. **Migrated off Lovable + Cloudflare onto Prarit's own VPS.** The domain's DNS (managed at **GoDaddy**)
   was pointed straight at the VPS, a Let's Encrypt SSL certificate was installed on the VPS, and the
   built site is now served directly by the VPS's nginx. Lovable and Cloudflare are no longer in the path.
5. **Content rewritten from the real resume.** Profile, skills (6 categories), experience (3 roles),
   and projects (7) were updated to match Prarit's actual resume and reposition the site as an
   **AI Engineer** portfolio.
6. **Performance & polish.** nginx gzip + long-term asset caching were enabled; a resume-PDF upload was
   added to the admin; the projects section was redesigned into a responsive grid; the contact form and
   SPA routing were fixed.

> **Key takeaway:** the site is now **fully self-hosted on the VPS**. The content data still lives in
> **Supabase cloud** (not on the VPS). These are two separate things — see the architecture section.

---

## 4. Tech stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui (component library)
- framer-motion (animations)
- TanStack React Query (data fetching/caching)
- react-router-dom (routing)
- vite-plugin-pwa (installable Progressive Web App)

**Backend / data**
- Supabase (hosted PostgreSQL database + Auth + file Storage)
- Row-Level Security (RLS) in Postgres for authorization

**Hosting**
- Ubuntu 24.04 VPS (Hostinger), nginx web server, Let's Encrypt SSL
- Domain DNS at GoDaddy

There is **no custom backend server** for the portfolio — the React app talks directly to Supabase.
The VPS only serves the static built files (HTML/CSS/JS).

---

## 5. Architecture (how it works)

```
                 ┌─────────────────────────────────────────────┐
   Browser  ───► │  praritsidana.com  (nginx on the VPS)         │
                 │  serves static files from /var/www/html       │
                 └───────────────┬─────────────────────────────┘
                                 │  (the React app runs in the browser)
                                 ▼
                 ┌─────────────────────────────────────────────┐
                 │  Supabase cloud (atbmizothalsxuxqgpgd)        │
                 │  • PostgreSQL database (all content)          │
                 │  • Auth (admin login)                         │
                 │  • Storage (profile photo, resume PDF, images)│
                 └─────────────────────────────────────────────┘
```

- The VPS serves a **static bundle** (the compiled React app). It contains no content — just the app.
- When the app loads in the browser, it **fetches content from Supabase** (projects, skills, profile, etc.).
- The admin panel **writes** to Supabase (protected by login + database RLS rules).
- So: **design/code = on the VPS. Content/data = in Supabase cloud.** To change how the site *looks*,
  you edit code and redeploy to the VPS. To change what the site *says*, you edit content in the admin
  panel (no redeploy needed).

---

## 6. The database (Supabase)

- **Project ref:** `atbmizothalsxuxqgpgd`
- **URL:** `https://atbmizothalsxuxqgpgd.supabase.co`
- **Dashboard:** https://supabase.com/dashboard (log in with the owner's Supabase account)
- The frontend uses only the **public anon key** (safe to expose; it is in the browser bundle by
  design). All real protection comes from **Row-Level Security** policies in Postgres.

**Main tables**
| Table | Purpose |
|---|---|
| `profile_settings` | Name, tagline, about, contact, social links, profile photo & resume URLs (single row) |
| `site_settings` | Site title/description, theme color, SEO fields |
| `skill_categories` + `skills` | Skills grouped by category, each skill has a % level |
| `experiences` | Work history (role, company, dates, achievements) |
| `projects` + `project_images` | Portfolio projects and their gallery images |
| `services` | Services offered (section can be hidden) |
| `testimonials` | Client/colleague quotes (section can be hidden) |
| `blog_posts` | Blog articles (draft/published) |
| `enquiries` | Contact-form submissions |
| `section_settings` | Which homepage sections are visible/ordered |
| `admin_roles` | Which users are admins (drives the `is_admin()` check) |

**Auth model**
- Admin login is Supabase Auth. Only users listed in `admin_roles` (role `admin`) can write.
- Every write is enforced server-side by the Postgres function `is_admin()` + RLS. The client-side
  login screen is just UX; the real gate is in the database.

**Storage buckets**
- `portfolio-assets` — profile photos, **resume PDF** (10 MB limit, allows images + PDF)
- `project-images` — project cover/gallery images

---

## 7. Admin panel — how to change content

1. Go to **https://praritsidana.com/admin/login**
2. Log in with the **admin email** (`1995praritsidana@gmail.com`) and password (owner knows it;
   resettable at `/admin/forgot-password`).
3. Use the sidebar to edit any section:
   - **Profile** — name, tagline, about, contact, social links, **profile photo upload**, **resume PDF upload**
   - **Skills, Experience, Projects, Services, Testimonials, Blog Posts** — full add/edit/delete
   - **Sections** — toggle which homepage sections show and their order
   - **Enquiries** — read contact-form messages
   - **Site Settings** — SEO title/description, theme color
4. **Always click "Save Changes"** after editing. Uploaded files (photo/resume) are stored immediately,
   but the link is only attached to your profile when you save.

> No code or deploy is needed for content changes — they appear on the live site after a refresh.

---

## 8. Hosting & DNS

**The full path from a visitor to the content:**

```
Visitor ─► DNS lookup (GoDaddy) ─► 187.127.132.106 (the VPS)
        ─► nginx (SSL via Let's Encrypt) ─► static files in /var/www/html
        ─► React app loads in browser ─► fetches content from Supabase cloud
```

- **VPS:** Hostinger, Ubuntu 24.04, IP `187.127.132.106`, hostname `srv1505725`.
  Also runs other apps (Postzyo, Nirogidhara, SeeStox, JSLL, RIIMS, Rezoom) — **do not disturb those.**
- **Domain:** `praritsidana.com`. DNS is managed at **GoDaddy** (nameservers `ns09/ns10.domaincontrol.com`).
  The `@` and `www` A-records both point to `187.127.132.106`.
- **SSL:** Let's Encrypt certificate for `praritsidana.com` + `www`, issued and auto-renewed by
  `certbot` on the VPS.
- **Web server config:** `/etc/nginx/sites-enabled/praritsidana.com`
  - Web root (where files live): **`/var/www/html`**
  - SPA fallback: `try_files $uri $uri/ /index.html;` (so client-side routes like `/blog` work on refresh)
  - Keep the `automation_media/` subfolder inside the web root — it belongs to another feature.
- **Performance config:** `/etc/nginx/conf.d/performance.conf` — enables gzip for JS/CSS/SVG/JSON
  (this is **global**, so it benefits all sites on the VPS). Long-term caching for `/assets/` is set
  in the site config.

---

## 9. How to deploy code changes

Code changes (design, features) require a rebuild + upload to the VPS. Content changes do **not** —
those are done in the admin panel.

**On your local machine (Windows PowerShell):**

```powershell
cd "D:\Prarit portfolio website"

# 1. Install dependencies (first time only)
npm install

# 2. Build the production bundle (needs a .env file — see Secrets section)
npm run build

# 3. Upload the built files to the VPS web root
scp -r dist/* root@187.127.132.106:/var/www/html/
```

**Then:** open `https://praritsidana.com` and **hard-refresh** (`Ctrl+Shift+R`).
Because this is a PWA, the service worker may serve a cached old version first — hard refresh once or
twice, or clear site data in DevTools (Application → Clear site data) if needed.

**Also push the source to GitHub** so history is backed up:
```powershell
git add -A
git commit -m "your message"
git push origin main
```

**Local dev server (to preview changes before deploying):**
```powershell
npm run dev      # opens http://localhost:8080
```

---

## 10. VPS command reference

SSH in first (from your local terminal). Commands prefixed with `#` are comments.

```bash
ssh root@187.127.132.106
```

**Diagnostics — what's running / listening:**
```bash
docker ps -a                       # all containers
systemctl --type=service --state=running   # running services
ss -tulpn | grep LISTEN             # open ports
df -h /                             # disk usage
certbot certificates                # SSL certs + expiry
```

**Portfolio deploy (the swap that goes into /var/www/html):**
```bash
# Files are uploaded from your PC via scp (see section 9). Nothing to run here for a normal deploy.
# To back up the current site before a risky change:
cp -r /var/www/html /var/www/html.bak-$(date +%s)
```

**nginx — the portfolio site config:**
```bash
cat /etc/nginx/sites-enabled/praritsidana.com   # view config
nginx -t                                          # test config is valid
systemctl reload nginx                            # apply config changes (no downtime)
```

**SSL (Let's Encrypt) — issue or renew:**
```bash
# Issue/renew for the domain (only needed if setting up fresh; renewal is automatic):
certbot --nginx -d praritsidana.com -d www.praritsidana.com --redirect --agree-tos -m 1995praritsidana@gmail.com -n
certbot renew --dry-run             # test auto-renewal
```

**Performance (gzip + caching) — already applied; here's what was done:**
```bash
# Global gzip for JS/CSS/etc lives here:
cat /etc/nginx/conf.d/performance.conf
# Long-term caching for hashed assets is a `location ^~ /assets/ { expires 1y; ... }`
# block inside /etc/nginx/sites-enabled/praritsidana.com
```

**Check the site is serving correctly (bypassing any local DNS/browser cache):**
```bash
curl -sI https://praritsidana.com/ | head -1                     # should be 200
curl -sI -H 'Accept-Encoding: gzip' https://praritsidana.com/assets/  # check content-encoding: gzip
```

---

## 11. Secrets & credentials

**None of these live in this file, and secrets must never be committed to git.**

- **`.env`** (local, git-ignored) holds the build-time variables: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_PUBLISHABLE_KEY` (public anon key — safe), `VITE_SITE_URL`, `VITE_SITE_TITLE`,
  `VITE_SITE_DESCRIPTION`, `VITE_OG_IMAGE_URL`. See `.env.example` for the list.
- **VPS SSH:** `root@187.127.132.106` — password known to the owner (not stored here).
- **Supabase admin login:** email `1995praritsidana@gmail.com`, password known to the owner
  (resettable at `/admin/forgot-password`). Recommended: use a strong password and change it periodically.
- **Supabase dashboard:** owner's Supabase account at https://supabase.com/dashboard.
- The **anon key** in the frontend is public by design; real security is Postgres RLS. Do not add any
  service-role key or private secret to the frontend or to this repo.

---

## 12. Pros & cons of this setup

**Pros**
- **Owner-editable content** via a friendly admin panel — no developer needed for day-to-day updates.
- **Fully owned & self-hosted** on Prarit's VPS + his own domain + his own GitHub. No vendor lock-in.
- **Cheap to run** — the VPS already exists and hosts other apps; the portfolio adds almost no cost.
  Supabase free tier is enough for a portfolio.
- **Fast** — static files with gzip + long-term caching; SSL; installable as a PWA.
- **Secure by design** — database Row-Level Security gates all writes server-side.

**Cons / trade-offs**
- **No CDN.** After moving off Cloudflare, the site is served from a single VPS. Global visitors far
  from the server get slightly slower first loads. (Mitigated by gzip + caching; a CDN could be
  re-added later if needed.)
- **Two places to manage.** Design/code lives on the VPS (needs a build + scp to change); content lives
  in Supabase (admin panel). New people must understand this split.
- **Manual deploys.** There is no CI/CD pipeline — deploying code is a manual `npm run build` + `scp`.
- **Single point of failure.** If the VPS is down, the site is down. (The VPS hosts many apps, so keep
  an eye on its load/disk.)
- **PWA caching** can make new deploys appear "not updated" until a hard refresh / cache clear.

---

## 13. Known issues & gotchas

- **"I deployed but the site looks old."** It's almost always caching:
  1. **Local DNS cache** — run `ipconfig /flushdns`; `nslookup praritsidana.com` should return
     `187.127.132.106`.
  2. **Service worker (PWA) cache** — hard refresh (`Ctrl+Shift+R`), or DevTools → Application →
     Service Workers → Unregister → Clear site data. Testing in an Incognito window avoids this.
- **Content changes don't need a deploy.** If a project/skill isn't showing, check the admin panel and
  the `section_settings` (the section may be hidden), not the code.
- **Don't touch other apps on the VPS.** Postzyo, Nirogidhara, etc. share this server. Only the
  portfolio uses `/var/www/html` and `/etc/nginx/sites-enabled/praritsidana.com`.
- **Keep `automation_media/`** inside `/var/www/html` when replacing files — it belongs to another feature.
- **Supabase `.env` in old git history.** The old (deleted) repo may still contain the anon key in
  history — harmless (public key), but never add real secrets to `.env` while it could be committed.

---

## 14. Project structure

```
Prarit portfolio website/
├── src/
│   ├── pages/                 # route pages (Index, Blog, admin/*)
│   ├── components/
│   │   ├── sections/          # homepage sections (Hero, About, Skills, Experience, Projects, ...)
│   │   ├── admin/             # admin building blocks (ImageUpload, FileUpload, ProtectedRoute, ...)
│   │   ├── layout/            # Navbar, Footer, Layout
│   │   └── ui/                # shadcn/ui + custom UI components
│   ├── hooks/                 # data hooks (usePortfolioData, useAdminMutations, useAuth, ...)
│   ├── integrations/supabase/ # Supabase client + generated types
│   ├── lib/                   # helpers (animations, rateLimit, types, utils)
│   ├── index.css              # design system (colors, glass cards, gradients, animations)
│   └── App.tsx                # routes + providers
├── supabase/migrations/       # SQL schema history
├── public/                    # static assets, robots.txt, sitemap.xml, PWA icons
├── index.html                 # HTML shell + SEO meta tags
├── vite.config.ts             # Vite + PWA config
├── .env                       # local secrets (git-ignored)
├── .env.example               # template for .env
└── prarit.md                  # THIS FILE
```

---

## 15. Quick-start

**To edit content (most common):**
→ Log in at https://praritsidana.com/admin/login and edit in the dashboard. Done.

**To change the design/code:**
```powershell
cd "D:\Prarit portfolio website"
npm install                 # first time only
npm run dev                 # preview at http://localhost:8080
# ...make your changes...
npm run build               # build production bundle
scp -r dist/* root@187.127.132.106:/var/www/html/   # deploy to VPS
git add -A && git commit -m "..." && git push origin main   # back up to GitHub
```
Then hard-refresh https://praritsidana.com.

**To understand the whole thing:** read sections 1, 5, and 8 above — they explain what it is, how it
works, and how it's hosted. Everything else is detail.

---

*Last updated: 2026-07-06.*
