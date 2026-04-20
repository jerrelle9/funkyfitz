# FunkyFitz Entertainment — Claude Code Context

## What this app is
A website for **FunkyFitz Entertainment**, a South Trinidad-based events company. The site is a static React + Vite SPA hosted on **Cloudflare Pages**.

## Tech stack
- **React 19** + **Vite 8** (with `@vitejs/plugin-react`)
- **React Router v7** (BrowserRouter, client-side routing)
- **Supabase** — database (PostgreSQL) + storage + auth
- **Web3Forms** — handles the Join Our Team form submissions (emails `burnaface123@gmail.com`)
- No CSS framework — all styling is inline styles + custom CSS classes in `src/styles/global.css`
- No TypeScript — plain JSX throughout

## Project structure
```
src/
  app.jsx                     # BrowserRouter + all routes
  main.jsx                    # Entry point, imports global.css
  lib/
    supabase.js               # Supabase client (reads VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  styles/
    colors.js                 # Brand colour constants (YELLOW, PURPLE, PURPLE_DARK, CORAL, DARK)
    global.css                # CSS reset, responsive utilities, gallery/form/nav CSS classes
  data/
    siteData.js               # Static data: services, stats, testimonials, navLinks, albums
  assets/                     # Images (logo.png, banner.jfif, banner2.png, design.jfif, etc.)
  components/
    navbar.jsx                # Sticky nav — auth-aware (shows Dashboard/Sign Out when logged in)
    footer.jsx                # Simple footer with social links
    hero.jsx                  # Landing hero section (yellow background, brand copy)
    gallerySection.jsx        # Public gallery grid — fetches published events from Supabase
    servicesSection.jsx       # (Unused on main page, kept for reference)
    ui/
      wavyBg.jsx
      wavyBorder.jsx
    admin/
      requireAuth.jsx         # Auth guard — wraps protected routes, redirects to /admin/login
      imageUploader.jsx       # Folder + zip upload component with compression + progress bar
  pages/
    funkyfitz.jsx             # Home page (Navbar + Hero + GallerySection + Footer)
    gallery.jsx               # /gallery — full gallery page
    eventGallery.jsx          # /gallery/:slug — per-event photo grid + lightbox
    joinTeam.jsx              # /join — team application form (Web3Forms)
    authCallback.jsx          # /auth/callback — handles Supabase invite email → set password
    admin/
      login.jsx               # /admin/login — email + password sign in
      dashboard.jsx           # /admin — lists all past events + upcoming events
      newEvent.jsx            # /admin/events/new — create event (title + date → slug)
      manageEvent.jsx         # /admin/events/:slug — upload photos, set cover, publish toggle
      newUpcomingEvent.jsx    # /admin/upcoming-events/new — create upcoming event with flyer
      manageUpcomingEvent.jsx # /admin/upcoming-events/:id — edit upcoming event
public/
  _redirects                  # Cloudflare Pages SPA routing rules
```

## Routes
| Path | Page | Protected |
|---|---|---|
| `/` | Home | No |
| `/gallery` | Gallery | No |
| `/gallery/:slug` | Event gallery + lightbox | No |
| `/join` | Join Our Team form | No |
| `/auth/callback` | Set password (invite flow) | No |
| `/admin/login` | Admin sign in | No |
| `/admin` | Dashboard | Yes |
| `/admin/events/new` | New past event | Yes |
| `/admin/events/:slug` | Manage past event | Yes |
| `/admin/upcoming-events/new` | New upcoming event | Yes |
| `/admin/upcoming-events/:id` | Manage upcoming event | Yes |

## Supabase schema
**`events` table** — past events shown in the public gallery
- `id`, `slug` (unique), `title`, `date`, `bucket_folder`, `cover_url`, `published`, `photo_count`, `created_at`

**`upcoming_events` table** — events shown on the home page
- `id`, `name`, `date`, `time`, `ticket_link`, `image_url`, `is_published`, `created_at`

**Storage buckets**
- `event-galleries` — public bucket, photos stored at `{slug}/{filename}`
- `upcoming-events` — public bucket, flyer images stored as `{uuid}.{ext}`

**RLS policies**
- Public can only read `published = true` rows
- Authenticated (admin) has full access to all rows and storage

## Environment variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WEB3FORMS_KEY=17958cb4-ade4-46e7-9115-49393cd09f9d
```
Set in `.env` locally. On Cloudflare Pages — Settings → Environment variables.
Note: Web3Forms key is intentionally hardcoded in `joinTeam.jsx` (it's a public routing key, not a secret).

## Styling conventions
- **All component styles are inline** — `style={{ ... }}` on every element
- **Colours always come from** `src/styles/colors.js` — never hardcode hex values
- **CSS classes** are only used for things that need hover states, transitions, or media queries that can't be done inline (gallery cards, nav drawer, form inputs, responsive grid)
- Brand colours: `YELLOW #F5C800`, `PURPLE #6B21C8`, `PURPLE_DARK #4A1188`, `CORAL #FF5C4D`, `DARK #1a0a3a`
- Dark background throughout: `#0d0620` for page backgrounds, `#1a0a3a` for cards/panels

## Admin flow
1. Owner visits `/admin/login` and signs in with email + password
2. Dashboard shows upcoming events (top) and past events (bottom)
3. **Past events**: create → upload photos (folder or zip) → set cover → publish
4. **Upcoming events**: create with name, date, time, ticket link, and flyer image → publish
5. Navbar shows **Dashboard** and **Sign Out** links when logged in

## Image upload flow (admin)
- `imageUploader.jsx` accepts folder (desktop) or zip (mobile + desktop)
- Images are compressed client-side via `browser-image-compression` (max 1920px, max 200KB)
- Uploaded to Supabase Storage at `event-galleries/{bucket_folder}/{filename}`
- After upload, `photo_count` and `cover_url` are updated on the `events` row
- First uploaded image auto-sets as cover if none exists

## Deployment
- Hosted on **Cloudflare Pages** at `https://funkyfitz.jerrellejohnson3.workers.dev`
- Build command: `npm run build` / Output: `dist/`
- Auto-deploys on every push to `main`
- `public/_redirects` handles SPA routing (explicit routes only — `/* /index.html 200` causes a loop error on Cloudflare)

## Key things to know
- The `assets/` folder was previously misnamed `assests/` — all imports now correctly use `assets/`
- `siteData.js` still exports a static `albums` array (legacy) — the public gallery now fetches live from Supabase instead, so `albums` is unused
- `desktop-only` / `mobile-only` CSS utility classes are defined in `global.css` and used in the admin dashboard
- Folder upload (`webkitdirectory`) does not work on mobile — `imageUploader.jsx` detects mobile and shows zip-only mode
- The `authCallback.jsx` page handles the Supabase invite email link — the admin sets their password there on first login
