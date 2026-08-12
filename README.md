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
- Enter the password stored in Vercel as the sensitive `ADMIN_PASSWORD` environment variable.
- Authentication is verified by a Vercel Function and kept in a secure, HTTP-only session cookie.

### What you can edit
- **Site Info:** hero text, customer favorite, social links, About story + photo, Visit address/hours/phone/website/map, highlight strip, and the **Order Online** link.
- **Menu Items:** every category and item — name, description, price, photos (upload or paste a URL), add/remove items.

### Saving vs. Publishing
- **Save** → changes appear in your browser as a private preview.
- **Publish** → writes the content to the connected public Vercel Blob store and makes it live for everyone immediately.
- Uploaded menu and site images are stored in Vercel Blob automatically (maximum 3 MB each; PNG, JPEG, WebP, or GIF).
- **Import** lets you load a `content.json` back into the editor.
- **Reset** discards local edits and reloads the currently published content.

### Required Vercel configuration
- Connect a public Vercel Blob store to Production and Preview environments.
- Add a sensitive `ADMIN_PASSWORD` environment variable to Production and Preview.

## The Order Online button
Set your ordering link in **Admin → Site Info → Order Online link**. If empty, the button shows a friendly “coming soon” popup instead of breaking.

## Your logo
Your Mochi Heaven logo is at `frontend/public/assets/logo.png` and is used in the header, footer, admin, and browser tab.
