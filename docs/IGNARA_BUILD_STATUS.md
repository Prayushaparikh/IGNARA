# Ignara (DreamPath CodeX) — Build status, security, issues & learnings

**Purpose:** Single source of truth for what is built vs planned, production gaps, incidents, and lessons for investor / engineering / ops documentation.

**Last updated:** March 2026

**Go-to-market:** Ignara is designed for **both** direct learners (**B2C** — anyone can sign up) and **schools / programs (B2B)** using the same product; teacher accounts support class-style use cases.

---

## 1. Product alignment (source documents)

| Artifact | Role |
|----------|------|
| **ignara-product-plan.pdf** | Mission, student journey, curriculum shape, Code DNA + Patent #2 narrative, tech stack, phased roadmap. |
| **ignara-curriculum-spec.pdf** | 12 units, 60 micro-challenges, 12 unit projects, 48 misconception tags, AI tutor hooks per challenge. |
| **ignara-sensor-map.pdf** | Same 48 tags ↔ challenges (sensor contract). |
| **ignara_full_sensors.csv** / **Unit-MicroChallenge-…csv** | Spreadsheet view for content QA and aligning DB seeds with spec. |

---

## 2. What is implemented (codebase)

### Frontend (React + Vite)

- Landing, auth (login/register), dashboard, quiz + results, careers + detail.
- **Challenges** list with difficulty filters + **personalized “next step”** banner (`GET /api/challenges/next`).
- Challenge **Compiler** page (Monaco).
- **Lessons** page (`/lessons`) — unit roadmap + transition card + Code DNA hints (`GET /api/lessons/me`).
- **Roadmap** page — AI-generated weekly plan (Claude API when configured).
- Layout sidebar: Dashboard, Quiz, Careers, **Lessons**, Challenges, Roadmap, Compiler.

### Backend (Node + Express + PostgreSQL)

- JWT auth, bcrypt password hashing, Zod validation on register/login.
- Quiz submit + career scoring, careers CRUD-style reads.
- Challenges list + detail, **next challenge** recommendation (career + skills + struggle + **misconception remediation**).
- Compiler: Docker sandbox, run + submit against test cases.
- **Patent #2 MVP:** on failed submit, log `submission_misconceptions`, update `user_misconception_profile`, return tutor hint from `misconception_tags`.
- Progress, teacher routes, roadmap route.
- **Lessons:** `GET /api/lessons/me`, `POST /api/lessons/transition-event`, `GET /api/lessons/transition-analytics`.

### Database (migrations)

- `001_init.sql` — users, quiz, careers, challenges, submissions, skills, etc.
- `002_seed_challenges.sql` — early seeds (superseded by 003 in typical flow).
- `003_zero_to_hero_challenges.sql` — 50 core challenges (truncates + re-seeds).
- `004_patent2_tutor.sql` — `sensor_tag`, `misconception_tags` (48), profiles, tutor cache, tag updates on challenges.
- `005_expand_curriculum_to_120.sql` — additional deterministic challenges.
- `006_seed_additional_careers.sql` — extra career rows.
- `007_transition_events.sql` — `lesson_transition_events` for adaptation analytics.

---

## 3. Gaps vs full Ignara plan (not yet “complete”)

| Planned (spec / product plan) | Status |
|-------------------------------|--------|
| 12 units × 5 micro-challenges + 1 project each | Partially: challenge count expanded; **unit projects** not fully modeled as first-class flows in UI/DB. |
| Placement → lock to Beginner / Intermediate / Advanced **track** in app | Quiz exists; **track-gated curriculum** (only show relevant units) not fully enforced everywhere. |
| Full lesson content (5 min reads) in product | Lessons are **structured summaries** in code; long-form markdown/CMS not built. |
| Code DNA dashboard / readiness score 0–100 | Partial: data exists; **unified score + UX** as in plan still light. |
| Mentor Connect | Not implemented. |
| Gamification (XP, badges, streaks, class leaderboard) | Not implemented. |
| HTTPS + custom domain for production site | Current public demo may be **S3 website (HTTP)** — see security section. |
| AI tutor beyond default hints | Mostly **catalog hints**; full LLM layer per submission optional/future. |

---

## 4. Security posture

### In place

- **Helmet** on API.
- **CORS** restricted to `CLIENT_URL` (must list every allowed origin in production).
- **Rate limiting** on `/api` and stricter on `/api/compiler`.
- **JWT** for protected routes; passwords hashed with bcrypt (cost 12).
- **Parameterized SQL** via `pg` (no string-concat SQL in routes reviewed).
- **JSON body size limit** (10kb).
- Compiler: Docker with `--network=none`, memory/cpu limits, read-only mount (design intent: isolate execution).

### Risks / TODO for “production secure”

