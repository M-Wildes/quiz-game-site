# QuizForge Website Starter

This project is a production-minded starter for your quiz game website. It includes:

- a marketing homepage
- a release download hub
- sign up and login flows
- a dashboard shell for synced player stats
- a leaderboard page
- a battle pass page
- API routes for latest release metadata, auth, player stats, leaderboard data, and quiz result uploads
- Supabase schema and middleware setup

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth + Postgres
- GitHub Releases for build distribution

## Getting Started

1. Copy `.env.example` to `.env.local`.
2. Fill in your Supabase and GitHub release values.
3. Run the SQL in `supabase/schema.sql`.
4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_TOKEN=
```

`GITHUB_TOKEN` is optional, but it helps avoid low anonymous rate limits when fetching the latest release metadata.

## Database Notes

The starter expects these Supabase tables:

- `profiles`
- `quiz_results`
- `user_stats`
- `leaderboard_entries`
- `seasons`
- `battle_pass_tiers`
- `user_battle_pass_progress`

The included SQL script also adds:

- a profile + stats bootstrap trigger for new users
- stat updates when quiz results are inserted
- row-level security policies for player-owned data

## API Endpoints

- `GET /api/download/latest`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/game/upload-result`
- `GET /api/leaderboard`
- `GET /api/me/stats`

## Important Behaviour

- If Supabase or GitHub release env vars are missing, the UI falls back to preview data instead of crashing.
- The upload endpoint calculates score and XP server-side before writing results.
- The web app uses cookie-based auth through Supabase SSR helpers.

## Next Recommended Steps

1. Point the desktop quiz app at `/api/auth/login` and `/api/game/upload-result`.
2. Replace the mock rewards and marketing copy with your real theme.
3. Add an admin page for new seasons, reward tracks, and release notes.
