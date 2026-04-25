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
- Exports the current lineup as a PNG and also supports clipboard image copy where the browser allows it
- Saves the latest team setup in local storage so the board persists between refreshes

## Files

- `index.html` contains the two-page app shell
- `styles.css` contains the football field layout and responsive styling
- `app.js` contains the team configuration, lineup management, and image export logic
- `server.js` serves the static app
- `api/config.js` exposes the public Supabase runtime config for Vercel deployments
- `supabase-schema.sql` contains the database schema and RLS policies for Supabase

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. In the Supabase dashboard, open the SQL editor.
3. Run the full contents of `supabase-schema.sql`.
4. In `Authentication` -> `Providers`, enable `Anonymous Sign-Ins`.
5. Copy your project URL and anon key.

Local environment variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
OPENAI_API_KEY=replace-with-a-new-server-side-openai-key
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

### Vercel dashboard flow

1. Push the latest code to GitHub.
2. In Vercel, click `Add New` -> `Project`.
3. Import `BrendonJM/Football-App`.
4. Keep the default project settings.

Recommended settings:

- Framework Preset: `Other`
- Root Directory: project root
- Build Command: leave empty
- Output Directory: leave empty

5. Add these environment variables in Vercel Project Settings -> Environment Variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
OPENAI_API_KEY=replace-with-a-new-server-side-openai-key
```

6. Deploy the project.
7. After deploy, open the live URL and confirm:

- `/api/config` returns your Supabase public config
- teams can be created and switched
- a page refresh still shows the same saved teams

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
- Image copy may not work from `file://` or restricted in-app browsers. Running from `http://localhost` or a hosted `https://` site is more reliable.

## Good next additions

1. Save multiple teams instead of a single local roster.
2. Add named positional templates like left wing or centre back.
3. Add match-day notes, captains, and substitutes rotation tracking.
4. Add a printable PDF team sheet layout.