1. **`JWT_SECRET` / `dev-secret` fallback** — Must never deploy with default secret. Server should **refuse to start** in production without a strong `JWT_SECRET` (enforced in code).
2. **HTTP S3 website** — Browser shows “Not secure”; tokens over HTTP are vulnerable on untrusted networks. **Use CloudFront + ACM (HTTPS)** or put app behind ALB/nginx TLS.
3. **`CLIENT_URL` vs S3 origin** — If frontend is `http://*.s3-website-*.amazonaws.com`, that exact origin must be in CORS allowlist or API calls fail / misconfigure.
4. **Secrets in repo** — Never commit `.env` with RDS passwords; use `.env.example` only.
5. **Compiler service** — `docker.sock` + privileged container is powerful; restrict server access, keep images pinned, audit resource limits.
6. **Open signup (B2C + B2B)** — Students and teachers can self-register to support consumers and school offerings. If a district requires **invite-only** or **SSO**, add that as a separate integration layer.
7. **Roadmap / AI** — Requires `ANTHROPIC_API_KEY`; rate-limit and monitor spend; avoid logging full student prompts in production logs without policy.

---

## 5. Issues encountered (chronological log)

| Issue | What happened | Resolution / workaround |
|-------|----------------|-------------------------|
| **Personalization invisible** | Users stayed on generic Challenges grid; new APIs not obvious. | Added **personalized banner** on Challenges using `/challenges/next`; redeployed frontend to S3. |
| **Backend DB migrate failed locally** | `password authentication failed for user postgres` when running `npm run migrate`. | Local `.env` did not match running Postgres; fix credentials or use `docker-compose` DB on port 5433. |
| **Production migration not applied** | RDS credentials not available in dev environment. | **Blocker:** run `npm run migrate` on server or CI with production `DATABASE_URL` / PG env vars. |
| **AWS CLI in sandbox** | `aws sts` failed via proxy in restricted network. | Re-run with full network permissions. |
| **EC2 / SSH deploy** | No SSH key in workspace; SSM empty; Instance Connect attempt hung. | Frontend-only deploy via S3 succeeded; **backend updates require** key-based SSH, SSM agent, or CI pipeline. |
| **Mixed deploy topology** | Static site on S3 + API on EC2 IP. | CORS + HTTP + cache invalidation must be coordinated; prefer one domain behind HTTPS. |

---

## 6. What we learned

1. **Personalization must be visible** — Background recommendation logic is not enough; users need a **primary CTA** on the page they already use (Challenges).
2. **Spec → DB contract** — The 48 tags and `sensor_tag` per challenge are the spine; any content drift breaks Code DNA and remediation.
3. **Migrations are order-dependent** — `schema_migrations` table prevents double-apply; new envs must run all files through `007` for lessons analytics.
4. **Split hosting adds friction** — S3 + EC2 + RDS triples moving parts (CORS, TLS, deploy keys, migrate step).
5. **Default secrets are a footgun** — Explicit production checks for `JWT_SECRET` prevent embarrassing deploys.

---

## 7. Troubles / open blockers

**Step-by-step:** [`PRODUCTION_DEPLOY_RUNBOOK.md`](./PRODUCTION_DEPLOY_RUNBOOK.md) (HTTPS `ignaracodex.com`, RDS migrations 004–007, API deploy, E2E checklist).

- [ ] **P1 HTTPS + domain** — CloudFront + ACM + Route 53 for `ignaracodex.com` / `www`; TLS for API (`api.ignaracodex.com` recommended).
- [ ] **P2 RDS migrations** — Ensure `004`–`007` applied (`schema_migrations` + `lesson_transition_events`).
- [ ] **P3 API deploy** — Latest code + `CLIENT_URL` comma list for apex + www + strong `JWT_SECRET`.
- [ ] **P4 E2E** — Quiz → Lessons → Challenges → submit → Code DNA path (see runbook).

---

## 8. Definition of done (Ignara “MVP complete” for this repo)

- [ ] All migrations applied in production.
- [ ] HTTPS end-to-end for app + API (or documented exception).
- [ ] No default JWT secret in production.
- [ ] CORS matches deployed frontend URL(s).
- [ ] Challenges page shows personalized next step; Lessons page loads without 404 from API.
- [ ] Health check: `GET /health` OK; smoke test register → quiz → challenge submit.

---

## 9. Quick reference — important env vars

See **`backend/.env.example`** in this repo for the full list.

| Variable | Purpose |
|----------|---------|
| `DB_*` or connection string | PostgreSQL |
| `JWT_SECRET` | Sign JWTs (required strong value in prod) |
| `CLIENT_URL` | CORS origin (frontend URL) |
| `ANTHROPIC_API_KEY` | Roadmap AI (optional) |

Frontend: `VITE_API_URL` — base URL of API **without** `/api` suffix (appended in `api.js`).

---

## 10. Maintainer notes

- Update this file when you close a blocker or ship a phase.
- For patent / investor narrative, cross-link: **misconception taxonomy**, **remediation loop**, **transition events** (007), and **user_misconception_profile** aggregates.
- Shorter security narrative for partners: **[`SECURITY.md`](./SECURITY.md)**.
