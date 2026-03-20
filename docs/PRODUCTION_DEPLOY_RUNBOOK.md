# Ignara — Production deploy runbook (priorities 1–4)

**Domain:** `ignaracodex.com`  
**Goal:** HTTPS everywhere, migrations on RDS, latest API live, smoke-tested learner journey.

**Live AWS state for this domain (zone ID, cert ARN, NS, scripts):**  
→ **[`IGNARACODEX_AWS_SETUP.md`](./IGNARACODEX_AWS_SETUP.md)**

---

## Priority 1 — HTTPS + custom domain (frontend)

**Why:** Browsers show “Not Secure” on `http://` S3 website endpoints; students won’t trust sign-in.

### Recommended architecture

| Piece | Role |
|--------|------|
| **Route 53** | Hosted zone for `ignaracodex.com` |
| **ACM certificate** | **Must be in `us-east-1`** for CloudFront |
| **CloudFront** | HTTPS edge, HTTP→HTTPS redirect |
| **S3** | Private bucket + **Origin Access Control (OAC)** — do not rely on public website endpoint for prod |
| **DNS** | `A`/`AAAA` alias → CloudFront distribution |

### 1.1 Request ACM certificate (us-east-1)

In **AWS Console → Certificate Manager (N. Virginia)**:

- Request public certificate.
- Add names: `ignaracodex.com`, `www.ignaracodex.com`.
- Validate via **DNS** (Route 53 “Create records” button).

### 1.2 S3 bucket

- Bucket can stay `dreampath-codex-frontend` or rename later; **block public access** on the bucket when using OAC.
- Upload = same as today: `aws s3 sync frontend/dist s3://YOUR_BUCKET --delete` (after build).

### 1.3 CloudFront distribution

- **Origin:** S3 (OAC), not “website endpoint” unless you know the tradeoffs.
- **Default behavior:** Viewer protocol **Redirect HTTP to HTTPS**.
- **Alternate domain names (CNAMEs):** `ignaracodex.com`, `www.ignaracodex.com`.
- **Custom SSL certificate:** the ACM cert from 1.1.
- **Default root object:** `index.html` (and add **custom error response** 403/404 → `/index.html` with 200 if you use client-side routing — Ignara uses React Router).

### 1.4 Route 53 records

- Create **A** (and **AAAA**) **alias** for `ignaracodex.com` → CloudFront distribution.
- Same for `www.ignaracodex.com` (or **CNAME** `www` → CloudFront domain name).

### 1.5 Frontend build env

Before `npm run build` in `frontend/`:

```bash
# Use HTTPS API when API is TLS-terminated (see Priority 1b)
export VITE_API_URL=https://api.ignaracodex.com
npm run build
```

Add a tracked example (no secrets):

- `frontend/.env.production.example` — copy to `.env.production` locally/CI; **do not commit** real overrides if they embed secrets (API URL is fine).

Then sync `dist/` to S3 and **invalidate** CloudFront:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Priority 1b — HTTPS for the API (strongly recommended)

Calling `http://IP:4000` from `https://ignaracodex.com` is **mixed content** — browsers may block requests.

Pick one:

**Option A — Subdomain + nginx + Let’s Encrypt (common on single EC2)**

- DNS: `api.ignaracodex.com` → A record to EC2 public IP.
- On server: nginx reverse proxy `443` → `127.0.0.1:4000`, **Certbot** for TLS.
- Open security group: **443** from `0.0.0.0/0` (and keep **4000** closed publicly if everything goes through nginx).

**Option B — Application Load Balancer + ACM**

- ALB in front of EC2, ACM cert on listener 443, target group → app port.

After API is on HTTPS, set:

- `VITE_API_URL=https://api.ignaracodex.com` at build time.
- API `CLIENT_URL` to both site origins (see Priority 3).

---

## Priority 2 — Run all migrations on production RDS

**Symptom:** Lessons / transition analytics need tables from **004–007** (especially **007** `lesson_transition_events`). If only `001–003` ever ran, newer features break.

### 2.1 Preconditions

- VPN or **security group** allows your IP to **5432** on RDS **or** run migrations **from the EC2** instance (recommended).
- `DATABASE_URL` or `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` match **production**.

### 2.2 Run migrations (from EC2 or trusted machine)

```bash
cd /path/to/backend
# set production env (export or .env on server — never commit)
npm run migrate
```

`migrations/run.js` applies any `NNN_*.sql` not yet in `schema_migrations`, in order. Confirm these exist in prod:

- `004_patent2_tutor.sql`
- `005_expand_curriculum_to_120.sql`
- `006_seed_additional_careers.sql`
- `007_transition_events.sql`

### 2.3 Verify in SQL

```sql
SELECT filename FROM schema_migrations ORDER BY filename;
SELECT to_regclass('public.lesson_transition_events');
SELECT COUNT(*) FROM misconception_tags;
```

---

## Priority 3 — Deploy latest API + env alignment

### 3.1 Ship code

- Pull latest `main` (or your release branch) on EC2.
- `npm ci` / `npm install --omit=dev` as you prefer.
- Restart process manager, e.g. `pm2 restart dreampath-api` (use your real name).

### 3.2 Required production env

| Variable | Example / note |
|----------|----------------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Strong random (server **refuses** weak defaults in production) |
| `CLIENT_URL` | `https://ignaracodex.com,https://www.ignaracodex.com` (comma-separated; matches browser `Origin`) |
| `DB_*` | Production RDS |
| `ANTHROPIC_API_KEY` | Optional; only if Roadmap AI enabled |

**CORS:** The API now supports **multiple origins** via comma-separated `CLIENT_URL`. Include every URL students use (www + non-www).

### 3.3 Smoke API from laptop

```bash
curl -sS https://api.ignaracodex.com/health
# With JWT:
curl -sS -H "Authorization: Bearer TOKEN" https://api.ignaracodex.com/api/lessons/me
```

---

## Priority 4 — End-to-end test checklist (Quiz → Code DNA)

Run in **Chrome incognito** on `https://ignaracodex.com` after deploy.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 1 | Open site | Lock icon / valid HTTPS, no mixed-content errors in DevTools → Console |
| 2 | Register new student | Account created, redirected, token stored |
| 3 | Career quiz | Completes, results saved |
| 4 | **Lessons** (`/lessons`) | Page loads; no 401/500; unit roadmap visible |
| 5 | **Challenges** | “Personalized next step” banner appears (or sensible fallback if no history) |
| 6 | Open a challenge, **submit wrong code once** | Tutor hint / misconception path updates (Patent #2 MVP) |
| 7 | **Submit correct code** | Pass; skills/progress update as designed |
| 8 | **Lessons** again | Transition / tips reflect activity (when data exists) |
| 9 | Teacher path (optional) | Register as teacher, class flow if you use it |

**DevTools checks:**

- **Network:** API calls go to **HTTPS** API URL, status 200/201, not blocked by CORS.
- **Application → Local Storage:** `dp_token` present after login.

---

## Rollback (if something breaks)

- **Frontend:** Revert S3 to previous build or CloudFront to previous origin; invalidate cache.
- **API:** Redeploy previous commit; restart PM2.
- **DB:** Migrations are forward-only in this repo — avoid manual `DROP` in prod; fix forward with a new migration if needed.

---

## After this runbook

Update [`IGNARA_BUILD_STATUS.md`](./IGNARA_BUILD_STATUS.md) §7 (open blockers) with dates and mark HTTPS / migrations / API deploy as done.
