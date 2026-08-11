# Mochi Heaven — Website PRD

## Original Problem Statement
Build an interactive restaurant website for "Mochi Heaven" following an exact provided design, using the provided winged-donut logo, deployable on **Vercel as a static site**, with editable placeholders/templates the owner can update later, and a **private admin editor that other users cannot see**.

## User Choices (confirmed)
- Admin editing scope: **both** menu items AND site info (hero, hours, address, contact, socials).
- Order Online button: **link to an external ordering site** (placeholder for now → friendly modal until link is added).
- Hosting: **Vercel-only static version** (no backend/database).
- Content: **editable placeholders** owner fills in later.
- Admin must be **hidden** from public users.

## Architecture
- **Frontend only** React app (Create React App via `@craco/craco`) in `/app/frontend`. No backend, no MongoDB.
- Content model in `frontend/public/content.json` (published) + `src/content.default.json` (compile-time fallback).
- Runtime content resolution: `localStorage['mochi_content_v1']` (admin's unpublished edits) → else fetch `/content.json` → else default.
- Routing: react-router-dom (`/`, `/menu`, `/about`, `/visit`, `/admin`). `vercel.json` rewrites all paths to index.html for SPA refresh support.
- Animations: framer-motion. Icons: lucide-react (food category markers kept as emoji to match brand). Fonts: Baloo 2 + Nunito.

## Private Admin (hidden)
- Reachable ONLY at secret `/admin` URL — no link anywhere in public Navbar/Footer/pages (verified by testing agent DOM audit).
- Client-side password gate (default `mochiheaven`, changeable in-panel, stored in localStorage). Security-by-obscurity + password, appropriate for a static no-backend site.
- Edits Site Info (order URL, hero, socials, about, visit, highlights) and Menu (categories + items, add/remove, image upload as dataURL or URL).
- **Save** = live in owner's browser (localStorage). **Publish** = downloads updated `content.json` to commit into `frontend/public/` and redeploy → visible to everyone.

## Implemented (2026-06)
- Homepage matching reference: hero (logo, MOCHI HEAVEN title, lead, VISIT US, customer favorite), interactive category filter, 4 category cards with VIEW buttons, feature/highlights strip.
- Card/banner product images: generated on white, then background-removed to transparent PNGs (flood-fill from edges + large enclosed pockets, feathered) so products float and blend on cards with soft drop-shadows (no cropped/pasted look). White source backups in public/assets/_white_src.
- Menu, About, Visit pages with editable placeholders; footer; order modal.
- Hidden password-protected admin editor with Save/Publish/Import/Reset/Change-password.
- Uses provided logo across header/footer/admin/favicon.
- Tested: 32/32 frontend checks pass (iteration_1.json). No known bugs.

## Deployment
- Vercel: import repo, Root Directory = `frontend`, preset Create React App, build `yarn build`, output `build`. See `frontend/README.md`.

## Backlog / Future (P1/P2)
- P1: Optional data-testids on remaining admin inputs (test robustness).
- P2: Proper 404 page (currently unknown routes fall back to Home).
- P2: Optional real ordering integration or in-site order form (currently external-link/modal).
- P2: Google Maps embed on Visit (field exists; owner pastes embed URL).
