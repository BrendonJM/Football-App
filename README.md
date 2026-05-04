# Spreadsheet Report Builder

This is a lightweight standalone dashboard for building reports from Excel or CSV exports.

## What it does

- Accepts dropped or selected `.xlsx`, `.xls`, and `.csv` files in the browser
- Reads uploaded column names and exposes them as X-axis, Y-axis, and breakdown options
- Builds vertical bar charts by default
- Uses count of rows as the default Y-axis measure
- Lets users toggle breakdown filters from the legend
- Shows hover details and a selected-value breakdown
- Includes a grouped source table
- Copies a short shareable URL backed by stored JSON share records

## Files

- `index.html` contains the dashboard shell
- `styles.css` contains the report layout and responsive styling
- `app.js` contains upload parsing, grouping logic, and dashboard interactions
- `server.js` serves the static app
- `docs/azure-deployment.md` covers Azure Blob-backed share storage and container deployment

## Run locally

```bash
npm start
```

Then open `http://localhost:3000`.

When running locally without Azure Blob environment variables, share records are stored in a temporary local JSON file. Production deployments must configure Azure Blob Storage for `/api/shares`.

## Run with Docker

Build the image:

```bash
docker build -t spreadsheet-report-builder .
```

Run the container:

```bash
docker run --rm -p 3000:3000 spreadsheet-report-builder
```

Then open `http://localhost:3000`.

## Deploy To Azure

See [docs/azure-deployment.md](docs/azure-deployment.md) for Azure Container Registry, Azure App Service for Containers, environment variables, and GitHub Actions CI/CD setup.

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

This project is ready to deploy on Vercel as static files from the project root.

### Vercel dashboard flow

1. Push the latest code to GitHub.
2. In Vercel, click `Add New` -> `Project`.
3. Import the GitHub repository.
4. Keep the default project settings.

Recommended settings:

- Framework Preset: `Other`
- Root Directory: project root
- Build Command: `npm run build`
- Output Directory: leave empty

5. Deploy the project.
6. Open the live URL, upload a file, apply filters, and use `Copy share link` to share that exact view.

### Vercel CLI flow

If you prefer CLI:

```bash
vercel
```

Or from anywhere:

```bash
vercel --cwd "/Users/brendonmoore/Documents/New project"
```

No environment variables are required for the dashboard.

## Share Storage

Production share links require:

- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_BLOB_CONTAINER_NAME`
- `NODE_ENV=production`

Optional:

- `SHARE_DEFAULT_TTL_DAYS`
- `SHARE_MAX_BYTES`

Shared URLs load in read-only mode and use the format `?share=<token>`.

The app exposes `GET /api/health` for non-secret diagnostics. The `shareStorage.provider` value should be `azure-blob` in production. If production Blob Storage is missing, `/api/shares` returns a helpful `500` response naming the missing env vars.

### Azure Blob setup for shares

Create a storage account and private container:

```bash
RESOURCE_GROUP=rg-fol-reportbuilder-aue-dev
LOCATION=australiaeast
STORAGE_ACCOUNT=<globally-unique-storage-name>
SHARE_CONTAINER=report-shares

az storage account create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$STORAGE_ACCOUNT" \
  --location "$LOCATION" \
  --sku Standard_LRS

STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
  --resource-group "$RESOURCE_GROUP" \
  --name "$STORAGE_ACCOUNT" \
  --query connectionString \
  -o tsv)

az storage container create \
  --name "$SHARE_CONTAINER" \
  --connection-string "$STORAGE_CONNECTION_STRING" \
  --public-access off
```

Configure Azure Container Apps:

```bash
CONTAINER_APP_NAME=ca-fol-reportbuilder-aue-dev

az containerapp secret set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_APP_NAME" \
  --secrets azure-storage-connection-string="$STORAGE_CONNECTION_STRING"

az containerapp update \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_APP_NAME" \
  --set-env-vars \
    PORT=3000 \
    NODE_ENV=production \
    AZURE_STORAGE_CONNECTION_STRING=secretref:azure-storage-connection-string \
    AZURE_BLOB_CONTAINER_NAME="$SHARE_CONTAINER"

az containerapp revision restart \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_APP_NAME" \
  --revision ca-fol-reportbuilder-aue-dev--0000001
```

After restart, verify:

```bash
curl https://<container-app-url>/api/health
```

Expected production share storage:

```json
{
  "shareStorage": {
    "provider": "azure-blob",
    "configured": true,
    "productionReady": true
  }
}
```

### Manual share tests

Local development:

```bash
NODE_ENV=development PORT=3000 npm start
curl -X POST http://localhost:3000/api/shares \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.csv","mapping":{"xAxis":"Pipeline","yAxis":"__count"},"rows":[{"xValue":"Renewals","seriesName":"All rows","value":1}]}'
```

Production missing env vars:

```bash
NODE_ENV=production PORT=3000 npm start
curl -i -X POST http://localhost:3000/api/shares \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.csv","mapping":{"xAxis":"Pipeline"},"rows":[{"xValue":"Renewals","seriesName":"All rows","value":1}]}'
```

Expected: HTTP `500` with `shareStorage.missingEnvVars`.

Production Azure Blob:

```bash
NODE_ENV=production \
AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION_STRING" \
AZURE_BLOB_CONTAINER_NAME="$SHARE_CONTAINER" \
PORT=3000 npm start
```

Then create a share with the same `curl` command and load it with `GET /api/shares/<token>`.

## Notes

- Uploaded files are parsed locally in the browser.
- Share records are stored as JSON objects in Azure Blob Storage for hosted deployments.
- For broad sharing, deploy to a hosted HTTPS URL.

## Good next additions

1. Add downloadable PNG or PDF exports.
2. Add CSV download for the filtered source table.
3. Add date or deal-stage filters if those fields are included in a future export.
