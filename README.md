# Football Manager Pro

This is a lightweight browser app for setting up a football squad, arranging players on a field, and exporting a lineup image.

## What it does

- Lets you enter a team name and squad list
- Lets you choose how many players are on the field
- Includes recommended formation options for common small-sided formats, including 9-a-side
- Supports adding custom formations as long as they match the selected player count
- Shows a dedicated management screen with players laid out on a football field
- Lets you move and swap players between field positions and the bench
- Lets you change formation while keeping the squad loaded
- Supports clipboard image copy where the browser allows it
- Includes a feedback form that can email thoughts to the TeamPro inbox
- Saves the latest team setup in local storage so the board persists between refreshes

## Files

- `index.html` contains the two-page app shell
- `styles.css` contains the football field layout and responsive styling
- `app.js` contains the team configuration, lineup management, and image export logic
- `server.js` serves the static app
- `api/config.js` exposes the public Supabase runtime config for Vercel deployments
- `api/feedback.js` sends feedback emails from the Account page
- `public-config.js` is the generated public runtime config consumed by the browser
- `build-config.js` writes the public Supabase config file during Vercel builds
- `supabase-schema.sql` contains the database schema and public RLS policies for Supabase

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
- This app uses Supabase as a public database client only. It does not use Supabase Auth.

Local environment variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
OPENAI_API_KEY=replace-with-a-new-server-side-openai-key
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=TeamPro <onboarding@resend.dev>
PORT=3000
```

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
OPENAI_API_KEY=replace-with-a-new-server-side-openai-key
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=TeamPro <onboarding@resend.dev>
```

6. Deploy the project.
7. After deploy, open the live URL and confirm:

- `/public-config.js` contains your Supabase URL and anon key values
- `/api/config` returns your Supabase public config
- teams can be created and switched
- a page refresh still shows the same saved teams

### Troubleshooting deployed Supabase connection errors

If the app shows a Supabase connection warning:

1. Open `/public-config.js` on the deployed site.
   It should contain real values, not blank strings.
2. Open `/api/config`.
   It should return JSON with non-empty `supabaseUrl` and `supabaseAnonKey`.
3. In Supabase, confirm:
   - `supabase-schema.sql` has been run successfully
   - the `teams` table exists
   - the public RLS policies from `supabase-schema.sql` were created
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

- Team data is currently stored in browser `localStorage`, so saved teams are local to each user's device.
- Team data is now synced to Supabase when the Supabase environment variables are configured. The browser still keeps a local cached copy for resilience.
- The app does not use Supabase authentication. It reads and writes directly to the `teams` table using the public anon key.
- Image copy may not work from `file://` or restricted in-app browsers. Running from `http://localhost` or a hosted `https://` site is more reliable.

## Good next additions

1. Save multiple teams instead of a single local roster.
2. Add named positional templates like left wing or centre back.
3. Add match-day notes, captains, and substitutes rotation tracking.
4. Add a printable PDF team sheet layout.
