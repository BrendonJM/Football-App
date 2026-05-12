const FEEDBACK_TO_EMAIL = "brendonjmoore@gmail.com";

module.exports = async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const resendApiKey = String(process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = String(process.env.RESEND_FROM_EMAIL || "").trim();

  if (!resendApiKey || !resendFromEmail) {
    console.warn("[Feedback] Resend is not fully configured", {
      hasApiKey: Boolean(resendApiKey),
      hasFromEmail: Boolean(resendFromEmail),
    });
    response.status(500).json({
      error: "Email sending is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL for TeamPro email sending.",
    });
    return;
  }

  const payload = request.body || {};
  const message = String(payload.message || "").trim();
  const userEmail = String(payload.userEmail || "").trim();
  const page = String(payload.page || "").trim();
  const appName = String(payload.app || "TeamPro").trim();

  if (!message) {
    response.status(400).json({ error: "Feedback message is required." });
    return;
  }

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [FEEDBACK_TO_EMAIL],
        subject: `${appName} feedback`,
        text: buildFeedbackText({ message, userEmail, page, appName }),
        html: buildFeedbackHtml({ message, userEmail, page, appName }),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend request failed: ${errorText}`);
    }

    const resendJson = await resendResponse.json();
    response.status(200).json({
      ok: true,
      id: resendJson.id || null,
    });
  } catch (error) {
    console.error("[Feedback] Email send failed", {
      error,
      message: error?.message || String(error),
      hasApiKey: Boolean(resendApiKey),
      fromEmail: resendFromEmail || null,
    });
    response.status(500).json({
      error: error?.message || "Feedback email failed to send.",
    });
  }
};

function buildFeedbackText({ message, userEmail, page, appName }) {
  return [
    `${appName} feedback received`,
    "",
    `From user: ${userEmail || "Not signed in"}`,
    `Current page: ${page || "Unknown"}`,
    "",
    "Feedback:",
    message,
  ].join("\n");
}

function buildFeedbackHtml({ message, userEmail, page, appName }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(appName)} feedback received</h2>
      <p><strong>From user:</strong> ${escapeHtml(userEmail || "Not signed in")}</p>
      <p><strong>Current page:</strong> ${escapeHtml(page || "Unknown")}</p>
      <p><strong>Feedback:</strong></p>
      <div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
