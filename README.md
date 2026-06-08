# TeamPro

This is a lightweight browser app for setting up grassroots sports teams, arranging players on a match-day layout, planning training sessions, managing team contacts and events, and sending group updates.

## What it does

- Lets you enter a team name, sport type, and squad list
- Supports football, rugby, softball, and cricket teams
- Lets you choose the right team size for each sport
- Keeps football formation options for common small-sided formats
- Shows a dedicated match-day management screen with a sport-specific field layout
- Lets you move and swap players between field positions and the bench
- Keeps football formations working while rugby, softball, and cricket use standard position layouts
- Lets you manage team contacts for each saved squad
- Lets you create team events with dates, times, locations, and notes
- Lets you preview, copy, and email event updates to selected contacts
- Lets contacts RSVP from event emails without logging in
- Shows RSVP availability, notes, and response times back inside TeamPro
- Includes an AI Assistant that turns plain-English coach instructions into draft event and communication workflows
- Generates reminder drafts for upcoming events and emails the team admin for review before anything is sent
- Lets coaches manage a global reminder schedule policy from the Account tab
- Supports clipboard image copy where the browser allows it
- Includes a feedback form that can email thoughts to the TeamPro inbox
- Uses Supabase Auth so each user only sees their own teams, contacts, and events

## Files

- `index.html` contains the two-page app shell
- `styles.css` contains the sport field layouts and responsive styling
- `app.js` contains the team configuration, sport layout engine, lineup management, and image export logic
- `server.js` serves the static app
- `api/config.js` exposes the public Supabase runtime config for Vercel deployments
- `api/feedback.js` sends feedback emails from the Account page
- `api/team-update.js` sends event update emails through Resend when configured
- `api/ai/communication-draft.js` generates structured AI communication drafts server-side using OpenAI
- `api/rsvp.js` powers the public RSVP lookup and submission flow
- `api/reminder-scheduler.js` checks upcoming events, creates reminder drafts, and emails admins to review them
- `rsvp.html` and `rsvp.js` provide the public RSVP page
- `public-config.js` is the generated public runtime config consumed by the browser
- `build-config.js` writes the public Supabase config file during Vercel builds
- `supabase-schema.sql` contains the authenticated user-scoped schema and RLS policies for Supabase

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. In the Supabase dashboard, open the SQL editor.
3. Run the full contents of `supabase-schema.sql`.
4. Copy your project URL and anon key.

Important:

- `SUPABASE_ANON_KEY` is safe to expose to the browser.
- Never use the Supabase `service_role` key in frontend code.
- `SUPABASE_SERVICE_ROLE_KEY` is required server-side for RSVP links and public RSVP updates.
- `OPENAI_API_KEY` is required server-side for AI training plans and AI communication drafts.
- This app uses Supabase Auth and user-based RLS.

Local environment variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-side-service-role-key
OPENAI_API_KEY=replace-with-a-new-server-side-openai-key
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=TeamPro <onboarding@resend.dev>
TEAMPRO_APP_BASE_URL=https://www.teampro.co.nz
CRON_SECRET=replace-with-a-long-random-string
PORT=3000
```

Resend is optional for event updates:

- If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is missing, coaches can still preview and copy event messages.
- Email sending is only enabled when Resend is configured.
- If `SUPABASE_SERVICE_ROLE_KEY` is missing, RSVP links and public RSVP updates will not work.
- `TEAMPRO_APP_BASE_URL` is used in admin reminder review links and should point at the live TeamPro site.
- `CRON_SECRET` is optional for manual scheduler triggers outside the signed-in TeamPro UI and for local testing.

## Share on GitHub

This project is now structured to be pushed to GitHub as a normal repository.

1. Create a new empty repository on GitHub.
2. In this project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. If you want to share it publicly in a browser, deploy it after pushing to GitHub using GitHub Pages, Netlify, or Vercel.

## Deploy on Vercel

This project is ready to deploy on Vercel as:

- static files from the project root
- one Node function at `api/config.js`
- one generated public config file at `public-config.js`

### Vercel dashboard flow

1. Push the latest code to GitHub.
2. In Vercel, click `Add New` -> `Project`.
3. Import `BrendonJM/Football-App`.
4. Keep the default project settings.

Recommended settings:

- Framework Preset: `Other`
- Root Directory: project root
- Build Command: `npm run build`
- Output Directory: leave empty

5. Add these environment variables in Vercel Project Settings -> Environment Variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-side-service-role-key
OPENAI_API_KEY=replace-with-a-new-server-side-openai-key
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=TeamPro <onboarding@resend.dev>
TEAMPRO_APP_BASE_URL=https://www.teampro.co.nz
CRON_SECRET=replace-with-a-long-random-string
```

6. Deploy the project.
7. After deploy, open the live URL and confirm:

- `/public-config.js` contains your Supabase URL and anon key values
- `/api/config` returns your Supabase public config
- teams can be created and switched
- contacts and events save and reload after sign-in
- RSVP links from event emails load and submit successfully
- reminder drafts appear in `ai_communication_drafts` when the reminder scheduler runs
- admin reminder review emails arrive before any team-member reminder is sent
- a page refresh still shows the same saved teams, contacts, and events

### Troubleshooting deployed Supabase connection errors

If the app shows a Supabase connection warning:

1. Open `/public-config.js` on the deployed site.
   It should contain real values, not blank strings.
2. Open `/api/config`.
   It should return JSON with non-empty `supabaseUrl` and `supabaseAnonKey`.
3. In Supabase, confirm:
   - `supabase-schema.sql` has been run successfully
  - the `teams`, `team_contacts`, `team_events`, `event_update_logs`, `event_rsvps`, `ai_communication_drafts`, and `user_settings` tables exist
  - the authenticated RLS policies from `supabase-schema.sql` were created
