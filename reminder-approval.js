const approvalEndpoint = "/api/reminder-approval";

const approvalLoading = document.querySelector("#approvalLoading");
const approvalError = document.querySelector("#approvalError");
const approvalErrorText = document.querySelector("#approvalErrorText");
const approvalContent = document.querySelector("#approvalContent");
const approvalTeamName = document.querySelector("#approvalTeamName");
const approvalEventSummary = document.querySelector("#approvalEventSummary");
const approvalEventLocation = document.querySelector("#approvalEventLocation");
const approvalReminderMeta = document.querySelector("#approvalReminderMeta");
const approvalRecipientSummary = document.querySelector("#approvalRecipientSummary");
const approvalMessageText = document.querySelector("#approvalMessageText");
const approvalSendNow = document.querySelector("#approvalSendNow");
const approvalReviewLink = document.querySelector("#approvalReviewLink");
const approvalDismiss = document.querySelector("#approvalDismiss");
const approvalStatus = document.querySelector("#approvalStatus");

const approvalQuery = new URLSearchParams(window.location.search);
const approvalToken = approvalQuery.get("token") || "";
let currentApproval = null;

bootstrapApprovalPage();

approvalSendNow?.addEventListener("click", async () => {
  await submitApprovalAction("send");
});

approvalDismiss?.addEventListener("click", async () => {
  await submitApprovalAction("dismiss");
});

async function bootstrapApprovalPage() {
  if (!approvalToken) {
    showApprovalError("This reminder approval link is missing its token.");
    return;
  }

  try {
    const response = await fetch(`${approvalEndpoint}?token=${encodeURIComponent(approvalToken)}`, {
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Reminder approval details could not be loaded.");
    }

    currentApproval = result.approval;
    renderApprovalDetails();
  } catch (error) {
    showApprovalError(error?.message || "Reminder approval details could not be loaded.");
  }
}

function renderApprovalDetails() {
  approvalLoading.classList.add("hidden");
  approvalError.classList.add("hidden");
  approvalContent.classList.remove("hidden");

  approvalTeamName.textContent = currentApproval.teamName || "Team";
  approvalEventSummary.textContent = [
    currentApproval.eventTitle || "Event",
    currentApproval.eventDate || "Date TBC",
    currentApproval.eventTime || "Time TBC",
  ]
    .filter(Boolean)
    .join(" | ");
  approvalEventLocation.textContent = currentApproval.location ? `Location: ${currentApproval.location}` : "";
  approvalReminderMeta.textContent = [
    currentApproval.approvalLabel || (currentApproval.reminderType ? `${formatReminderLabel(currentApproval.reminderType)} reminder` : ""),
    currentApproval.rsvpSummary
      ? `${currentApproval.rsvpSummary.yes} yes, ${currentApproval.rsvpSummary.no} no, ${currentApproval.rsvpSummary.maybe} maybe, ${currentApproval.rsvpSummary.no_response} no response`
      : "",
  ]
    .filter(Boolean)
    .join(" • ");
  approvalRecipientSummary.textContent = `${currentApproval.recipientCount || 0} recipient${currentApproval.recipientCount === 1 ? "" : "s"}: ${(currentApproval.recipientNames || []).join(", ")}`;
  approvalMessageText.value = currentApproval.messageText || "";
  approvalReviewLink.href = currentApproval.reviewUrl || "/";
  if (approvalSendNow) {
    approvalSendNow.textContent = currentApproval.draftType === "event_cancellation" ? "Send Cancellation Now" : "Send Now";
  }
}

async function submitApprovalAction(action) {
  if (!approvalToken) {
    showApprovalError("This reminder approval link is missing its token.");
    return;
  }

  approvalSendNow.disabled = true;
  approvalDismiss.disabled = true;
    setApprovalStatus(action === "send"
      ? (currentApproval?.draftType === "event_cancellation" ? "Sending cancellation..." : "Sending reminder...")
      : "Dismissing reminder...", false);

  try {
    const response = await fetch(approvalEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: approvalToken,
        action,
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Approval could not be completed.");
    }

    setApprovalStatus(
      result.message || (action === "send"
        ? (currentApproval?.draftType === "event_cancellation" ? "Cancellation sent." : "Reminder sent.")
        : "Reminder dismissed."),
      false,
    );

    if (action === "send" || action === "dismiss") {
      approvalSendNow.classList.add("hidden");
      approvalDismiss.classList.add("hidden");
    }
  } catch (error) {
    setApprovalStatus(error?.message || "Approval could not be completed.", true);
  } finally {
    approvalSendNow.disabled = false;
    approvalDismiss.disabled = false;
  }
}

function showApprovalError(message) {
  approvalLoading.classList.add("hidden");
  approvalContent.classList.add("hidden");
  approvalError.classList.remove("hidden");
  approvalErrorText.textContent = message;
}

function setApprovalStatus(message, isError) {
  approvalStatus.textContent = message;
  approvalStatus.classList.toggle("is-error", Boolean(isError));
}

function formatReminderLabel(value) {
  return {
    reminder_3_day: "3-day",
    reminder_1_day: "1-day",
    reminder_same_day: "same-day",
  }[value] || "scheduled";
}
