# Domain & HTTPS — what’s free, what isn’t

## Can you get `ignaracodex.com` for free?

**Basically no.** A **`.com` name** is rented yearly from a **registrar**. Nobody offers a real `.com` you fully own forever at $0. Typical cost is about **$10–15 USD/year** (sometimes a first-year promo).

**“Free domain”** offers are usually:
- A **subdomain** they control (e.g. `yourapp.vercel.app`), or  
- A **trial** / bundle with hosting, still paid long-term.

For a **startup brand** like Ignara, budgeting **~$12/year** for `ignaracodex.com` (or another name you like) is normal.

---

## Good options while you’re not ready to pay

### 1. Free HTTPS + URL (no custom domain)

Use a host that gives you **HTTPS + a free subdomain**:

| Platform        | Example URL              | Notes                          |
|----------------|--------------------------|--------------------------------|
| **Vercel**     | `ignara.vercel.app`      | Great for static/React builds  |
| **Netlify**    | `ignara.netlify.app`     | Same idea                      |
| **Cloudflare Pages** | `*.pages.dev`      | Free tier, custom domain later |

You **build** the same Ignara frontend; you **connect Git** or **upload `dist/`**; you get **HTTPS** and no “Not Secure” for that URL.

**Tradeoff:** URL is not `ignaracodex.com` until you buy the domain and attach it (all of these support adding a domain later).

### 2. Keep using AWS S3 URL (not ideal for real users)

`s3-website-*.amazonaws.com` is **HTTP only** in the classic website endpoint — that’s why browsers say **Not Secure**. Fine for **your own testing**, bad for **public signups**.

### 3. Buy the domain when you’re ready (simple path)

1. Pick a registrar (examples): **Cloudflare Registrar**, **Namecheap**, **Porkbun**, or **Route 53 Domains** in AWS.  
2. Search **`ignaracodex.com`** (or another name if taken).  
3. Pay for **1 year**.  
4. Point **nameservers** to the Route 53 NS we already created (see [`IGNARACODEX_AWS_SETUP.md`](./IGNARACODEX_AWS_SETUP.md)) **or** use the registrar’s DNS and add the same ACM validation records there.

---

## Important: Route 53 hosted zone cost

A **public hosted zone** in Route 53 costs about **$0.50/month** even if you **don’t** own the domain yet.

- If you **won’t** buy `ignaracodex.com` soon, you can **delete** the hosted zone in the AWS console to stop that charge, then **recreate** it when you purchase the domain.  
- If you **will** buy soon, leaving it is fine.

---

## Practical recommendation

| Stage              | Do this |
|--------------------|--------|
| **Now (no budget)** | Deploy frontend to **Vercel or Netlify** with a free `*.vercel.app` / `*.netlify.app` URL + **HTTPS**; point `VITE_API_URL` at your API (API should use HTTPS when the site is HTTPS — see runbook). |
| **When ~$12 is OK** | Register **`ignaracodex.com`** (or final name), set NS, finish ACM + CloudFront from [`IGNARACODEX_AWS_SETUP.md`](./IGNARACODEX_AWS_SETUP.md). |

---

## Student / nonprofit discounts

- **GitHub Student Pack** sometimes includes **domain or hosting** perks — check [education.github.com/pack](https://education.github.com/pack) if you’re eligible.  
- Not a guaranteed free `.com`, but can lower cost.

If you tell me whether you prefer **staying on AWS only** vs **Vercel/Netlify for the frontend**, the next step can be a **copy-paste deploy checklist** for that path (still no domain cost).
