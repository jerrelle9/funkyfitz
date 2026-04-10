# FunkyFitz Gallery Implementation Plan

## Overview

Per-event photo galleries hosted on Supabase Storage with a protected admin portal for the owner to upload and manage events.

---

## Phase 1 — Supabase Setup (no code)

### Step 1: Create Supabase project
- Go to supabase.com, create a new project named `funkyfitz`
- Save your project URL and anon key — you'll need them

### Step 2: Create Storage bucket
- In Supabase dashboard → Storage → New bucket
- Name: `event-galleries`
- Set to **Public**
- Enable **image transformations** (in bucket settings) — this lets you serve resized images via URL params without storing duplicates

### Step 3: Create the `events` table

Run this in the Supabase SQL editor:

```sql
create table events (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  date date not null,
  bucket_folder text not null,
  cover_url text,
  published boolean default false,
  photo_count integer default 0,
  created_at timestamp with time zone default now()
);
```

### Step 4: Set Row Level Security

```sql
alter table events enable row level security;

-- Public can only see published events
create policy "Public reads published events"
  on events for select
  using (published = true);

-- Authenticated (admin) can do everything
create policy "Admin full access"
  on events for all
  using (auth.role() = 'authenticated');
```

### Step 5: Create admin account
- Supabase dashboard → Authentication → Users → Invite user
- Enter the owner's email — they get a magic link to set their password
- This is the only account — no public sign-up needed

---

## Phase 2 — Wiring Supabase into the App

### Step 6: Install packages

```bash
npm install @supabase/supabase-js browser-image-compression jszip
```

- `@supabase/supabase-js` — Supabase client
- `browser-image-compression` — client-side image resize/compress before upload
- `jszip` — unzip uploaded zip files in the browser

### Step 7: Create Supabase client file
- New file: `src/lib/supabase.js`
- Initialise the client using env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Add a `.env` file at project root (already in `.gitignore`)

---

## Phase 3 — Update Public Gallery

### Step 8: Replace `siteData.js` albums with a Supabase fetch
- `src/components/gallerySection.jsx` currently imports albums from `siteData.js`
- Replace with a `useEffect` that queries `events` table where `published = true`, ordered by `date desc`
- Show a loading skeleton while fetching

### Step 9: Build the per-event gallery page
- New file: `src/pages/eventGallery.jsx`
- Route: `/gallery/:slug`
- Fetches all images from `event-galleries/<bucket_folder>/` using `supabase.storage.from(...).list()`
- Renders a masonry/grid layout with lazy-loaded `<img loading="lazy">` tags
- Supabase image transformation URL appended: `?width=600&quality=80` for thumbnails

### Step 10: Build the lightbox
- When a gallery image is clicked → full-screen overlay with the full-res image
- Keyboard nav (arrow keys), click outside to close
- Load full-res on demand (`?width=1920&quality=90`) — don't preload

### Step 11: Update album cards to link internally
- Change `href={album.facebookUrl}` in `src/components/gallerySection.jsx` to `<Link to={/gallery/${album.slug}}>`
- Add new route in `src/app.jsx`: `<Route path="/gallery/:slug" element={<EventGallery />} />`

---

## Phase 4 — Admin Auth

### Step 12: Build the login page
- New file: `src/pages/admin/login.jsx`
- Email + password form → calls `supabase.auth.signInWithPassword()`
- On success → redirect to `/admin`
- On fail → show error message

### Step 13: Build the auth guard
- New file: `src/components/admin/requireAuth.jsx`
- Wraps protected routes — checks `supabase.auth.getSession()`
- If no session → redirect to `/admin/login`
- If session exists → render children

### Step 14: Add admin routes to `src/app.jsx`

| Route | Component | Protected |
|---|---|---|
| `/admin/login` | `AdminLogin` | No |
| `/admin` | `AdminDashboard` | Yes |
| `/admin/events/new` | `NewEvent` | Yes |
| `/admin/events/:slug` | `ManageEvent` | Yes |

