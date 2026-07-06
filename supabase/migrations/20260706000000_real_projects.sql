-- Replace Lovable placeholder projects with real projects from github.com/prarit0097
-- and make the Projects section visible on the public site.
-- Safe to run multiple times (upserts by slug).

-- 1) Remove the 4 placeholder projects seeded by the initial migration
DELETE FROM public.projects
WHERE slug IN (
  'sales-analytics-dashboard',
  'fintech-crm-automation',
  'invoice-processing-bot',
  'market-analysis-tool'
);

-- 2) Insert real projects
INSERT INTO public.projects
  (title, slug, short_description, full_description, cover_image_url, tech_stack, category, github_url, live_url, is_featured, ordering)
VALUES
(
  'Postzyo',
  'postzyo',
  'Social media automation SaaS that connects Facebook & Instagram accounts, schedules posts, and delivers AI-powered insights from a single dashboard.',
  'Postzyo is a Django-based social media automation platform. It handles the complete Meta OAuth flow for Facebook Pages and Instagram Business accounts, lets you schedule posts from one dashboard, and publishes them automatically using Celery workers. A daily pipeline snapshots insights for every connected profile and generates profile-wise AI insights using OpenAI, with snapshot caching and refresh throttling. Access tokens are encrypted at rest, and the stack ships production-ready with Gunicorn + Nginx via Docker Compose. Live at postzyo.com.',
  'https://opengraph.githubassets.com/1/prarit0097/SocialMediaAutomation',
  ARRAY['Python','Django','Celery','Redis','PostgreSQL','OpenAI API','Docker','Nginx'],
  'SaaS · Automation',
  'https://github.com/prarit0097/SocialMediaAutomation',
  'https://www.postzyo.com',
  true,
  1
),
(
  'Nirogidhara AI Command Center',
  'nirogidhara-ai-command-center',
  'AI Revenue Operating System for an Ayurveda D2C brand — AI agents run sales, calling, CRM, WhatsApp, payments, courier and reorder operations for a single founder.',
  'A production AI command center built so one founder can operate an entire D2C sales operation with an army of AI agents. It covers sales workboards, AI calling, CRM, WhatsApp journeys, payments, courier + RTO rescue, reorder flows, compliance and governance — all measured against one north star: Net Delivered Profit per Director Hour. Monorepo with a Django 5 + DRF backend (22 apps) and a React 18 + Vite + Tailwind + shadcn/ui frontend (27 pages), running on PostgreSQL 16, Redis 7 and Celery, deployed with Docker Compose. Live at ai.nirogidhara.com.',
  'https://opengraph.githubassets.com/1/prarit0097/Nirogidhara-AI-Command-Center',
  ARRAY['Python','Django','DRF','React','TypeScript','PostgreSQL','Redis','Celery','Docker'],
  'AI · Operations',
  'https://github.com/prarit0097/Nirogidhara-AI-Command-Center',
  'https://ai.nirogidhara.com',
  true,
  2
),
(
  'JSLL Prediction Platform',
  'jsll-prediction-platform',
  'NSE stock prediction and monitoring platform with tournament-driven model selection, confidence bands, drift detection and a live dashboard.',
  'A Django-based prediction and monitoring system for Jeena Sikho Lifecare Ltd (JSLL.NS), built around NSE session-aware data handling. An hourly tournament pipeline trains and validates competing models per horizon and promotes champions automatically. Predictions ship with confidence scores, uncertainty bands and outcome match-tracking, backed by drift checks, data-quality checks and self-repair jobs. A live dashboard and JSON APIs expose prices, scoreboards and the latest ready predictions.',
  'https://opengraph.githubassets.com/1/prarit0097/jsllprediciton',
  ARRAY['Python','Django','Machine Learning','pandas','yfinance','REST APIs'],
  'Data Science · ML',
  'https://github.com/prarit0097/jsllprediciton',
  NULL,
  true,
  3
),
(
  'SeeStox Backend',
  'seestox-backend',
  'Backend engine for SeeStox — a Django stock-market analytics platform with REST APIs, a prediction scheduler and sentiment tracking, deployed with Docker.',
  'The API and core engine powering SeeStox, a stock market analytics product. Django project with dedicated apps for accounts, public APIs and a core prediction engine, plus a standalone scheduler for recurring prediction runs and sentiment trend tracking. Ships with Docker and docker-compose for reproducible deployment.',
  'https://opengraph.githubassets.com/1/prarit0097/seestox-backend-v2',
  ARRAY['Python','Django','REST APIs','Docker'],
  'Fintech · Backend',
  'https://github.com/prarit0097/seestox-backend-v2',
  NULL,
  false,
  4
),
(
  'RIIMS Hospitals Website',
  'riims-website',
  'SEO-first kidney-care hospital website — 25 static pages with structured data, a booking flow and a zero-dependency admin panel. Live at riimshospitals.com.',
  'Production marketing site for RIIMS (Rashtriya Institute of Integrated Medical Sciences), a kidney-care hospital. Built as a static, SEO-focused multi-page site — 25 pages including 8 condition pages and 9 blog articles, each with its own metadata, Open Graph tags and JSON-LD structured data (MedicalClinic, FAQPage, BreadcrumbList). Interactive features in vanilla JS: disease search, health reels, a 2-step booking modal and WhatsApp/call actions. Includes a zero-dependency Node admin panel for leads, doctors, blogs and content that auto-rebuilds the static site on save. Serves 1000+ concurrent users from cache on a Hostinger VPS.',
  'https://opengraph.githubassets.com/1/prarit0097/Riims-Website',
  ARRAY['HTML','CSS','JavaScript','Node.js','SEO','JSON-LD'],
  'Web · SEO',
  'https://github.com/prarit0097/Riims-Website',
  'https://riimshospitals.com',
  false,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  cover_image_url = EXCLUDED.cover_image_url,
  tech_stack = EXCLUDED.tech_stack,
  category = EXCLUDED.category,
  github_url = EXCLUDED.github_url,
  live_url = EXCLUDED.live_url,
  is_featured = EXCLUDED.is_featured,
  ordering = EXCLUDED.ordering;

-- 3) Make the Projects section visible on the public site
UPDATE public.section_settings
SET is_visible = true
WHERE section_key = 'projects';
