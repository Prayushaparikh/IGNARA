# Deploy Ignara frontend on Vercel (free HTTPS)

**Goal:** `ignara.vercel.app` (or any name you pick) with a padlock, auto-deploy on `git push`.

---

## Prerequisites

1. **GitHub account** — [github.com/signup](https://github.com/signup)
2. This repo **pushed to GitHub** (see below if you haven’t yet)

---

## Step 1 — Push code to GitHub

If this folder is **not** a git repo yet (first time):

```bash
cd /path/to/dreampath-codex
git init
git add .
git commit -m "Initial commit — Ignara / DreamPath CodeX"
```

Create a **new empty repository** on GitHub (no README), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Use **SSH** if you prefer: `git@github.com:YOUR_USERNAME/YOUR_REPO.git`

---

## Step 2 — Import project in Vercel

1. Go to [vercel.com](https://vercel.com) → sign up with **GitHub**.
2. **Add New Project** → import your repository.
3. Configure:
   - **Root Directory:** `frontend` ← important (monorepo)
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default for Vite)

---

## Step 3 — Environment variable (API URL)

In Vercel → Project → **Settings** → **Environment Variables**:

| Name | Value | Notes |
|------|--------|--------|
| `VITE_API_URL` | `https://api.ignaracodex.com` or your API URL | **No** `/api` suffix (the app adds `/api`). |

**Mixed content:** If the site is `https://*.vercel.app`, the API must be **HTTPS** too, or the browser will block requests. Until API has TLS, use a tunnel (e.g. Cloudflare Tunnel) or temporary HTTPS proxy — see [`PRODUCTION_DEPLOY_RUNBOOK.md`](./PRODUCTION_DEPLOY_RUNBOOK.md).

After adding/changing env vars, **Redeploy** (Deployments → ⋮ → Redeploy).

---

## Step 4 — SPA routing

`frontend/vercel.json` rewrites all routes to `index.html` so React Router works (`/dashboard`, `/challenges`, etc.).

---

## Step 5 — API CORS

On your API server, set **`CLIENT_URL`** to your Vercel URL (comma-separated if several):

```bash
CLIENT_URL=https://ignara.vercel.app
```

When you add a custom domain in Vercel, append it:

```bash
CLIENT_URL=https://ignara.vercel.app,https://yourdomain.com
```

---

## Custom domain later (~$12/year)

1. Buy domain (Cloudflare, Namecheap, etc.).
2. Vercel → Project → **Settings** → **Domains** → add domain → follow DNS instructions (usually one CNAME or A record).

---

## Optional: change the `*.vercel.app` name

Vercel project name controls the default URL: rename project in **Settings → General** to get e.g. `ignara.vercel.app` (if available).