---

## Phase 5 — Admin Dashboard

### Step 15: Build the dashboard
- New file: `src/pages/admin/dashboard.jsx`
- Fetches ALL events (published + unpublished) — admin sees everything
- Table/list view showing: title, date, photo count, published status, actions
- Actions: Edit, Toggle Published, Delete
- "New Event" button → navigates to `/admin/events/new`
- Logout button → `supabase.auth.signOut()`

---

## Phase 6 — Upload Flow

### Step 16: Build the new event form
- New file: `src/pages/admin/newEvent.jsx`
- Fields: Event Title, Event Date
- Auto-generates slug from title + date (e.g. `bubble-gum_2025-05-01`)
- Upload zone below the form — accepts both folder and zip

### Step 17: Build the upload component
- New file: `src/components/admin/imageUploader.jsx`
- Two upload modes:
  - **Folder** — `<input type="file" webkitdirectory multiple>` — drag and drop or click to browse
  - **Zip** — `<input type="file" accept=".zip">` — uses `jszip` to extract files in the browser before processing
- On file selection:
  1. Filter to image files only (`.jpg`, `.jpeg`, `.png`, `.webp`)
  2. Compress each with `browser-image-compression` (max 1920px, max 200KB)
  3. Upload each to `event-galleries/<slug>/` in Supabase Storage
  4. Show per-file progress bar
  5. On completion → auto-pick first image as cover, update `events` table `photo_count` and `cover_url`

### Step 18: Cover selection
- After upload completes, show a strip of uploaded images
- Owner clicks one to designate as cover
- Updates `cover_url` in the `events` table

### Step 19: Publish toggle
- Simple toggle on the dashboard and event management page
- Updates `published` column in `events` table
- Unpublished events are invisible on the public site

---

## Phase 7 — Seed Existing Events

### Step 20: Upload Bubble Gum manually (first event)
- Log into admin portal as the owner
- Create event: "Bubble Gum", date 2025-05-01
- Upload the 208 images from `src/assets/harpylyefentertainment_bubble-gum_2025-05-01_0020` via the folder uploader
- Pick cover image
- Publish

### Step 21: Migrate existing events (Start It, Altitude)
- These currently use local `.jfif` cover images and link to Facebook
- Two options:
  - **Full migration**: upload all photos to Supabase (need the original photo folders)
  - **Partial**: create the event records in Supabase with just a cover image, keep the Facebook link as a fallback until photos are available

---

## Phase 8 — Polish + Deploy

### Step 22: Loading states + error handling
- Skeleton loaders on the public gallery grid while events fetch
- Error state if Supabase is unreachable
- Upload error handling — failed files shown with retry option

### Step 23: Mobile admin check
- Folder upload (`webkitdirectory`) doesn't work on mobile — hide it on mobile, show zip-only on small screens
- Dashboard table → responsive card layout on mobile

### Step 24: Set environment variables on your host
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your deployment environment (Netlify/Vercel/etc.)

---

## Build Order Summary

| Phase | What gets built |
|---|---|
| 1 | Supabase project, bucket, table, RLS, admin account |
| 2 | Install packages, Supabase client |
| 3 | Public gallery fetches from Supabase, event page, lightbox |
| 4 | Admin login, auth guard, routes |
| 5 | Admin dashboard |
| 6 | Upload flow (folder + zip), cover selection, publish toggle |
| 7 | Seed existing events via the new admin UI |
| 8 | Polish, mobile, deploy env vars |

---

## File Structure (new files)

```
src/
  lib/
    supabase.js
  pages/
    eventGallery.jsx
    admin/
      login.jsx
      dashboard.jsx
      newEvent.jsx
      manageEvent.jsx
  components/
    admin/
      requireAuth.jsx
      imageUploader.jsx
.env
```
