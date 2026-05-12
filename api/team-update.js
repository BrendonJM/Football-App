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
  const payload = request.body || {};
  const teamName = String(payload.teamName || "TeamPro").trim();
  const messageText = String(payload.messageText || "").trim();
  const eventRecord = payload.event || {};
  const recipients = Array.isArray(payload.recipients) ? payload.recipients : [];
  const emailRecipients = recipients
    .map((recipient) => ({
      name: String(recipient.name || "").trim(),
      email: String(recipient.email || "").trim(),
    }))
    .filter((recipient) => recipient.email);

  if (!eventRecord.eventTitle || !messageText) {
    response.status(400).json({
      error: "event and messageText are required.",
    });
    return;
  }

  if (!emailRecipients.length) {
    response.status(400).json({
      error: "Select at least one contact with an email address.",
    });
    return;
  }

  if (!resendApiKey || !resendFromEmail) {
    console.warn("[Updates] Resend is not fully configured", {
      hasApiKey: Boolean(resendApiKey),
      hasFromEmail: Boolean(resendFromEmail),
    });
    response.status(200).json({
      ok: true,
      sent: false,
      warning: "Email sending is not configured yet. The message preview is ready to copy instead.",
      subject: buildSubject(teamName, eventRecord),
    });
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
        to: emailRecipients.map((recipient) => recipient.email),
        subject: buildSubject(teamName, eventRecord),
        text: messageText,
        html: buildUpdateHtml({
          teamName,
          eventRecord,
          messageText,
        }),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend request failed: ${errorText}`);
    }

    const resendJson = await resendResponse.json();
    response.status(200).json({
      ok: true,
      sent: true,
      id: resendJson.id || null,
      subject: buildSubject(teamName, eventRecord),
    });
  } catch (error) {
    console.error("[Updates] Email send failed", {
      error,
      message: error?.message || String(error),
      hasApiKey: Boolean(resendApiKey),
      fromEmail: resendFromEmail || null,
      recipientCount: emailRecipients.length,
    });
    response.status(500).json({
      error: error?.message || "Event update email failed to send.",
    });
  }
};

function buildSubject(teamName, eventRecord) {
  return `${teamName} update: ${eventRecord.eventTitle}`;
}

function buildUpdateHtml({ teamName, eventRecord, messageText }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 12px;">${escapeHtml(teamName)} update</h2>
      <p><strong>Event:</strong> ${escapeHtml(String(eventRecord.eventTitle || ""))}</p>
      ${eventRecord.eventDate ? `<p><strong>Date:</strong> ${escapeHtml(String(eventRecord.eventDate))}</p>` : ""}
      ${eventRecord.eventTime ? `<p><strong>Time:</strong> ${escapeHtml(String(eventRecord.eventTime))}</p>` : ""}
      ${eventRecord.location ? `<p><strong>Location:</strong> ${escapeHtml(String(eventRecord.location))}</p>` : ""}
      <div style="padding: 12px 14px; border-radius: 12px; background: #f3f4f6; white-space: pre-wrap;">${escapeHtml(messageText)}</div>
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
