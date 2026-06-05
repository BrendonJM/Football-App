const DEFAULT_EVENT_TIMEZONE = "Pacific/Auckland";

function buildCalendarInviteAttachment({
  eventRecord,
  teamName,
  contact,
  messageText,
  fromEmail,
  includeRsvp = true,
  baseUrl = "https://www.teampro.co.nz",
}) {
  const method = getCalendarMethod(eventRecord);
  const icsText = buildCalendarInviteText({
    eventRecord,
    teamName,
    contact,
    messageText,
    fromEmail,
    includeRsvp,
    baseUrl,
    method,
  });

  return {
    filename: buildCalendarFilename(eventRecord, method),
    content: Buffer.from(icsText, "utf8").toString("base64"),
  };
}

function getCalendarMethod(eventRecord) {
  return String(eventRecord?.status || "").trim().toLowerCase() === "cancelled" ? "CANCEL" : "REQUEST";
}

function buildCalendarInviteText({
  eventRecord,
  teamName,
  contact,
  messageText,
  fromEmail,
  includeRsvp,
  baseUrl,
  method,
}) {
  const eventId = String(eventRecord?.id || "").trim() || `teampro-${Date.now()}`;
  const uid = buildCalendarUid(eventId, baseUrl);
  const dtStamp = formatDateTimeUtc(new Date());
  const dtStartLocal = getEventStartDateTimeLocal(eventRecord);
  const dtEndLocal = getEventEndDateTimeLocal(eventRecord, dtStartLocal);
  const organizerEmail = extractEmailAddress(fromEmail) || "noreply@teampro.co.nz";
  const sequence = buildCalendarSequence(eventRecord);
  const status = method === "CANCEL" ? "CANCELLED" : "CONFIRMED";
  const timezone = getEventTimezone(eventRecord);
  const description = buildCalendarDescription({
    eventRecord,
    teamName,
    contact,
    messageText,
    includeRsvp,
    baseUrl,
  });

  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//TeamPro//Event Invite//EN",
    "VERSION:2.0",
    `METHOD:${method}`,
    "CALSCALE:GREGORIAN",
    `X-WR-TIMEZONE:${timezone}`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `SEQUENCE:${sequence}`,
    `SUMMARY:${escapeIcsText(eventRecord?.event_title || `${teamName} event`)}`,
    `DTSTART;TZID=${timezone}:${formatDateTimeLocal(dtStartLocal)}`,
    `DTEND;TZID=${timezone}:${formatDateTimeLocal(dtEndLocal)}`,
    `STATUS:${status}`,
    `LOCATION:${escapeIcsText(eventRecord?.location || "")}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `ORGANIZER;CN=${escapeIcsText(teamName || "TeamPro")}:mailto:${organizerEmail}`,
    buildAttendeeLine(contact),
    method === "CANCEL" ? "TRANSP:TRANSPARENT" : "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

function buildAttendeeLine(contact) {
  const email = String(contact?.email || "").trim();
  if (!email) {
    return "";
  }

  const name = escapeIcsText(contact?.contact_name || contact?.contactName || "Team member");
  return `ATTENDEE;CN=${name};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${email}`;
}

function buildCalendarUid(eventId, baseUrl) {
  let host = "teampro.co.nz";

  try {
    host = new URL(baseUrl || "https://www.teampro.co.nz").hostname || host;
  } catch (_error) {
    host = "teampro.co.nz";
  }

  return `${eventId}@${host}`;
}

function buildCalendarFilename(eventRecord, method) {
  const eventId = String(eventRecord?.id || "event").trim();
  return `teampro-${eventId}-${method.toLowerCase()}.ics`;
}

function buildCalendarSequence(eventRecord) {
  const source = eventRecord?.updated_at || eventRecord?.updatedAt || eventRecord?.created_at || eventRecord?.createdAt || "";
  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) {
    return 0;
  }

  return Math.floor(parsed.getTime() / 1000);
}

function getEventTimezone(eventRecord) {
  const value = String(eventRecord?.event_timezone || eventRecord?.timezone || "").trim();
  return value || DEFAULT_EVENT_TIMEZONE;
}

function getEventStartDateTimeLocal(eventRecord) {
  const date = String(eventRecord?.event_date || eventRecord?.eventDate || "").trim();
  const time = String(eventRecord?.start_time || eventRecord?.startTime || "09:00").trim() || "09:00";
  const local = buildLocalDateTimeParts(date, time);
  if (local) {
    return local;
  }

  return buildLocalDateTimeParts(formatDateOnlyLocal(new Date()), "09:00");
}

function getEventEndDateTimeLocal(eventRecord, startLocal) {
  const date = String(eventRecord?.event_date || eventRecord?.eventDate || "").trim();
  const startTime = String(eventRecord?.start_time || eventRecord?.startTime || "09:00").trim() || "09:00";
  const endTime = String(eventRecord?.end_time || eventRecord?.endTime || "").trim();
  const local = buildLocalDateTimeParts(date, endTime || startTime);
  if (!local) {
    return addHoursToLocalDateTime(startLocal, 1);
  }

  if (!endTime) {
    return addHoursToLocalDateTime(local, 1);
  }

  if (compareLocalDateTimes(local, startLocal) <= 0) {
    return addHoursToLocalDateTime(local, 1);
  }

  return local;
}

function buildCalendarDescription({ eventRecord, teamName, contact, messageText, includeRsvp, baseUrl }) {
  const lines = [
    `${teamName || "TeamPro"} event`,
    "",
    `Hello ${contact?.contact_name || contact?.contactName || "there"},`,
    "",
    messageText || "",
    "",
    `Event: ${eventRecord?.event_title || eventRecord?.eventTitle || "Event"}`,
    `Type: ${formatEventTypeLabel(eventRecord?.event_type || eventRecord?.eventType || "other")}`,
    `Date: ${String(eventRecord?.event_date || eventRecord?.eventDate || "").trim() || "To be confirmed"}`,
    `Time: ${formatEventTimeRange(eventRecord?.start_time || eventRecord?.startTime || "", eventRecord?.end_time || eventRecord?.endTime || "") || "To be confirmed"}`,
    `Location: ${String(eventRecord?.location || "").trim() || "To be confirmed"}`,
  ];

  const notes = String(eventRecord?.notes || eventRecord?.event_notes || "").trim();
  if (notes) {
    lines.push(`Notes: ${notes}`);
  }

  if (includeRsvp) {
    lines.push(
      "",
      "Use your calendar invite to RSVP if your app supports it.",
      "If that doesn't work, the TeamPro RSVP links in the email body are your fallback.",
    );
  }

  return lines.filter(Boolean).join("\n");
}

function formatEventTypeLabel(eventType) {
  return {
    training: "Training",
    game: "Game",
    tournament: "Tournament",
    other: "Other",
  }[eventType] || "Other";
}

function formatEventTimeRange(startTime, endTime) {
  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }
  return startTime || endTime || "";
}

function formatDateTimeUtc(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function formatDateTimeLocal(localDateTime) {
  if (!localDateTime) {
    return "";
  }

  return `${localDateTime.year}${String(localDateTime.month).padStart(2, "0")}${String(localDateTime.day).padStart(2, "0")}T${String(localDateTime.hour).padStart(2, "0")}${String(localDateTime.minute).padStart(2, "0")}00`;
}

function formatDateOnlyLocal(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function buildLocalDateTimeParts(dateText, timeText) {
  const dateMatch = String(dateText || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = String(timeText || "").match(/^(\d{1,2}):(\d{2})/);
  if (!dateMatch || !timeMatch) {
    return null;
  }

  return {
    year: Number(dateMatch[1]),
    month: Number(dateMatch[2]),
    day: Number(dateMatch[3]),
    hour: Number(timeMatch[1]),
    minute: Number(timeMatch[2]),
  };
}

function addHoursToLocalDateTime(localDateTime, hoursToAdd) {
  const date = new Date(
    localDateTime.year,
    localDateTime.month - 1,
    localDateTime.day,
    localDateTime.hour,
    localDateTime.minute,
    0,
    0,
  );
  date.setHours(date.getHours() + hoursToAdd);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

function compareLocalDateTimes(left, right) {
  const leftValue = new Date(left.year, left.month - 1, left.day, left.hour, left.minute, 0, 0).getTime();
  const rightValue = new Date(right.year, right.month - 1, right.day, right.hour, right.minute, 0, 0).getTime();
  return leftValue - rightValue;
}

function escapeIcsText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function extractEmailAddress(value) {
  const text = String(value || "").trim();
  const match = text.match(/<([^>]+)>/);
  if (match?.[1]) {
    return match[1].trim();
  }
  return text.includes("@") ? text : "";
}

function foldIcsLine(line) {
  const value = String(line || "");
  if (value.length <= 73) {
    return value;
  }

  const chunks = [];
  for (let index = 0; index < value.length; index += 73) {
    chunks.push(index === 0 ? value.slice(index, index + 73) : ` ${value.slice(index, index + 73)}`);
  }
  return chunks.join("\r\n");
}

module.exports = {
  buildCalendarInviteAttachment,
  getCalendarMethod,
};
