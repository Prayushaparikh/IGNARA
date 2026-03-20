# ignaracodex.com — AWS resources created (March 2026)

**Account:** `920373010909`  
**Purpose:** HTTPS + custom domain for Ignara frontend (and later `api.` TLS).

**Don’t own the domain yet?** `.com` domains are **not free** (~$10–15/year). See **[`DOMAIN_AND_HTTPS_OPTIONS.md`](./DOMAIN_AND_HTTPS_OPTIONS.md)** for free HTTPS options (e.g. Vercel/Netlify) and **Route 53 ~$0.50/mo** hosted-zone note.

---

## 1. Route 53 hosted zone (done)

| Field | Value |
|--------|--------|
| **Hosted zone ID** | `Z09933851X45P0DFXKPPX` |
| **Domain** | `ignaracodex.com` |

### Nameservers — set these at your domain registrar

Point **ignaracodex.com**’s nameservers to:

```
ns-627.awsdns-14.net
ns-1677.awsdns-17.co.uk
ns-353.awsdns-44.com
ns-1252.awsdns-28.org
```

Until this is done, **ACM will not validate** and **DNS for your site will not work**.

**Registrar:** If you bought the domain in Route 53 Domains, attach this hosted zone to the registration (or use the “Route 53 as DNS” flow in the console). If the domain is at GoDaddy/Namecheap/etc., replace their NS with the four above.

---

## 2. ACM certificate (requested, us-east-1)

| Field | Value |
|--------|--------|
| **ARN** | `arn:aws:acm:us-east-1:920373010909:certificate/814c958e-e655-4bfb-bdff-fd3e958f8414` |
| **Names** | `ignaracodex.com`, `www.ignaracodex.com`, `api.ignaracodex.com` |
| **Validation** | DNS — CNAME records were added **in this hosted zone** via `scripts/route53-acm-validation.json` |

Check status:

```bash
aws acm describe-certificate --region us-east-1 \
  --certificate-arn "arn:aws:acm:us-east-1:920373010909:certificate/814c958e-e655-4bfb-bdff-fd3e958f8414" \
  --query 'Certificate.Status' --output text
```

When it prints **`ISSUED`**, continue to CloudFront below.

---

## 3. CloudFront Origin Access Control (done)

| Field | Value |
|--------|--------|
| **OAC ID** | `E2RTUGMYQJQLN8` |
| **S3 bucket** | `dreampath-codex-frontend` |

---

## 4. Next steps (you / automation)

### A. After ACM = `ISSUED`

1. Run the CloudFront script (creates distribution + prints ID):

   ```bash
   cd /path/to/dreampath-codex
   ./scripts/create-cloudfront-ignaracodex.sh
   ```

2. Attach **S3 bucket policy** for that distribution (script prints the policy JSON).

3. In Route 53, create **A/AAAA alias** for `ignaracodex.com` and `www.ignaracodex.com` → the CloudFront distribution.

4. Build frontend with `VITE_API_URL=https://api.ignaracodex.com`, sync to S3, **invalidate** CloudFront:

   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
   ```

### B. API on `api.ignaracodex.com` (EC2)

Same cert covers `api.ignaracodex.com`. Add **A record** `api` → EC2 public IP (or ALB), terminate TLS with **nginx + Certbot** (or ACM on ALB). Set API env:

`CLIENT_URL=https://ignaracodex.com,https://www.ignaracodex.com`

### C. RDS migrations + API deploy

See [`PRODUCTION_DEPLOY_RUNBOOK.md`](./PRODUCTION_DEPLOY_RUNBOOK.md) §2–3.

---

## 5. If you re-request a new ACM certificate

DNS validation **CNAME names/values change**. Do not reuse old `route53-acm-validation.json` — run `describe-certificate`, update records, or use the ACM console “Create records in Route 53” button.