4. If the schema changed after an earlier deploy, redeploy on Vercel after updating env vars.

### Vercel CLI flow

If you prefer CLI:

```bash
vercel
```

Or from anywhere:

```bash
vercel --cwd "/Users/brendonmoore/Documents/New project"
```

Then add the same environment variables in Vercel and redeploy if needed.

## Notes

- Team, contact, and event data are stored in Supabase and scoped by authenticated user ID.
- Events can be one-off or generated as weekly repeating occurrences, with one row per occurrence so RSVP responses stay event-specific.
- AI communication drafts are saved in `ai_communication_drafts` and remain private to the authenticated coach through RLS.
- Reminder schedule defaults live in `user_settings` and are managed globally from the Account tab.
- Scheduled reminders create `pending_review` drafts in `ai_communication_drafts`; no team-member emails are sent automatically.
- Changing an event to `Cancelled` creates an admin approval draft for a cancellation message before anything is sent to team contacts.
- Event emails now include a standard `.ics` calendar invite so Gmail/Google Calendar can add the event directly, use native calendar RSVP where supported, and process later cancellation updates against the same calendar item.
- On Vercel Hobby, a daily cron calls `/api/reminder-scheduler` around early NZ morning and admins can also trigger `Generate Due Reminders` from the Account tab at any time.
- Public RSVP updates are handled only through server-side API routes using secure random tokens.
- The browser still keeps a local cached copy for resilience, but Supabase is the source of truth after login.
- Image copy may not work from `file://` or restricted in-app browsers. Running from `http://localhost` or a hosted `https://` site is more reliable.

## Reminder scheduler architecture

- Reminder timing is configured globally per account in `user_settings` with three toggles:
  - 3 days before
  - 1 day before
  - day of event
- The scheduler never emails team members directly.
- Instead, it creates one `pending_review` draft per event per reminder type in `ai_communication_drafts`.
- Event cancellations also create `pending_review` drafts in `ai_communication_drafts` using the `event_cancellation` draft type.
- When reminders or event updates are approved and sent, the outgoing team-member emails include calendar invite attachments:
  - normal event messages use `METHOD:REQUEST`
  - cancellation messages use `METHOD:CANCEL`
  - TeamPro RSVP links remain in the email as a fallback when native calendar RSVP is unavailable
- Duplicate drafts are prevented with a unique index on `event_id + reminder_type`.
- After a reminder draft is created, TeamPro emails the signed-in team admin a review link and dismiss link.
- The admin email includes:
  - `Review & Send` to open the draft in TeamPro and edit before sending
  - `Accept & Send` to open TeamPro and immediately send the pending reminder if no edits are needed
  - `Dismiss` to discard the reminder draft
- The admin can still review the draft, adjust recipients if needed, and explicitly approve sending from inside TeamPro.
- The production fallback for Vercel Hobby is:
  - one daily cron run via `vercel.json`
  - plus the `Generate Due Reminders` button in the Account tab for immediate/manual checks

## Manual AI communication draft test

1. Sign in to TeamPro and choose a saved team.
2. Open `Events`.
3. In `AI Assistant`, enter a general update prompt.
4. Confirm TeamPro returns:
   - intent
   - email subject/body
   - SMS body
   - recipient suggestion
   - RSVP suggestion
5. Enter a new event prompt and click `Create Event from Draft`.
6. Confirm the new event row appears in `team_events`.
7. Enter an update or cancellation prompt.
8. Choose the target event in the draft review and apply the update or cancellation.
9. Copy the email and SMS draft text.
10. Confirm no message is sent until you explicitly click `Send Draft Email`.

## Manual reminder scheduler test

1. Sign in to TeamPro and create an event more than 3 days in the future.
2. In `Account`, confirm the default reminder schedule is enabled as expected.
3. Make sure the team has at least one contact with an email address.
4. In `Account`, click `Generate Due Reminders`.
5. Confirm TeamPro reports whether drafts were created, skipped, or already existed.
6. Confirm a `pending_review` draft row appears in `ai_communication_drafts`.
7. Confirm the team admin receives the reminder review email.
8. Confirm no team-member reminder emails are sent automatically.
9. Open the `Review & Send` link and confirm TeamPro opens the correct event and reminder draft.
10. Approve/send the reminder and confirm recipients receive it.
11. Trigger the reminder check again and confirm duplicate drafts are not created.
12. Repeat for 1-day and same-day reminder timings.

Optional local API trigger:

```bash
curl -X POST http://localhost:3000/api/reminder-scheduler \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -d '{}'
```

## Manual event and RSVP test

1. Sign in to TeamPro.
2. Create or choose a team with at least one contact that has an email address.
3. Create a one-off event in `Events`.
4. Create a weekly repeating training event with a repeat end date and confirm multiple event rows are created.
5. Open an event in `Events`, prepare a reminder or update, and send the email to the contact.
6. Open the RSVP link from the email and submit `Yes`, `No`, or `Maybe`.
7. Confirm the `event_rsvps` table in Supabase contains the response against the correct `event_id`.
8. Refresh TeamPro and return to `Events`.
9. Confirm the `Availability` section shows the RSVP status, note, response time, and counts for that event.
10. Select a different future event and confirm it has its own separate RSVP records and counts.
11. Log out and back in, then confirm the saved events and RSVP states still load correctly.

## Good next additions

1. Save multiple teams instead of a single local roster.
2. Add named positional templates like left wing or centre back.
3. Add match-day notes, captains, and substitutes rotation tracking.
4. Add a printable PDF team sheet layout.
