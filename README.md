# Football Team Board

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

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`.

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

## Notes

- Team data is currently stored in browser `localStorage`, so saved teams are local to each user's device.
- Image copy may not work from `file://` or restricted in-app browsers. Running from `http://localhost` or a hosted `https://` site is more reliable.

## Good next additions

1. Save multiple teams instead of a single local roster.
2. Add named positional templates like left wing or centre back.
3. Add match-day notes, captains, and substitutes rotation tracking.
4. Add a printable PDF team sheet layout.
