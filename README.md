# BIZNIZ — Digital Business Cards

BIZNIZ turns your business card into a QR code. You fill in your details once,
the app generates a styled QR code, and anyone who scans it lands on a page
showing your card — which they can then keep in their own rolodex.

The idea is the thing paper cards are bad at. At a hackathon, conference, or
networking event, paper cards get pocketed and thrown away. A scan puts your
contact details straight onto someone's phone, in a list they can come back to
later.

Built with Next.js (App Router) and Supabase for auth, data, and image storage.

## Quickstart

Requires Node.js 22 (developed on v22.19.0) and a Supabase project.

```bash
npm install
```

Create `.env.local` in the project root with your Supabase project credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both are read in [app/libs/supabase.ts](app/libs/supabase.ts). Without them the
app still builds and runs — the landing page and the rolodex demo cards render
fine — but sign-up, card creation, and saving are disabled.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

There are no migration files in this repo; the schema below is what the client
code actually reads and writes. Create these before signing up, or account
creation will fail.

**`profiles`** — one row per user, created at sign-up.

| column | notes |
|---|---|
| `user_id` | matches `auth.users.id` |
| `username` | chosen at sign-up; becomes the QR link |
| `profile_url` | filled in when a card is generated |

**`business_cards`** — one row per user, their card.

| column | notes |
|---|---|
| `user_id` | card owner |
| `first_name`, `last_name`, `company_name`, `tagline` | |
| `phone`, `email`, `website` | |
| `card_color` | icon-circle fill, chosen in the picker |
| `qr_code_url` | the scan destination |
| `image_url` | logo, if uploaded |

**`rolodex_entries`** — cards a user has collected: `rolodex_entry_id`,
`scanned_user_id`, `created_at`.

Also create a **public storage bucket named `card-images`**. Logos upload to
`<user_id>/card-image.<ext>`.

## How the QR flow works

1. You sign up and pick a username.
2. On `/create`, you fill in the card and hit Generate. The app builds
   `<origin>/rolodex?username=<your-username>`, stores it on your card row, and
   writes it back to your profile.
3. [StyledQR](app/components/styledqr.tsx) renders that URL as an SVG QR code
   with high error correction, so it still scans with a logo over the middle.
4. A scanner opens `/rolodex?username=...`, which looks up the profile, then the
   matching card, and renders it.

Because the QR encodes a URL rather than the contact details themselves, editing
your card updates what people see — the printed code never goes stale.

## Layout

```
app/
  page.tsx              landing page, business-name handoff to /create
  create/page.tsx       card builder with live preview; doubles as edit mode
  rolodex/page.tsx      your collected cards, or one scanned card
  login/, signup/       email + password auth
  components/           navbar, biznizcard, authmodal, styledqr
  libs/supabase.ts      Supabase client + isSupabaseConfigured guard
public/                 logo mark, sample QR, icons
```

`/create` detects an existing card for the signed-in user and switches to edit
mode: current values show as placeholders, and only the fields you actually
change get written.

## Status

Working:

- Email/password sign-up and login, plus an inline auth modal on `/create`
- Card creation, edit mode, logo upload, live colour preview
- QR generation and the scan-to-view path
- The rolodex reads real entries for a signed-in user, and shows four demo
  cards to signed-out visitors so the page isn't blank

Not built yet:

- **Nothing writes to `rolodex_entries`.** Scanning shows a card but there's no
  "save to my rolodex" action, so collections only grow if rows are inserted by
  hand.
- The search box on `/rolodex` is presentational — it has no handler.
- The "Links" section on the card is a placeholder for a future multi-link view.

## Scripts

| command | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm start` | serve the build |
| `npm run lint` | ESLint (currently reports one `react-hooks` error in `app/page.tsx`) |
