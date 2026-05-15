const crypto = require("crypto");

function getSupabaseAdminConfig() {
  return {
    supabaseUrl: String(process.env.SUPABASE_URL || "").trim(),
    supabaseAnonKey: String(process.env.SUPABASE_ANON_KEY || "").trim(),
    serviceRoleKey: String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim(),
  };
}

function assertSupabaseAdminConfig(config) {
  if (!config.supabaseUrl || !config.supabaseAnonKey || !config.serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must all be configured.",
    );
  }
}

async function fetchAuthenticatedUser({ supabaseUrl, supabaseAnonKey, accessToken }) {
  if (!supabaseUrl || !supabaseAnonKey || !accessToken) {
    throw new Error("Supabase auth verification is missing required inputs.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      payload?.msg ||
      payload?.message ||
      payload?.error_description ||
      response.statusText ||
      "Supabase user verification failed.",
    );
  }

  return payload;
}

async function fetchAdminUserById({ supabaseUrl, serviceRoleKey, userId }) {
  if (!supabaseUrl || !serviceRoleKey || !userId) {
    throw new Error("Supabase admin user lookup is missing required inputs.");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      payload?.msg ||
      payload?.message ||
      payload?.error_description ||
      response.statusText ||
      "Supabase admin user lookup failed.",
    );
  }

  return payload?.user || payload;
}

async function supabaseAdminRequest({ supabaseUrl, serviceRoleKey, tableName, method = "GET", query = {}, body = null, headers = {} }) {
  const url = new URL(`${supabaseUrl}/rest/v1/${tableName}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
      payload?.error_description ||
      payload?.details ||
      payload?.hint ||
      response.statusText ||
      `Supabase ${tableName} request failed.`,
    );
  }

  return payload;
}

async function parseJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    return { raw: text };
  }
}

function createSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}

function buildRsvpBaseUrl(baseUrl) {
  const safeBase = String(baseUrl || "").trim().replace(/\/$/, "");
  return safeBase || "https://www.teampro.co.nz";
}

function buildRsvpLink({ baseUrl, token, response }) {
  const url = new URL(`${buildRsvpBaseUrl(baseUrl)}/rsvp`);
  url.searchParams.set("token", token);
  if (response) {
    url.searchParams.set("response", response);
  }
  return url.toString();
}

function buildTokenExpiry(eventDate) {
  if (!eventDate) {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString();
  }

  const parsed = new Date(`${eventDate}T23:59:59Z`);
  const fallback = Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
  return new Date(fallback + 1000 * 60 * 60 * 24 * 14).toISOString();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = {
  assertSupabaseAdminConfig,
  buildRsvpBaseUrl,
  buildRsvpLink,
  buildTokenExpiry,
  createSecureToken,
  escapeHtml,
  fetchAdminUserById,
  fetchAuthenticatedUser,
  getSupabaseAdminConfig,
  supabaseAdminRequest,
};
