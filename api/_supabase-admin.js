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

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function getReminderApprovalSecret() {
  return String(process.env.REMINDER_APPROVAL_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
}

function createReminderApprovalToken({ draftId, eventId, teamId = "", expiresAt }) {
  const secret = getReminderApprovalSecret();

  if (!secret) {
    throw new Error("REMINDER_APPROVAL_SECRET or SUPABASE_SERVICE_ROLE_KEY must be configured.");
  }

  const payload = {
    type: "reminder_approval",
    draftId,
    eventId,
    teamId,
    exp: expiresAt,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encodedPayload}.${signature}`;
}

function verifyReminderApprovalToken(token) {
  const secret = getReminderApprovalSecret();

  if (!secret) {
    throw new Error("REMINDER_APPROVAL_SECRET or SUPABASE_SERVICE_ROLE_KEY must be configured.");
  }

  const [encodedPayload, signature] = String(token || "").split(".");

  if (!encodedPayload || !signature) {
    throw new Error("Reminder approval link is invalid.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (signature.length !== expectedSignature.length) {
    throw new Error("Reminder approval link is invalid.");
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Reminder approval link is invalid.");
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));

  if (payload?.type !== "reminder_approval" || !payload?.draftId || !payload?.eventId) {
    throw new Error("Reminder approval link is invalid.");
  }

  if (payload.exp && Date.now() > new Date(payload.exp).getTime()) {
    throw new Error("Reminder approval link has expired.");
  }

  return payload;
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
  createReminderApprovalToken,
  createSecureToken,
  escapeHtml,
  fetchAdminUserById,
  fetchAuthenticatedUser,
  getSupabaseAdminConfig,
  getReminderApprovalSecret,
  supabaseAdminRequest,
  verifyReminderApprovalToken,
};
