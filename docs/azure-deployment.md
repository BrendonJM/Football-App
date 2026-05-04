# Azure Deployment

This app is packaged as a single Docker container. The app listens inside the container on port `3000`.

## Azure Resources To Create

- Resource group
- Azure Container Registry
- Azure Storage account with a private blob container for report share links
- Linux App Service plan
- Azure App Service for Containers
- Service principal or federated identity for GitHub Actions deployment

Example variables:

```bash
RESOURCE_GROUP=rg-spreadsheet-report-builder
LOCATION=australiaeast
ACR_NAME=<globally-unique-acr-name>
APP_SERVICE_PLAN=asp-spreadsheet-report-builder
WEBAPP_NAME=<globally-unique-webapp-name>
IMAGE_NAME=spreadsheet-report-builder
STORAGE_ACCOUNT=<globally-unique-storage-name>
SHARE_CONTAINER=report-shares
```

## Create Azure Resources

```bash
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION"

az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true

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

az appservice plan create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_SERVICE_PLAN" \
  --is-linux \
  --sku B1

az webapp create \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$APP_SERVICE_PLAN" \
  --name "$WEBAPP_NAME" \
  --deployment-container-image-name "$ACR_NAME.azurecr.io/$IMAGE_NAME:latest"
```

## App Service Configuration

Set the container port expected by Azure App Service:

```bash
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --settings \
    WEBSITES_PORT=3000 \
    PORT=3000 \
    NODE_ENV=production \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION_STRING" \
    AZURE_BLOB_CONTAINER_NAME="$SHARE_CONTAINER"
```

`AZURE_STORAGE_CONNECTION_STRING` should be stored only in Azure App Service or Azure Container Apps configuration. Do not commit it.

Allow the Web App to pull from ACR. One simple option is to use ACR admin credentials:

```bash
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query passwords[0].value -o tsv)

az webapp config container set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --docker-custom-image-name "$ACR_NAME.azurecr.io/$IMAGE_NAME:latest" \
  --docker-registry-server-url "https://$ACR_NAME.azurecr.io" \
  --docker-registry-server-user "$ACR_USERNAME" \
  --docker-registry-server-password "$ACR_PASSWORD"
```

## Build And Push Manually

```bash
az acr login --name "$ACR_NAME"

docker build --provenance=false --platform linux/amd64 -t "$ACR_NAME.azurecr.io/$IMAGE_NAME:latest" .
docker push "$ACR_NAME.azurecr.io/$IMAGE_NAME:latest"

az webapp restart \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME"
```

## GitHub Actions Secrets

Add these repository secrets in GitHub:

- `AZURE_CREDENTIALS`: JSON credentials for `azure/login`.
- `AZURE_WEBAPP_NAME`: your Azure Web App name.
- `AZURE_RESOURCE_GROUP`: your Azure resource group name.
- `ACR_LOGIN_SERVER`: for example, `myregistry.azurecr.io`.
- `ACR_USERNAME`: ACR username.
- `ACR_PASSWORD`: ACR password.

Create a service principal for `AZURE_CREDENTIALS`:

```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

az ad sp create-for-rbac \
  --name "sp-spreadsheet-report-builder-github" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
  --sdk-auth
```

Use the JSON output as the `AZURE_CREDENTIALS` secret.

## Runtime Environment Variables

Required:

- `WEBSITES_PORT=3000`
- `PORT=3000`
- `NODE_ENV=production`
- `AZURE_STORAGE_CONNECTION_STRING`: storage account connection string used by `/api/shares`.
- `AZURE_BLOB_CONTAINER_NAME`: private blob container where share JSON records are stored.

Optional:

- `SHARE_DEFAULT_TTL_DAYS`: default expiry window for share links. Leave unset or `0` for no default expiry.
- `SHARE_MAX_BYTES`: maximum JSON share payload size. Defaults to `5242880`.
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Set App Service variables with:

```bash
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --settings KEY=value
```

## Share Link Storage

`/api/shares` stores each shared report as one JSON blob named `<share-id>.json`.

The share id is generated with 128 bits of cryptographic randomness and is included in URLs as `?share=<token>`. Selected bar and active-series state are stored inside the share JSON record, not in the URL. When a shared URL is opened, the app switches to read-only mode and hides upload/configuration controls.

Share records support an optional `expiresAt` ISO timestamp. If a user chooses a share expiry date in the app, that date is saved with the blob record. If `SHARE_DEFAULT_TTL_DAYS` is set, links without an explicit expiry receive that default. Expired links return HTTP `410`.

For local development only, if Azure Blob environment variables are not set and `NODE_ENV` is not `production`, share records are stored in `SHARE_STORE_PATH` or the OS temp directory. In production, Azure Blob configuration is required.

## Azure Container Apps Configuration

For Azure Container Apps, set the same runtime variables as secrets or environment variables:

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
```

Make sure the Container App target port remains `3000`.

## GitHub Actions Deployment

The workflow at `.github/workflows/azure-container-appservice.yml`:

- Builds the Docker image.
- Pushes both `latest` and the commit SHA tag to Azure Container Registry.
- Points Azure App Service at the commit SHA image.
- Restarts the app.
