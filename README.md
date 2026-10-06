# X - Report

**Report, confirm and track community problems on a live map.**

[Live demo](https://x-report.netlify.app) · [Report a bug](../../issues/new) · [Request a feature](../../issues/new) · [Roadmap](#roadmap)

> **Status:** early development. The core loop works end to end: people report problems on a map, neighbours confirm them, and admins move them through a public status timeline. Items under "Planned" are not built yet.

<!--
Add screenshots here once you have taken them, for example:
![Home page](docs/screenshots/home.png)
![Report detail and timeline](docs/screenshots/detail.png)
-->

---

## The problem

People run into problems every day: potholes, water leaks, broken streetlights, power outages, illegal dumping. But they rarely know who to report them to, whether someone already has, or whether anything is being done. The result is duplicate reports, no clear picture of what is happening, and no accountability.

## The solution

X - Report gives every problem a single, trackable record that the whole community can see.

```text
Reported → Verified → Assigned → Being fixed → Resolved
```

A report has a type, severity, map pin and description. Neighbours confirm it, an admin updates its status with a note, and every change is kept on a public timeline, including how long the fix took.

## Features

**Working today**

- Live map of reported problems, filterable by type
- Report form with a map pin picker and "use my location"
- Duplicate check: warns when an open report of the same type is within 200 m
- Accounts: sign up, log in, password reset (email + password)
- Neighbour confirmations, one per account, never on your own report
- Problem list with search, filters and sorting, and an "only my reports" view
- Detail page per report with a status timeline and notes
- Admin role for updating statuses; resolution time is recorded automatically
- Insights page: totals, types, statuses, severity, top areas, average time to resolve
- Privacy policy page

**Planned**

- Photo upload and before/after evidence
- AI suggestions for type and severity from a photo
- Hotspot detection and trend prediction
- Notifications
- Organisation (municipality) accounts and an API
- Installable mobile app (PWA)

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Leaflet |
| Backend | Supabase (PostgreSQL, Auth, Row Level Security, database functions) |
| Hosting | Netlify, deployed automatically from `main` |
| Maps | OpenStreetMap tiles |

## Getting started

You need [Node.js](https://nodejs.org) (LTS) and a free [Supabase](https://supabase.com) account.

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/x-report.git
   cd x-report
   npm install
   ```
2. **Create a Supabase project**, then open **SQL Editor → New query**, paste the contents of [`docs/database.sql`](docs/database.sql) and run it.
3. **Add your keys.** Copy `.env.example` to `.env.local` and fill in your project's URL and publishable key:
   ```text
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
   ```
   Never use the secret / `service_role` key in this project.
4. **Allow your local address for login emails.** In Supabase go to **Authentication → URL Configuration** and add `http://localhost:5173/**` to the redirect URLs.
5. **Start the app**
   ```bash
   npm run dev
   ```
6. **Make yourself an admin** (optional): sign up on the site, then run this in the SQL Editor with your email:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

## How the data is protected

- The public can read reports and their history. Nothing else is readable or writable without an account.
- Only signed-in users can create reports. The database checks that a report belongs to the person submitting it.
- Confirmations and status changes can only happen through database functions that check who is calling.
- Only admins can change a status, and every change is recorded with who made it and when.

## Contributing and workflow

All changes go through pull requests. Nothing is pushed directly to `main`.

1. Create (or pick) an Issue describing the work
2. Create a branch from `main`, for example `feature/photo-upload`
3. Commit with clear messages (`feat:`, `fix:`, `docs:`, `chore:`)
4. Push the branch and open a pull request that references the issue
5. Check the Netlify deploy preview, then merge
6. Netlify deploys `main` automatically

## Project structure

```text
x-report/
├── docs/
│   └── database.sql        # full database schema
├── public/
│   └── _redirects          # makes page refreshes work on Netlify
├── src/
│   ├── components/         # Navbar, Footer, MapView, IssueRow, ...
│   ├── context/            # AuthContext
│   ├── hooks/
│   ├── lib/                # Supabase client and data functions
│   ├── pages/              # Home, Issues, IssueDetail, Insights, ...
│   ├── styles/
│   └── utils/
├── .env.example
└── README.md
```

## Roadmap

- [x] **v1:** report a problem, issue list, statuses
- [x] **v2:** live map, duplicate check, confirmations, shared database
- [x] **v3:** accounts, detail page with timeline, admin status updates, insights
- [ ] **v4:** photo upload, before/after evidence, custom email sending
- [ ] **v5:** AI suggestions, hotspot prediction, notifications
- [ ] **v6:** organisation accounts, public API, PWA

## License

MIT
