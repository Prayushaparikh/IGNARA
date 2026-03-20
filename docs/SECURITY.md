# Ignara — Security overview

**Audience:** Team, partners, and schools evaluating trust & safety.  
**Detail level:** High level. For implementation status and incident notes, see [`IGNARA_BUILD_STATUS.md`](./IGNARA_BUILD_STATUS.md).

---

## What we protect

- **Student accounts** — email + password; sessions via signed JWTs.
- **Student work** — code submissions stored in our database for progress and adaptation (Code DNA / misconception signals).
- **API** — rate-limited; CORS restricted to known frontend origins.

---

## Key controls

| Area | Approach |
|------|----------|
| **Passwords** | Hashed with bcrypt; not stored in plain text. |
| **Sessions** | JWT; production requires a strong `JWT_SECRET` (weak defaults blocked at startup). |
| **Transport** | **HTTPS is required for production** customer-facing sites. Plain HTTP (e.g. raw S3 website URLs) is not acceptable for real users. |
| **CORS** | API only accepts requests from `CLIENT_URL` (your real app origin). |
| **Abuse** | Global and compiler-specific rate limits. |
| **Code execution** | Submissions run in isolated containers (no network, resource limits). |
| **Accounts** | **Students and teachers** can self-register via the app — supports direct-to-learner (B2C) and school pilots (B2B) where teachers create classes. For stricter school deployments, you can later add SSO, invite-only, or admin-provisioned accounts. |

---

## Data & privacy (directional)

- Do **not** commit database passwords or API keys to git; use environment variables and secret managers in production.
- Define a **retention policy** for submissions and logs (what you keep, how long, who can access).
- For schools: plan for **FERPA-aware** language and, when needed, DPAs and subprocessors list.

---

## Reporting

For security vulnerabilities, provide a contact (e.g. `security@yourdomain`) and expected response time in your main site footer or security page when you go live.

---

## Configuration reference

See `backend/.env.example` for variables including `JWT_SECRET` and `CLIENT_URL`.
