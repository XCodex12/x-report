# X - Report

**A community platform for reporting, tracking and (eventually) predicting local problems.**

[Live Demo](#) · [Report a Bug](../../issues/new) · [Request a Feature](../../issues/new) · [Roadmap](#-roadmap)

> **Status:** 🚧 In early development. Features below are marked as planned or done in the roadmap. Nothing is claimed as finished until it is merged.

---

## 📌 The problem

People run into problems every day: potholes, water leaks, broken streetlights, power outages, illegal dumping. But they rarely know:

- Who should I report this to?
- Has someone already reported it?
- Is anyone dealing with it?
- How serious is it, and how many people are affected?

The result is duplicate reports, no clear picture of what is happening, and no accountability.

## 💡 The solution

**X - Report** gives every problem a single, trackable record that the whole community can see.

A user reports a problem with a photo, description, location, category and severity. The system creates an issue (for example `XR-1028`) and tracks it through its lifecycle:

```text
Reported → Verified → Assigned → Being Fixed → Resolved
```

Over time, the platform turns raw reports into useful information: maps, hotspots, trends and predictions.

## ✨ Planned features

| Area | Feature |
| --- | --- |
| Reporting | Report a problem with photo, description, location, category and severity |
| Tracking | Unique issue IDs and a clear status lifecycle |
| Map | Interactive map of reported problems |
| Duplicates | Detect possible duplicate reports near the same location |
| Community | Confirm / dispute reports to improve reliability |
| Evidence | Before and after photos when an issue is resolved |
| Analytics | Dashboards, hotspots and trends by area and category |
| AI | Suggested category/severity from photos, smarter duplicate detection |
| Prediction | Flag areas where problems are increasing |

## 🧱 Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React (Vite), JavaScript, CSS |
| Backend / Database | Supabase (Auth, PostgreSQL, Storage) |
| Hosting | Netlify |
| Version control | Git and GitHub (feature branches + pull requests) |

## 🗺️ Roadmap

- [ ] **v1 - MVP:** registration/login, report a problem, image upload, categories, issue list, issue status
- [ ] **v2:** interactive map, duplicate detection, community confirmations, comments, notifications
- [ ] **v3:** analytics, heatmaps, trends, admin dashboard
- [ ] **v4:** AI classification, AI duplicate detection, predictive analytics
- [ ] **v5:** organisation/municipality integration, public API, PWA, automated notifications

## 🚀 Getting started

> Setup steps will be finalised once the first version of the app is merged. The expected flow is:

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/x-report.git

# 2. Go into the project folder
cd x-report

# 3. Install dependencies
npm install

# 4. Create your environment file (see .env.example)
# 5. Start the development server
npm run dev
```

## 🌿 Contributing and workflow

All changes to this project go through **pull requests**. Nothing is pushed directly to `main`.

1. Create (or pick) an **Issue** describing the work
2. Create a branch from `main`, for example `feature/report-problem`
3. Commit your changes with clear messages
4. Push the branch and open a **Pull Request** that references the issue (`Closes #12`)
5. Review, then merge into `main`
6. Netlify automatically deploys `main`

Branch naming: `feature/...`, `fix/...`, `docs/...`, `chore/...`

## 📁 Project structure (planned)

```text
x-report/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── styles/
├── public/
├── docs/
├── tests/
├── README.md
└── package.json
```

## 📄 License

To be decided. (MIT is a common choice for open-source portfolio projects.)

---

Built feature by feature, in the open. Check the [commit history](../../commits/main) and [pull requests](../../pulls) to follow progress.
