const rsvpEndpoint = "/api/rsvp";

const rsvpLoading = document.querySelector("#rsvpLoading");
const rsvpError = document.querySelector("#rsvpError");
const rsvpErrorText = document.querySelector("#rsvpErrorText");
const rsvpContent = document.querySelector("#rsvpContent");
const rsvpTeamName = document.querySelector("#rsvpTeamName");
const rsvpContactLabel = document.querySelector("#rsvpContactLabel");
const rsvpEventSummary = document.querySelector("#rsvpEventSummary");
const rsvpEventLocation = document.querySelector("#rsvpEventLocation");
const rsvpEventNotes = document.querySelector("#rsvpEventNotes");
const rsvpNote = document.querySelector("#rsvpNote");
const submitRsvpButton = document.querySelector("#submitRsvp");
const rsvpStatus = document.querySelector("#rsvpStatus");
const rsvpChoiceButtons = Array.from(document.querySelectorAll("[data-rsvp-response]"));

const query = new URLSearchParams(window.location.search);
const token = query.get("token") || "";
let selectedResponse = query.get("response") || "yes";
let currentRsvp = null;

bootstrapRsvpPage();

rsvpChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedResponse = button.dataset.rsvpResponse || "yes";
    renderSelectedResponse();
  });
});

submitRsvpButton.addEventListener("click", async () => {
  await submitRsvp();
});

async function bootstrapRsvpPage() {
  if (!token) {
    showError("This RSVP link is missing its token.");
    return;
  }

  try {
    const response = await fetch(`${rsvpEndpoint}?token=${encodeURIComponent(token)}`, {
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "RSVP details could not be loaded.");
    }

    currentRsvp = result.rsvp;
    renderRsvpDetails();
  } catch (error) {
    showError(error?.message || "RSVP details could not be loaded.");
  }
}

function renderRsvpDetails() {
  rsvpLoading.classList.add("hidden");
  rsvpError.classList.add("hidden");
  rsvpContent.classList.remove("hidden");

  rsvpTeamName.textContent = currentRsvp.team_name || "Team";
  rsvpContactLabel.textContent = currentRsvp.player_name
    ? `${currentRsvp.contact_name} responding for ${currentRsvp.player_name}`
    : currentRsvp.contact_name || "Contact response";
  rsvpEventSummary.textContent = [
    currentRsvp.event_title || "Event",
    currentRsvp.event_date || "Date TBC",
    currentRsvp.event_time || "Time TBC",
  ]
    .filter(Boolean)
    .join(" | ");
  rsvpEventLocation.textContent = currentRsvp.location ? `Location: ${currentRsvp.location}` : "";
  rsvpEventNotes.textContent = currentRsvp.event_notes ? `Notes: ${currentRsvp.event_notes}` : "";
  rsvpNote.value = currentRsvp.response_note || "";
  selectedResponse = ["yes", "no", "maybe"].includes(selectedResponse) ? selectedResponse : (currentRsvp.response === "no_response" ? "yes" : currentRsvp.response);
  renderSelectedResponse();
}

function renderSelectedResponse() {
  rsvpChoiceButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.rsvpResponse === selectedResponse);
  });
}

async function submitRsvp() {
  submitRsvpButton.disabled = true;
  setStatus("Submitting RSVP...", false);

  try {
    const response = await fetch(rsvpEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token,
        response: selectedResponse,
        responseNote: rsvpNote.value.trim(),
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "RSVP could not be saved.");
    }

    currentRsvp = result.rsvp || currentRsvp;
    setStatus("Thank you. Your RSVP has been recorded.", false);
  } catch (error) {
    setStatus(error?.message || "RSVP could not be saved.", true);
  } finally {
    submitRsvpButton.disabled = false;
  }
}

function showError(message) {
  rsvpLoading.classList.add("hidden");
  rsvpContent.classList.add("hidden");
  rsvpError.classList.remove("hidden");
  rsvpErrorText.textContent = message;
}

function setStatus(message, isError) {
  rsvpStatus.textContent = message;
  rsvpStatus.classList.toggle("is-error", Boolean(isError));
}
