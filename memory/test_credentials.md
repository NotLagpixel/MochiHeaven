# Test Credentials — Mochi Heaven

## Admin (private editor)
- URL: `/admin` (hidden — no public link anywhere on the site)
- Password: `mochiheaven` (default, client-side; changeable via the "Password" button in the admin bar)

Notes:
- This is a static frontend-only app (no backend/database). Auth is a client-side password gate stored in localStorage — appropriate for a static Vercel site.
- Unlocked state is kept in sessionStorage key `mochi_admin_unlocked`.
- Content override for the admin's browser is stored in localStorage key `mochi_content_v1`.
