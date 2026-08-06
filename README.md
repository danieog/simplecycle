# simplecycle: the easiest way to apply to school
a tracker for applications to schools (med / law / grad)

keeping track of your applications is difficult, but by using simplecycle, we hope to keep you stress-free

## Stack
Next.js (App Router) + Tailwind + Supabase (Postgres, Auth).

## Getting started
1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run [supabase/schema.sql](supabase/schema.sql) to create tables, row-level security policies, and the profile-creation trigger.
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL and anon key (Project Settings → API).
4. `npm install`
5. `npm run dev`

## Current features
- Email/password auth (Supabase Auth) with protected `/dashboard` routes.
- School tracker: tuition (in/out state), location, national ranking vs. your own ranking, status, pros/cons, alignment notes, clubs of interest.
- Secondary application tracker: received y/n, date received, auto two-week submission deadline, submitted date.
- Interview invite tracker: invited y/n, invite date, interview date.
- Exam score tracker (MCAT and others) with a stats page.
- Essay prompt tracker per school.

## Planned
- AI-assisted essay feedback/rewrite suggestions and school recommendations based on stats (`ai_feedback` column and stats page already stubbed).
- Email alerts (`email_alerts` table already in schema) for secondary deadlines, letter of recommendation reminders, and interview prep — needs a scheduled job (e.g. Supabase Edge Function on a cron trigger) to send via an email provider.
