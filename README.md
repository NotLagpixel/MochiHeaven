# Mochi Heaven — Website

A fully static, interactive website for Mochi Heaven. No backend or database needed — it deploys to **Vercel** as static files.

## Run locally
```bash
cd frontend
yarn install
yarn start        # dev server on http://localhost:3000
yarn build        # production build in /build
```

## Deploy to Vercel (free)
1. Push this repo to GitHub (use the **Save to GitHub** button).
2. On [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Set **Root Directory** to `frontend`.
   - Framework preset: **Create React App**
   - Build command: `yarn build`
   - Output directory: `build`
4. Click **Deploy**. Done — every visitor now sees your site.

`vercel.json` is already included so page refreshes on `/menu`, `/about`, etc. work correctly.

---

## 🔒 Private Admin (only you)
There is **no login button anywhere on the public site** — visitors can't see it.

- Open the secret URL: **`/admin`** (e.g. `https://yoursite.vercel.app/admin`)
- Enter your password. Default: **`mochiheaven`**
- Click **Password** in the top bar to change it right away (keep it and the `/admin` URL private).

### What you can edit
- **Site Info:** hero text, customer favorite, social links, About story + photo, Visit address/hours/phone/website/map, highlight strip, and the **Order Online** link.
- **Menu Items:** every category and item — name, description, price, photos (upload or paste a URL), add/remove items.

### Saving vs. Publishing (important for a static site)
- **Save** → changes appear instantly, but only in **your** browser (great for editing/preview).
- **Publish** → downloads an updated **`content.json`**. To make changes visible to **everyone**:
  1. Replace `frontend/public/content.json` with the downloaded file.
  2. Redeploy (push to GitHub → Vercel auto-redeploys).
- **Import** lets you load a `content.json` back into the editor.
- **Reset** discards local edits and reloads the currently published content.

> Why this flow? Static Vercel sites have no database, so published content lives in `content.json`. This keeps the site 100% free to host while still letting you edit everything.

## The Order Online button
Set your ordering link in **Admin → Site Info → Order Online link**. If empty, the button shows a friendly “coming soon” popup instead of breaking.

## Your logo
Your Mochi Heaven logo is at `frontend/public/assets/logo.png` and is used in the header, footer, admin, and browser tab.
