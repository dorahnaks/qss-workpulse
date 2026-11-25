# QSS WorkPulse — Client Portal

Next.js client-facing web application where QSS clients monitor deployed teams, production targets, shift output, work activities, and performance reports.

## Architecture & Responsibilities

| Technology       | Responsibility                               |
| ---------------- | -------------------------------------------- |
| Next.js          | Client-facing frontend (this repository)     |
| Laravel          | Backend, REST APIs, and business logic       |
| Laravel Filament | QSS administration and supervisor interfaces |
| Database         | Store and manage application data            |

## Folder Structure

```text
qss-workpulse/
├── public/
│   ├── icons/                      # Static SVG & app icons
│   └── images/                     # Brand logos & static imagery
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Client authentication routes
│   │   │   ├── login/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (portal)/               # Authenticated client portal routes
│   │   │   ├── dashboard/          # Overview: workers, teams, targets vs actuals
│   │   │   ├── daily-performance/  # Completed work, pending work, target achievement
│   │   │   ├── shift-performance/  # Shift-by-shift production monitoring
│   │   │   ├── team-performance/   # Individual team output & comparisons
│   │   │   ├── work-activities/    # Assigned activities & completion status
│   │   │   ├── reports/            # Daily, weekly & monthly reports + downloads
│   │   │   ├── notifications/      # Production & shift updates
│   │   │   └── settings/           # Company profile & account settings
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Basic home page
│   ├── components/
│   │   ├── ui/                     # Reusable UI primitives (buttons, inputs, cards, tables)
│   │   ├── layout/                 # Portal shell (sidebar, topbar, auth layout)
│   │   ├── charts/                 # Data visualization components
│   │   └── features/               # Feature-scoped components by portal module
│   │       ├── auth/
│   │       ├── dashboard/
│   │       ├── daily-performance/
│   │       ├── shift-performance/
│   │       ├── team-performance/
│   │       ├── work-activities/
│   │       ├── reports/
│   │       ├── notifications/
│   │       └── settings/
│   ├── config/
│   │   └── navigation.ts           # Main portal navigation & auth route constants
│   ├── context/                    # React contexts (auth session, client state)
│   ├── hooks/                      # Custom hooks (API queries, filters, pagination)
│   ├── lib/
│   │   ├── api/                    # Laravel HTTP client & auth token handling
│   │   └── utils/                  # Formatting, date/shift, and UI helpers
│   ├── services/                   # Domain API service modules calling Laravel endpoints
│   └── types/                      # Shared TypeScript interfaces & API DTOs
├── .env.example
└── package.json
```

> Empty directories include `.gitkeep` files so Git tracks the full structure on your initial push.

## Getting Started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## Pushing to Git

```bash
git add .
git commit -m "chore: initialize Next.js client portal structure and home page"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```
