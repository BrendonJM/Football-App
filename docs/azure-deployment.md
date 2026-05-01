# Azure Deployment

This app is packaged as a single Docker container. The app listens inside the container on port `3000`.

## Azure Resources To Create

- Resource group
- Azure Container Registry
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
  --settings WEBSITES_PORT=3000 PORT=3000 NODE_ENV=production
```

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

Optional, only if you use the existing backend helper routes:

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

## GitHub Actions Deployment

The workflow at `.github/workflows/azure-container-appservice.yml`:

- Builds the Docker image.
- Pushes both `latest` and the commit SHA tag to Azure Container Registry.
- Points Azure App Service at the commit SHA image.
- Restarts the app.
