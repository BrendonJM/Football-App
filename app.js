const formationLibrary = {
  5: ["2-1-1", "1-2-1", "1-1-2"],
  6: ["2-2-1", "3-1-1", "1-3-1"],
  7: ["2-3-1", "3-2-1", "2-2-2"],
  8: ["3-3-1", "2-3-2", "3-2-2"],
  9: ["3-4-1", "3-3-2", "2-5-1", "2-4-2"],
  10: ["3-4-2", "4-3-2", "3-3-3"],
  11: ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1"],
};

const rugbyLayoutLibrary = {
  7: {
    key: "rugby-7-standard",
    label: "Standard Layout",
    slots: [
      { role: "LH", roleLabel: "Loosehead", positionLabel: "Loosehead Prop", x: 0.28, y: 0.78 },
      { role: "HK", roleLabel: "Hooker", positionLabel: "Hooker", x: 0.5, y: 0.82 },
      { role: "TH", roleLabel: "Tighthead", positionLabel: "Tighthead Prop", x: 0.72, y: 0.78 },
      { role: "SH", roleLabel: "Scrum-half", positionLabel: "Scrum-half", x: 0.4, y: 0.6 },
      { role: "FH", roleLabel: "Fly-half", positionLabel: "Fly-half", x: 0.6, y: 0.54 },
      { role: "WG", roleLabel: "Wing", positionLabel: "Wing", x: 0.18, y: 0.32 },
      { role: "FB", roleLabel: "Fullback", positionLabel: "Fullback", x: 0.82, y: 0.22 },
    ],
  },
  10: {
    key: "rugby-10-standard",
    label: "Standard Layout",
    slots: [
      { role: "LH", roleLabel: "Loosehead", positionLabel: "Loosehead Prop", x: 0.24, y: 0.8 },
      { role: "HK", roleLabel: "Hooker", positionLabel: "Hooker", x: 0.4, y: 0.84 },
      { role: "TH", roleLabel: "Tighthead", positionLabel: "Tighthead Prop", x: 0.58, y: 0.84 },
      { role: "LK", roleLabel: "Lock", positionLabel: "Lock", x: 0.76, y: 0.8 },
      { role: "SH", roleLabel: "Scrum-half", positionLabel: "Scrum-half", x: 0.36, y: 0.62 },
      { role: "FH", roleLabel: "Fly-half", positionLabel: "Fly-half", x: 0.52, y: 0.56 },
      { role: "CTR", roleLabel: "Centre", positionLabel: "Centre", x: 0.68, y: 0.52 },
      { role: "WG", roleLabel: "Wing", positionLabel: "Wing", x: 0.16, y: 0.34 },
      { role: "WG", roleLabel: "Wing", positionLabel: "Wing", x: 0.84, y: 0.34 },
      { role: "FB", roleLabel: "Fullback", positionLabel: "Fullback", x: 0.5, y: 0.18 },
    ],
  },
  15: {
    key: "rugby-15-standard",
    label: "Standard Layout",
    slots: [
      { role: "LH", roleLabel: "Loosehead", positionLabel: "Loosehead Prop", x: 0.22, y: 0.84 },
      { role: "HK", roleLabel: "Hooker", positionLabel: "Hooker", x: 0.36, y: 0.88 },
      { role: "TH", roleLabel: "Tighthead", positionLabel: "Tighthead Prop", x: 0.5, y: 0.88 },
      { role: "LK", roleLabel: "Lock", positionLabel: "Lock", x: 0.64, y: 0.88 },
      { role: "LK", roleLabel: "Lock", positionLabel: "Lock", x: 0.78, y: 0.84 },
      { role: "FL", roleLabel: "Flanker", positionLabel: "Flanker", x: 0.24, y: 0.72 },
      { role: "FL", roleLabel: "Flanker", positionLabel: "Flanker", x: 0.76, y: 0.72 },
      { role: "8", roleLabel: "Number 8", positionLabel: "Number 8", x: 0.5, y: 0.74 },
      { role: "SH", roleLabel: "Scrum-half", positionLabel: "Scrum-half", x: 0.4, y: 0.58 },
      { role: "FH", roleLabel: "Fly-half", positionLabel: "Fly-half", x: 0.56, y: 0.52 },
      { role: "CTR", roleLabel: "Centre", positionLabel: "Centre", x: 0.34, y: 0.4 },
      { role: "CTR", roleLabel: "Centre", positionLabel: "Centre", x: 0.66, y: 0.4 },
      { role: "WG", roleLabel: "Wing", positionLabel: "Wing", x: 0.14, y: 0.26 },
      { role: "WG", roleLabel: "Wing", positionLabel: "Wing", x: 0.86, y: 0.26 },
      { role: "FB", roleLabel: "Fullback", positionLabel: "Fullback", x: 0.5, y: 0.14 },
    ],
  },
};

const softballLayoutLibrary = {
  9: {
    key: "softball-9-standard",
    label: "Standard Layout",
    slots: [
      { role: "P", roleLabel: "Pitcher", positionLabel: "Pitcher", x: 0.5, y: 0.62 },
      { role: "C", roleLabel: "Catcher", positionLabel: "Catcher", x: 0.5, y: 0.82 },
      { role: "1B", roleLabel: "First Base", positionLabel: "First Base", x: 0.72, y: 0.58 },
      { role: "2B", roleLabel: "Second Base", positionLabel: "Second Base", x: 0.62, y: 0.42 },
      { role: "3B", roleLabel: "Third Base", positionLabel: "Third Base", x: 0.28, y: 0.58 },
      { role: "SS", roleLabel: "Shortstop", positionLabel: "Shortstop", x: 0.38, y: 0.42 },
      { role: "LF", roleLabel: "Left Field", positionLabel: "Left Field", x: 0.2, y: 0.2 },
      { role: "CF", roleLabel: "Centre Field", positionLabel: "Centre Field", x: 0.5, y: 0.1 },
      { role: "RF", roleLabel: "Right Field", positionLabel: "Right Field", x: 0.8, y: 0.2 },
    ],
  },
  10: {
    key: "softball-10-standard",
    label: "Standard Layout",
    slots: [
      { role: "P", roleLabel: "Pitcher", positionLabel: "Pitcher", x: 0.5, y: 0.62 },
      { role: "C", roleLabel: "Catcher", positionLabel: "Catcher", x: 0.5, y: 0.82 },
      { role: "1B", roleLabel: "First Base", positionLabel: "First Base", x: 0.72, y: 0.58 },
      { role: "2B", roleLabel: "Second Base", positionLabel: "Second Base", x: 0.62, y: 0.42 },
      { role: "3B", roleLabel: "Third Base", positionLabel: "Third Base", x: 0.28, y: 0.58 },
      { role: "SS", roleLabel: "Shortstop", positionLabel: "Shortstop", x: 0.38, y: 0.42 },
      { role: "LF", roleLabel: "Left Field", positionLabel: "Left Field", x: 0.18, y: 0.2 },
      { role: "CF", roleLabel: "Centre Field", positionLabel: "Centre Field", x: 0.5, y: 0.1 },
      { role: "RF", roleLabel: "Right Field", positionLabel: "Right Field", x: 0.82, y: 0.2 },
      { role: "RV", roleLabel: "Rover", positionLabel: "Rover", x: 0.5, y: 0.3 },
    ],
  },
};

const cricketSlotLibrary = [
  { role: "WK", roleLabel: "Wicketkeeper", positionLabel: "Wicketkeeper", x: 0.5, y: 0.82 },
  { role: "SL", roleLabel: "Slip", positionLabel: "Slip", x: 0.62, y: 0.7 },
  { role: "GY", roleLabel: "Gully", positionLabel: "Gully", x: 0.72, y: 0.6 },
  { role: "PT", roleLabel: "Point", positionLabel: "Point", x: 0.8, y: 0.46 },
  { role: "CV", roleLabel: "Cover", positionLabel: "Cover", x: 0.68, y: 0.3 },
  { role: "MO", roleLabel: "Mid-off", positionLabel: "Mid-off", x: 0.56, y: 0.2 },
  { role: "MN", roleLabel: "Mid-on", positionLabel: "Mid-on", x: 0.44, y: 0.2 },
  { role: "MW", roleLabel: "Mid-wicket", positionLabel: "Mid-wicket", x: 0.28, y: 0.32 },
  { role: "SQ", roleLabel: "Square leg", positionLabel: "Square leg", x: 0.2, y: 0.48 },
  { role: "FL", roleLabel: "Fine leg", positionLabel: "Fine leg", x: 0.28, y: 0.66 },
  { role: "TM", roleLabel: "Third man", positionLabel: "Third man", x: 0.82, y: 0.78 },
];

const sportCatalog = {
  football: {
    sportType: "football",
    displayName: "Football",
    icon: "⚽",
    supportedTeamSizes: [5, 6, 7, 8, 9, 10, 11],
    defaultTeamSize: 9,
    layoutType: "formation",
    fieldLabel: "Football Field",
  },
  rugby: {
    sportType: "rugby",
    displayName: "Rugby",
    icon: "🏉",
    supportedTeamSizes: [7, 10, 15],
    defaultTeamSize: 15,
    layoutType: "positions",
    fieldLabel: "Rugby Field",
  },
  softball: {
    sportType: "softball",
    displayName: "Softball",
    icon: "🥎",
    supportedTeamSizes: [9, 10],
    defaultTeamSize: 9,
    layoutType: "positions",
    fieldLabel: "Softball Diamond",
  },
  cricket: {
    sportType: "cricket",
    displayName: "Cricket",
    icon: "🏏",
    supportedTeamSizes: [7, 8, 9, 10, 11],
    defaultTeamSize: 11,
    layoutType: "positions",
    fieldLabel: "Cricket Field",
  },
};

const sampleConfig = {
  teamName: "Harbour United U12",
  sportType: "football",
  playersOnField: 9,
  players: [
    "Aria",
    "Mia",
    "Noah",
    "Luca",
    "Zoe",
    "Theo",
    "Sienna",
    "Finn",
    "Ruby",
    "Leo",
    "Poppy",
    "Jack",
  ],
  formations: ["3-4-1", "3-3-2", "2-5-1"],
  selectedFormation: "3-4-1",
};

const storageKey = "football-team-board-state";
const userStateStoragePrefix = "football-team-board-user-state";
const configEndpoint = "/api/config";
const feedbackEndpoint = "/api/feedback";
const trainingPlanEndpoint = "/api/training-plan";
const teamUpdateEndpoint = "/api/team-update";
const aiCommunicationDraftEndpoint = "/api/ai/communication-draft";
const reminderSchedulerEndpoint = "/api/reminder-scheduler";
const eventCancellationEndpoint = "/api/event-cancellation";
const teamsTableName = "teams";
const teamContactsTableName = "team_contacts";
const teamEventsTableName = "team_events";
const eventUpdateLogsTableName = "event_update_logs";
const eventRsvpsTableName = "event_rsvps";
const aiCommunicationDraftsTableName = "ai_communication_drafts";
const userSettingsTableName = "user_settings";
const authRequiredPage = "account";

const appShell = document.querySelector("#appShell");
const appTopbar = document.querySelector("#appTopbar");
const appNav = document.querySelector("#appNav");
const topbarSide = document.querySelector("#topbarSide");
const guestTopbarActions = document.querySelector("#guestTopbarActions");
const teamNameInput = document.querySelector("#teamName");
const teamSportTypeInput = document.querySelector("#teamSportType");
const playersOnFieldInput = document.querySelector("#playersOnField");
const playerNamesInput = document.querySelector("#playerNames");
const playerRows = document.querySelector("#playerRows");
const formationSuggestions = document.querySelector("#formationSuggestions");
const formationHelp = document.querySelector("#formationHelp");
const customFormationInput = document.querySelector("#customFormation");
const configStatus = document.querySelector("#configStatus");
const configForm = document.querySelector("#configForm");
const addFormationButton = document.querySelector("#addFormation");
const signupForm = document.querySelector("#signupForm");
const authEmailInput = document.querySelector("#authEmail");
const authPasswordInput = document.querySelector("#authPassword");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const authGuestPanel = document.querySelector("#authGuestPanel");
const authUserPanel = document.querySelector("#authUserPanel");
const authUserEmail = document.querySelector("#authUserEmail");
const authStatus = document.querySelector("#authStatus");
const landingPage = document.querySelector("#landingPage");
const accountSignedInContent = document.querySelector("#accountSignedInContent");
const authCtaButtons = Array.from(document.querySelectorAll("[data-cta-auth]"));
const loginCtaButtons = Array.from(document.querySelectorAll("[data-cta-login]"));
const authCloseButtons = Array.from(document.querySelectorAll("[data-auth-close]"));
const scrollTargetButtons = Array.from(document.querySelectorAll("[data-scroll-target]"));
const quickReminderApprovalPanel = document.querySelector("#quickReminderApprovalPanel");
const quickReminderApprovalHeading = document.querySelector("#quickReminderApprovalHeading");
const quickReminderApprovalMeta = document.querySelector("#quickReminderApprovalMeta");
const quickReminderApprovalMessage = document.querySelector("#quickReminderApprovalMessage");
const quickReminderApprovalSendButton = document.querySelector("#quickReminderApprovalSend");
const quickReminderApprovalReviewButton = document.querySelector("#quickReminderApprovalReview");
const quickReminderApprovalDismissButton = document.querySelector("#quickReminderApprovalDismiss");
const quickReminderApprovalStatus = document.querySelector("#quickReminderApprovalStatus");
const accountSettingsPanel = document.querySelector("#accountSettingsPanel");
const openEventReminderSettingsButton = document.querySelector("#openEventReminderSettings");
const eventReminderSettingsPanel = document.querySelector("#eventReminderSettingsPanel");
const accountReminder3DayInput = document.querySelector("#accountReminder3Day");
const accountReminder1DayInput = document.querySelector("#accountReminder1Day");
const accountReminderSameDayInput = document.querySelector("#accountReminderSameDay");
const saveAccountSettingsButton = document.querySelector("#saveAccountSettings");
const runReminderCheckButton = document.querySelector("#runReminderCheck");
const accountSettingsStatus = document.querySelector("#accountSettingsStatus");
const feedbackForm = document.querySelector("#feedbackForm");
const feedbackMessageInput = document.querySelector("#feedbackMessage");
const feedbackStatus = document.querySelector("#feedbackStatus");

const navAccount = document.querySelector("#navAccount");
const navConfig = document.querySelector("#navConfig");
const navManage = document.querySelector("#navManage");
const navComms = document.querySelector("#navComms");
const navTraining = document.querySelector("#navTraining");
const accountPage = document.querySelector("#accountPage");
const configPage = document.querySelector("#configPage");
const managePage = document.querySelector("#managePage");
const commsPage = document.querySelector("#commsPage");
const trainingPage = document.querySelector("#trainingPage");
const teamSwitcher = document.querySelector("#teamSwitcher");
const newTeamButton = document.querySelector("#newTeam");
const deleteTeamButton = document.querySelector("#deleteTeam");

const teamNameSummary = document.querySelector("#teamNameSummary");
const formationFieldLabel = document.querySelector("#formationFieldLabel");
const formationSelect = document.querySelector("#formationSelect");
const formationBuilderSection = document.querySelector("#formationBuilderSection");
const formationBuilderTitle = document.querySelector("#formationBuilderTitle");
const fillEmptyPositionsButton = document.querySelector("#fillEmptyPositions");
const resetLineupButton = document.querySelector("#resetLineup");
const copyImageButton = document.querySelector("#copyImage");
const saveNowButton = document.querySelector("#saveNow");
const toggleAvailabilityButton = document.querySelector("#toggleAvailability");
const exportStatus = document.querySelector("#exportStatus");
const selectionHint = document.querySelector("#selectionHint");
const sendSelectedToBenchButton = document.querySelector("#sendSelectedToBench");
const benchList = document.querySelector("#benchList");
const pitch = document.querySelector("#pitch");
const pitchEyebrow = document.querySelector("#pitchEyebrow");
const pitchTitle = document.querySelector("#pitchTitle");
const pitchLegend = document.querySelector("#pitchLegend");
const contactForm = document.querySelector("#contactForm");
const contactIdInput = document.querySelector("#contactId");
const contactNameInput = document.querySelector("#contactName");
const contactEmailInput = document.querySelector("#contactEmail");
const contactPhoneInput = document.querySelector("#contactPhone");
const contactRoleInput = document.querySelector("#contactRole");
const contactLinkedPlayers = document.querySelector("#contactLinkedPlayers");
const openContactFormButton = document.querySelector("#openContactForm");
const contactFormPanel = document.querySelector("#contactFormPanel");
const contactNotesInput = document.querySelector("#contactNotes");
const saveContactButton = document.querySelector("#saveContact");
const resetContactButton = document.querySelector("#resetContact");
const contactStatus = document.querySelector("#contactStatus");
const contactList = document.querySelector("#contactList");
const eventForm = document.querySelector("#eventForm");
const openEventFormButton = document.querySelector("#openEventForm");
const eventFormPanel = document.querySelector("#eventFormPanel");
const eventFormHeading = document.querySelector("#eventFormHeading");
const eventIdInput = document.querySelector("#eventId");
const eventTitleInput = document.querySelector("#eventTitle");
const eventTypeInput = document.querySelector("#eventType");
const eventDateInput = document.querySelector("#eventDate");
const eventStartTimeInput = document.querySelector("#eventStartTime");
const eventEndTimeInput = document.querySelector("#eventEndTime");
const eventLocationInput = document.querySelector("#eventLocation");
const eventStatusInput = document.querySelector("#eventStatus");
const eventRepeatPatternInput = document.querySelector("#eventRepeatPattern");
const eventRecurringOptions = document.querySelector("#eventRecurringOptions");
const eventRecurringDays = document.querySelector("#eventRecurringDays");
const eventRepeatEndDateInput = document.querySelector("#eventRepeatEndDate");
const eventNotesInput = document.querySelector("#eventNotes");
const resetEventButton = document.querySelector("#resetEvent");
const eventStatusMessage = document.querySelector("#eventStatusMessage");
const eventList = document.querySelector("#eventList");
const eventListSummary = document.querySelector("#eventListSummary");
const selectedEventHeading = document.querySelector("#selectedEventHeading");
const aiAssistantPromptInput = document.querySelector("#aiAssistantPrompt");
const generateAiDraftButton = document.querySelector("#generateAiDraft");
const aiDraftStatus = document.querySelector("#aiDraftStatus");
const aiDraftReview = document.querySelector("#aiDraftReview");
const aiDraftIntent = document.querySelector("#aiDraftIntent");
const aiDraftConfidence = document.querySelector("#aiDraftConfidence");
const aiDraftRecipients = document.querySelector("#aiDraftRecipients");
const aiDraftRsvp = document.querySelector("#aiDraftRsvp");
const aiDraftFollowUp = document.querySelector("#aiDraftFollowUp");
const aiDraftMissingInfo = document.querySelector("#aiDraftMissingInfo");
const aiDraftEventTitleInput = document.querySelector("#aiDraftEventTitle");
const aiDraftEventTypeInput = document.querySelector("#aiDraftEventType");
const aiDraftEventDateInput = document.querySelector("#aiDraftEventDate");
const aiDraftEventLocationInput = document.querySelector("#aiDraftEventLocation");
const aiDraftStartTimeInput = document.querySelector("#aiDraftStartTime");
const aiDraftEndTimeInput = document.querySelector("#aiDraftEndTime");
const aiDraftEventNotesInput = document.querySelector("#aiDraftEventNotes");
const aiDraftEventMatchRow = document.querySelector("#aiDraftEventMatchRow");
const aiDraftEventMatchInput = document.querySelector("#aiDraftEventMatch");
const aiDraftEmailSubjectInput = document.querySelector("#aiDraftEmailSubject");
const aiDraftEmailBodyInput = document.querySelector("#aiDraftEmailBody");
const aiDraftSmsBodyInput = document.querySelector("#aiDraftSmsBody");
const aiDraftRecipientGroupInput = document.querySelector("#aiDraftRecipientGroup");
const aiDraftRsvpRequiredInput = document.querySelector("#aiDraftRsvpRequired");
const aiDraftRsvpDeadlineInput = document.querySelector("#aiDraftRsvpDeadline");
const aiCopyEmailDraftButton = document.querySelector("#aiCopyEmailDraft");
const aiCopySmsDraftButton = document.querySelector("#aiCopySmsDraft");
const aiSendDraftEmailButton = document.querySelector("#aiSendDraftEmail");
const aiCreateEventFromDraftButton = document.querySelector("#aiCreateEventFromDraft");
const aiApplyEventUpdateButton = document.querySelector("#aiApplyEventUpdate");
const aiApplyEventCancellationButton = document.querySelector("#aiApplyEventCancellation");
const aiDiscardDraftButton = document.querySelector("#aiDiscardDraft");
const reminderRecipientsPanel = document.querySelector("#reminderRecipientsPanel");
const messageRecipientSummary = document.querySelector("#messageRecipientSummary");
const messageRecipientList = document.querySelector("#messageRecipientList");
const selectAllMessageRecipientsButton = document.querySelector("#selectAllMessageRecipients");
const clearMessageRecipientsButton = document.querySelector("#clearMessageRecipients");
const messagePreview = document.querySelector("#messagePreview");
const sendReminderEmailButton = document.querySelector("#sendReminderEmail");
const sendReminderPrimaryActionButton = document.querySelector("#sendReminderPrimaryAction");
const dismissReminderDraftButton = document.querySelector("#dismissReminderDraft");
const messageStatus = document.querySelector("#messageStatus");
const eventRsvpSummary = document.querySelector("#eventRsvpSummary");
const eventRsvpList = document.querySelector("#eventRsvpList");
const eventRsvpStatus = document.querySelector("#eventRsvpStatus");
const reminderDraftSummary = document.querySelector("#reminderDraftSummary");
const trainingFocusSelect = document.querySelector("#trainingFocus");
const generateTrainingPlanButton = document.querySelector("#generateTrainingPlan");
const refreshTrainingPlanButton = document.querySelector("#refreshTrainingPlan");
const acceptTrainingPlanButton = document.querySelector("#acceptTrainingPlan");
const copyTrainingPlanButton = document.querySelector("#copyTrainingPlan");
const trainingStatus = document.querySelector("#trainingStatus");
const trainingTeamLabel = document.querySelector("#trainingTeamLabel");
const trainingAgeRange = document.querySelector("#trainingAgeRange");
const trainingPlanTitle = document.querySelector("#trainingPlanTitle");
const trainingPlanMeta = document.querySelector("#trainingPlanMeta");
const trainingPlanBody = document.querySelector("#trainingPlanBody");
const defaultUserSettings = {
  id: "",
  userId: "",
  defaultReminder3DayEnabled: true,
  defaultReminder1DayEnabled: true,
  defaultReminderSameDayEnabled: true,
  createdAt: "",
  updatedAt: "",
};

let formationDraft = [];
let state = loadState();
let supabaseClient = null;
let supabaseReady = false;
let supabaseUserId = null;
let supabaseUserEmail = "";
let supabaseProjectUrl = "";
let supabaseAnonKey = "";
let supabaseAccessToken = "";
let saveNowInFlight = false;
let sendingEventUpdate = false;
let eventFormOpen = false;
let eventRsvpDetailsOpen = false;
let eventLifecycleTimerId = null;
let contactFormOpen = false;
let messagePreviewEventId = null;
let messagePreviewDraft = "";
let messageRecipientSelectionEventId = null;
let reminderComposerOpen = false;
let reminderComposerEventId = null;
let reminderDraftSelectionEventId = null;
let aiDraftState = {
  loading: false,
  draftId: null,
  data: null,
};
const appLinkState = readAppLinkState();
let trainingState = {
  focusArea: "Passing",
  plan: null,
  loading: false,
  accepted: false,
};
let reminderCheckInFlight = false;
let accountReminderSettingsOpen = false;
let quickReminderApprovalOpen = false;
let quickReminderApprovalDraftId = "";
let reminderAutoCatchUpInFlight = false;
let reminderAutoCatchUpAttemptKey = "";

bootstrapApp();

configForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveConfigFromForm();
});

playersOnFieldInput.addEventListener("change", () => {
  const playersOnField = Number(playersOnFieldInput.value);
  const sportType = getSelectedSportType();
  const validExisting = formationDraft.filter((formation) =>
    isValidFormation(formation, playersOnField, sportType),
  );
  formationDraft = validExisting.length > 0
    ? validExisting
    : getSuggestedFormations(playersOnField, sportType).slice(0, 3);
  renderPlayerRows();
  renderFormationChoices();
  renderContactLinkedPlayerOptions();
});

teamSportTypeInput?.addEventListener("change", () => {
  const sportType = getSelectedSportType();
  renderPlayersOnFieldOptions(sportType);
  const playersOnField = Number(playersOnFieldInput.value) || getSportDefaultTeamSize(sportType);
  formationDraft = getSuggestedFormations(playersOnField, sportType).slice(0, 3);
  renderFormationChoices();
  renderContactLinkedPlayerOptions();
});

playerNamesInput.addEventListener("input", () => {
  renderPlayerRows();
  renderContactLinkedPlayerOptions();
});

addFormationButton.addEventListener("click", () => {
  const sportType = getSelectedSportType();
  const playersOnField = Number(playersOnFieldInput.value);
  const formation = normaliseFormation(customFormationInput.value);

  if (!formation) {
    setStatus(formationHelp, "Enter a formation before adding it.", true);
    return;
  }

  if (!isValidFormation(formation, playersOnField, sportType)) {
    setStatus(
      formationHelp,
      `Formation ${formation} is not valid for ${playersOnField} players on the field.`,
      true,
    );
    return;
  }

  if (!formationDraft.includes(formation)) {
    formationDraft = [...formationDraft, formation];
  }

  customFormationInput.value = "";
  renderFormationChoices();
  setStatus(formationHelp, `${formation} added to your formation list.`, false);
});

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await signUpWithEmail();
});

loginButton?.addEventListener("click", async () => {
  await signInWithEmail();
});

logoutButton.addEventListener("click", async () => {
  await signOutUser();
});

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitFeedback();
});

authCtaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    focusSignupExperience();
  });
});

loginCtaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    focusLoginExperience();
  });
});

authCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    authGuestPanel?.classList.add("hidden");
  });
});

scrollTargetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.scrollTarget || "";
    scrollToSection(targetId);
  });
});

saveAccountSettingsButton?.addEventListener("click", async () => {
  await saveAccountSettings();
});

runReminderCheckButton?.addEventListener("click", async () => {
  await runReminderSchedulerCheck();
});

openEventReminderSettingsButton?.addEventListener("click", () => {
  accountReminderSettingsOpen = !accountReminderSettingsOpen;
  renderAccountSettings();
});

quickReminderApprovalSendButton?.addEventListener("click", async () => {
  await sendQuickReminderApproval();
});

quickReminderApprovalReviewButton?.addEventListener("click", () => {
  openReminderDraftInEvents();
});

quickReminderApprovalDismissButton?.addEventListener("click", async () => {
  await dismissQuickReminderApproval();
});

openContactFormButton?.addEventListener("click", () => {
  openContactForm();
});

saveContactButton?.addEventListener("click", async () => {
  await saveContactFromForm();
});

resetContactButton.addEventListener("click", () => {
  resetContactForm();
  renderAll();
});

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveEventFromForm();
});

openEventFormButton?.addEventListener("click", () => {
  openEventForm();
});

resetEventButton.addEventListener("click", () => {
  resetEventForm();
});

eventRepeatPatternInput?.addEventListener("change", () => {
  renderEventRepeatInputs();
});

navAccount.addEventListener("click", () => {
  state.page = "account";
  persistState();
  renderAll();
});

navConfig.addEventListener("click", () => {
  state.page = "config";
  persistState();
  renderAll();
});

navManage.addEventListener("click", () => {
  state.page = "manage";
  persistState();
  renderAll();
});

navComms.addEventListener("click", () => {
  state.page = "comms";
  persistState();
  renderAll();
});

navTraining.addEventListener("click", () => {
  state.page = "training";
  persistState();
  renderAll();
});

teamSwitcher.addEventListener("change", () => {
  switchTeam(teamSwitcher.value);
});

newTeamButton.addEventListener("click", () => {
  createNewTeamDraft();
});

deleteTeamButton.addEventListener("click", () => {
  deleteCurrentTeam();
});

formationSelect.addEventListener("change", () => {
  const formation = formationSelect.value;
  setFormation(formation);
});

fillEmptyPositionsButton.addEventListener("click", () => {
  fillEmptySlotsFromBench();
});

resetLineupButton.addEventListener("click", () => {
  resetLineup();
});

copyImageButton.addEventListener("click", async () => {
  await copyLineupImage();
});

saveNowButton.addEventListener("click", async () => {
  await saveActiveTeamNow();
});

eventRsvpSummary?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-rsvp-toggle]");

  if (!button) {
    return;
  }

  eventRsvpDetailsOpen = !eventRsvpDetailsOpen;
  renderEventRsvps();
});

eventRsvpList?.addEventListener("change", async (event) => {
  const field = event.target.closest("[data-rsvp-field='response']");

  if (!field) {
    return;
  }

  await saveManualRsvpOverride(field.dataset.rsvpId || "");
});

sendReminderEmailButton?.addEventListener("click", async () => {
  if (!reminderComposerOpen) {
    reminderComposerOpen = true;
    reminderComposerEventId = getSelectedEvent()?.id || null;
    renderEventMessaging();
    return;
  }

  await sendEventUpdateEmail("reminder");
});

sendReminderPrimaryActionButton?.addEventListener("click", () => {
  if (!sendReminderEmailButton?.disabled) {
    sendReminderEmailButton.click();
  }
});

dismissReminderDraftButton?.addEventListener("click", async () => {
  await dismissSelectedReminderDraft();
});

selectAllMessageRecipientsButton?.addEventListener("click", () => {
  selectAllContactsForMessaging();
});

clearMessageRecipientsButton?.addEventListener("click", () => {
  clearSelectedContactsForMessaging();
});

messageRecipientList?.addEventListener("change", (event) => {
  const field = event.target.closest("[data-message-recipient-id]");

  if (!field) {
    return;
  }

  toggleMessageRecipient(field.dataset.messageRecipientId || "", Boolean(field.checked));
});

messagePreview?.addEventListener("input", () => {
  messagePreviewEventId = getSelectedEvent()?.id || null;
  messagePreviewDraft = messagePreview.value;
});

generateAiDraftButton?.addEventListener("click", async () => {
  await generateAiCommunicationDraft();
});

aiCopyEmailDraftButton?.addEventListener("click", async () => {
  await copyAiDraftText("email");
});

aiCopySmsDraftButton?.addEventListener("click", async () => {
  await copyAiDraftText("sms");
});

aiSendDraftEmailButton?.addEventListener("click", async () => {
  await sendAiDraftEmail();
});

aiCreateEventFromDraftButton?.addEventListener("click", async () => {
  await createEventFromAiDraft();
});

aiApplyEventUpdateButton?.addEventListener("click", async () => {
  await applyAiDraftToExistingEvent("update");
});

aiApplyEventCancellationButton?.addEventListener("click", async () => {
  await applyAiDraftToExistingEvent("cancel");
});

aiDiscardDraftButton?.addEventListener("click", async () => {
  await discardAiDraft();
});

toggleAvailabilityButton.addEventListener("click", () => {
  toggleSelectedAvailability();
});

trainingFocusSelect.addEventListener("change", () => {
  trainingState.focusArea = trainingFocusSelect.value;
  trainingState.accepted = false;
  clearStatus(trainingStatus);
  renderTrainingView();
});

generateTrainingPlanButton.addEventListener("click", async () => {
  await generateTrainingPlan();
});

refreshTrainingPlanButton.addEventListener("click", async () => {
  await generateTrainingPlan({ regenerate: true });
});

acceptTrainingPlanButton.addEventListener("click", () => {
  acceptTrainingPlan();
});

copyTrainingPlanButton.addEventListener("click", async () => {
  await copyTrainingPlan();
});

sendSelectedToBenchButton.addEventListener("click", () => {
  if (!state.selectedTarget) {
    setStatus(exportStatus, "Select a player on the field first.", true);
    return;
  }

  if (state.selectedTarget.type !== "slot") {
    setStatus(exportStatus, "Only players on the field can be sent to the bench.", true);
    return;
  }

  moveSelectedToBench();
});

pitch.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-target-type]");

  if (!trigger) {
    return;
  }

  handleTargetSelection({
    type: trigger.dataset.targetType,
    index: Number(trigger.dataset.targetIndex),
  });
});

benchList.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-target-type]");

  if (!trigger) {
    return;
  }

  if (trigger.dataset.targetType === "bench-dropzone") {
    moveSelectedToBench();
    return;
  }

  handleTargetSelection({
    type: trigger.dataset.targetType,
    index: Number(trigger.dataset.targetIndex),
  });
});

document.addEventListener("dragstart", (event) => {
  const trigger = event.target.closest("[data-target-type]");

  if (!trigger || trigger.dataset.empty === "true") {
    return;
  }

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      type: trigger.dataset.targetType,
      index: Number(trigger.dataset.targetIndex),
    }),
  );
});

document.addEventListener("dragover", (event) => {
  const trigger = event.target.closest("[data-target-type]");

  if (!trigger) {
    return;
  }

  event.preventDefault();
  trigger.classList.add("drop-target");
});

document.addEventListener("dragleave", (event) => {
  const trigger = event.target.closest("[data-target-type]");

  if (trigger) {
    trigger.classList.remove("drop-target");
  }
});

document.addEventListener("drop", (event) => {
  const trigger = event.target.closest("[data-target-type]");

  if (!trigger) {
    return;
  }

  event.preventDefault();
  trigger.classList.remove("drop-target");

  const source = safeJsonParse(event.dataTransfer.getData("text/plain"));

  if (!source) {
    return;
  }

  if (trigger.dataset.targetType === "bench-dropzone") {
    movePlayerToBench(source);
    return;
  }

  swapOrMove(source, {
    type: trigger.dataset.targetType,
    index: Number(trigger.dataset.targetIndex),
  });
});

function initialisePlayersOnFieldOptions() {
  renderPlayersOnFieldOptions(getSelectedSportType());
}

async function bootstrapApp() {
  initialisePlayersOnFieldOptions();
  syncFormFromState();
  renderAll();
  startEventLifecycleWatcher();
  await initialiseSupabaseSync();
}

async function initialiseSupabaseSync() {
  try {
    const config = await fetchRuntimeConfig();
    const supabaseUrl = normaliseSupabaseProjectUrl(config.supabaseUrl);
    console.info("[Supabase] Runtime config loaded", {
      hasUrl: Boolean(supabaseUrl),
      hasAnonKey: Boolean(config.supabaseAnonKey),
      configSource:
        window.__APP_CONFIG__?.supabaseUrl && window.__APP_CONFIG__?.supabaseAnonKey
          ? "public-config.js"
          : "api/config",
    });

    if (!supabaseUrl || !config.supabaseAnonKey) {
      setStatus(
        configStatus,
        "Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel, then redeploy.",
        true,
      );
      return;
    }

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      throw new Error("Supabase client library did not load in the browser.");
    }

    supabaseClient = window.supabase.createClient(
      supabaseUrl,
      config.supabaseAnonKey,
    );
    supabaseProjectUrl = supabaseUrl;
    supabaseAnonKey = config.supabaseAnonKey;
    window.teamProDebug = {
      supabase: supabaseClient,
      getUser: async () => supabaseClient.auth.getUser(),
      testInsert: async () => {
        const { data: userData, error: userError } = await supabaseClient.auth.getUser();

        if (userError || !userData.user) {
          return { userError, user: userData.user };
        }

        return await supabaseClient
          .from("teams")
          .insert({
            id: window.crypto.randomUUID(),
            user_id: userData.user.id,
            team_name: "Browser direct test",
            players_on_field: 7,
            players: [],
            formations: ["2-3-1"],
            selected_formation: "2-3-1",
            lineup: {},
          })
          .select();
      },
    };
    console.info("[Supabase] Client initialised", {
      urlHost: safeSupabaseHost(supabaseUrl),
    });

    supabaseReady = true;
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      console.info("[Supabase] Auth state changed", {
        event: _event,
        hasSession: Boolean(session),
      });
      await applyAuthSession(session);
    });

    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    await applyAuthSession(session);
  } catch (error) {
    console.error("[Supabase] Initialisation failed", {
      error,
      message: error?.message || String(error),
      stack: error?.stack || null,
    });
    setStatus(
      configStatus,
      `Could not connect to Supabase. ${describeSupabaseError(error)} The app will keep using the current browser copy for now.`,
      true,
    );
  }
}

async function fetchRuntimeConfig() {
  const inlineConfig = window.__APP_CONFIG__ || {};

  if (inlineConfig.supabaseUrl && inlineConfig.supabaseAnonKey) {
    console.info("[Supabase] Using public-config.js runtime config");
    return inlineConfig;
  }

  console.warn("[Supabase] public-config.js did not contain Supabase values, falling back to /api/config");
  const response = await fetch(configEndpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Config endpoint unavailable or missing environment variables.");
  }

  return response.json();
}

async function applyAuthSession(session) {
  supabaseUserId = session?.user?.id || null;
  supabaseUserEmail = session?.user?.email || "";
  supabaseAccessToken = session?.access_token || "";
  console.info("[Supabase] applyAuthSession", {
    userId: supabaseUserId,
    email: supabaseUserEmail,
    hasSession: Boolean(session),
  });
  renderAuthState();

  if (!supabaseUserId) {
    console.info("[Supabase] No authenticated user session");
    aiDraftState = {
      loading: false,
      draftId: null,
      data: null,
    };
    state = createStateFromPersisted({
      page: "account",
      activeTeamId: null,
      teams: [],
      contactsByTeamId: {},
      eventsByTeamId: {},
      rsvpsByEventId: {},
      aiDraftsByEventId: {},
      userSettings: defaultUserSettings,
      selectedEventId: null,
      selectedContactIds: [],
    });
    persistCachedStateOnly();
    syncFormFromState();
    renderAll();
    setStatus(
      authStatus,
      "Sign in to load and save your private teams.",
      false,
    );
    return;
  }

  console.info("[Supabase] Authenticated user session ready", {
    userId: supabaseUserId,
    email: supabaseUserEmail,
  });
  clearStatus(authStatus);
  try {
    await hydrateStateFromSupabase();
    persistUserScopedState();
    await applyAppLinkState();
    void ensureDueReminderCoverageInBackground();
  } catch (error) {
    console.error("[Supabase] Failed to hydrate teams after login", {
      userId: supabaseUserId,
      error,
      message: error?.message || String(error),
    });
    setStatus(
      authStatus,
      `Could not load your saved teams from Supabase. ${describeSupabaseError(error)}`,
      true,
    );
    return;
  }
  console.info("[Supabase] Initial sync complete", {
    teamCount: state.teams.length,
    activeTeamId: state.activeTeamId,
  });
}

function renderAuthState() {
  const isLoggedIn = Boolean(supabaseUserId);
  document.body.classList.toggle("guest-mode", !isLoggedIn);
  appShell?.classList.toggle("is-guest-shell", !isLoggedIn);
  landingPage?.classList.toggle("hidden", isLoggedIn);
  accountSignedInContent?.classList.toggle("hidden", !isLoggedIn);
  if (isLoggedIn) {
    authGuestPanel?.classList.add("hidden");
  }
  authUserPanel.classList.toggle("hidden", !isLoggedIn);
  accountSettingsPanel?.classList.toggle("hidden", !isLoggedIn);
  authUserEmail.textContent = supabaseUserEmail || "Signed in";
  appTopbar?.classList.toggle("guest-topbar", !isLoggedIn);
  appNav?.classList.toggle("hidden", !isLoggedIn);
  topbarSide?.classList.toggle("hidden", !isLoggedIn);
  guestTopbarActions?.classList.toggle("hidden", isLoggedIn);
  teamSwitcher.disabled = !isLoggedIn;
  newTeamButton.disabled = !isLoggedIn;
  deleteTeamButton.disabled = !isLoggedIn || state.teams.length === 0;
  renderAccountSettings();
}

async function hydrateStateFromSupabase() {
  if (!supabaseProjectUrl || !supabaseAnonKey || !supabaseAccessToken) {
    throw new Error("Supabase runtime config or session token is missing for team loading.");
  }

  console.info("[Supabase] Fetching teams after login", {
    userId: supabaseUserId,
    query: "supabase.from('teams').select('*').eq('user_id', user.id)",
  });

  const [teamRows, contactRows, eventRows, rsvpRows, aiDraftRows, userSettingsRows] = await Promise.all([
    fetchUserOwnedRowsFromSupabase({
      tableName: teamsTableName,
      orderBy: "updated_at.desc",
      logLabel: "Teams",
    }),
    fetchUserOwnedRowsFromSupabase({
      tableName: teamContactsTableName,
      orderBy: "contact_name.asc",
      logLabel: "Contacts",
    }),
    fetchUserOwnedRowsFromSupabase({
      tableName: teamEventsTableName,
      orderBy: "event_date.asc",
      logLabel: "Events",
    }),
    fetchUserOwnedRowsFromSupabase({
      tableName: eventRsvpsTableName,
      orderBy: "created_at.asc",
      logLabel: "RSVPs",
    }),
    fetchUserOwnedRowsFromSupabase({
      tableName: aiCommunicationDraftsTableName,
      orderBy: "created_at.desc",
      logLabel: "AI drafts",
    }),
    fetchUserOwnedRowsFromSupabase({
      tableName: userSettingsTableName,
      orderBy: "updated_at.desc",
      logLabel: "User settings",
    }),
  ]);

  console.info("[Supabase] Teams fetched after login", {
    userId: supabaseUserId,
    rowCount: teamRows.length,
    rows: teamRows,
  });

  const remoteTeams = teamRows.map(mapDatabaseTeamToRecord);
  const mappedContacts = contactRows.map(mapDatabaseContactToRecord);
  const contactsByTeamId = groupRowsByTeamId(mappedContacts);
  const eventsByTeamId = groupRowsByTeamId(eventRows.map(mapDatabaseEventToRecord));
  const contactNameById = Object.fromEntries(mappedContacts.map((contact) => [contact.id, contact.contactName]));
  const rsvpsByEventId = groupRowsByEventId(
    rsvpRows.map((row) => mapDatabaseRsvpToRecord({
      ...row,
      contact_name: contactNameById[row.contact_id] || row.contact_name || "",
    })),
  );
  const aiDraftsByEventId = groupRowsByEventId(
    aiDraftRows
      .map(mapDatabaseAiDraftToRecord)
      .filter((draft) => draft.eventId),
  );
  const userSettings = mapDatabaseUserSettingsToRecord(
    Array.isArray(userSettingsRows) ? userSettingsRows[0] : userSettingsRows,
  );
  const cachedState = loadState();

  console.info("[Supabase] Source-of-truth check", {
    usesSupabaseSourceOfTruth: true,
    remoteTeamCount: remoteTeams.length,
  });

  if (remoteTeams.length === 0) {
    state = createStateFromPersisted({
      page: cachedState.page,
      activeTeamId: cachedState.activeTeamId,
      teams: [],
      contactsByTeamId: {},
      eventsByTeamId: {},
      rsvpsByEventId: {},
      aiDraftsByEventId: {},
      userSettings,
      selectedEventId: null,
      selectedContactIds: [],
    });
    persistCachedStateOnly();
    syncFormFromState();
    renderAll();
    return;
  }

  state = createStateFromPersisted({
    page: cachedState.page,
    activeTeamId:
      cachedState.activeTeamId && remoteTeams.some((team) => team.id === cachedState.activeTeamId)
        ? cachedState.activeTeamId
        : remoteTeams[0].id,
    teams: remoteTeams,
    contactsByTeamId,
    eventsByTeamId,
    rsvpsByEventId,
    aiDraftsByEventId,
    userSettings,
    selectedEventId: chooseNextSelectedEventId({
      currentSelectedEventId: cachedState.selectedEventId,
      activeTeamId:
        cachedState.activeTeamId && remoteTeams.some((team) => team.id === cachedState.activeTeamId)
          ? cachedState.activeTeamId
          : remoteTeams[0].id,
      eventsByTeamId,
    }),
    selectedContactIds: Array.isArray(cachedState.selectedContactIds) ? cachedState.selectedContactIds : [],
  });

  persistCachedStateOnly();
  persistUserScopedState();
  syncFormFromState();
  renderAll();
  clearStatus(configStatus);
}

async function fetchUserOwnedRowsFromSupabase({ tableName, orderBy, logLabel }) {
  const tableUrl = new URL(`${supabaseProjectUrl}/rest/v1/${tableName}`);
  tableUrl.searchParams.set("select", "*");
  tableUrl.searchParams.set("user_id", `eq.${supabaseUserId}`);

  if (orderBy) {
    tableUrl.searchParams.set("order", orderBy);
  }

  let response;
  let responseText = "";
  let responseData = null;

  try {
    response = await fetch(tableUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    });

    responseText = await response.text();
    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        responseData = responseText;
      }
    }
  } catch (error) {
    console.error(`[Supabase] ${logLabel} query failed`, {
      userId: supabaseUserId,
      error,
      message: error?.message || String(error),
    });
    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      responseData?.message ||
      responseData?.error_description ||
      responseData?.details ||
      responseText ||
      response.statusText ||
      `Supabase ${logLabel.toLowerCase()} fetch failed.`,
    );
    console.error(`[Supabase] ${logLabel} query failed`, {
      userId: supabaseUserId,
      error,
      responseStatus: response.status,
      responseBody: responseData || responseText || null,
    });
    throw error;
  }

  console.info(`[Supabase] ${logLabel} fetched after login`, {
    userId: supabaseUserId,
    rowCount: Array.isArray(responseData) ? responseData.length : 0,
    rows: Array.isArray(responseData) ? responseData : [],
  });

  return Array.isArray(responseData) ? responseData : [];
}

function groupRowsByTeamId(rows) {
  return rows.reduce((accumulator, row) => {
    if (!row?.teamId) {
      return accumulator;
    }

    if (!accumulator[row.teamId]) {
      accumulator[row.teamId] = [];
    }

    accumulator[row.teamId].push(row);
    return accumulator;
  }, {});
}

function groupRowsByEventId(rows) {
  return rows.reduce((accumulator, row) => {
    if (!row?.eventId) {
      return accumulator;
    }

    if (!accumulator[row.eventId]) {
      accumulator[row.eventId] = [];
    }

    accumulator[row.eventId].push(row);
    return accumulator;
  }, {});
}

function chooseNextSelectedEventId({ currentSelectedEventId, activeTeamId, eventsByTeamId }) {
  const activeEvents = getVisibleEventsForTeam(activeTeamId, new Date(), eventsByTeamId);

  if (currentSelectedEventId && activeEvents.some((event) => event.id === currentSelectedEventId)) {
    return currentSelectedEventId;
  }

  return activeEvents[0]?.id || null;
}

async function signUpWithEmail() {
  if (!supabaseClient) {
    setStatus(authStatus, "Supabase is not ready yet.", true);
    return;
  }

  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value;

  if (!email || !password) {
    setStatus(authStatus, "Enter an email and password first.", true);
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    setStatus(authStatus, error.message || "Could not create account.", true);
    return;
  }

  if (!data.session) {
    setStatus(
      authStatus,
      "Account created. Check your email if confirmation is enabled, then log in.",
      false,
    );
    return;
  }

  setStatus(authStatus, "Account created and signed in.", false);
}

async function signInWithEmail() {
  if (!supabaseClient) {
    setStatus(authStatus, "Supabase is not ready yet.", true);
    return;
  }

  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value;

  if (!email || !password) {
    setStatus(authStatus, "Enter your email and password first.", true);
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setStatus(authStatus, error.message || "Could not log in.", true);
    return;
  }

  setStatus(authStatus, "Logged in.", false);
}

async function signOutUser() {
  if (!supabaseClient) {
    return;
  }

  persistUserScopedState();

  setStatus(authStatus, "Logging out...", false);

  let error = null;

  try {
    const result = await Promise.race([
      supabaseClient.auth.signOut({ scope: "local" }),
      timeoutAfter(4000),
    ]);
    error = result?.error || null;
  } catch (caughtError) {
    error = caughtError;
  }

  if (error) {
    console.warn("[Supabase] Local sign-out did not complete cleanly, forcing local session clear", {
      error,
      message: error?.message || String(error),
    });
    clearSupabaseBrowserSession();
  }

  console.info("[Supabase] Sign-out succeeded, clearing local auth state");
  await applyAuthSession(null);
  setStatus(authStatus, "Logged out.", false);
}

function timeoutAfter(milliseconds) {
  return new Promise((_, reject) => {
    window.setTimeout(() => {
      reject(new Error("Supabase sign-out timed out."));
    }, milliseconds);
  });
}

function clearSupabaseBrowserSession() {
  clearSupabaseStorageArea(window.localStorage);
  clearSupabaseStorageArea(window.sessionStorage);
}

function clearSupabaseStorageArea(storage) {
  if (!storage) {
    return;
  }

  const keysToRemove = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (key && /^sb-.*-(auth-token|code-verifier)$/.test(key)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    storage.removeItem(key);
  });
}

async function submitFeedback() {
  const message = feedbackMessageInput.value.trim();

  if (!message) {
    setStatus(feedbackStatus, "Write a little feedback before submitting it.", true);
    return;
  }

  setStatus(feedbackStatus, "Sending feedback...", false);

  try {
    const response = await fetch(feedbackEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message,
        userEmail: supabaseUserEmail || "",
        app: "TeamPro",
        page: state.page,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Feedback could not be sent right now.");
    }

    feedbackForm.reset();
    setStatus(feedbackStatus, "Thanks. Your feedback has been sent.", false);
  } catch (error) {
    console.error("[Feedback] Submit failed", {
      error,
      message: error?.message || String(error),
    });
    setStatus(
      feedbackStatus,
      error?.message || "Feedback could not be sent right now.",
      true,
    );
  }
}

async function saveAccountSettings() {
  if (!supabaseUserId) {
    setStatus(accountSettingsStatus, "Log in before saving settings.", true);
    return;
  }

  const nextSettings = {
    id: state.userSettings?.id || createTeamStorageId(),
    user_id: supabaseUserId,
    default_reminder_3_day_enabled: accountReminder3DayInput?.checked !== false,
    default_reminder_1_day_enabled: accountReminder1DayInput?.checked !== false,
    default_reminder_same_day_enabled: accountReminderSameDayInput?.checked !== false,
  };

  setStatus(accountSettingsStatus, "Saving settings...", false);

  try {
    const savedRow = await saveRowToSupabase({
      tableName: userSettingsTableName,
      row: nextSettings,
      statusElement: accountSettingsStatus,
      pendingMessage: "Saving settings...",
      successMessage: "Settings saved.",
      label: "user settings",
    });
    state.userSettings = mapDatabaseUserSettingsToRecord(savedRow);
    persistState();
    renderAccountSettings();
    setStatus(accountSettingsStatus, "Settings saved.", false);
  } catch (error) {
    console.error("[Supabase] user settings save failed", {
      error,
      message: error?.message || String(error),
      row: nextSettings,
    });
    setStatus(accountSettingsStatus, `Settings save failed: ${describeSupabaseError(error)}`, true);
  }
}

async function runReminderSchedulerCheck() {
  if (!supabaseUserId || !supabaseAccessToken) {
    setStatus(accountSettingsStatus, "Log in before generating reminder drafts.", true);
    return;
  }

  reminderCheckInFlight = true;
  renderAccountSettings();
  setStatus(accountSettingsStatus, "Checking for due reminders...", false);

  try {
    const result = await executeReminderSchedulerCheck();
    console.info("[Reminder Scheduler] Manual reminder check completed", result);
    await hydrateStateFromSupabase();
    setStatus(accountSettingsStatus, formatReminderSchedulerResult(result), false);
  } catch (error) {
    console.error("[Reminder Scheduler] Manual reminder check failed", {
      error,
      message: error?.message || String(error),
    });
    setStatus(accountSettingsStatus, error?.message || "Reminder check failed.", true);
  } finally {
    reminderCheckInFlight = false;
    renderAccountSettings();
  }
}

async function executeReminderSchedulerCheck() {
  const response = await fetch(reminderSchedulerEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      accessToken: supabaseAccessToken,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Reminder check failed.");
  }

  return result;
}

function formatReminderSchedulerResult(result) {
  const dueCount = Number(result?.dueCount || 0);
  const draftCount = Number(result?.draftCount || 0);
  const notifiedCount = Number(result?.notifiedCount || 0);
  const duplicateCount = Number(result?.duplicatesPrevented || 0);
  const skippedCount = Number(result?.skippedCount || 0);

  if (draftCount > 0) {
    return `Created ${draftCount} reminder draft${draftCount === 1 ? "" : "s"} and emailed ${notifiedCount} admin review ${notifiedCount === 1 ? "notification" : "notifications"}.`;
  }

  if (dueCount === 0) {
    return "No reminder drafts are due right now.";
  }

  const summaryParts = [];
  if (duplicateCount > 0) {
    summaryParts.push(
      `${duplicateCount} due reminder${duplicateCount === 1 ? "" : "s"} already had a draft`,
    );
  }
  if (skippedCount > 0) {
    summaryParts.push(`${skippedCount} reminder${skippedCount === 1 ? "" : "s"} were skipped`);
  }

  if (!summaryParts.length) {
    return "No new reminder drafts were created.";
  }

  return `No new reminder drafts were created. ${summaryParts.join(". ")}.`;
}

async function generateTrainingPlan(options = {}) {
  trainingState.loading = true;
  trainingState.accepted = false;
  renderTrainingView();
  setStatus(
    trainingStatus,
    options.regenerate ? "Generating another training plan..." : "Generating training plan...",
    false,
  );

  try {
    const response = await fetch(trainingPlanEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        teamName: state.config.teamName || "Untitled team",
        playersOnField: state.config.playersOnField,
        ageRange: getAgeRangeForPlayersOnField(state.config.playersOnField),
        focusArea: trainingState.focusArea,
        formation: state.lineup.formation,
        squadSize: state.players.length,
        variationSeed:
          window.crypto && typeof window.crypto.randomUUID === "function"
            ? window.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        previousPlanTitle: options.regenerate ? trainingState.plan?.title || "" : "",
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Training plan generation failed.");
    }

    trainingState.plan = normaliseTrainingPlan(result);
    clearStatus(trainingStatus);
  } catch (error) {
    console.error("[Training] Plan generation failed", {
      error,
      message: error?.message || String(error),
    });
    setStatus(
      trainingStatus,
      error?.message || "Training plan generation failed.",
      true,
    );
  } finally {
    trainingState.loading = false;
    renderTrainingView();
  }
}

function acceptTrainingPlan() {
  if (!trainingState.plan) {
    setStatus(trainingStatus, "Generate a plan first.", true);
    return;
  }

  trainingState.accepted = true;
  renderTrainingView();
  setStatus(trainingStatus, "Training plan accepted for this session.", false);
}

async function copyTrainingPlan() {
  if (!trainingState.plan) {
    setStatus(trainingStatus, "Generate a plan first.", true);
    return;
  }

  const text = formatTrainingPlanAsText(trainingState.plan);

  if (!navigator.clipboard?.writeText) {
    setStatus(trainingStatus, "Clipboard copy is not supported here.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus(trainingStatus, "Training plan copied to the clipboard.", false);
  } catch (error) {
    setStatus(trainingStatus, "Could not copy the training plan right now.", true);
  }
}

function describeSupabaseError(error) {
  const message = String(error?.message || error || "");

  if (message.includes("Invalid API key") || message.includes("JWT")) {
    return "Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct.";
  }

  if (message.includes("relation") || message.includes("column")) {
    return "The database schema does not match the app yet. Run the latest supabase-schema.sql in Supabase.";
  }

  if (message.includes("row-level security") || message.includes("permission denied")) {
    return "Supabase RLS is blocking this request. Confirm the authenticated user policies were created for teams, contacts, and events.";
  }

  if (message.includes("Config endpoint unavailable")) {
    return "The frontend could not read runtime config. Confirm the Vercel build ran and /api/config or public-config.js is available.";
  }

  return message || "Check the browser console and Supabase settings.";
}

function safeSupabaseHost(url) {
  try {
    return new URL(url).host;
  } catch (error) {
    return url;
  }
}

function normaliseSupabaseProjectUrl(url) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .replace(/\/rest\/v1\/?$/i, "/")
      .replace(/\/auth\/v1\/?$/i, "/");
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch (error) {
    return String(url)
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/auth\/v1\/?$/i, "")
      .replace(/\/$/, "");
  }
}

function loadState() {
  const fallbackTeam = createTeamRecordFromConfig(sampleConfig);

  try {
    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      return createStateFromPersisted({
        page: "config",
        activeTeamId: fallbackTeam.id,
        teams: [fallbackTeam],
        contactsByTeamId: {},
      eventsByTeamId: {},
      rsvpsByEventId: {},
      aiDraftsByEventId: {},
      userSettings: defaultUserSettings,
      selectedEventId: null,
      selectedContactIds: [],
    });
    }

    const parsed = JSON.parse(raw);

    if (!parsed) {
      return createStateFromPersisted({
        page: "config",
        activeTeamId: fallbackTeam.id,
        teams: [fallbackTeam],
      });
    }

    if (Array.isArray(parsed.teams) && parsed.teams.length > 0) {
      return createStateFromPersisted(parsed);
    }

    if (parsed.config) {
      const migratedTeam = createTeamRecordFromLegacyState(parsed);
      return createStateFromPersisted({
        page: parsed.page === "manage" ? "manage" : "config",
        activeTeamId: migratedTeam.id,
        teams: [migratedTeam],
        contactsByTeamId: {},
        eventsByTeamId: {},
        rsvpsByEventId: {},
        aiDraftsByEventId: {},
        selectedEventId: null,
        selectedContactIds: [],
      });
    }

    return createStateFromPersisted({
      page: "config",
      activeTeamId: fallbackTeam.id,
      teams: [fallbackTeam],
    });
  } catch (error) {
    return createStateFromPersisted({
      page: "config",
      activeTeamId: fallbackTeam.id,
      teams: [fallbackTeam],
    });
  }
}

function createStateFromPersisted(saved) {
  const fallbackTeam = createTeamRecordFromConfig(sampleConfig);
  const teams = (saved.teams || [])
    .map(sanitiseTeamRecord)
    .filter(Boolean);
  const eventsByTeamId = sanitiseEntityMap(saved.eventsByTeamId);
  const activeTeamId = teams.some((team) => team.id === saved.activeTeamId)
    ? saved.activeTeamId
    : (teams[0] || fallbackTeam).id;
  const activeTeam = teams.find((team) => team.id === activeTeamId) || fallbackTeam;
  const runtime = hydrateTeamRuntime(activeTeam);

  return {
    page: ["account", "config", "manage", "comms", "training"].includes(saved.page) ? saved.page : "config",
    teams: teams.length > 0 ? teams : [fallbackTeam],
    activeTeamId: activeTeam.id,
    config: runtime.config,
    players: runtime.players,
    lineup: runtime.lineup,
    contactsByTeamId: sanitiseEntityMap(saved.contactsByTeamId),
    eventsByTeamId,
    rsvpsByEventId: sanitiseEntityMap(saved.rsvpsByEventId),
    aiDraftsByEventId: sanitiseEntityMap(saved.aiDraftsByEventId),
    userSettings: normaliseUserSettings(saved.userSettings),
    selectedEventId: chooseNextSelectedEventId({
      currentSelectedEventId: saved.selectedEventId || null,
      activeTeamId: activeTeam.id,
      eventsByTeamId,
    }),
    selectedContactIds: Array.isArray(saved.selectedContactIds) ? saved.selectedContactIds.filter(Boolean) : [],
    selectedTarget: null,
  };
}

function normaliseUserSettings(settings) {
  const safe = settings && typeof settings === "object" ? settings : {};
  return {
    ...defaultUserSettings,
    id: safe.id || "",
    userId: safe.userId || "",
    defaultReminder3DayEnabled: safe.defaultReminder3DayEnabled !== false,
    defaultReminder1DayEnabled: safe.defaultReminder1DayEnabled !== false,
    defaultReminderSameDayEnabled: safe.defaultReminderSameDayEnabled !== false,
    createdAt: safe.createdAt || "",
    updatedAt: safe.updatedAt || "",
  };
}

function sanitiseEntityMap(entityMap) {
  if (!entityMap || typeof entityMap !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(entityMap).map(([teamId, rows]) => [teamId, Array.isArray(rows) ? rows.filter(Boolean) : []]),
  );
}

function getSportDefinition(sportType) {
  return sportCatalog[sportType] || sportCatalog.football;
}

function normaliseSportType(sportType) {
  return getSportDefinition((sportType || "").toLowerCase()).sportType;
}

function getSelectedSportType() {
  return normaliseSportType(teamSportTypeInput?.value || state.config?.sportType || "football");
}

function getSportSupportedTeamSizes(sportType) {
  return [...getSportDefinition(sportType).supportedTeamSizes];
}

function getSportDefaultTeamSize(sportType) {
  return getSportDefinition(sportType).defaultTeamSize;
}

function getSportIcon(sportType) {
  return getSportDefinition(sportType).icon;
}

function getSportDisplayName(sportType) {
  return getSportDefinition(sportType).displayName;
}

function getSportFieldLabel(sportType) {
  return getSportDefinition(sportType).fieldLabel;
}

function getSportLayout(sportType, playersOnField, layoutKey = "") {
  const safeSportType = normaliseSportType(sportType);

  if (safeSportType === "football") {
    return {
      key: layoutKey,
      label: layoutKey,
      slots: [],
    };
  }

  if (safeSportType === "rugby") {
    return rugbyLayoutLibrary[playersOnField] || rugbyLayoutLibrary[getSportDefaultTeamSize(safeSportType)];
  }

  if (safeSportType === "softball") {
    return softballLayoutLibrary[playersOnField] || softballLayoutLibrary[getSportDefaultTeamSize(safeSportType)];
  }

  const safeSize = Math.max(7, Math.min(playersOnField, cricketSlotLibrary.length));
  return {
    key: `cricket-${safeSize}-standard`,
    label: "Standard Layout",
    slots: cricketSlotLibrary.slice(0, safeSize),
  };
}

function getSuggestedFormations(playersOnField, sportType = "football") {
  const safeSportType = normaliseSportType(sportType);

  if (safeSportType === "football") {
    return formationLibrary[playersOnField] || [];
  }

  const layout = getSportLayout(safeSportType, playersOnField);
  return layout ? [layout.key] : [];
}

function getLayoutDisplayLabel(sportType, formation, playersOnField) {
  const safeSportType = normaliseSportType(sportType);

  if (safeSportType === "football") {
    return formation || "Formation";
  }

  return getSportLayout(safeSportType, playersOnField, formation)?.label || "Standard Layout";
}

function getSportLegendItems(sportType) {
  const safeSportType = normaliseSportType(sportType);

  if (safeSportType === "football") {
    return [
      { cssClass: "gk-dot", label: "Goalkeeper" },
      { cssClass: "outfield-dot", label: "Outfield" },
    ];
  }

  if (safeSportType === "rugby") {
    return [
      { cssClass: "forwards-dot", label: "Forwards" },
      { cssClass: "backs-dot", label: "Backs" },
    ];
  }

  if (safeSportType === "softball") {
    return [
      { cssClass: "infield-dot", label: "Infield" },
      { cssClass: "outfield-dot", label: "Outfield" },
    ];
  }

  return [
    { cssClass: "ring-dot", label: "Ring field" },
    { cssClass: "deep-dot", label: "Boundary" },
  ];
}

function renderPlayersOnFieldOptions(sportType, selectedValue = null) {
  const safeSportType = normaliseSportType(sportType);
  const supportedSizes = getSportSupportedTeamSizes(safeSportType);
  const selectedSize = Number(selectedValue || playersOnFieldInput.value) || getSportDefaultTeamSize(safeSportType);
  const fallbackSize = supportedSizes.includes(selectedSize) ? selectedSize : getSportDefaultTeamSize(safeSportType);

  playersOnFieldInput.innerHTML = supportedSizes
    .map((value) => `<option value="${value}" ${value === fallbackSize ? "selected" : ""}>${value} players</option>`)
    .join("");
}

function hydrateTeamRuntime(teamRecord) {
  const config = normaliseConfig(teamRecord.config);
  const players = config.players.map((name, index) => ({
    id: createId(index),
    name,
  }));
  const runtime = {
    config,
    players,
    lineup: buildLineup(players, config.playersOnField, config.selectedFormation, config.sportType),
  };

  return applySavedLineup(runtime, teamRecord.lineup);
}

function applySavedLineup(runtime, savedLineup) {
  if (!savedLineup?.formation || !runtime.config.formations.includes(savedLineup.formation)) {
    return runtime;
  }

  runtime.lineup = buildLineup(runtime.players, runtime.config.playersOnField, savedLineup.formation, runtime.config.sportType);

  const availablePlayers = new Map(runtime.players.map((player) => [player.name, player.id]));
  const absentIds = [];
  (savedLineup.absent || []).forEach((name) => {
    const playerId = availablePlayers.get(name);

    if (playerId && !absentIds.includes(playerId)) {
      absentIds.push(playerId);
    }
  });

  runtime.lineup.absentIds = absentIds;
  const used = new Set();

  runtime.lineup.slots.forEach((slot, index) => {
    const playerName = savedLineup.slotAssignments?.[index];
    const playerId = availablePlayers.get(playerName);

    if (playerId && !used.has(playerId) && !absentIds.includes(playerId)) {
      slot.occupantId = playerId;
      used.add(playerId);
    } else {
      slot.occupantId = null;
    }
  });

  runtime.lineup.benchIds = [];
  (savedLineup.bench || []).forEach((name) => {
    const playerId = availablePlayers.get(name);

    if (playerId && !used.has(playerId) && !absentIds.includes(playerId)) {
      runtime.lineup.benchIds.push(playerId);
      used.add(playerId);
    }
  });

  absentIds.forEach((playerId) => {
    if (!runtime.lineup.benchIds.includes(playerId)) {
      runtime.lineup.benchIds.push(playerId);
    }
    used.add(playerId);
  });

  runtime.players.forEach((player) => {
    if (!used.has(player.id)) {
      const emptySlot = runtime.lineup.slots.find((slot) => !slot.occupantId);

      if (emptySlot) {
        emptySlot.occupantId = player.id;
      } else {
        runtime.lineup.benchIds.push(player.id);
      }
    }
  });

  return runtime;
}

function createTeamRecordFromLegacyState(saved) {
  return {
    id: createTeamStorageId(),
    config: normaliseConfig(saved.config),
    lineup: saved.lineup || null,
  };
}

function createTeamRecordFromConfig(config) {
  const teamId = createTeamStorageId();
  const normalised = normaliseConfig(config);
  const runtime = hydrateTeamRuntime({
    id: teamId,
    config: normalised,
    lineup: null,
  });

  return {
    id: teamId,
    config: runtime.config,
    lineup: createLineupSnapshot(runtime),
  };
}

function sanitiseTeamRecord(team) {
  if (!team?.config) {
    return null;
  }

  return {
    id: team.id || createTeamStorageId(),
    config: normaliseConfig(team.config),
    lineup: team.lineup || null,
  };
}

function normaliseConfig(config) {
  const sportType = normaliseSportType(config.sportType || "football");
  const supportedTeamSizes = getSportSupportedTeamSizes(sportType);
  const rawPlayersOnField = Number(config.playersOnField) || getSportDefaultTeamSize(sportType);
  const playersOnField = supportedTeamSizes.includes(rawPlayersOnField)
    ? rawPlayersOnField
    : getSportDefaultTeamSize(sportType);
  const players = Array.isArray(config.players) ? dedupeNames(config.players) : [];
  const formations = Array.from(
    new Set((config.formations || []).map(normaliseFormation)),
  ).filter((formation) => isValidFormation(formation, playersOnField, sportType));
  const safeFormations = formations.length > 0
    ? formations
    : getSuggestedFormations(playersOnField, sportType).slice(0, 1);

  return {
    ...config,
    sportType,
    teamName: (config.teamName || "").trim(),
    playersOnField,
    players,
    formations: safeFormations,
    selectedFormation: safeFormations.includes(config.selectedFormation)
      ? config.selectedFormation
      : safeFormations[0],
  };
}

function createTeamStorageId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `team-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createId(index) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `player-${Date.now()}-${index}`;
}

function buildLineup(players, playersOnField, formation, sportType = "football") {
  const slots = buildFormationSlots(formation, playersOnField, sportType).map((slot) => ({
    ...slot,
    occupantId: null,
  }));

  players.forEach((player, index) => {
    if (slots[index]) {
      slots[index].occupantId = player.id;
    }
  });

  return {
    formation,
    sportType: normaliseSportType(sportType),
    slots,
    benchIds: players.slice(slots.length).map((player) => player.id),
    absentIds: [],
  };
}

function syncFormFromState() {
  applyConfigToForm(state.config);
}

function applyConfigToForm(config) {
  teamNameInput.value = config.teamName;
  if (teamSportTypeInput) {
    teamSportTypeInput.value = config.sportType || "football";
  }
  renderPlayersOnFieldOptions(config.sportType, config.playersOnField);
  playersOnFieldInput.value = String(config.playersOnField);
  playerNamesInput.value = config.players.join("\n");
  renderPlayerRows();
  formationDraft = [...config.formations];
  renderFormationChoices();
  renderContactLinkedPlayerOptions();
  renderAccountSettings();
}

function renderPlayerRows() {
  if (!playerRows) {
    return;
  }

  const draftNames = parsePlayerNames(playerNamesInput.value || "");
  const playersOnField = Number(playersOnFieldInput.value) || 0;
  const rowCount = Math.max(draftNames.length + 2, playersOnField + 4, 8);
  const linkedContactsByPlayer = getLinkedContactsByPlayer();

  playerRows.innerHTML = Array.from({ length: rowCount }, (_, index) => `
    <label class="player-row">
      <span class="player-row-number">${index + 1}</span>
      <div class="player-row-main">
        <input
          type="text"
          class="player-row-input"
          data-player-row="${index}"
          value="${escapeHtml(draftNames[index] || "")}"
          placeholder="Player ${index + 1}"
        />
        ${
          draftNames[index] && linkedContactsByPlayer.get(draftNames[index])?.length
            ? `<span class="player-row-links">${escapeHtml(`Linked contacts: ${linkedContactsByPlayer.get(draftNames[index]).join(", ")}`)}</span>`
            : ""
        }
      </div>
    </label>
  `).join("");

  Array.from(playerRows.querySelectorAll("[data-player-row]")).forEach((input) => {
    input.addEventListener("input", () => {
      syncPlayerNamesFieldFromRows();
      renderContactLinkedPlayerOptions();
    });
  });
}

function getLinkedContactsByPlayer() {
  const linkedContactsByPlayer = new Map();

  getActiveTeamContacts().forEach((contact) => {
    const contactName = (contact.contactName || "").trim();
    if (!contactName || !Array.isArray(contact.linkedPlayers)) {
      return;
    }

    contact.linkedPlayers
      .map((playerName) => (playerName || "").trim())
      .filter(Boolean)
      .forEach((playerName) => {
        const existingContacts = linkedContactsByPlayer.get(playerName) || [];
        if (!existingContacts.includes(contactName)) {
          existingContacts.push(contactName);
        }
        linkedContactsByPlayer.set(playerName, existingContacts);
      });
  });

  return linkedContactsByPlayer;
}

function syncPlayerNamesFieldFromRows() {
  if (!playerRows || !playerNamesInput) {
    return;
  }

  const names = Array.from(playerRows.querySelectorAll("[data-player-row]"))
    .map((input) => input.value.trim().replace(/\s+/g, " "))
    .filter(Boolean);

  playerNamesInput.value = names.join("\n");
}

function renderFormationChoices() {
  const sportType = getSelectedSportType();
  const playersOnField = Number(playersOnFieldInput.value);
  const suggestions = getSuggestedFormations(playersOnField, sportType);
  const combined = Array.from(new Set([...formationDraft, ...suggestions]))
    .filter((formation) => isValidFormation(formation, playersOnField, sportType))
    .sort(compareFormationStrings);

  if (sportType !== "football") {
    formationSuggestions.innerHTML = combined
      .map((formation) => `<span class="formation-choice"><span>${escapeHtml(getLayoutDisplayLabel(sportType, formation, playersOnField))}</span></span>`)
      .join("");
    formationHelp.textContent = `${getSportDisplayName(sportType)} uses a standard position layout for this team size.`;
    formationHelp.classList.remove("is-error");
    return;
  }

  formationSuggestions.innerHTML = combined
    .map(
      (formation) => `
        <label class="formation-choice">
          <input
            type="checkbox"
            value="${formation}"
            ${formationDraft.includes(formation) ? "checked" : ""}
          />
          <span>${formation}</span>
        </label>
      `,
    )
    .join("");

  formationHelp.textContent = `Every formation must add up to ${playersOnField - 1} outfield players, plus 1 goalkeeper.`;
  formationHelp.classList.remove("is-error");

  Array.from(formationSuggestions.querySelectorAll('input[type="checkbox"]')).forEach((input) => {
    input.addEventListener("change", () => {
      formationDraft = Array.from(
        formationSuggestions.querySelectorAll('input[type="checkbox"]:checked'),
        (checkbox) => checkbox.value,
      ).sort(compareFormationStrings);
    });
  });
}

function renderAll() {
  renderTeamSwitcher();
  renderPage();
  renderQuickReminderApproval();
  renderAccountSettings();
  renderPlayerRows();
  renderManagerControls();
  renderBench();
  renderPitch();
  renderContacts();
  renderContactFormPanel();
  renderContactLinkedPlayerOptions();
  renderEventRepeatInputs();
  renderEventFormPanel();
  renderEvents();
  renderEventMessaging();
  renderEventRsvps();
  renderAiAssistant();
  renderTrainingView();
}

function renderQuickReminderApproval() {
  if (!quickReminderApprovalPanel) {
    return;
  }

  const draftRecord = getQuickReminderApprovalDraft();
  const eventRecord = getSelectedEvent();
  const isVisible = Boolean(
    quickReminderApprovalOpen
      && supabaseUserId
      && draftRecord
      && draftRecord.status === "pending_review"
      && eventRecord,
  );

  quickReminderApprovalPanel.classList.toggle("hidden", !isVisible);

  if (!isVisible) {
    clearStatus(quickReminderApprovalStatus);
    return;
  }

  const recipients = getRecipientsForReminderDraft(eventRecord, draftRecord);
  const teamName = state.config.teamName || "TeamPro team";
  const approvalLabel = formatApprovalDraftLabel(draftRecord);

  if (quickReminderApprovalHeading) {
    quickReminderApprovalHeading.textContent = `${teamName} | ${eventRecord.eventTitle}`;
  }

  if (quickReminderApprovalMeta) {
    const timing = getEventTimingLabel(eventRecord) || "Time to be confirmed";
    quickReminderApprovalMeta.textContent = `${approvalLabel} • ${formatEventDate(eventRecord.eventDate)} • ${timing} • ${eventRecord.location || "Location to be confirmed"} • ${recipients.length} recipient${recipients.length === 1 ? "" : "s"}`;
  }

  if (quickReminderApprovalMessage) {
    quickReminderApprovalMessage.value = draftRecord.draftJson?.message?.email_body || buildEventMessageText(eventRecord);
  }

  if (quickReminderApprovalSendButton) {
    quickReminderApprovalSendButton.disabled = sendingEventUpdate || !recipients.length;
    quickReminderApprovalSendButton.textContent = sendingEventUpdate ? "Sending..." : "Send Now";
  }
}

function renderAccountSettings() {
  const settings = normaliseUserSettings(state.userSettings);
  if (eventReminderSettingsPanel) {
    eventReminderSettingsPanel.classList.toggle("hidden", !accountReminderSettingsOpen);
  }
  if (openEventReminderSettingsButton) {
    openEventReminderSettingsButton.textContent = accountReminderSettingsOpen
      ? "Hide Event Reminders"
      : "Event Reminders";
  }
  if (accountReminder3DayInput) {
    accountReminder3DayInput.checked = settings.defaultReminder3DayEnabled;
  }
  if (accountReminder1DayInput) {
    accountReminder1DayInput.checked = settings.defaultReminder1DayEnabled;
  }
  if (accountReminderSameDayInput) {
    accountReminderSameDayInput.checked = settings.defaultReminderSameDayEnabled;
  }
  if (saveAccountSettingsButton) {
    saveAccountSettingsButton.disabled = !supabaseUserId || reminderCheckInFlight;
  }
  if (runReminderCheckButton) {
    runReminderCheckButton.disabled = !supabaseUserId || reminderCheckInFlight;
    runReminderCheckButton.textContent = reminderCheckInFlight
      ? "Checking reminders..."
      : "Generate Due Reminders";
  }
}

function renderTeamSwitcher() {
  teamSwitcher.innerHTML = state.teams
    .map((team) => {
      const selected = team.id === state.activeTeamId ? "selected" : "";
      const label = team.config.teamName || "Untitled team";
      return `<option value="${team.id}" ${selected}>${escapeHtml(`${getSportIcon(team.config.sportType)} ${label}`)}</option>`;
    })
    .join("");

  deleteTeamButton.disabled = !supabaseUserId || state.teams.length === 0;
}

function renderPage() {
  const effectivePage = supabaseUserId ? state.page : authRequiredPage;
  const accountActive = effectivePage === "account";
  const configActive = effectivePage === "config";
  const manageActive = effectivePage === "manage";
  const commsActive = effectivePage === "comms";
  const trainingActive = effectivePage === "training";

  accountPage.classList.toggle("hidden", !accountActive);
  configPage.classList.toggle("hidden", !configActive);
  managePage.classList.toggle("hidden", !manageActive);
  commsPage.classList.toggle("hidden", !commsActive);
  trainingPage.classList.toggle("hidden", !trainingActive);
  navAccount.classList.toggle("is-active", accountActive);
  navConfig.classList.toggle("is-active", configActive);
  navManage.classList.toggle("is-active", manageActive);
  navComms.classList.toggle("is-active", commsActive);
  navTraining.classList.toggle("is-active", trainingActive);
}

function focusSignupExperience() {
  authGuestPanel?.classList.remove("hidden");
  window.setTimeout(() => {
    authEmailInput?.focus();
  }, 180);
}

function focusLoginExperience() {
  authGuestPanel?.classList.remove("hidden");
  window.setTimeout(() => {
    authEmailInput?.focus();
  }, 180);
}

function scrollToSection(sectionId) {
  if (!sectionId) {
    return;
  }

  document.querySelector(`#${CSS.escape(sectionId)}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function renderManagerControls() {
  const sportType = state.config.sportType || "football";
  const teamLabel = state.config.teamName || "Untitled team";
  const layoutLabel = getLayoutDisplayLabel(sportType, state.lineup.formation, state.config.playersOnField);
  const sportLabel = getSportDisplayName(sportType);

  teamNameSummary.textContent = `${getSportIcon(sportType)} ${teamLabel}`;
  if (pitchEyebrow) {
    pitchEyebrow.textContent = `${getSportIcon(sportType)} ${sportLabel} | ${layoutLabel}`;
  }
  pitchTitle.textContent = teamLabel;
  selectionHint.textContent = state.selectedTarget
    ? describeSelection(state.selectedTarget)
    : "Select a player on the field or bench, then select another player or an empty position.";

  if (formationFieldLabel) {
    formationFieldLabel.textContent = sportType === "football" ? "Formation" : "Layout";
  }

  if (formationBuilderTitle) {
    formationBuilderTitle.textContent = sportType === "football" ? "Available formations" : "Available layouts";
  }

  if (formationBuilderSection) {
    formationBuilderSection.classList.toggle("hidden", sportType !== "football");
  }

  formationSelect.innerHTML = state.config.formations
    .map(
      (formation) =>
        `<option value="${formation}" ${formation === state.lineup.formation ? "selected" : ""}>${escapeHtml(getLayoutDisplayLabel(sportType, formation, state.config.playersOnField))}</option>`,
    )
    .join("");

  formationSelect.disabled = state.config.formations.length <= 1;

  if (pitchLegend) {
    pitchLegend.innerHTML = getSportLegendItems(sportType)
      .map((item) => `<span><i class="legend-dot ${item.cssClass}"></i>${escapeHtml(item.label)}</span>`)
      .join("");
  }

  saveNowButton.disabled = !supabaseUserId || saveNowInFlight;
  renderAvailabilityControl();
}

function renderContacts() {
  const contacts = getActiveTeamContacts();

  contactList.innerHTML = contacts.length
    ? contacts
        .map(
          (contact) => `
            <div class="entity-card contact-card">
              <div class="entity-card-header">
                <div class="contact-card-heading">
                  <div class="contact-card-title-row">
                    <div class="contact-card-title-group">
                      <strong>${escapeHtml(contact.contactName)}</strong>
                      ${contact.role ? `<span class="pill">${escapeHtml(contact.role)}</span>` : ""}
                    </div>
                    <div class="entity-card-actions contact-card-actions">
                      <button type="button" class="secondary-button" data-contact-action="edit" data-contact-id="${contact.id}">Edit</button>
                      <button type="button" class="danger-button" data-contact-action="delete" data-contact-id="${contact.id}">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="entity-card-meta contact-card-meta">
                ${contact.email ? `<span class="contact-card-meta-item">Email: ${escapeHtml(contact.email)}</span>` : ""}
                ${contact.phone ? `<span class="contact-card-meta-item">Phone: ${escapeHtml(contact.phone)}</span>` : ""}
                ${contact.linkedPlayers?.length ? `<span class="contact-card-meta-item">Linked players: ${escapeHtml(contact.linkedPlayers.join(", "))}</span>` : ""}
                ${contact.notes ? `<span>${escapeHtml(contact.notes)}</span>` : ""}
              </div>
            </div>
          `,
        )
        .join("")
    : '<div class="info-card"><strong>No contacts yet</strong><p>Add team contacts here so they are ready for updates.</p></div>';

  Array.from(contactList.querySelectorAll("[data-contact-action]")).forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.contactAction;
      const contactId = button.dataset.contactId;

      if (action === "edit") {
        populateContactForm(contactId);
      } else if (action === "delete") {
        void deleteContact(contactId);
      }
    });
  });
}

function renderContactFormPanel() {
  if (!contactFormPanel || !openContactFormButton) {
    return;
  }

  contactFormPanel.classList.toggle("hidden", !contactFormOpen);

  if (!contactFormOpen) {
    openContactFormButton.textContent = "Add Contact";
    return;
  }

  openContactFormButton.textContent = contactIdInput?.value ? "Close Contact" : "Hide Contact Form";
}

function renderContactLinkedPlayerOptions() {
  if (!contactLinkedPlayers) {
    return;
  }

  const playerNames = getConfigFormPlayerNames();
  const selectedNames = getSelectedLinkedPlayersFromForm();

  contactLinkedPlayers.innerHTML = playerNames.length
    ? playerNames
        .map(
          (playerName) => `
            <label class="linked-player-tile">
              <input
                type="checkbox"
                data-linked-player="${escapeHtml(playerName)}"
                ${selectedNames.includes(playerName) ? "checked" : ""}
              />
              <span class="linked-player-content">
                <strong>${escapeHtml(playerName)}</strong>
              </span>
            </label>
          `,
        )
        .join("")
    : '<div class="info-card"><strong>Add player names first</strong><p>Player links become available once the squad list is filled in.</p></div>';
}

function getConfigFormPlayerNames() {
  syncPlayerNamesFieldFromRows();
  const draftNames = dedupeNames(parsePlayerNames(playerNamesInput.value || ""));
  return draftNames.length ? draftNames : dedupeNames(state.config.players || []);
}

function getSelectedLinkedPlayersFromForm() {
  if (!contactLinkedPlayers) {
    return [];
  }

  return Array.from(contactLinkedPlayers.querySelectorAll("[data-linked-player]:checked"))
    .map((input) => input.dataset.linkedPlayer || "")
    .filter(Boolean);
}

function renderEvents() {
  const events = getActiveTeamEvents();

  if (eventListSummary) {
    const plannedCount = events.filter((eventRecord) => eventRecord.status === "planned").length;
    eventListSummary.innerHTML = `
      <strong>${events.length} event${events.length === 1 ? "" : "s"}</strong>
      <p>${plannedCount} planned${events.length ? " | Scroll the list to manage each event individually." : " | Create your first event to get started."}</p>
    `;
  }

  eventList.innerHTML = events.length
    ? events
        .map(
          (eventRecord) => `
            <div class="entity-card entity-card-compact ${eventRecord.id === state.selectedEventId ? "is-selected" : ""}">
              <div class="entity-card-header">
                <div>
                  <strong>${escapeHtml(eventRecord.eventTitle)}</strong>
                  <span class="pill">${escapeHtml(formatEventTypeLabel(eventRecord.eventType))}</span>
                  <span class="pill ${eventRecord.status === "cancelled" ? "is-cancelled" : ""}">${escapeHtml(eventRecord.status)}</span>
                </div>
              </div>
              <div class="entity-card-meta">
                <span>${escapeHtml(formatEventDate(eventRecord.eventDate))}${getEventTimingLabel(eventRecord) ? ` | ${escapeHtml(getEventTimingLabel(eventRecord))}` : ""}</span>
                ${eventRecord.location ? `<span>${escapeHtml(eventRecord.location)}</span>` : ""}
                ${eventRecord.notes ? `<span>${escapeHtml(eventRecord.notes)}</span>` : ""}
                ${getEventReminderScheduleLabel(eventRecord) ? `<span>${escapeHtml(getEventReminderScheduleLabel(eventRecord))}</span>` : ""}
              </div>
              <div class="entity-card-actions">
                <button type="button" class="secondary-button" data-event-action="select" data-event-id="${eventRecord.id}">Open</button>
                <button type="button" class="secondary-button" data-event-action="edit" data-event-id="${eventRecord.id}">Edit</button>
                <button type="button" class="danger-button" data-event-action="delete" data-event-id="${eventRecord.id}">Delete</button>
              </div>
            </div>
          `,
        )
        .join("")
    : '<div class="info-card"><strong>No events yet</strong><p>Add events so you can build and send team updates.</p></div>';

  Array.from(eventList.querySelectorAll("[data-event-action]")).forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.eventAction;
      const eventId = button.dataset.eventId;

      if (action === "select") {
        state.selectedEventId = eventId || null;
        eventRsvpDetailsOpen = false;
        persistState();
        renderEvents();
        renderEventMessaging();
        renderEventRsvps();
        renderAiAssistant();
      } else if (action === "edit") {
        populateEventForm(eventId);
      } else if (action === "delete") {
        void deleteEvent(eventId);
      }
    });
  });
}

function renderEventMessaging() {
  const contacts = getActiveTeamContacts();
  const events = getActiveTeamEvents();
  if (!state.selectedEventId && events.length) {
    state.selectedEventId = getNextPlannedEvent()?.id || events[0].id;
  }
  const selectedEvent = getSelectedEvent();
  const selectedDraft = getSelectedReminderDraft();
  if (selectedEvent && state.selectedEventId !== selectedEvent.id) {
    state.selectedEventId = selectedEvent.id;
  }
  const emailContacts = contacts.filter((contact) => contact.email);
  const reminderRecipientContacts = selectedDraft
    ? getRecipientsForReminderDraft(selectedEvent, selectedDraft)
    : getRecipientsForEventUpdate(selectedEvent, "reminder");
  syncMessageRecipientSelection(selectedEvent, emailContacts, reminderRecipientContacts);
  const selectedReminderContacts = emailContacts.filter((contact) => state.selectedContactIds.includes(contact.id));
  const showReminderComposer = reminderComposerOpen && Boolean(selectedEvent) && reminderComposerEventId === selectedEvent.id;

  if (selectedEventHeading) {
    selectedEventHeading.textContent = selectedEvent?.eventTitle || "Selected Event";
  }

  if (messageRecipientSummary) {
    if (!selectedEvent) {
      messageRecipientSummary.textContent = "Choose an event to see who should receive the reminder.";
    } else if (!emailContacts.length) {
      messageRecipientSummary.textContent = "No contacts with email addresses are available for this team yet.";
    } else if (selectedDraft) {
      messageRecipientSummary.textContent = `${selectedReminderContacts.length} contact${selectedReminderContacts.length === 1 ? "" : "s"} selected for this ${formatApprovalDraftLabel(selectedDraft).toLowerCase()}. ${reminderRecipientContacts.length} ${reminderRecipientContacts.length === 1 ? "contact is" : "contacts are"} suggested by the draft.`;
    } else {
      messageRecipientSummary.textContent = `${selectedReminderContacts.length} contact${selectedReminderContacts.length === 1 ? "" : "s"} selected. ${reminderRecipientContacts.length} ${reminderRecipientContacts.length === 1 ? "contact has" : "contacts have"} not replied yet.`;
    }
  }

  if (reminderDraftSummary) {
    if (!selectedDraft || !selectedEvent) {
      reminderDraftSummary.classList.add("hidden");
      reminderDraftSummary.innerHTML = "";
    } else {
      reminderDraftSummary.classList.remove("hidden");
      reminderDraftSummary.innerHTML = `
        <strong>${escapeHtml(formatApprovalDraftLabel(selectedDraft))} ready</strong>
        <p>Generated for ${escapeHtml(selectedEvent.eventTitle)} and waiting for your review before anything is sent.</p>
      `;
    }
  }

  if (reminderRecipientsPanel) {
    reminderRecipientsPanel.classList.toggle("hidden", !showReminderComposer);
  }

  if (messageRecipientList && showReminderComposer) {
    messageRecipientList.innerHTML = !selectedEvent
      ? '<div class="compact-list-item">Choose an event first.</div>'
      : !emailContacts.length
        ? '<div class="compact-list-item">No contact emails are on file for this team yet.</div>'
        : emailContacts
          .map((contact) => {
            const rsvpRows = getSelectedEventRsvps().filter((row) => row.contactId === contact.id);
            const status = getContactReminderStatusLabel(rsvpRows);
            const linkedPlayers = contact.linkedPlayers?.length ? `Linked players: ${contact.linkedPlayers.join(", ")}` : "";
            return `
              <label class="recipient-option">
                <input
                  type="checkbox"
                  data-message-recipient-id="${contact.id}"
                  ${state.selectedContactIds.includes(contact.id) ? "checked" : ""}
                />
                <span>
                  <strong>${escapeHtml(contact.contactName)}</strong>
                  <span>${escapeHtml(contact.email || "")}</span>
                  <span>${escapeHtml(status)}</span>
                  ${linkedPlayers ? `<span>${escapeHtml(linkedPlayers)}</span>` : ""}
                </span>
              </label>
            `;
          })
          .join("");
  }

  const messageText = getMessagePreviewValue(selectedEvent);
  messagePreview.value = messageText;
  if (dismissReminderDraftButton) {
    dismissReminderDraftButton.classList.toggle("hidden", !selectedDraft);
    dismissReminderDraftButton.disabled = sendingEventUpdate || !selectedDraft;
  }
  if (sendReminderEmailButton) {
    sendReminderEmailButton.disabled = !selectedEvent
      || sendingEventUpdate
      || (showReminderComposer ? !selectedReminderContacts.length : !emailContacts.length);
    if (showReminderComposer) {
      sendReminderEmailButton.textContent = selectedDraft
        ? selectedDraft.draftType === "event_cancellation"
          ? "Approve & Send Cancellation"
          : "Approve & Send Reminder"
        : "Send Reminder Now";
    } else {
      sendReminderEmailButton.textContent = selectedDraft?.draftType === "event_cancellation" ? "Send Cancellation" : "Send Reminder";
    }
  }

  if (sendReminderPrimaryActionButton) {
    sendReminderPrimaryActionButton.disabled = sendReminderEmailButton?.disabled ?? true;
    sendReminderPrimaryActionButton.textContent = selectedDraft
      ? sendReminderEmailButton?.textContent || "Send Reminder"
      : "Send to All Parents";
  }

  if (!selectedEvent) {
    clearStatus(messageStatus);
    reminderComposerOpen = false;
    reminderComposerEventId = null;
  }
}

function renderEventRsvps() {
  if (!eventRsvpList) {
    return;
  }

  clearStatus(eventRsvpStatus);
  const selectedEvent = getSelectedEvent();
  const rsvps = getSelectedEventRsvps();

  if (!selectedEvent) {
    if (eventRsvpSummary) {
      eventRsvpSummary.innerHTML = "<strong>No event selected</strong><p>Choose an event to see attendance.</p>";
    }
    eventRsvpList.innerHTML = "";
    eventRsvpList.classList.add("hidden");
    return;
  }

  const responseCounts = {
    yes: rsvps.filter((rsvp) => rsvp.response === "yes").length,
    no: rsvps.filter((rsvp) => rsvp.response === "no").length,
    maybe: rsvps.filter((rsvp) => rsvp.response === "maybe").length,
    no_response: rsvps.filter((rsvp) => rsvp.response === "no_response").length,
  };

  if (eventRsvpSummary) {
    eventRsvpSummary.innerHTML = `
      <strong>${escapeHtml(selectedEvent.eventTitle)}</strong>
      <p>${escapeHtml(formatEventDate(selectedEvent.eventDate))}${getEventTimingLabel(selectedEvent) ? ` | ${escapeHtml(getEventTimingLabel(selectedEvent))}` : ""}</p>
      <div class="response-summary-grid">
        <span>Yes: ${responseCounts.yes}</span>
        <span>No: ${responseCounts.no}</span>
        <span>Maybe: ${responseCounts.maybe}</span>
        <span>No response: ${responseCounts.no_response}</span>
      </div>
      <div class="button-row">
        <button type="button" class="secondary-button" data-rsvp-toggle>${eventRsvpDetailsOpen ? "Show Less" : "Show More"}</button>
      </div>
    `;
  }

  if (!rsvps.length) {
    eventRsvpList.classList.remove("hidden");
    eventRsvpList.innerHTML = eventRsvpDetailsOpen
      ? '<div class="info-card"><strong>No RSVPs yet</strong><p>Send an event update email to generate RSVP links and start collecting responses.</p></div>'
      : "";
    eventRsvpList.classList.toggle("hidden", !eventRsvpDetailsOpen);
    return;
  }

  eventRsvpList.classList.toggle("hidden", !eventRsvpDetailsOpen);

  if (!eventRsvpDetailsOpen) {
    eventRsvpList.innerHTML = "";
    return;
  }

  eventRsvpList.innerHTML = rsvps
    .map(
      (rsvp) => `
        <div class="entity-card">
          <div class="entity-card-header">
            <div>
              <strong>${escapeHtml(rsvp.contactName)}</strong>
              ${rsvp.playerName ? `<span class="pill">${escapeHtml(rsvp.playerName)}</span>` : ""}
            </div>
            <span class="pill ${getRsvpStatusClassName(rsvp.response)}">${escapeHtml(formatRsvpResponseLabel(rsvp.response))}</span>
          </div>
          <div class="entity-card-meta">
            ${rsvp.email ? `<span>${escapeHtml(rsvp.email)}</span>` : ""}
            ${rsvp.phone ? `<span>${escapeHtml(rsvp.phone)}</span>` : ""}
            ${rsvp.respondedAt ? `<span>Responded: ${escapeHtml(formatRsvpTimestamp(rsvp.respondedAt))}</span>` : "<span>No reply yet</span>"}
            ${rsvp.responseNote ? `<span>${escapeHtml(rsvp.responseNote)}</span>` : ""}
          </div>
          <div class="stack-form compact-stack">
            <label class="field">
              <span>Manual status</span>
              <select data-rsvp-field="response" data-rsvp-id="${rsvp.id}">
                ${["no_response", "yes", "no", "maybe"]
                  .map(
                    (value) => `<option value="${value}" ${value === rsvp.response ? "selected" : ""}>${escapeHtml(formatRsvpResponseLabel(value))}</option>`,
                  )
                  .join("")}
              </select>
            </label>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderAiAssistant() {
  if (!aiDraftReview) {
    return;
  }

  const draft = aiDraftState.data;
  generateAiDraftButton.disabled = aiDraftState.loading || !supabaseUserId;
  aiAssistantPromptInput.disabled = aiDraftState.loading;

  if (!draft) {
    aiDraftReview.classList.add("hidden");
    aiSendDraftEmailButton.disabled = true;
    return;
  }

  aiDraftReview.classList.remove("hidden");

  aiDraftIntent.textContent = formatAiIntentLabel(draft.intent_type || "general_update");
  aiDraftConfidence.textContent = `Confidence ${formatAiConfidence(draft.confidence)}`;
  aiDraftRecipients.textContent = formatRecipientGroupLabel(draft.recipients?.suggested_group || "all_contacts");
  aiDraftRsvp.textContent = draft.rsvp?.rsvp_required ? "RSVP suggested" : "No RSVP suggested";
  aiDraftFollowUp.textContent = draft.follow_up?.reminder_recommended
    ? `Follow-up: ${draft.follow_up.suggested_reminder_timing || "Reminder recommended."}`
    : "Follow-up: No reminder recommended yet.";

  if (aiDraftMissingInfo) {
    aiDraftMissingInfo.classList.add("hidden");
    aiDraftMissingInfo.innerHTML = "";
  }

  aiDraftEventTitleInput.value = draft.event_action?.suggested_event_title || "";
  aiDraftEventTypeInput.value = draft.event_action?.event_type || "other";
  aiDraftEventDateInput.value = draft.event_action?.event_date || "";
  aiDraftEventLocationInput.value = draft.event_action?.location || "";
  aiDraftStartTimeInput.value = draft.event_action?.start_time || "";
  aiDraftEndTimeInput.value = draft.event_action?.end_time || "";
  aiDraftEventNotesInput.value = draft.event_action?.notes || "";
  aiDraftEmailSubjectInput.value = draft.message?.email_subject || "";
  aiDraftEmailBodyInput.value = draft.message?.email_body || "";
  aiDraftSmsBodyInput.value = draft.message?.sms_body || "";
  aiDraftRecipientGroupInput.value = draft.recipients?.suggested_group || "all_contacts";
  aiDraftRsvpRequiredInput.checked = Boolean(draft.rsvp?.rsvp_required);
  aiDraftRsvpDeadlineInput.value = draft.rsvp?.suggested_deadline || "";

  renderAiDraftEventMatchOptions();
  renderAiDraftActionButtons();
}

function renderAiDraftEventMatchOptions() {
  if (!aiDraftEventMatchInput || !aiDraftEventMatchRow) {
    return;
  }

  const draft = aiDraftState.data;
  const requiresExistingEvent = Boolean(
    draft?.event_action?.update_existing_event || draft?.event_action?.cancel_existing_event,
  );
  const events = getActiveTeamEvents();

  aiDraftEventMatchRow.classList.toggle("hidden", !requiresExistingEvent);

  if (!requiresExistingEvent) {
    aiDraftEventMatchInput.innerHTML = "";
    return;
  }

  aiDraftEventMatchInput.innerHTML = events.length
    ? events
        .map(
          (eventRecord) => `
            <option value="${eventRecord.id}" ${eventRecord.id === state.selectedEventId ? "selected" : ""}>
              ${escapeHtml(formatEventOptionLabel(eventRecord))}
            </option>
          `,
        )
        .join("")
    : '<option value="">No upcoming events available</option>';
}

function renderAiDraftActionButtons() {
  const draft = aiDraftState.data;
  if (!draft) {
    return;
  }

  const intent = draft.event_action || {};
  const hasSelectedEvent = Boolean(getAiDraftTargetEventId());
  aiCreateEventFromDraftButton.classList.toggle("hidden", !intent.create_new_event);
  aiApplyEventUpdateButton.classList.toggle("hidden", !intent.update_existing_event);
  aiApplyEventCancellationButton.classList.toggle("hidden", !intent.cancel_existing_event);
  aiApplyEventUpdateButton.disabled = !hasSelectedEvent;
  aiApplyEventCancellationButton.disabled = !hasSelectedEvent;
  aiSendDraftEmailButton.disabled = !getSelectedEvent() || aiDraftState.loading;
}

function renderAvailabilityControl() {
  const selectedPlayer = getSelectedPlayer();

  if (!selectedPlayer) {
    toggleAvailabilityButton.disabled = true;
    toggleAvailabilityButton.textContent = "Mark selected absent";
    return;
  }

  const selectedAbsent = isPlayerAbsent(selectedPlayer.id);
  const selectedAbsentByRsvp = isPlayerAbsentFromRsvp(selectedPlayer.id);
  toggleAvailabilityButton.disabled = selectedAbsentByRsvp;
  toggleAvailabilityButton.textContent = selectedAbsent
    ? selectedAbsentByRsvp
      ? "Marked absent by RSVP"
      : "Mark selected available"
    : "Mark selected absent";
}

function renderTrainingView() {
  if (!trainingFocusSelect) {
    return;
  }

  const focusArea = trainingState.focusArea || "Passing";
  const ageRange = getAgeRangeForPlayersOnField(state.config.playersOnField);
  const teamName = state.config.teamName || "Untitled team";

  trainingFocusSelect.value = focusArea;
  trainingTeamLabel.textContent = `${teamName} training`;
  trainingAgeRange.textContent = `${ageRange} | ${state.config.playersOnField} on field | Focus: ${focusArea}`;
  generateTrainingPlanButton.disabled = trainingState.loading;
  refreshTrainingPlanButton.disabled = trainingState.loading || !trainingState.plan;
  acceptTrainingPlanButton.disabled = trainingState.loading || !trainingState.plan;
  copyTrainingPlanButton.disabled = trainingState.loading || !trainingState.plan;

  if (!trainingState.plan) {
    trainingPlanTitle.textContent = "Training Plan";
    trainingPlanMeta.textContent = "Generate a plan to see a one-hour session tailored to this team format and focus area.";
    trainingPlanBody.innerHTML = `
      <div class="info-card">
        <strong>Ready when you are</strong>
        <p>Choose a focus area and generate a fresh session plan. If the first one is not quite right, ask TeamPro for another option.</p>
      </div>
    `;
    return;
  }

  const plan = trainingState.plan;
  trainingPlanTitle.textContent = plan.title;
  trainingPlanMeta.textContent = `${plan.focusArea} focus | ${plan.ageRange} | ${plan.totalMinutes} minutes${trainingState.accepted ? " | Accepted" : ""}`;
  trainingPlanBody.innerHTML = `
    <div class="info-card">
      <strong>Overview</strong>
      <p>${escapeHtml(plan.summary)}</p>
      <p><strong>Session goals:</strong> ${plan.sessionGoals.map(escapeHtml).join(" | ")}</p>
      <p><strong>Equipment:</strong> ${plan.equipment.map(escapeHtml).join(", ")}</p>
    </div>
    ${plan.blocks
      .map(
        (block) => `
          <div class="training-plan-block">
            <div class="training-plan-block-header">
              <strong>${escapeHtml(block.title)}</strong>
              <span>${escapeHtml(String(block.durationMinutes))} mins</span>
            </div>
            <p>${escapeHtml(block.purpose)}</p>
            <p><strong>Setup:</strong> ${escapeHtml(block.setup)}</p>
            <ul class="training-plan-points">
              ${block.coachingPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
            </ul>
          </div>
        `,
      )
      .join("")}
    <div class="info-card">
      <strong>Coach reminder</strong>
      <p>${escapeHtml(plan.coachReminder)}</p>
    </div>
  `;
}

function getAgeRangeForPlayersOnField(playersOnField) {
  if (playersOnField <= 6) {
    return "Ages 7-9";
  }

  if (playersOnField <= 8) {
    return "Ages 9-11";
  }

  if (playersOnField <= 10) {
    return "Ages 11-13";
  }

  return "Ages 14 to adult";
}

function normaliseTrainingPlan(plan) {
  if (!plan || typeof plan !== "object") {
    return plan;
  }

  return {
    ...plan,
    title: normaliseMetricText(plan.title || ""),
    summary: normaliseMetricText(plan.summary || ""),
    focusArea: normaliseMetricText(plan.focusArea || ""),
    ageRange: normaliseMetricText(plan.ageRange || ""),
    coachReminder: normaliseMetricText(plan.coachReminder || ""),
    sessionGoals: Array.isArray(plan.sessionGoals)
      ? plan.sessionGoals.map((goal) => normaliseMetricText(goal))
      : [],
    equipment: Array.isArray(plan.equipment)
      ? plan.equipment.map((item) => normaliseMetricText(item))
      : [],
    blocks: Array.isArray(plan.blocks)
      ? plan.blocks.map((block) => ({
          ...block,
          title: normaliseMetricText(block.title || ""),
          purpose: normaliseMetricText(block.purpose || ""),
          setup: normaliseMetricText(block.setup || ""),
          coachingPoints: Array.isArray(block.coachingPoints)
            ? block.coachingPoints.map((point) => normaliseMetricText(point))
            : [],
        }))
      : [],
  };
}

function normaliseMetricText(text) {
  return String(text || "")
    .replace(/\byards\b/gi, "metres")
    .replace(/\byard\b/gi, "metre")
    .replace(/\bmeters\b/gi, "metres")
    .replace(/\bmeter\b/gi, "metre");
}

function getActiveTeamContacts() {
  return [...(state.contactsByTeamId[state.activeTeamId] || [])].sort((left, right) =>
    left.contactName.localeCompare(right.contactName),
  );
}

function startEventLifecycleWatcher() {
  if (eventLifecycleTimerId) {
    window.clearInterval(eventLifecycleTimerId);
  }

  eventLifecycleTimerId = window.setInterval(() => {
    if (document.hidden) {
      return;
    }

    refreshEventLifecycleState();
  }, 60_000);
}

function refreshEventLifecycleState() {
  const nextSelectedEventId = chooseNextSelectedEventId({
    currentSelectedEventId: state.selectedEventId,
    activeTeamId: state.activeTeamId,
    eventsByTeamId: state.eventsByTeamId,
  });

  if (nextSelectedEventId !== state.selectedEventId) {
    state.selectedEventId = nextSelectedEventId;
    eventRsvpDetailsOpen = false;
    persistState();
  }

  renderAll();
}

function getActiveTeamEvents() {
  return getVisibleEventsForTeam(state.activeTeamId);
}

function getVisibleEventsForTeam(teamId, now = new Date(), eventsByTeamId = state.eventsByTeamId) {
  return [...(eventsByTeamId[teamId] || [])]
    .filter((eventRecord) => !isEventFinished(eventRecord, now))
    .sort(compareEvents);
}

function getSelectedEventRsvps() {
  const selectedEvent = getSelectedEvent();

  if (!selectedEvent) {
    return [];
  }

  return [...(state.rsvpsByEventId[selectedEvent.id] || [])].sort((left, right) => {
    const leftLabel = `${left.playerName || ""}${left.contactName || ""}`;
    const rightLabel = `${right.playerName || ""}${right.contactName || ""}`;
    return leftLabel.localeCompare(rightLabel);
  });
}

function getEventDrafts(eventId) {
  if (!eventId) {
    return [];
  }

  return [...(state.aiDraftsByEventId?.[eventId] || [])].sort((left, right) => {
    return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
  });
}

function getSelectedReminderDraft() {
  const selectedEvent = getSelectedEvent();

  if (!selectedEvent) {
    return null;
  }

  return getEventDrafts(selectedEvent.id).find((draft) =>
    draft.status === "pending_review" && ["scheduled_reminder", "event_cancellation"].includes(draft.draftType),
  ) || null;
}

function getQuickReminderApprovalDraft() {
  if (!quickReminderApprovalDraftId || !state.selectedEventId) {
    return null;
  }

  return getEventDrafts(state.selectedEventId).find((draft) => draft.id === quickReminderApprovalDraftId) || null;
}

function upsertAiDraftInState(draftRecord) {
  if (!draftRecord?.eventId) {
    return;
  }

  const rows = [...(state.aiDraftsByEventId?.[draftRecord.eventId] || [])];
  const index = rows.findIndex((row) => row.id === draftRecord.id);

  if (index >= 0) {
    rows[index] = draftRecord;
  } else {
    rows.unshift(draftRecord);
  }

  state.aiDraftsByEventId = state.aiDraftsByEventId || {};
  state.aiDraftsByEventId[draftRecord.eventId] = rows.sort((left, right) =>
    new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime(),
  );
}

function removeAiDraftFromState(draftId, eventId) {
  if (!draftId || !eventId || !state.aiDraftsByEventId?.[eventId]) {
    return;
  }

  state.aiDraftsByEventId[eventId] = state.aiDraftsByEventId[eventId].filter((draft) => draft.id !== draftId);

  if (!state.aiDraftsByEventId[eventId].length) {
    delete state.aiDraftsByEventId[eventId];
  }
}

function compareEvents(left, right) {
  const leftKey = `${left.eventDate || ""}T${left.startTime || "23:59"}`;
  const rightKey = `${right.eventDate || ""}T${right.startTime || "23:59"}`;
  return leftKey.localeCompare(rightKey);
}

function isEventFinished(eventRecord, now = new Date()) {
  const endDateTime = getEventEndDateTime(eventRecord);

  if (!endDateTime) {
    return false;
  }

  return endDateTime.getTime() < now.getTime();
}

function getEventEndDateTime(eventRecord) {
  if (!eventRecord?.eventDate) {
    return null;
  }

  const timeValue = eventRecord.endTime || eventRecord.startTime || "23:59";
  const parsed = new Date(`${eventRecord.eventDate}T${timeValue}`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getSelectedEvent() {
  const events = getActiveTeamEvents();

  if (!events.length) {
    return null;
  }

  const selected = events.find((eventRecord) => eventRecord.id === state.selectedEventId);
  return selected || events[0];
}

function resetContactForm() {
  contactIdInput.value = "";
  contactNameInput.value = "";
  contactEmailInput.value = "";
  contactPhoneInput.value = "";
  contactRoleInput.value = "";
  contactNotesInput.value = "";
  contactFormOpen = false;
  renderContactLinkedPlayerOptions();
  clearStatus(contactStatus);
}

function resetEventForm() {
  eventForm.reset();
  eventIdInput.value = "";
  eventTypeInput.value = "training";
  eventStatusInput.value = "planned";
  eventRepeatPatternInput.value = "once";
  eventRepeatEndDateInput.value = "";
  clearSelectedRecurringDays();
  renderEventRepeatInputs();
  clearStatus(eventStatusMessage);
  closeEventForm();
}

function populateContactForm(contactId) {
  const contact = getActiveTeamContacts().find((item) => item.id === contactId);

  if (!contact) {
    return;
  }

  contactIdInput.value = contact.id;
  contactNameInput.value = contact.contactName;
  contactEmailInput.value = contact.email || "";
  contactPhoneInput.value = contact.phone || "";
  contactRoleInput.value = contact.role || "";
  contactNotesInput.value = contact.notes || "";
  contactFormOpen = true;
  renderContactLinkedPlayerOptions();
  Array.from(contactLinkedPlayers?.querySelectorAll("[data-linked-player]") || []).forEach((input) => {
    input.checked = contact.linkedPlayers?.includes(input.dataset.linkedPlayer || "") || false;
  });
  setStatus(contactStatus, `Editing ${contact.contactName}.`, false);
}

function openContactForm() {
  if (contactFormOpen) {
    resetContactForm();
    renderAll();
    return;
  }

  contactFormOpen = true;
  renderAll();
  contactNameInput?.focus();
}

function populateEventForm(eventId) {
  const eventRecord = getActiveTeamEvents().find((item) => item.id === eventId);

  if (!eventRecord) {
    return;
  }

  eventIdInput.value = eventRecord.id;
  eventTitleInput.value = eventRecord.eventTitle;
  eventTypeInput.value = eventRecord.eventType || "other";
  eventDateInput.value = eventRecord.eventDate || "";
  eventStartTimeInput.value = eventRecord.startTime || "";
  eventEndTimeInput.value = eventRecord.endTime || "";
  eventLocationInput.value = eventRecord.location || "";
  eventStatusInput.value = eventRecord.status || "planned";
  eventRepeatPatternInput.value = eventRecord.repeatPattern || "once";
  eventRepeatEndDateInput.value = eventRecord.repeatEndDate || "";
  clearSelectedRecurringDays();
  if (eventRecord.repeatPattern === "weekly") {
    setSelectedRecurringDays([
      Number.isInteger(eventRecord.repeatDayOfWeek)
        ? eventRecord.repeatDayOfWeek
        : new Date(`${eventRecord.eventDate}T12:00:00`).getDay(),
    ]);
  }
  eventNotesInput.value = eventRecord.notes || "";
  renderEventRepeatInputs();
  eventFormOpen = true;
  renderEventFormPanel();
  setStatus(eventStatusMessage, `Editing ${eventRecord.eventTitle}.`, false);
}

async function saveContactFromForm() {
  if (!supabaseUserId) {
    setStatus(contactStatus, "Log in before saving contacts.", true);
    return;
  }

  try {
    await ensureTeamExistsForContactSave();
  } catch (error) {
    console.error("[Supabase] team ensure failed before contact save", {
      error,
      message: error?.message || String(error),
    });
    setStatus(contactStatus, error?.message || "Save the team details before adding contacts.", true);
    return;
  }

  const contact = buildContactFromForm();

  if (!contact.ok) {
    setStatus(contactStatus, contact.message, true);
    return;
  }

  const row = contact.value;
  setStatus(contactStatus, "Saving contact...", false);

  try {
    const savedRow = await saveRowToSupabase({
      tableName: teamContactsTableName,
      row,
      statusElement: contactStatus,
      pendingMessage: "Saving contact...",
      successMessage: "Contact saved.",
      label: "contact",
    });
    const mappedContact = mapDatabaseContactToRecord(savedRow);
    upsertContactInState(mappedContact);
    syncRsvpContactName(mappedContact.id, mappedContact.contactName);
    persistState();
    resetContactForm();
    renderAll();
    setStatus(contactStatus, "Contact saved.", false);
  } catch (error) {
    console.error("[Supabase] contact save failed", {
      error,
      message: error?.message || String(error),
      row,
    });
    setStatus(contactStatus, `Contact save failed: ${describeSupabaseError(error)}`, true);
  }
}

async function ensureTeamExistsForContactSave() {
  const config = buildConfigFromForm();

  if (!config.ok) {
    throw new Error(config.message);
  }

  const teamId = state.activeTeamId || createTeamStorageId();
  const nextRuntime = hydrateTeamRuntime({
    id: teamId,
    config: config.value,
    lineup: state.activeTeamId === teamId ? createLineupSnapshot(state) : null,
  });

  state.config = nextRuntime.config;
  state.players = nextRuntime.players;
  state.lineup = nextRuntime.lineup;
  state.activeTeamId = teamId;
  upsertCurrentTeam();
  state.selectedTarget = null;
  persistState();

  const currentTeam = state.teams.find((team) => team.id === state.activeTeamId) || null;

  if (!currentTeam) {
    throw new Error("The team could not be prepared for saving.");
  }

  await saveTeamRecordToSupabase(currentTeam, {
    statusElement: contactStatus,
    pendingMessage: "Saving team details first...",
    successMessage: "Team details saved.",
  });

  persistCachedStateOnly();
  persistUserScopedState();
  renderAll();

  return currentTeam;
}

async function saveEventFromForm() {
  if (!supabaseUserId) {
    setStatus(eventStatusMessage, "Log in before saving events.", true);
    return;
  }

  const existingEventId = eventIdInput.value || "";
  const existingEvent = existingEventId
    ? getActiveTeamEvents().find((item) => item.id === existingEventId) || null
    : null;
  const eventRecord = buildEventRowsFromForm();

  if (!eventRecord.ok) {
    setStatus(eventStatusMessage, eventRecord.message, true);
    return;
  }

  setStatus(eventStatusMessage, "Saving event...", false);

  try {
    const savedRows = [];

    for (const row of eventRecord.value) {
      const savedRow = await saveRowToSupabase({
        tableName: teamEventsTableName,
        row,
        statusElement: eventStatusMessage,
        pendingMessage: "Saving event...",
        successMessage: "Event saved.",
        label: "event",
      });
      savedRows.push(savedRow);
    }

    const mappedEvents = savedRows.map(mapDatabaseEventToRecord);
    mappedEvents.forEach(upsertEventInState);
    state.selectedEventId = mappedEvents[0]?.id || state.selectedEventId;
    persistState();
    resetEventForm();
    renderAll();
    let saveMessage = mappedEvents.length === 1 ? "Event saved." : `${mappedEvents.length} events saved.`;

    if (mappedEvents.some(shouldAutoTriggerImmediateReminderApproval)) {
      setStatus(eventStatusMessage, `${saveMessage} Checking for due reminder approvals...`, false);

      try {
        const reminderResult = await executeReminderSchedulerCheck();
        console.info("[Reminder Scheduler] Auto-triggered after event save", {
          eventIds: mappedEvents.map((eventRow) => eventRow.id),
          result: reminderResult,
        });
        await hydrateStateFromSupabase();
        saveMessage = `${saveMessage} ${formatReminderSchedulerResult(reminderResult)}`;
      } catch (reminderError) {
        console.error("[Reminder Scheduler] Auto-trigger failed after event save", {
          error: reminderError,
          message: reminderError?.message || String(reminderError),
          eventIds: mappedEvents.map((eventRow) => eventRow.id),
        });
        saveMessage = `${saveMessage} Reminder check could not run automatically: ${reminderError?.message || "Reminder check failed."}`;
      }
    }

    if (mappedEvents.some((eventRow) => shouldAutoTriggerCancellationApproval({ eventRecord: eventRow, existingEvent }))) {
      setStatus(eventStatusMessage, `${saveMessage} Preparing cancellation approval...`, false);

      try {
        const cancellationResult = await executeCancellationApprovalDraft({
          teamId: state.activeTeamId,
          eventId: mappedEvents[0].id,
        });
        console.info("[Cancellation Draft] Auto-triggered after event save", {
          eventIds: mappedEvents.map((eventRow) => eventRow.id),
          result: cancellationResult,
        });
        await hydrateStateFromSupabase();
        saveMessage = `${saveMessage} ${formatCancellationDraftResult(cancellationResult)}`;
      } catch (cancellationError) {
        console.error("[Cancellation Draft] Auto-trigger failed after event save", {
          error: cancellationError,
          message: cancellationError?.message || String(cancellationError),
          eventIds: mappedEvents.map((eventRow) => eventRow.id),
        });
        saveMessage = `${saveMessage} Cancellation approval could not be prepared automatically: ${cancellationError?.message || "Cancellation check failed."}`;
      }
    }

    setStatus(eventStatusMessage, saveMessage, false);
  } catch (error) {
    console.error("[Supabase] event save failed", {
      error,
      message: error?.message || String(error),
      rows: eventRecord.value,
    });
    setStatus(eventStatusMessage, `Event save failed: ${describeSupabaseError(error)}`, true);
  }
}

function shouldAutoTriggerImmediateReminderApproval(eventRecord) {
  const now = new Date();

  if (!eventRecord?.eventDate || !["planned", "sent"].includes(eventRecord.status) || isEventFinished(eventRecord, now)) {
    return false;
  }

  return getDueReminderCandidatesForEvent(eventRecord, now).length > 0;
}

function shouldAutoTriggerCancellationApproval({ eventRecord, existingEvent }) {
  if (!eventRecord || eventRecord.status !== "cancelled") {
    return false;
  }

  return existingEvent?.status !== "cancelled";
}

function openEventForm() {
  eventFormOpen = true;
  renderEventFormPanel();
  clearStatus(eventStatusMessage);
}

function closeEventForm() {
  eventFormOpen = false;
  renderEventFormPanel();
}

function renderEventFormPanel() {
  if (!eventFormPanel) {
    return;
  }

  eventFormPanel.classList.toggle("hidden", !eventFormOpen);

  if (eventFormHeading) {
    eventFormHeading.textContent = eventIdInput.value ? "Edit Event" : "Create Event";
  }

  if (openEventFormButton) {
    openEventFormButton.classList.toggle("hidden", eventFormOpen);
  }
}

function buildContactFromForm() {
  const contactName = contactNameInput.value.trim();
  const email = contactEmailInput.value.trim();
  const phone = contactPhoneInput.value.trim();
  const role = contactRoleInput.value.trim();
  const notes = contactNotesInput.value.trim();
  const linkedPlayers = getSelectedLinkedPlayersFromForm();

  if (!contactName) {
    return { ok: false, message: "Add a contact name first." };
  }

  if (!email && !phone) {
    return { ok: false, message: "Add at least an email address or phone number." };
  }

  return {
    ok: true,
    value: {
      id: contactIdInput.value || createTeamStorageId(),
      user_id: supabaseUserId,
      team_id: state.activeTeamId,
      contact_name: contactName,
      email: email || null,
      phone: phone || null,
      role: role || null,
      linked_players: linkedPlayers,
      notes: notes || null,
    },
  };
}

function buildEventRowsFromForm() {
  const eventTitle = eventTitleInput.value.trim();
  const eventDate = eventDateInput.value;
  const eventType = eventTypeInput.value || "other";
  const startTime = eventStartTimeInput.value || null;
  const endTime = eventEndTimeInput.value || null;
  const repeatPattern = eventRepeatPatternInput.value || "once";
  const recurringDays = getSelectedRecurringDaysFromForm();
  const repeatEndDate = eventRepeatEndDateInput.value || null;
  const reminder3DayEnabled = state.userSettings?.defaultReminder3DayEnabled !== false;
  const reminder1DayEnabled = state.userSettings?.defaultReminder1DayEnabled !== false;
  const reminderSameDayEnabled = state.userSettings?.defaultReminderSameDayEnabled !== false;
  const baseId = eventIdInput.value || createTeamStorageId();
  const seriesId = repeatPattern === "weekly"
    ? (eventIdInput.value ? null : createTeamStorageId())
    : null;

  if (!eventTitle) {
    return { ok: false, message: "Add an event title first." };
  }

  if (!eventDate) {
    return { ok: false, message: "Choose the event date." };
  }

  if (endTime && startTime && endTime < startTime) {
    return { ok: false, message: "End time must be after the start time." };
  }

  if (repeatPattern === "weekly" && !eventIdInput.value) {
    if (!recurringDays.length) {
      return { ok: false, message: "Choose at least one recurring day." };
    }

    if (!repeatEndDate) {
      return { ok: false, message: "Choose a repeat end date for weekly events." };
    }

    if (repeatEndDate < eventDate) {
      return { ok: false, message: "Repeat end date must be on or after the first event date." };
    }
  }

  const buildRow = (id, occurrenceDate, repeatDayOfWeek) => ({
    id,
    user_id: supabaseUserId,
    team_id: state.activeTeamId,
    event_title: eventTitle,
    event_type: eventType,
    event_date: occurrenceDate,
    start_time: startTime,
    end_time: endTime,
    location: eventLocationInput.value.trim() || null,
    notes: eventNotesInput.value.trim() || null,
    status: eventStatusInput.value || "planned",
    reminder_3_day_enabled: reminder3DayEnabled,
    reminder_1_day_enabled: reminder1DayEnabled,
    reminder_same_day_enabled: reminderSameDayEnabled,
    repeat_pattern: repeatPattern,
    repeat_end_date: repeatPattern === "weekly" ? repeatEndDate : null,
    repeat_day_of_week: repeatPattern === "weekly"
      ? repeatDayOfWeek
      : null,
    series_id: seriesId,
  });

  if (repeatPattern !== "weekly" || eventIdInput.value) {
    return {
      ok: true,
      value: [buildRow(baseId, eventDate, new Date(`${eventDate}T12:00:00`).getDay())],
    };
  }

  const rows = [];
  const endCursor = new Date(`${repeatEndDate}T12:00:00`);

  recurringDays
    .sort((left, right) => left - right)
    .forEach((targetDay, dayIndex) => {
      const cursor = new Date(`${eventDate}T12:00:00`);

      while (cursor.getDay() !== targetDay) {
        cursor.setDate(cursor.getDate() + 1);
      }

      while (cursor.getTime() <= endCursor.getTime()) {
        const occurrenceDate = cursor.toISOString().slice(0, 10);
        rows.push(
          buildRow(
            rows.length === 0 && dayIndex === 0 ? baseId : createTeamStorageId(),
            occurrenceDate,
            targetDay,
          ),
        );
        cursor.setDate(cursor.getDate() + 7);
      }
    });

  rows.sort((left, right) => compareEvents(mapDatabaseEventToRecord(left), mapDatabaseEventToRecord(right)));

  if (!rows.length) {
    return {
      ok: false,
      message: "That weekly repeat range does not produce any event dates. Adjust the start date, repeat day, or end date.",
    };
  }

  return {
    ok: true,
    value: rows,
  };
}

async function deleteContact(contactId) {
  const contact = getActiveTeamContacts().find((item) => item.id === contactId);

  if (!contact || !window.confirm(`Delete ${contact.contactName}?`)) {
    return;
  }

  try {
    await deleteRowFromSupabase({
      tableName: teamContactsTableName,
      rowId: contactId,
      statusElement: contactStatus,
      label: "contact",
    });
    state.contactsByTeamId[state.activeTeamId] = getActiveTeamContacts().filter((item) => item.id !== contactId);
    state.selectedContactIds = state.selectedContactIds.filter((id) => id !== contactId);
    Object.keys(state.rsvpsByEventId || {}).forEach((eventId) => {
      state.rsvpsByEventId[eventId] = (state.rsvpsByEventId[eventId] || []).filter((row) => row.contactId !== contactId);
    });
    persistState();
    renderAll();
    setStatus(contactStatus, "Contact deleted.", false);
  } catch (error) {
    console.error("[Supabase] contact delete failed", {
      error,
      message: error?.message || String(error),
      contactId,
    });
    setStatus(contactStatus, `Contact delete failed: ${describeSupabaseError(error)}`, true);
  }
}

async function deleteEvent(eventId) {
  const eventRecord = getActiveTeamEvents().find((item) => item.id === eventId);

  if (!eventRecord || !window.confirm(`Delete ${eventRecord.eventTitle}?`)) {
    return;
  }

  try {
    await deleteRowFromSupabase({
      tableName: teamEventsTableName,
      rowId: eventId,
      statusElement: eventStatusMessage,
      label: "event",
    });
    state.eventsByTeamId[state.activeTeamId] = getActiveTeamEvents().filter((item) => item.id !== eventId);
    delete state.rsvpsByEventId[eventId];
    if (state.selectedEventId === eventId) {
      state.selectedEventId = chooseNextSelectedEventId({
        currentSelectedEventId: null,
        activeTeamId: state.activeTeamId,
        eventsByTeamId: state.eventsByTeamId,
      });
    }
    persistState();
    renderAll();
    setStatus(eventStatusMessage, "Event deleted.", false);
  } catch (error) {
    console.error("[Supabase] event delete failed", {
      error,
      message: error?.message || String(error),
      eventId,
    });
    setStatus(eventStatusMessage, `Event delete failed: ${describeSupabaseError(error)}`, true);
  }
}

function upsertContactInState(contact) {
  const rows = getActiveTeamContacts();
  const index = rows.findIndex((item) => item.id === contact.id);

  if (index >= 0) {
    rows[index] = contact;
  } else {
    rows.push(contact);
  }

  state.contactsByTeamId[state.activeTeamId] = rows.sort((left, right) => left.contactName.localeCompare(right.contactName));
}

function upsertEventInState(eventRecord) {
  const rows = getActiveTeamEvents();
  const index = rows.findIndex((item) => item.id === eventRecord.id);

  if (index >= 0) {
    rows[index] = eventRecord;
  } else {
    rows.push(eventRecord);
  }

  state.eventsByTeamId[state.activeTeamId] = rows.sort(compareEvents);
}

function upsertRsvpInState(rsvpRecord) {
  const rows = [...(state.rsvpsByEventId[rsvpRecord.eventId] || [])];
  const index = rows.findIndex((item) => item.id === rsvpRecord.id);

  if (index >= 0) {
    rows[index] = rsvpRecord;
  } else {
    rows.push(rsvpRecord);
  }

  state.rsvpsByEventId[rsvpRecord.eventId] = rows;
}

function syncRsvpContactName(contactId, contactName) {
  Object.keys(state.rsvpsByEventId || {}).forEach((eventId) => {
    state.rsvpsByEventId[eventId] = (state.rsvpsByEventId[eventId] || []).map((row) =>
      row.contactId === contactId
        ? { ...row, contactName }
        : row,
    );
  });
}

function selectAllContactsForMessaging() {
  state.selectedContactIds = getActiveTeamContacts()
    .filter((contact) => contact.email)
    .map((contact) => contact.id);
  messageRecipientSelectionEventId = getSelectedEvent()?.id || null;
  persistState();
  renderEventMessaging();
}

function clearSelectedContactsForMessaging() {
  state.selectedContactIds = [];
  messageRecipientSelectionEventId = getSelectedEvent()?.id || null;
  persistState();
  renderEventMessaging();
}

function toggleMessageRecipient(contactId, isSelected) {
  if (isSelected) {
    state.selectedContactIds = Array.from(new Set([...state.selectedContactIds, contactId]));
  } else {
    state.selectedContactIds = state.selectedContactIds.filter((id) => id !== contactId);
  }

  messageRecipientSelectionEventId = getSelectedEvent()?.id || null;
  persistState();
  renderEventMessaging();
}

function syncMessageRecipientSelection(selectedEvent, emailContacts, reminderRecipientContacts) {
  if (!selectedEvent) {
    state.selectedContactIds = [];
    messageRecipientSelectionEventId = null;
    reminderDraftSelectionEventId = null;
    return;
  }

  const validIds = new Set(emailContacts.map((contact) => contact.id));
  const reminderIds = reminderRecipientContacts.map((contact) => contact.id);
  const selectedDraft = getSelectedReminderDraft();

  if (messagePreviewEventId !== selectedEvent.id && !selectedDraft) {
    messagePreviewEventId = selectedEvent.id;
    messagePreviewDraft = "";
  }

  if (selectedDraft && reminderDraftSelectionEventId !== selectedDraft.id) {
    state.selectedContactIds = reminderIds;
    messageRecipientSelectionEventId = selectedEvent.id;
    reminderDraftSelectionEventId = selectedDraft.id;
    return;
  }

  if (!selectedDraft) {
    reminderDraftSelectionEventId = null;
  }

  if (messageRecipientSelectionEventId !== selectedEvent.id) {
    state.selectedContactIds = reminderIds;
    messageRecipientSelectionEventId = selectedEvent.id;
    return;
  }

  state.selectedContactIds = state.selectedContactIds.filter((id) => validIds.has(id));
}

function getMessagePreviewValue(eventRecord) {
  if (!eventRecord) {
    messagePreviewEventId = null;
    messagePreviewDraft = "";
    return "";
  }

  const selectedDraft = getSelectedReminderDraft();

  if (selectedDraft && selectedDraft.status === "pending_review") {
    if (messagePreviewEventId !== eventRecord.id || !messagePreviewDraft || reminderDraftSelectionEventId !== selectedDraft.id) {
      messagePreviewEventId = eventRecord.id;
      reminderDraftSelectionEventId = selectedDraft.id;
      messagePreviewDraft = selectedDraft.draftJson?.message?.email_body || buildEventMessageText(eventRecord);
    }
    return messagePreviewDraft;
  }

  if (messagePreviewEventId !== eventRecord.id || !messagePreviewDraft) {
    messagePreviewEventId = eventRecord.id;
    messagePreviewDraft = buildEventMessageText(eventRecord);
  }

  return messagePreviewDraft;
}

function getContactReminderStatusLabel(rsvpRows) {
  if (!rsvpRows.length) {
    return "No RSVP yet";
  }

  if (rsvpRows.some((row) => row.response === "no_response")) {
    return "No response";
  }

  if (rsvpRows.some((row) => row.response === "yes")) {
    return "Responded: Yes";
  }

  if (rsvpRows.some((row) => row.response === "no")) {
    return "Responded: No";
  }

  if (rsvpRows.some((row) => row.response === "maybe")) {
    return "Responded: Maybe";
  }

  return "No RSVP yet";
}

function getRecipientsForEventUpdate(eventRecord, mode = "all") {
  const contacts = getActiveTeamContacts().filter((contact) => contact.email);

  if (!eventRecord) {
    return [];
  }

  if (mode !== "reminder") {
    return contacts;
  }

  const rsvpsByContactId = new Map();
  getSelectedEventRsvps().forEach((rsvp) => {
    const rows = rsvpsByContactId.get(rsvp.contactId) || [];
    rows.push(rsvp);
    rsvpsByContactId.set(rsvp.contactId, rows);
  });

  return contacts.filter((contact) => {
    const contactRsvps = rsvpsByContactId.get(contact.id) || [];

    if (!contactRsvps.length) {
      return true;
    }

    return contactRsvps.some((rsvp) => rsvp.response === "no_response");
  });
}

function getRecipientsForReminderDraft(eventRecord, draftRecord) {
  const contacts = getActiveTeamContacts().filter((contact) => contact.email);

  if (!eventRecord || !draftRecord) {
    return [];
  }

  const group = draftRecord.draftJson?.recipients?.suggested_group || "non_responders";

  switch (group) {
    case "all_contacts":
      return contacts;
    case "available_players": {
      const yesIds = new Set(getSelectedEventRsvps().filter((row) => row.response === "yes").map((row) => row.contactId));
      return contacts.filter((contact) => yesIds.has(contact.id));
    }
    case "unavailable_players": {
      const noIds = new Set(getSelectedEventRsvps().filter((row) => row.response === "no").map((row) => row.contactId));
      return contacts.filter((contact) => noIds.has(contact.id));
    }
    case "custom":
      return contacts;
    case "non_responders":
    default:
      return getRecipientsForEventUpdate(eventRecord, "reminder");
  }
}

function formatReminderTypeLabel(value) {
  return {
    reminder_3_day: "3-day",
    reminder_1_day: "1-day",
    reminder_same_day: "same-day",
  }[value] || "scheduled";
}

function formatApprovalDraftLabel(draftRecord) {
  if (draftRecord?.draftType === "event_cancellation") {
    return "Cancellation message";
  }

  return `${formatReminderTypeLabel(draftRecord?.reminderType)} reminder`;
}

function buildEventMessageText(eventRecord) {
  if (!eventRecord) {
    return "";
  }

  return [
    `${state.config.teamName || "Team"} update`,
    "",
    `Event: ${eventRecord.eventTitle}`,
    `Type: ${formatEventTypeLabel(eventRecord.eventType)}`,
    `Date: ${formatEventDate(eventRecord.eventDate)}`,
    `Time: ${getEventTimingLabel(eventRecord) || "To be confirmed"}`,
    `Location: ${eventRecord.location || "To be confirmed"}`,
    eventRecord.notes ? `Notes: ${eventRecord.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSmsPreviewText(eventRecord, phoneContacts) {
  if (!eventRecord) {
    return "";
  }

  const header = `${state.config.teamName || "Team"}: ${eventRecord.eventTitle}`;
  const lines = [
    header,
    `${formatEventDate(eventRecord.eventDate)}${getEventTimingLabel(eventRecord) ? `, ${getEventTimingLabel(eventRecord)}` : ""}`,
    eventRecord.location || "Location TBC",
    eventRecord.notes || null,
  ].filter(Boolean);

  if (phoneContacts.length) {
    lines.push("", `Phone contacts on file: ${phoneContacts.map((contact) => contact.contactName).join(", ")}`);
  }

  return lines.join("\n");
}

async function generateAiCommunicationDraft() {
  if (aiDraftState.loading) {
    return;
  }

  if (!supabaseUserId) {
    setStatus(aiDraftStatus, "Log in before using the AI assistant.", true);
    return;
  }

  const prompt = aiAssistantPromptInput.value.trim();

  if (!prompt) {
    setStatus(aiDraftStatus, "Add a short instruction for TeamPro first.", true);
    return;
  }

  aiDraftState.loading = true;
  renderAiAssistant();
  setStatus(aiDraftStatus, "Generating AI draft...", false);

  try {
    const response = await fetch(aiCommunicationDraftEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        accessToken: supabaseAccessToken,
        teamId: state.activeTeamId,
        teamName: state.config.teamName || "Untitled team",
        instruction: prompt,
        selectedEventId: state.selectedEventId || null,
        contacts: getActiveTeamContacts().map((contact) => ({
          id: contact.id,
          name: contact.contactName,
          role: contact.role,
          linkedPlayers: contact.linkedPlayers || [],
          hasEmail: Boolean(contact.email),
          hasPhone: Boolean(contact.phone),
        })),
        upcomingEvents: getActiveTeamEvents().slice(0, 8).map((eventRecord) => ({
          id: eventRecord.id,
          title: eventRecord.eventTitle,
          eventType: eventRecord.eventType,
          eventDate: eventRecord.eventDate,
          startTime: eventRecord.startTime,
          endTime: eventRecord.endTime,
          location: eventRecord.location,
          status: eventRecord.status,
        })),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "AI draft generation failed.");
    }

    aiDraftState = {
      loading: false,
      draftId: result.draftId || null,
      data: normaliseAiDraft(result.draft),
    };
    renderAiAssistant();
    setStatus(aiDraftStatus, "Draft ready for review.", false);
  } catch (error) {
    console.error("[AI Draft] Generation failed", {
      error,
      message: error?.message || String(error),
    });
    aiDraftState.loading = false;
    renderAiAssistant();
    setStatus(aiDraftStatus, error?.message || "AI draft generation failed.", true);
  }
}

function normaliseAiDraft(draft) {
  const safeDraft = draft && typeof draft === "object" ? draft : {};
  return {
    intent_type: safeDraft.intent_type || "general_update",
    confidence: typeof safeDraft.confidence === "number" ? safeDraft.confidence : 0.5,
    event_action: {
      create_new_event: Boolean(safeDraft.event_action?.create_new_event),
      update_existing_event: Boolean(safeDraft.event_action?.update_existing_event),
      cancel_existing_event: Boolean(safeDraft.event_action?.cancel_existing_event),
      suggested_event_title: safeDraft.event_action?.suggested_event_title || "",
      event_type: safeDraft.event_action?.event_type || "other",
      event_date: safeDraft.event_action?.event_date || "",
      start_time: safeDraft.event_action?.start_time || "",
      end_time: safeDraft.event_action?.end_time || "",
      location: safeDraft.event_action?.location || "",
      notes: safeDraft.event_action?.notes || "",
    },
    message: {
      email_subject: safeDraft.message?.email_subject || "",
      email_body: safeDraft.message?.email_body || "",
      sms_body: safeDraft.message?.sms_body || "",
    },
    rsvp: {
      rsvp_required: Boolean(safeDraft.rsvp?.rsvp_required),
      suggested_deadline: safeDraft.rsvp?.suggested_deadline || "",
    },
    recipients: {
      suggested_group: safeRecipientGroup(safeDraft.recipients?.suggested_group),
    },
    follow_up: {
      reminder_recommended: Boolean(safeDraft.follow_up?.reminder_recommended),
      suggested_reminder_timing: safeDraft.follow_up?.suggested_reminder_timing || "",
    },
    missing_information: Array.isArray(safeDraft.missing_information)
      ? safeDraft.missing_information.filter(Boolean)
      : [],
  };
}

function safeRecipientGroup(value) {
  return ["all_contacts", "non_responders", "available_players", "unavailable_players", "custom"].includes(value)
    ? value
    : "all_contacts";
}

async function copyAiDraftText(type) {
  syncAiDraftStateFromInputs();
  const text = type === "sms"
    ? aiDraftSmsBodyInput.value.trim()
    : `${aiDraftEmailSubjectInput.value.trim()}\n\n${aiDraftEmailBodyInput.value.trim()}`.trim();

  if (!text) {
    setStatus(aiDraftStatus, `There is no ${type.toUpperCase()} draft to copy yet.`, true);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus(aiDraftStatus, `${type === "sms" ? "SMS" : "Email"} draft copied.`, false);
  } catch (error) {
    setStatus(aiDraftStatus, `Could not copy the ${type.toUpperCase()} draft right now.`, true);
  }
}

async function createEventFromAiDraft() {
  if (!supabaseUserId || !aiDraftState.data) {
    return;
  }

  syncAiDraftStateFromInputs();

  const row = buildSingleEventRowFromAiDraft();

  if (!row.ok) {
    setStatus(aiDraftStatus, row.message, true);
    return;
  }

  setStatus(aiDraftStatus, "Creating event from draft...", false);

  try {
    const savedRow = await saveRowToSupabase({
      tableName: teamEventsTableName,
      row: row.value,
      statusElement: aiDraftStatus,
      pendingMessage: "Creating event from draft...",
      successMessage: "Event created from draft.",
      label: "event",
    });
    const mapped = mapDatabaseEventToRecord(savedRow);
    upsertEventInState(mapped);
    state.selectedEventId = mapped.id;
    persistState();
    await saveAiDraftStatus("used", mapped.id);
    clearAiDraftState();
    renderAll();
    setStatus(aiDraftStatus, "Event created from draft.", false);
  } catch (error) {
    console.error("[AI Draft] Event creation failed", {
      error,
      message: error?.message || String(error),
    });
    setStatus(aiDraftStatus, `Draft event creation failed: ${describeSupabaseError(error)}`, true);
  }
}

async function applyAiDraftToExistingEvent(mode) {
  if (!supabaseUserId || !aiDraftState.data) {
    return;
  }

  syncAiDraftStateFromInputs();

  const targetEventId = getAiDraftTargetEventId();
  const existingEvent = getActiveTeamEvents().find((eventRecord) => eventRecord.id === targetEventId);

  if (!existingEvent) {
    setStatus(aiDraftStatus, "Choose an existing event first.", true);
    return;
  }

  const row = buildSingleEventRowFromAiDraft(existingEvent, mode === "cancel" ? "cancelled" : null);

  if (!row.ok) {
    setStatus(aiDraftStatus, row.message, true);
    return;
  }

  setStatus(aiDraftStatus, mode === "cancel" ? "Cancelling event..." : "Updating event from draft...", false);

  try {
    const savedRow = await saveRowToSupabase({
      tableName: teamEventsTableName,
      row: row.value,
      statusElement: aiDraftStatus,
      pendingMessage: mode === "cancel" ? "Cancelling event..." : "Updating event from draft...",
      successMessage: mode === "cancel" ? "Event cancelled from draft." : "Event updated from draft.",
      label: "event",
    });
    const mapped = mapDatabaseEventToRecord(savedRow);
    upsertEventInState(mapped);
    state.selectedEventId = mapped.id;
    persistState();
    await saveAiDraftStatus("used", mapped.id);
    clearAiDraftState();
    renderAll();
    setStatus(aiDraftStatus, mode === "cancel" ? "Event cancelled from draft." : "Event updated from draft.", false);
  } catch (error) {
    console.error("[AI Draft] Event update failed", {
      error,
      message: error?.message || String(error),
      mode,
    });
    setStatus(aiDraftStatus, `Draft event update failed: ${describeSupabaseError(error)}`, true);
  }
}

function clearAiDraftState() {
  aiDraftState = {
    loading: false,
    draftId: null,
    data: null,
  };
}

function buildSingleEventRowFromAiDraft(existingEvent = null, forcedStatus = null) {
  const title = aiDraftEventTitleInput.value.trim();
  const eventDate = aiDraftEventDateInput.value;
  const eventType = aiDraftEventTypeInput.value || "other";
  const startTime = aiDraftStartTimeInput.value || null;
  const endTime = aiDraftEndTimeInput.value || null;

  if (!title) {
    return { ok: false, message: "Confirm the event title before saving the AI draft." };
  }

  if (!eventDate) {
    return { ok: false, message: "Confirm the event date before saving the AI draft." };
  }

  if (endTime && startTime && endTime < startTime) {
    return { ok: false, message: "End time must be after start time." };
  }

  return {
    ok: true,
    value: {
      id: existingEvent?.id || createTeamStorageId(),
      user_id: supabaseUserId,
      team_id: state.activeTeamId,
      event_title: title,
      event_type: eventType,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime,
      location: aiDraftEventLocationInput.value.trim() || null,
      notes: aiDraftEventNotesInput.value.trim() || null,
      status: forcedStatus || existingEvent?.status || "planned",
      reminder_3_day_enabled: state.userSettings?.defaultReminder3DayEnabled !== false,
      reminder_1_day_enabled: state.userSettings?.defaultReminder1DayEnabled !== false,
      reminder_same_day_enabled: state.userSettings?.defaultReminderSameDayEnabled !== false,
      repeat_pattern: existingEvent?.repeatPattern || "once",
      repeat_end_date: existingEvent?.repeatEndDate || null,
      repeat_day_of_week: Number.isInteger(existingEvent?.repeatDayOfWeek) ? existingEvent.repeatDayOfWeek : null,
      series_id: existingEvent?.seriesId || null,
    },
  };
}

async function sendAiDraftEmail() {
  if (sendingEventUpdate || aiDraftState.loading) {
    return;
  }

  syncAiDraftStateFromInputs();

  const selectedEvent = getSelectedEvent();

  if (!selectedEvent) {
    setStatus(aiDraftStatus, "Create or choose an event before sending the AI draft.", true);
    return;
  }

  const recipients = getAiDraftRecipients(selectedEvent);

  if (!recipients.length) {
    setStatus(aiDraftStatus, "No matching recipients are available for this AI draft.", true);
    return;
  }

  sendingEventUpdate = true;
  renderAiAssistant();
  setStatus(aiDraftStatus, "Sending AI draft email...", false);

  try {
    const response = await fetch(teamUpdateEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        accessToken: supabaseAccessToken,
        teamId: state.activeTeamId,
        eventId: selectedEvent.id,
        contactIds: recipients.map((contact) => contact.id),
        teamName: state.config.teamName || "TeamPro team",
        messageText: aiDraftEmailBodyInput.value.trim(),
        subject: aiDraftEmailSubjectInput.value.trim(),
        includeRsvp: Boolean(aiDraftRsvpRequiredInput.checked),
        baseUrl: window.location.origin,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "AI draft email could not be sent.");
    }

    if (Array.isArray(result.rsvps)) {
      const contactNameById = Object.fromEntries(recipients.map((contact) => [contact.id, contact.contactName]));
      result.rsvps
        .map((row) => mapDatabaseRsvpToRecord({
          ...row,
          contact_name: contactNameById[row.contact_id] || "",
        }))
        .forEach(upsertRsvpInState);
    }

    await logEventUpdate({
      eventId: selectedEvent.id,
      deliveryMethod: result.sent ? "email" : "copy",
      recipientCount: recipients.length,
      subject: aiDraftEmailSubjectInput.value.trim() || `${state.config.teamName || "Team"} update`,
      messageText: aiDraftEmailBodyInput.value.trim(),
    });

    await saveAiDraftStatus("used", selectedEvent.id);
    renderAll();
    setStatus(
      aiDraftStatus,
      result.warning
        ? result.warning
        : buildEmailSendStatusMessage({
            mode: "all",
            sentCount: Number(result.sentCount || 0),
            failedCount: Number(result.failedCount || 0),
            prefix: "AI draft",
          }),
      Number(result.failedCount || 0) > 0 && Number(result.sentCount || 0) === 0,
    );
  } catch (error) {
    console.error("[AI Draft] Send failed", {
      error,
      message: error?.message || String(error),
    });
    setStatus(aiDraftStatus, error?.message || "AI draft email could not be sent.", true);
  } finally {
    sendingEventUpdate = false;
    renderAiAssistant();
  }
}

function getAiDraftRecipients(selectedEvent) {
  const group = aiDraftRecipientGroupInput.value || "all_contacts";
  const contacts = getActiveTeamContacts();
  const rsvps = getSelectedEventRsvps();

  switch (group) {
    case "non_responders": {
      const pendingIds = new Set(rsvps.filter((row) => row.response === "no_response").map((row) => row.contactId));
      return contacts.filter((contact) => contact.email && pendingIds.has(contact.id));
    }
    case "available_players": {
      const yesIds = new Set(rsvps.filter((row) => row.response === "yes").map((row) => row.contactId));
      return contacts.filter((contact) => contact.email && yesIds.has(contact.id));
    }
    case "unavailable_players": {
      const noIds = new Set(rsvps.filter((row) => row.response === "no").map((row) => row.contactId));
      return contacts.filter((contact) => contact.email && noIds.has(contact.id));
    }
    case "custom":
      return contacts.filter((contact) => contact.email);
    case "all_contacts":
    default:
      return contacts.filter((contact) => contact.email);
  }
}

function buildEmailSendStatusMessage({ mode, sentCount, failedCount, prefix = "" }) {
  const intro = prefix ? `${prefix} email` : mode === "reminder" ? "Reminder" : "Email update";

  if (sentCount > 0 && failedCount > 0) {
    return `${intro} sent to ${sentCount} contact${sentCount === 1 ? "" : "s"}. ${failedCount} failed due to send limits or delivery errors.`;
  }

  if (sentCount > 0) {
    return `${intro} sent to ${sentCount} contact${sentCount === 1 ? "" : "s"}.`;
  }

  if (failedCount > 0) {
    return `${intro} could not be sent. ${failedCount} contact${failedCount === 1 ? "" : "s"} failed due to send limits or delivery errors.`;
  }

  return `${intro} did not send to any contacts.`;
}

function getAiDraftTargetEventId() {
  return aiDraftEventMatchInput?.value || state.selectedEventId || "";
}

async function discardAiDraft() {
  if (aiDraftState.draftId) {
    await saveAiDraftStatus("discarded", null).catch((error) => {
      console.error("[AI Draft] Could not mark draft discarded", {
        error,
        message: error?.message || String(error),
      });
    });
  }

  aiDraftState = {
    loading: false,
    draftId: null,
    data: null,
  };
  if (aiAssistantPromptInput) {
    aiAssistantPromptInput.value = "";
  }
  clearStatus(aiDraftStatus);
  renderAiAssistant();
}

async function saveAiDraftStatus(status, eventId) {
  if (!aiDraftState.draftId || !aiDraftState.data || !supabaseUserId) {
    return;
  }

  await saveRowToSupabase({
    tableName: aiCommunicationDraftsTableName,
    row: {
      id: aiDraftState.draftId,
      user_id: supabaseUserId,
      team_id: state.activeTeamId,
      event_id: eventId || null,
      raw_prompt: aiAssistantPromptInput.value.trim(),
      draft_json: buildAiDraftPayloadFromInputs(),
      status,
      draft_type: "manual",
      reminder_type: null,
      scheduled_for: null,
      admin_notified_at: null,
      reviewed_at: status === "used" || status === "discarded" ? new Date().toISOString() : null,
    },
    statusElement: aiDraftStatus,
    pendingMessage: "Saving draft status...",
    successMessage: "Draft status saved.",
    label: "ai draft",
  });
}

async function saveReminderDraftStatus(draftRecord, status) {
  if (!draftRecord || !supabaseUserId) {
    return null;
  }

  const savedRow = await saveRowToSupabase({
    tableName: aiCommunicationDraftsTableName,
    row: {
      id: draftRecord.id,
      user_id: supabaseUserId,
      team_id: draftRecord.teamId,
      event_id: draftRecord.eventId || null,
      raw_prompt: draftRecord.rawPrompt || "",
      draft_json: draftRecord.draftJson || {},
      status,
      draft_type: draftRecord.draftType || "scheduled_reminder",
      reminder_type: draftRecord.reminderType || null,
      scheduled_for: draftRecord.scheduledFor || null,
      admin_notified_at: draftRecord.adminNotifiedAt || null,
      reviewed_at: status === "used" || status === "discarded" ? new Date().toISOString() : (draftRecord.reviewedAt || null),
    },
    statusElement: messageStatus,
    pendingMessage: status === "discarded" ? "Dismissing reminder draft..." : "Saving reminder draft...",
    successMessage: status === "discarded" ? "Reminder draft dismissed." : "Reminder draft saved.",
    label: "reminder draft",
  });

  const mappedDraft = mapDatabaseAiDraftToRecord(savedRow);
  upsertAiDraftInState(mappedDraft);
  return mappedDraft;
}

async function dismissSelectedReminderDraft() {
  const draftRecord = getSelectedReminderDraft();

  if (!draftRecord) {
    return;
  }

  try {
    const savedDraft = await saveReminderDraftStatus(draftRecord, "discarded");
    if (savedDraft?.status === "discarded") {
      removeAiDraftFromState(savedDraft.id, savedDraft.eventId);
    }
    reminderComposerOpen = false;
    reminderComposerEventId = null;
    reminderDraftSelectionEventId = null;
    messagePreviewDraft = "";
    persistState();
    renderAll();
    setStatus(messageStatus, "Reminder draft dismissed.", false);
    clearAppLinkState();
  } catch (error) {
    console.error("[Reminder Draft] Dismiss failed", {
      error,
      message: error?.message || String(error),
      draftId: draftRecord.id,
    });
    setStatus(messageStatus, error?.message || "Reminder draft could not be dismissed.", true);
  }
}

async function dismissQuickReminderApproval() {
  const draftRecord = getQuickReminderApprovalDraft();

  if (!draftRecord) {
    setStatus(quickReminderApprovalStatus, "That reminder draft is no longer available.", true);
    quickReminderApprovalOpen = false;
    quickReminderApprovalDraftId = "";
    renderAll();
    return;
  }

  try {
    const savedDraft = await saveReminderDraftStatus(draftRecord, "discarded");
    if (savedDraft?.status === "discarded") {
      removeAiDraftFromState(savedDraft.id, savedDraft.eventId);
    }
    quickReminderApprovalOpen = false;
    quickReminderApprovalDraftId = "";
    reminderComposerOpen = false;
    reminderComposerEventId = null;
    reminderDraftSelectionEventId = null;
    messagePreviewDraft = "";
    persistState();
    setStatus(accountSettingsStatus, "Reminder draft dismissed.", false);
    renderAll();
    clearAppLinkState();
  } catch (error) {
    console.error("[Reminder Draft] Quick dismiss failed", {
      error,
      message: error?.message || String(error),
      draftId: draftRecord.id,
    });
    setStatus(quickReminderApprovalStatus, error?.message || "Reminder draft could not be dismissed.", true);
  }
}

async function sendQuickReminderApproval() {
  const draftRecord = getQuickReminderApprovalDraft();
  const eventRecord = getSelectedEvent();

  if (!draftRecord || !eventRecord) {
    setStatus(quickReminderApprovalStatus, "That reminder draft is no longer available.", true);
    return;
  }

  const recipients = getRecipientsForReminderDraft(eventRecord, draftRecord);

  if (!recipients.length) {
    setStatus(quickReminderApprovalStatus, "No matching recipients are available for this reminder.", true);
    return;
  }

  state.selectedContactIds = recipients.map((contact) => contact.id);
  if (messagePreview) {
    messagePreview.value = quickReminderApprovalMessage?.value.trim()
      || draftRecord.draftJson?.message?.email_body
      || buildEventMessageText(eventRecord);
  }

  clearStatus(messageStatus);
  clearStatus(quickReminderApprovalStatus);
  await sendEventUpdateEmail("reminder");

  if (!getQuickReminderApprovalDraft()) {
    setStatus(
      accountSettingsStatus,
      messageStatus?.textContent || "Reminder sent.",
      messageStatus?.classList.contains("is-error") || false,
    );
    quickReminderApprovalOpen = false;
    quickReminderApprovalDraftId = "";
    renderAll();
  } else if (messageStatus?.textContent) {
    setStatus(quickReminderApprovalStatus, messageStatus.textContent, messageStatus.classList.contains("is-error"));
  }
}

function openReminderDraftInEvents() {
  const draftRecord = getQuickReminderApprovalDraft();
  const eventRecord = getSelectedEvent();

  if (!draftRecord || !eventRecord) {
    return;
  }

  state.page = "comms";
  reminderComposerOpen = true;
  reminderComposerEventId = eventRecord.id;
  reminderDraftSelectionEventId = draftRecord.id;
  quickReminderApprovalOpen = false;
  quickReminderApprovalDraftId = "";
  persistState();
  renderAll();
}

function syncAiDraftStateFromInputs() {
  if (!aiDraftState.data) {
    return;
  }

  aiDraftState.data = {
    ...aiDraftState.data,
    ...buildAiDraftPayloadFromInputs(),
  };
}

function buildAiDraftPayloadFromInputs() {
  return {
    intent_type: aiDraftState.data?.intent_type || "general_update",
    confidence: aiDraftState.data?.confidence || 0.5,
    event_action: {
      create_new_event: Boolean(aiDraftState.data?.event_action?.create_new_event),
      update_existing_event: Boolean(aiDraftState.data?.event_action?.update_existing_event),
      cancel_existing_event: Boolean(aiDraftState.data?.event_action?.cancel_existing_event),
      suggested_event_title: aiDraftEventTitleInput.value.trim(),
      event_type: aiDraftEventTypeInput.value,
      event_date: aiDraftEventDateInput.value || null,
      start_time: aiDraftStartTimeInput.value || null,
      end_time: aiDraftEndTimeInput.value || null,
      location: aiDraftEventLocationInput.value.trim() || null,
      notes: aiDraftEventNotesInput.value.trim() || null,
    },
    message: {
      email_subject: aiDraftEmailSubjectInput.value.trim(),
      email_body: aiDraftEmailBodyInput.value.trim(),
      sms_body: aiDraftSmsBodyInput.value.trim(),
    },
    rsvp: {
      rsvp_required: Boolean(aiDraftRsvpRequiredInput.checked),
      suggested_deadline: aiDraftRsvpDeadlineInput.value.trim() || null,
    },
    recipients: {
      suggested_group: aiDraftRecipientGroupInput.value || "all_contacts",
    },
    follow_up: {
      reminder_recommended: Boolean(aiDraftState.data?.follow_up?.reminder_recommended),
      suggested_reminder_timing: aiDraftState.data?.follow_up?.suggested_reminder_timing || "",
    },
    missing_information: Array.isArray(aiDraftState.data?.missing_information)
      ? aiDraftState.data.missing_information
      : [],
  };
}

function formatAiIntentLabel(intent) {
  return {
    create_event: "Create event",
    update_event: "Update event",
    cancel_event: "Cancel event",
    send_reminder: "Send reminder",
    general_update: "General update",
  }[intent] || "General update";
}

function formatAiConfidence(confidence) {
  const percentage = Math.max(0, Math.min(100, Math.round(Number(confidence || 0) * 100)));
  return `${percentage}%`;
}

function formatRecipientGroupLabel(value) {
  return {
    all_contacts: "All contacts",
    non_responders: "Non-responders",
    available_players: "Available players",
    unavailable_players: "Unavailable players",
    custom: "Custom",
  }[value] || "All contacts";
}

async function sendEventUpdateEmail(mode = "all") {
  if (sendingEventUpdate) {
    return;
  }

  const selectedEvent = getSelectedEvent();
  const selectedDraft = mode === "reminder" ? getSelectedReminderDraft() : null;
  const recipients = getActiveTeamContacts()
    .filter((contact) => contact.email && state.selectedContactIds.includes(contact.id));
  const messageText = messagePreview.value.trim();
  const subjectOverride = selectedDraft?.draftJson?.message?.email_subject || "";

  if (!selectedEvent) {
    setStatus(messageStatus, "Choose an event first.", true);
    return;
  }

  if (!recipients.length) {
    setStatus(messageStatus, selectedDraft?.draftType === "event_cancellation"
      ? "Select at least one contact for this cancellation."
      : "Select at least one contact for this reminder.", true);
    return;
  }

  if (!messageText) {
    setStatus(messageStatus, selectedDraft?.draftType === "event_cancellation"
      ? "Add a cancellation message before sending."
      : "Add a reminder message before sending.", true);
    return;
  }

  sendingEventUpdate = true;
  renderEventMessaging();
  setStatus(
    messageStatus,
    mode === "reminder"
      ? (selectedDraft?.draftType === "event_cancellation" ? "Sending cancellation..." : "Sending reminder...")
      : "Sending update...",
    false,
  );

  try {
    const response = await fetch(teamUpdateEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        accessToken: supabaseAccessToken,
        teamId: state.activeTeamId,
        eventId: selectedEvent.id,
        contactIds: recipients.map((contact) => contact.id),
        teamName: state.config.teamName || "TeamPro team",
        messageText,
        subject: subjectOverride,
        includeRsvp: selectedDraft ? selectedDraft.draftJson?.rsvp?.rsvp_required !== false : true,
        baseUrl: window.location.origin,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "Event update could not be sent.");
    }

    if (result.warning) {
      setStatus(messageStatus, result.warning, false);
    } else {
      setStatus(
        messageStatus,
        buildEmailSendStatusMessage({
          mode,
          sentCount: Number(result.sentCount || 0),
          failedCount: Number(result.failedCount || 0),
        }),
        Number(result.failedCount || 0) > 0 && Number(result.sentCount || 0) === 0,
      );
    }

    if (Array.isArray(result.rsvps)) {
      const contactNameById = Object.fromEntries(recipients.map((contact) => [contact.id, contact.contactName]));
      result.rsvps
        .map((row) => mapDatabaseRsvpToRecord({
          ...row,
          contact_name: contactNameById[row.contact_id] || "",
        }))
        .forEach(upsertRsvpInState);
      renderEventRsvps();
    }

    await logEventUpdate({
      eventId: selectedEvent.id,
      deliveryMethod: result.sent ? "email" : "copy",
      recipientCount: recipients.length,
      subject: result.subject || subjectOverride || `${state.config.teamName || "Team"} update`,
      messageText,
    });

    if (result.sent) {
      if (!selectedDraft || selectedDraft.draftType === "scheduled_reminder") {
        await markEventAsSent(selectedEvent.id);
      }
      if (selectedDraft) {
        const savedDraft = await saveReminderDraftStatus(selectedDraft, "used");
        if (savedDraft?.status === "used") {
          removeAiDraftFromState(savedDraft.id, savedDraft.eventId);
        }
        clearAppLinkState();
      }
    }

    if (mode === "reminder") {
      reminderComposerOpen = false;
      reminderComposerEventId = null;
      reminderDraftSelectionEventId = null;
    }
    messagePreviewDraft = "";
    persistState();
    renderAll();
  } catch (error) {
    console.error("[Updates] Send failed", {
      error,
      message: error?.message || String(error),
    });
    setStatus(messageStatus, error?.message || "Event update could not be sent.", true);
  } finally {
    sendingEventUpdate = false;
    renderEventMessaging();
  }
}

async function saveManualRsvpOverride(rsvpId) {
  if (!supabaseUserId) {
    setStatus(eventRsvpStatus, "Log in before updating availability.", true);
    return;
  }

  const rsvpRecord = getSelectedEventRsvps().find((item) => item.id === rsvpId);

  if (!rsvpRecord) {
    setStatus(eventRsvpStatus, "That RSVP could not be found.", true);
    return;
  }

  const responseInput = eventRsvpList.querySelector(`[data-rsvp-field="response"][data-rsvp-id="${rsvpId}"]`);
  const nextResponse = responseInput?.value || "no_response";

  try {
    const savedRow = await saveRowToSupabase({
      tableName: eventRsvpsTableName,
      row: {
        id: rsvpRecord.id,
        user_id: supabaseUserId,
        team_id: rsvpRecord.teamId,
        event_id: rsvpRecord.eventId,
        contact_id: rsvpRecord.contactId,
        player_name: rsvpRecord.playerName || null,
        response: nextResponse,
        response_note: rsvpRecord.responseNote || null,
        token: rsvpRecord.token,
        token_expires_at: rsvpRecord.tokenExpiresAt,
        responded_at: nextResponse === "no_response" ? null : new Date().toISOString(),
      },
      statusElement: eventRsvpStatus,
      pendingMessage: "Saving RSVP...",
      successMessage: "RSVP updated.",
      label: "rsvp",
    });
    upsertRsvpInState(mapDatabaseRsvpToRecord({
      ...savedRow,
      contact_name: rsvpRecord.contactName,
    }));
    persistState();
    renderAll();
    setStatus(eventRsvpStatus, "RSVP updated.", false);
  } catch (error) {
    console.error("[Supabase] rsvp save failed", {
      error,
      message: error?.message || String(error),
      rsvpId,
    });
    setStatus(eventRsvpStatus, `RSVP save failed: ${describeSupabaseError(error)}`, true);
  }
}

async function markEventAsSent(eventId) {
  const events = getActiveTeamEvents();
  const index = events.findIndex((item) => item.id === eventId);

  if (index === -1) {
    return;
  }

  const nextEvent = {
    ...events[index],
    status: "sent",
  };
  events[index] = nextEvent;
  state.eventsByTeamId[state.activeTeamId] = events;
  persistState();
  renderAll();

  try {
    await saveRowToSupabase({
      tableName: teamEventsTableName,
      row: {
        id: nextEvent.id,
        user_id: supabaseUserId,
        team_id: nextEvent.teamId,
        event_title: nextEvent.eventTitle,
        event_type: nextEvent.eventType,
        event_date: nextEvent.eventDate,
        start_time: nextEvent.startTime || null,
        end_time: nextEvent.endTime || null,
        location: nextEvent.location || null,
        notes: nextEvent.notes || null,
        status: nextEvent.status,
        reminder_3_day_enabled: state.userSettings?.defaultReminder3DayEnabled !== false,
        reminder_1_day_enabled: state.userSettings?.defaultReminder1DayEnabled !== false,
        reminder_same_day_enabled: state.userSettings?.defaultReminderSameDayEnabled !== false,
        repeat_pattern: nextEvent.repeatPattern || "once",
        repeat_end_date: nextEvent.repeatEndDate || null,
        repeat_day_of_week: Number.isInteger(nextEvent.repeatDayOfWeek) ? nextEvent.repeatDayOfWeek : null,
        series_id: nextEvent.seriesId || null,
      },
      statusElement: messageStatus,
      pendingMessage: "Updating event status...",
      successMessage: "Event marked as sent.",
      label: "event",
    });
  } catch (error) {
    console.error("[Supabase] event sent status update failed", {
      error,
      message: error?.message || String(error),
      eventId,
    });
  }
}

function formatEventDate(dateValue) {
  if (!dateValue) {
    return "Date to be confirmed";
  }

  try {
    return new Intl.DateTimeFormat("en-NZ", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${dateValue}T12:00:00`));
  } catch (error) {
    return dateValue;
  }
}

function formatEventTime(timeValue) {
  if (!timeValue) {
    return "";
  }

  return timeValue;
}

function formatEventTimeRange(startTime, endTime) {
  if (startTime && endTime) {
    return `${formatEventTime(startTime)} - ${formatEventTime(endTime)}`;
  }

  return startTime ? formatEventTime(startTime) : "";
}

function getEventTimingLabel(eventRecord) {
  return formatEventTimeRange(eventRecord.startTime, eventRecord.endTime);
}

function getEventStartDateTime(eventRecord) {
  if (!eventRecord?.eventDate) {
    return null;
  }

  const timeValue = eventRecord.startTime || "23:59";
  const parsed = new Date(`${eventRecord.eventDate}T${timeValue}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatEventTypeLabel(eventType) {
  return {
    training: "Training",
    game: "Game",
    tournament: "Tournament",
    other: "Other",
  }[eventType] || "Other";
}

function getEventReminderScheduleLabel(eventRecord) {
  if (!eventRecord?.eventDate || !["planned", "sent"].includes(eventRecord.status)) {
    return "";
  }

  const pendingDrafts = (state.aiDraftsByEventId[eventRecord.id] || []).filter(
    (draft) => draft.draftType === "scheduled_reminder" && draft.status === "pending_review",
  );
  const existingReminderTypes = new Set(
    (state.aiDraftsByEventId[eventRecord.id] || [])
      .filter((draft) => draft.draftType === "scheduled_reminder" && draft.reminderType)
      .map((draft) => draft.reminderType),
  );
  const reminderCandidates = getEnabledReminderCandidatesForEvent(eventRecord)
    .filter((candidate) => !existingReminderTypes.has(candidate.type))
    .filter((candidate) => isReminderScheduleStillUpcoming(eventRecord, candidate));
  const dueCandidates = getDueReminderCandidatesForEvent(eventRecord).filter(
    (candidate) => !existingReminderTypes.has(candidate.type),
  );

  const dueReminder = dueCandidates[0] || null;
  const nextReminder = reminderCandidates.find(
    (candidate) => !dueReminder || candidate.type !== dueReminder.type,
  ) || null;

  if (dueReminder) {
    return `${formatReminderTypeLabel(dueReminder.type)} reminder draft due now`;
  }

  if (nextReminder) {
    return `Next reminder draft: ${formatReminderTypeLabel(nextReminder.type)} on ${formatEventDate(nextReminder.scheduledDate)} (early morning NZ)`;
  }

  if (pendingDrafts.length) {
    const nextPendingDraft = pendingDrafts.sort((left, right) => {
      const leftDate = left.scheduledFor || "";
      const rightDate = right.scheduledFor || "";
      return leftDate.localeCompare(rightDate);
    })[0];
    return `${formatReminderTypeLabel(nextPendingDraft.reminderType)} reminder draft awaiting review`;
  }

  return "No more automatic reminders scheduled";
}

async function executeCancellationApprovalDraft({ teamId, eventId }) {
  const response = await fetch(eventCancellationEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      accessToken: supabaseAccessToken,
      teamId,
      eventId,
      baseUrl: window.location.origin,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Cancellation approval could not be prepared.");
  }

  return result;
}

function formatCancellationDraftResult(result) {
  if (result?.duplicate && result?.notified) {
    return "Cancellation approval email re-sent to the coach.";
  }
  if (result?.duplicate) {
    return "A cancellation approval draft is already waiting for review.";
  }
  if (result?.notified) {
    return "Cancellation approval email sent to the coach.";
  }
  if (result?.draftCreated) {
    return "Cancellation approval draft created.";
  }
  return "Cancellation approval prepared.";
}

function getAllVisibleEvents(now = new Date()) {
  return Object.values(state.eventsByTeamId || {})
    .flatMap((rows) => (Array.isArray(rows) ? rows : []))
    .filter((eventRecord) => !isEventFinished(eventRecord, now))
    .sort(compareEvents);
}

function hasDueReminderCoverageGap(now = new Date()) {
  return getAllVisibleEvents(now).some((eventRecord) => {
    if (!eventRecord?.eventDate || !["planned", "sent"].includes(eventRecord.status)) {
      return false;
    }

    const existingReminderTypes = new Set(
      (state.aiDraftsByEventId[eventRecord.id] || [])
        .filter((draft) => draft.draftType === "scheduled_reminder" && draft.reminderType)
        .map((draft) => draft.reminderType),
    );

    return getDueReminderCandidatesForEvent(eventRecord, now).some(
      (candidate) => !existingReminderTypes.has(candidate.type),
    );
  });
}

async function ensureDueReminderCoverageInBackground() {
  if (!supabaseUserId || !supabaseAccessToken || reminderCheckInFlight || reminderAutoCatchUpInFlight) {
    return;
  }

  const todayKey = formatDateForStorage(new Date());
  const attemptKey = `${supabaseUserId}:${todayKey}`;

  if (reminderAutoCatchUpAttemptKey === attemptKey || !hasDueReminderCoverageGap()) {
    return;
  }

  reminderAutoCatchUpAttemptKey = attemptKey;
  reminderAutoCatchUpInFlight = true;

  try {
    console.info("[Reminder Scheduler] Background due-reminder catch-up started", {
      userId: supabaseUserId,
      attemptKey,
    });
    const result = await executeReminderSchedulerCheck();
    console.info("[Reminder Scheduler] Background due-reminder catch-up completed", result);

    if (Number(result?.dueCount || 0) > 0 || Number(result?.draftCount || 0) > 0 || Number(result?.notifiedCount || 0) > 0) {
      await hydrateStateFromSupabase();
    }
  } catch (error) {
    reminderAutoCatchUpAttemptKey = "";
    console.error("[Reminder Scheduler] Background due-reminder catch-up failed", {
      error,
      message: error?.message || String(error),
    });
  } finally {
    reminderAutoCatchUpInFlight = false;
  }
}

function getEnabledReminderCandidatesForEvent(eventRecord) {
  const baseDate = parseIsoDateAtNoon(eventRecord.eventDate);

  if (!baseDate) {
    return [];
  }

  const settings = normaliseUserSettings(state.userSettings);
  const candidates = [];

  if (settings.defaultReminder3DayEnabled) {
    candidates.push({
      type: "reminder_3_day",
      daysBefore: 3,
      scheduledDate: addDaysToDate(baseDate, -3),
    });
  }

  if (settings.defaultReminder1DayEnabled) {
    candidates.push({
      type: "reminder_1_day",
      daysBefore: 1,
      scheduledDate: addDaysToDate(baseDate, -1),
    });
  }

  if (settings.defaultReminderSameDayEnabled) {
    candidates.push({
      type: "reminder_same_day",
      daysBefore: 0,
      scheduledDate: baseDate,
    });
  }

  return candidates;
}

function getDueReminderCandidatesForEvent(eventRecord, now = new Date()) {
  if (!eventRecord?.eventDate || isEventFinished(eventRecord, now)) {
    return [];
  }

  const todayKey = formatDateForStorage(now);

  return getEnabledReminderCandidatesForEvent(eventRecord)
    .filter((candidate) => formatDateForStorage(candidate.scheduledDate) <= todayKey)
    .sort((left, right) => right.scheduledDate.getTime() - left.scheduledDate.getTime());
}

function isReminderScheduleStillUpcoming(eventRecord, candidate) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const scheduledDay = new Date(
    candidate.scheduledDate.getFullYear(),
    candidate.scheduledDate.getMonth(),
    candidate.scheduledDate.getDate(),
  );

  if (scheduledDay.getTime() > today.getTime()) {
    return true;
  }

  if (scheduledDay.getTime() < today.getTime()) {
    return false;
  }

  if (candidate.type === "reminder_same_day") {
    return !isEventFinished(eventRecord, now);
  }

  return true;
}

function parseIsoDateAtNoon(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function addDaysToDate(date, days) {
  const nextDate = new Date(date.getTime());
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDateForStorage(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatEventOptionLabel(eventRecord) {
  return `${eventRecord.eventTitle} | ${formatEventDate(eventRecord.eventDate)}${getEventTimingLabel(eventRecord) ? ` | ${getEventTimingLabel(eventRecord)}` : ""}`;
}

function getNextPlannedEvent() {
  const now = new Date();
  return getActiveTeamEvents()
    .filter((eventRecord) => eventRecord.status === "planned")
    .filter((eventRecord) => {
      if (!eventRecord.eventDate) {
        return false;
      }

      const eventDateTime = new Date(`${eventRecord.eventDate}T${eventRecord.startTime || "23:59"}`);
      return eventDateTime.getTime() >= now.getTime();
    })[0] || null;
}

function renderEventRepeatInputs() {
  const isWeekly = eventRepeatPatternInput?.value === "weekly";

  if (eventRecurringOptions) {
    eventRecurringOptions.classList.toggle("hidden", !isWeekly);
  }

  if (eventRepeatEndDateInput) {
    eventRepeatEndDateInput.disabled = !isWeekly;
  }
}

function getSelectedRecurringDaysFromForm() {
  if (!eventRecurringDays) {
    return [];
  }

  return Array.from(eventRecurringDays.querySelectorAll("input[type='checkbox']:checked"))
    .map((input) => Number(input.value))
    .filter((value) => Number.isInteger(value));
}

function clearSelectedRecurringDays() {
  if (!eventRecurringDays) {
    return;
  }

  Array.from(eventRecurringDays.querySelectorAll("input[type='checkbox']")).forEach((input) => {
    input.checked = false;
  });
}

function setSelectedRecurringDays(days) {
  if (!eventRecurringDays) {
    return;
  }

  const selectedDays = new Set(days);
  Array.from(eventRecurringDays.querySelectorAll("input[type='checkbox']")).forEach((input) => {
    input.checked = selectedDays.has(Number(input.value));
  });
}

function formatRsvpResponseLabel(response) {
  switch (response) {
    case "yes":
      return "Available";
    case "no":
      return "Unavailable";
    case "maybe":
      return "Maybe";
    default:
      return "No response";
  }
}

function getRsvpStatusClassName(response) {
  if (response === "yes") {
    return "is-rsvp-yes";
  }

  if (response === "no") {
    return "is-rsvp-no";
  }

  if (response === "maybe") {
    return "is-rsvp-maybe";
  }

  return "";
}

function formatRsvpTimestamp(value) {
  if (!value) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("en-NZ", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (_error) {
    return value;
  }
}

function formatTrainingPlanAsText(plan) {
  const blocksText = plan.blocks
    .map((block, index) => {
      const coachingPoints = block.coachingPoints.map((point) => `- ${point}`).join("\n");
      return [
        `${index + 1}. ${block.title} (${block.durationMinutes} mins)`,
        `Purpose: ${block.purpose}`,
        `Setup: ${block.setup}`,
        `Coaching points:`,
        coachingPoints,
      ].join("\n");
    })
    .join("\n\n");

  return [
    plan.title,
    `${plan.focusArea} focus | ${plan.ageRange} | ${plan.totalMinutes} minutes`,
    "",
    `Overview: ${plan.summary}`,
    `Session goals: ${plan.sessionGoals.join(" | ")}`,
    `Equipment: ${plan.equipment.join(", ")}`,
    "",
    blocksText,
    "",
    `Coach reminder: ${plan.coachReminder}`,
  ].join("\n");
}

function renderBench() {
  const benchPlayers = state.lineup.benchIds.map((playerId, index) => ({
    player: findPlayer(playerId),
    index,
  }));

  const cards = benchPlayers
    .map(
      ({ player, index }) => `
        <button
          class="bench-player ${isSelected("bench", index) ? "is-selected" : ""} ${isPlayerAbsent(player.id) ? "absent-player" : ""}"
          type="button"
          draggable="true"
          data-target-type="bench"
          data-target-index="${index}"
        >
          <span class="player-name">${escapeHtml(player.name)}</span>
          <span class="player-meta">${isPlayerAbsent(player.id) ? "Absent" : "Bench player"}</span>
        </button>
      `,
    )
    .join("");

  benchList.innerHTML = `
    <button class="bench-dropzone" type="button" data-target-type="bench-dropzone" data-target-index="-1">
      Drop here or use "Send selected to bench"
    </button>
    ${
      cards ||
      '<div class="bench-empty">No players on the bench right now.</div>'
    }
  `;
}

function getPitchMarkingsMarkup(sportType) {
  const safeSportType = normaliseSportType(sportType);

  if (safeSportType === "rugby") {
    return `
      <div class="rugby-halfway-line" aria-hidden="true"></div>
      <div class="rugby-try-line top" aria-hidden="true"></div>
      <div class="rugby-try-line bottom" aria-hidden="true"></div>
      <div class="rugby-twenty-two-line top" aria-hidden="true"></div>
      <div class="rugby-twenty-two-line bottom" aria-hidden="true"></div>
      <div class="rugby-five-line top" aria-hidden="true"></div>
      <div class="rugby-five-line bottom" aria-hidden="true"></div>
    `;
  }

  if (safeSportType === "cricket") {
    return `
      <div class="cricket-ring" aria-hidden="true"></div>
      <div class="cricket-inner-ring" aria-hidden="true"></div>
      <div class="cricket-strip" aria-hidden="true"></div>
      <div class="cricket-crease top" aria-hidden="true"></div>
      <div class="cricket-crease bottom" aria-hidden="true"></div>
    `;
  }

  if (safeSportType === "softball") {
    return `
      <div class="softball-outfield-arc" aria-hidden="true"></div>
      <div class="softball-infield-diamond" aria-hidden="true"></div>
      <div class="softball-base home" aria-hidden="true"></div>
      <div class="softball-base first" aria-hidden="true"></div>
      <div class="softball-base second" aria-hidden="true"></div>
      <div class="softball-base third" aria-hidden="true"></div>
      <div class="softball-pitcher-circle" aria-hidden="true"></div>
    `;
  }

  return `
    <div class="pitch-circle" aria-hidden="true"></div>
    <div class="pitch-box top-box" aria-hidden="true"></div>
    <div class="pitch-box bottom-box" aria-hidden="true"></div>
    <div class="pitch-goal-box top-goal-box" aria-hidden="true"></div>
    <div class="pitch-goal-box bottom-goal-box" aria-hidden="true"></div>
    <div class="pitch-centre-spot" aria-hidden="true"></div>
    <div class="pitch-penalty-spot top-spot" aria-hidden="true"></div>
    <div class="pitch-penalty-spot bottom-spot" aria-hidden="true"></div>
  `;
}

function renderPitch() {
  const sportType = state.config.sportType || "football";
  const markings = getPitchMarkingsMarkup(sportType);

  pitch.className = `pitch pitch--${sportType}`;
  pitch.setAttribute("aria-label", getSportFieldLabel(sportType));

  const slotMarkup = state.lineup.slots
    .map((slot, index) => {
      const player = slot.occupantId ? findPlayer(slot.occupantId) : null;
      const isGoalkeeper = state.config.sportType === "football" && slot.role === "GK";
      const selectedClass = isSelected("slot", index) ? "is-selected" : "";
      const emptyClass = player ? "" : "empty";
      const absentClass = player && isPlayerAbsent(player.id) ? "absent-player" : "";
      const playerMeta = player
        ? isPlayerAbsentFromRsvp(player.id)
          ? "Absent"
          : slot.positionLabel
        : "Tap to place";

      return `
        <div
          class="slot"
          style="left: ${slot.x * 100}%; top: ${slot.y * 100}%"
        >
          <div class="slot-role">${escapeHtml(slot.roleLabel)}</div>
          <button
            class="player-token ${isGoalkeeper ? "goalkeeper" : ""} ${selectedClass} ${emptyClass} ${absentClass}"
            type="button"
            draggable="${player ? "true" : "false"}"
            data-target-type="slot"
            data-target-index="${index}"
            data-empty="${player ? "false" : "true"}"
          >
            <span class="player-name">${player ? escapeHtml(player.name) : "Open Slot"}</span>
            <span class="player-meta">${escapeHtml(playerMeta)}</span>
          </button>
        </div>
      `;
    })
    .join("");

  pitch.innerHTML = markings + slotMarkup;
}

async function saveConfigFromForm() {
  if (!supabaseUserId) {
    setStatus(configStatus, "Log in before saving teams.", true);
    return;
  }

  const config = buildConfigFromForm();

  if (!config.ok) {
    setStatus(configStatus, config.message, true);
    return;
  }

  const existingId = state.activeTeamId;
  const teamId = existingId || createTeamStorageId();
  const nextRuntime = hydrateTeamRuntime({
    id: teamId,
    config: config.value,
    lineup: existingId === state.activeTeamId ? createLineupSnapshot(state) : null,
  });

  state.config = nextRuntime.config;
  state.players = nextRuntime.players;
  state.lineup = nextRuntime.lineup;
  state.activeTeamId = teamId;
  upsertCurrentTeam();
  state.selectedTarget = null;
  persistState();

  const currentTeam = state.teams.find((team) => team.id === state.activeTeamId) || null;

  if (!currentTeam) {
    setStatus(configStatus, "The team could not be prepared for saving.", true);
    return;
  }

  setStatus(configStatus, "Saving team...", false);

  try {
    await saveTeamRecordToSupabase(currentTeam, {
      statusElement: configStatus,
      pendingMessage: "Saving team...",
      successMessage: "Team saved to Supabase.",
    });
  } catch (error) {
    setStatus(
      configStatus,
      `Supabase save failed: ${describeSupabaseError(error)}`,
      true,
    );
    return;
  }

  persistCachedStateOnly();
  persistUserScopedState();
  renderAll();
  setStatus(configStatus, "Team saved.", false);
}

function buildConfigFromForm() {
  syncPlayerNamesFieldFromRows();
  const sportType = getSelectedSportType();
  const teamName = teamNameInput.value.trim();
  const playersOnField = Number(playersOnFieldInput.value);
  const players = dedupeNames(parsePlayerNames(playerNamesInput.value));
  const formations = formationDraft.filter((formation) =>
    isValidFormation(formation, playersOnField, sportType),
  );

  if (!teamName) {
    return { ok: false, message: "Add a team name first." };
  }

  if (formations.length === 0) {
    return {
      ok: false,
      message: "Choose at least one valid formation.",
    };
  }

  return {
    ok: true,
    value: {
      teamName,
      sportType,
      playersOnField,
      players,
      formations,
      selectedFormation: formations[0],
    },
  };
}

function parsePlayerNames(value) {
  return value
    .split(/\n|,/)
    .map((name) => name.trim().replace(/\s+/g, " "))
    .filter(Boolean);
}

function dedupeNames(names) {
  const counts = new Map();

  return names.map((name) => {
    const total = counts.get(name) || 0;
    counts.set(name, total + 1);
    return total === 0 ? name : `${name} ${total + 1}`;
  });
}

function normaliseFormation(value) {
  return value
    .trim()
    .replace(/[–—−\s]+/g, "-")
    .split("-")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("-");
}

function compareFormationStrings(left, right) {
  return left.localeCompare(right, undefined, { numeric: true });
}

function isValidFormation(formation, playersOnField, sportType = "football") {
  if (normaliseSportType(sportType) !== "football") {
    return getSuggestedFormations(playersOnField, sportType).includes(formation);
  }

  const parts = formation
    .split("-")
    .map((part) => Number(part))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (parts.length === 0) {
    return false;
  }

  return parts.reduce((sum, value) => sum + value, 0) === playersOnField - 1;
}

function buildFormationSlots(formation, playersOnField, sportType = "football") {
  const safeSportType = normaliseSportType(sportType);

  if (safeSportType !== "football") {
    return getSportLayout(safeSportType, playersOnField, formation).slots;
  }

  if (!isValidFormation(formation, playersOnField, safeSportType)) {
    return buildFormationSlots(getSuggestedFormations(playersOnField, safeSportType)[0], playersOnField, safeSportType);
  }

  const lines = formation.split("-").map(Number);
  const prefixes = linePrefixes(lines.length);
  const slots = [
    {
      role: "GK",
      roleLabel: "Goalkeeper",
      positionLabel: "GK",
      x: 0.5,
      y: 0.88,
    },
  ];

  lines.forEach((count, lineIndex) => {
    const y = 0.76 - (lineIndex * 0.58) / Math.max(lines.length - 1, 1);
    const positions = spreadAcross(count);

    positions.forEach((x, playerIndex) => {
      const positionLabel = `${prefixes[lineIndex]} ${playerIndex + 1}`;
      slots.push({
        role: positionLabel,
        roleLabel: prefixes[lineIndex],
        positionLabel,
        x,
        y,
      });
    });
  });

  return slots.slice(0, playersOnField);
}

function linePrefixes(lineCount) {
  if (lineCount === 1) {
    return ["Outfield"];
  }

  if (lineCount === 2) {
    return ["Defence", "Attack"];
  }

  if (lineCount === 3) {
    return ["Defence", "Midfield", "Attack"];
  }

  if (lineCount === 4) {
    return ["Defence", "Midfield", "Midfield", "Attack"];
  }

  return Array.from({ length: lineCount }, (_, index) => `Line ${index + 1}`);
}

function spreadAcross(count) {
  return Array.from({ length: count }, (_, index) => (index + 1) / (count + 1));
}

function handleTargetSelection(target) {
  clearStatus(exportStatus);

  if (!state.selectedTarget) {
    if (!targetHasPlayer(target)) {
      return;
    }

    state.selectedTarget = target;
    persistState();
    renderAll();
    return;
  }

  if (targetsMatch(state.selectedTarget, target)) {
    state.selectedTarget = null;
    persistState();
    renderAll();
    return;
  }

  swapOrMove(state.selectedTarget, target);
}

function swapOrMove(source, target) {
  if (!target) {
    return;
  }

  if (source.type === "bench" && target.type === "slot") {
    const sourcePlayer = findPlayer(state.lineup.benchIds[source.index]);

    if (sourcePlayer && isPlayerAbsent(sourcePlayer.id)) {
      setStatus(exportStatus, `${sourcePlayer.name} is marked absent. Mark them available before moving them onto the field.`, true);
      state.selectedTarget = null;
      renderAll();
      return;
    }
  }

  if (source.type === "slot" && target.type === "slot") {
    const sourceOccupant = state.lineup.slots[source.index].occupantId;
    const targetOccupant = state.lineup.slots[target.index].occupantId;
    state.lineup.slots[source.index].occupantId = targetOccupant || null;
    state.lineup.slots[target.index].occupantId = sourceOccupant || null;
  } else if (source.type === "bench" && target.type === "bench") {
    const sourcePlayer = state.lineup.benchIds[source.index];
    state.lineup.benchIds[source.index] = state.lineup.benchIds[target.index];
    state.lineup.benchIds[target.index] = sourcePlayer;
  } else if (source.type === "slot" && target.type === "bench") {
    const sourcePlayer = state.lineup.slots[source.index].occupantId;
    const benchPlayer = state.lineup.benchIds[target.index];
    state.lineup.slots[source.index].occupantId = benchPlayer || null;
    state.lineup.benchIds[target.index] = sourcePlayer;
  } else if (source.type === "bench" && target.type === "slot") {
    const sourcePlayer = state.lineup.benchIds[source.index];
    const slotPlayer = state.lineup.slots[target.index].occupantId;
    state.lineup.benchIds[source.index] = slotPlayer || null;
    state.lineup.slots[target.index].occupantId = sourcePlayer;
    state.lineup.benchIds = state.lineup.benchIds.filter(Boolean);
  }

  state.selectedTarget = null;
  persistState();
  renderAll();
}

function moveSelectedToBench() {
  if (!state.selectedTarget) {
    return;
  }

  movePlayerToBench(state.selectedTarget);
}

function movePlayerToBench(target) {
  if (!target || target.type !== "slot") {
    setStatus(exportStatus, "Select a player on the field to send them to the bench.", true);
    return;
  }

  const playerId = state.lineup.slots[target.index].occupantId;

  if (!playerId) {
    return;
  }

  state.lineup.slots[target.index].occupantId = null;
  state.lineup.benchIds.unshift(playerId);
  state.selectedTarget = null;
  persistState();
  renderAll();
}

function fillEmptySlotsFromBench() {
  let changed = false;

  state.lineup.slots.forEach((slot) => {
    if (!slot.occupantId) {
      const availableBenchIndex = state.lineup.benchIds.findIndex((playerId) => !isPlayerAbsent(playerId));

      if (availableBenchIndex === -1) {
        return;
      }

      slot.occupantId = state.lineup.benchIds.splice(availableBenchIndex, 1)[0];
      changed = true;
    }
  });

  setStatus(
    exportStatus,
    changed ? "Empty positions filled from the bench." : "There are no empty field positions to fill.",
    !changed,
  );
  persistState();
  renderAll();
}

function resetLineup() {
  const manualAbsentIds = getManualAbsentIds();
  const effectiveAbsentIds = getEffectiveAbsentIds();
  const availablePlayers = state.players.filter((player) => !effectiveAbsentIds.includes(player.id));
  state.lineup = buildLineup(availablePlayers, state.config.playersOnField, state.lineup.formation, state.config.sportType);
  state.lineup.absentIds = manualAbsentIds;
  effectiveAbsentIds.forEach((playerId) => {
    if (!state.lineup.benchIds.includes(playerId)) {
      state.lineup.benchIds.push(playerId);
    }
  });
  state.selectedTarget = null;
  persistState();
  setStatus(exportStatus, "Lineup reset to squad order.", false);
  renderAll();
}

function setFormation(formation) {
  if (!state.config.formations.includes(formation)) {
    return;
  }

  const manualAbsentIds = getManualAbsentIds();
  const effectiveAbsentIds = getEffectiveAbsentIds();
  const orderedPlayers = [
    ...state.lineup.slots.map((slot) => slot.occupantId).filter((playerId) => Boolean(playerId) && !effectiveAbsentIds.includes(playerId)),
    ...state.lineup.benchIds.filter((playerId) => !effectiveAbsentIds.includes(playerId)),
  ];
  const freshSlots = buildFormationSlots(formation, state.config.playersOnField, state.config.sportType).map((slot, index) => ({
    ...slot,
    occupantId: orderedPlayers[index] || null,
  }));

  state.lineup = {
    formation,
    sportType: state.config.sportType,
    slots: freshSlots,
    benchIds: [...orderedPlayers.slice(freshSlots.length), ...effectiveAbsentIds.filter((playerId) => !orderedPlayers.includes(playerId))],
    absentIds: manualAbsentIds,
  };
  state.config.selectedFormation = formation;
  state.selectedTarget = null;
  persistState();
  renderAll();
}

function targetHasPlayer(target) {
  if (target.type === "slot") {
    return Boolean(state.lineup.slots[target.index]?.occupantId);
  }

  if (target.type === "bench") {
    return Boolean(state.lineup.benchIds[target.index]);
  }

  return false;
}

function targetsMatch(left, right) {
  return left.type === right.type && left.index === right.index;
}

function isSelected(type, index) {
  return Boolean(
    state.selectedTarget &&
      state.selectedTarget.type === type &&
      state.selectedTarget.index === index,
  );
}

function describeSelection(target) {
  const player = target.type === "slot"
    ? findPlayer(state.lineup.slots[target.index].occupantId)
    : findPlayer(state.lineup.benchIds[target.index]);

  const availabilityText = player && isPlayerAbsent(player.id)
    ? isPlayerAbsentFromRsvp(player.id)
      ? " They are currently marked absent for the selected event because their RSVP is no."
      : " They are currently marked absent."
    : "";

  return player
    ? `${player.name} selected. Choose another player or an open spot to move them.${availabilityText}`
    : "Select a player on the field or bench, then select another player or an empty position.";
}

function getSelectedPlayer() {
  if (!state.selectedTarget) {
    return null;
  }

  if (state.selectedTarget.type === "slot") {
    return findPlayer(state.lineup.slots[state.selectedTarget.index]?.occupantId);
  }

  if (state.selectedTarget.type === "bench") {
    return findPlayer(state.lineup.benchIds[state.selectedTarget.index]);
  }

  return null;
}

function isPlayerAbsent(playerId) {
  return Boolean(playerId && getEffectiveAbsentIds().includes(playerId));
}

function isPlayerAbsentFromRsvp(playerId) {
  return Boolean(playerId && getRsvpAbsentPlayerIds().includes(playerId));
}

function getManualAbsentIds() {
  return [...(state.lineup.absentIds || [])];
}

function getEffectiveAbsentIds() {
  return Array.from(new Set([...getManualAbsentIds(), ...getRsvpAbsentPlayerIds()]));
}

function getRsvpAbsentPlayerIds() {
  const selectedEvent = getSelectedEvent();

  if (!selectedEvent || selectedEvent.teamId !== state.activeTeamId) {
    return [];
  }

  const declinedNames = new Set(
    getSelectedEventRsvps()
      .filter((rsvp) => rsvp.response === "no" && rsvp.playerName)
      .map((rsvp) => normalisePlayerLookupName(rsvp.playerName)),
  );

  if (!declinedNames.size) {
    return [];
  }

  return state.players
    .filter((player) => declinedNames.has(normalisePlayerLookupName(player.name)))
    .map((player) => player.id);
}

function normalisePlayerLookupName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function toggleSelectedAvailability() {
  const selectedPlayer = getSelectedPlayer();

  if (!selectedPlayer) {
    setStatus(exportStatus, "Select a player first.", true);
    return;
  }

  if (isPlayerAbsentFromRsvp(selectedPlayer.id)) {
    setStatus(
      exportStatus,
      `${selectedPlayer.name} is marked absent for the selected event because their RSVP is no.`,
      true,
    );
    return;
  }

  if (isPlayerAbsent(selectedPlayer.id)) {
    markPlayerAvailable(selectedPlayer.id);
  } else {
    markPlayerAbsent(selectedPlayer.id);
  }
}

function markPlayerAbsent(playerId) {
  const player = findPlayer(playerId);

  if (!player) {
    return;
  }

  if (!getManualAbsentIds().includes(playerId)) {
    state.lineup.absentIds.push(playerId);
  }

  const slot = state.lineup.slots.find((candidate) => candidate.occupantId === playerId);

  if (slot) {
    slot.occupantId = null;
  }

  state.lineup.benchIds = state.lineup.benchIds.filter((id) => id !== playerId);
  state.lineup.benchIds.unshift(playerId);
  state.selectedTarget = null;
  persistState();
  setStatus(exportStatus, `${player.name} marked absent and moved to the bench.`, false);
  renderAll();
}

function markPlayerAvailable(playerId) {
  const player = findPlayer(playerId);

  if (!player) {
    return;
  }

  state.lineup.absentIds = state.lineup.absentIds.filter((id) => id !== playerId);
  state.selectedTarget = null;
  persistState();
  setStatus(exportStatus, `${player.name} marked available.`, false);
  renderAll();
}

function findPlayer(playerId) {
  return state.players.find((player) => player.id === playerId);
}

function upsertCurrentTeam() {
  const record = {
    id: state.activeTeamId,
    config: normaliseConfig(state.config),
    lineup: createLineupSnapshot(state),
  };

  const index = state.teams.findIndex((team) => team.id === record.id);

  if (index >= 0) {
    state.teams[index] = record;
  } else {
    state.teams.push(record);
  }
}

function createLineupSnapshot(runtimeState) {
  return {
    formation: runtimeState.lineup.formation,
    slotAssignments: runtimeState.lineup.slots.map((slot) => {
      const player = slot.occupantId ? runtimeState.players.find((candidate) => candidate.id === slot.occupantId) : null;
      return player ? player.name : null;
    }),
    bench: runtimeState.lineup.benchIds
      .map((playerId) => runtimeState.players.find((candidate) => candidate.id === playerId))
      .filter(Boolean)
      .map((player) => player.name),
    absent: (runtimeState.lineup.absentIds || [])
      .map((playerId) => runtimeState.players.find((candidate) => candidate.id === playerId))
      .filter(Boolean)
      .map((player) => player.name),
  };
}

function switchTeam(teamId) {
  if (!supabaseUserId) {
    setStatus(configStatus, "Log in before loading teams.", true);
    return;
  }

  if (!teamId || teamId === state.activeTeamId) {
    return;
  }

  upsertCurrentTeam();
  const record = state.teams.find((team) => team.id === teamId);

  if (!record) {
    return;
  }

  const runtime = hydrateTeamRuntime(record);
  state.activeTeamId = record.id;
  state.config = runtime.config;
  state.players = runtime.players;
  state.lineup = runtime.lineup;
  state.selectedEventId = getActiveTeamEvents()[0]?.id || null;
  state.selectedContactIds = [];
  state.selectedTarget = null;
  aiDraftState = {
    loading: false,
    draftId: null,
    data: null,
  };
  persistState();
  syncFormFromState();
  resetContactForm();
  resetEventForm();
  renderAll();
}

function createNewTeamDraft() {
  if (!supabaseUserId) {
    setStatus(configStatus, "Log in before creating teams.", true);
    return;
  }

  upsertCurrentTeam();
  const sportType = getSelectedSportType();
  const playersOnField = Number(playersOnFieldInput.value) || getSportDefaultTeamSize(sportType);
  const blankConfig = {
    sportType,
    teamName: "",
    playersOnField,
    players: [],
    formations: getSuggestedFormations(playersOnField, sportType).slice(0, 3),
    selectedFormation: getSuggestedFormations(playersOnField, sportType)[0],
  };

  state.activeTeamId = createTeamStorageId();
  state.config = normaliseConfig(blankConfig);
  state.players = [];
  state.lineup = buildLineup([], state.config.playersOnField, state.config.selectedFormation, state.config.sportType);
  state.contactsByTeamId[state.activeTeamId] = [];
  state.eventsByTeamId[state.activeTeamId] = [];
  state.rsvpsByEventId = state.rsvpsByEventId || {};
  state.aiDraftsByEventId = state.aiDraftsByEventId || {};
  state.selectedEventId = null;
  state.selectedContactIds = [];
  state.selectedTarget = null;
  state.page = "config";
  aiDraftState = {
    loading: false,
    draftId: null,
    data: null,
  };
  formationDraft = [...state.config.formations];
  syncFormFromState();
  persistState();
  renderAll();
  setStatus(configStatus, "New team draft ready. Add the squad and save it when you’re ready.", false);
}

function deleteCurrentTeam() {
  if (!supabaseUserId) {
    setStatus(configStatus, "Log in before deleting teams.", true);
    return;
  }

  const currentTeam = state.teams.find((team) => team.id === state.activeTeamId);

  if (!currentTeam) {
    setStatus(configStatus, "There isn’t a saved team to delete.", true);
    return;
  }

  const label = currentTeam.config.teamName || "this team";
  const confirmed = window.confirm(`Delete ${label}? This will remove the saved team from this browser.`);

  if (!confirmed) {
    return;
  }

  if (supabaseReady && supabaseClient && supabaseUserId) {
    void deleteTeamFromSupabase(currentTeam.id).catch((error) => {
      console.error("[Supabase] delete failed", {
        teamId: currentTeam.id,
        error,
        message: error?.message || String(error),
      });
      setStatus(
        getSaveStatusElement(),
        `Supabase delete failed: ${describeSupabaseError(error)}`,
        true,
      );
    });
  }

  delete state.contactsByTeamId[state.activeTeamId];
  delete state.eventsByTeamId[state.activeTeamId];
  Object.keys(state.rsvpsByEventId || {}).forEach((eventId) => {
    const rsvpRows = state.rsvpsByEventId[eventId] || [];
    if (rsvpRows.some((row) => row.teamId === state.activeTeamId)) {
      delete state.rsvpsByEventId[eventId];
    }
  });
  Object.keys(state.aiDraftsByEventId || {}).forEach((eventId) => {
    const drafts = state.aiDraftsByEventId[eventId] || [];
    if (drafts.some((draft) => draft.teamId === state.activeTeamId)) {
      delete state.aiDraftsByEventId[eventId];
    }
  });
  state.selectedContactIds = [];
  state.selectedEventId = null;
  aiDraftState = {
    loading: false,
    draftId: null,
    data: null,
  };

  const remainingTeams = state.teams.filter((team) => team.id !== state.activeTeamId);

  if (remainingTeams.length === 0) {
    const playersOnField = 9;
    const sportType = "football";
    state.teams = [];
    state.activeTeamId = createTeamStorageId();
    state.config = normaliseConfig({
      sportType,
      teamName: "",
      playersOnField,
      players: [],
      formations: getSuggestedFormations(playersOnField, sportType).slice(0, 3),
      selectedFormation: getSuggestedFormations(playersOnField, sportType)[0],
    });
    state.players = [];
    state.lineup = buildLineup([], state.config.playersOnField, state.config.selectedFormation, state.config.sportType);
    state.contactsByTeamId = {};
    state.eventsByTeamId = {};
    state.rsvpsByEventId = {};
    state.aiDraftsByEventId = {};
    state.selectedEventId = null;
    state.selectedContactIds = [];
    state.selectedTarget = null;
    state.page = "config";
    formationDraft = [...state.config.formations];
    syncFormFromState();
    persistState();
    renderAll();
    setStatus(configStatus, `${label} deleted. A new blank team draft is ready.`, false);
    return;
  }

  state.teams = remainingTeams;
  const nextTeam = remainingTeams[0];
  const runtime = hydrateTeamRuntime(nextTeam);
  state.activeTeamId = nextTeam.id;
  state.config = runtime.config;
  state.players = runtime.players;
  state.lineup = runtime.lineup;
  state.selectedEventId = chooseNextSelectedEventId({
    currentSelectedEventId: null,
    activeTeamId: nextTeam.id,
    eventsByTeamId: state.eventsByTeamId,
  });
  state.selectedContactIds = [];
  state.selectedTarget = null;
  syncFormFromState();
  resetContactForm();
  resetEventForm();
  persistState();
  renderAll();
  setStatus(configStatus, `${label} deleted.`, false);
}

function persistState() {
  upsertCurrentTeam();
  console.info("[Supabase] persistState invoked", {
    userId: supabaseUserId,
    activeTeamId: state.activeTeamId,
    teamIds: state.teams.map((team) => team.id),
    selectedFormation: state.lineup?.formation || null,
  });
  persistCachedStateOnly();
  persistUserScopedState();
}

function persistCachedStateOnly() {
  const saved = {
    page: state.page,
    activeTeamId: state.activeTeamId,
    teams: state.teams,
    contactsByTeamId: state.contactsByTeamId,
    eventsByTeamId: state.eventsByTeamId,
    rsvpsByEventId: state.rsvpsByEventId,
    aiDraftsByEventId: state.aiDraftsByEventId,
    userSettings: state.userSettings,
    selectedEventId: state.selectedEventId,
    selectedContactIds: state.selectedContactIds,
  };

  localStorage.setItem(storageKey, JSON.stringify(saved));
}

function persistUserScopedState() {
  if (!supabaseUserId) {
    return;
  }

  const userState = {
    page: state.page,
    activeTeamId: state.activeTeamId,
    teams: state.teams,
    contactsByTeamId: state.contactsByTeamId,
    eventsByTeamId: state.eventsByTeamId,
    rsvpsByEventId: state.rsvpsByEventId,
    aiDraftsByEventId: state.aiDraftsByEventId,
    userSettings: state.userSettings,
    selectedEventId: state.selectedEventId,
    selectedContactIds: state.selectedContactIds,
    savedAt: Date.now(),
  };

  localStorage.setItem(getUserStateStorageKey(supabaseUserId), JSON.stringify(userState));
}

function loadUserScopedState(userId) {
  if (!userId) {
    return null;
  }

  try {
    const raw = localStorage.getItem(getUserStateStorageKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function getUserStateStorageKey(userId) {
  return `${userStateStoragePrefix}:${userId}`;
}

function getLatestRemoteTimestamp(rows) {
  return rows.reduce((latest, row) => {
    const candidate = Date.parse(row.updated_at || row.created_at || "");
    return Number.isFinite(candidate) ? Math.max(latest, candidate) : latest;
  }, 0);
}

async function saveActiveTeamNow() {
  if (saveNowInFlight) {
    return;
  }

  if (!supabaseUserId) {
    setStatus(getSaveStatusElement(), "Log in before saving to Supabase.", true);
    return;
  }

  const activeTeam = state.teams.find((team) => team.id === state.activeTeamId) || null;

  if (!activeTeam) {
    setStatus(getSaveStatusElement(), "There is no active team to save yet.", true);
    return;
  }

  saveNowInFlight = true;
  renderManagerControls();
  setStatus(getSaveStatusElement(), "Saving now...", false);

  try {
    await saveTeamRecordToSupabase(activeTeam, {
      statusElement: getSaveStatusElement(),
      pendingMessage: "Saving now...",
      successMessage: "Saved to Supabase.",
    });
    setStatus(getSaveStatusElement(), "Saved to Supabase.", false);
  } catch (error) {
    setStatus(
      getSaveStatusElement(),
      `Supabase save failed: ${describeSupabaseError(error)}`,
      true,
    );
  } finally {
    saveNowInFlight = false;
    renderManagerControls();
  }
}

async function saveTeamRecordToSupabase(teamRecord, options = {}) {
  const userId = supabaseUserId;
  const statusElement = options.statusElement || getSaveStatusElement();
  const pendingMessage = options.pendingMessage || "Saving now...";
  const successMessage = options.successMessage || "Saved to Supabase.";

  if (!userId) {
    const error = new Error("No logged-in Supabase user is available for saving.");
    console.warn("[Supabase] saveTeamRecordToSupabase skipped because no user is logged in", {
      userId,
      teamId: teamRecord?.id || null,
    });
    setStatus(statusElement, error.message, true);
    throw error;
  }

  if (!teamRecord) {
    const error = new Error("No active team is available for saving.");
    console.warn("[Supabase] saveTeamRecordToSupabase skipped because no team record exists", {
      userId,
    });
    setStatus(statusElement, error.message, true);
    throw error;
  }

  if (!supabaseProjectUrl || !supabaseAnonKey || !supabaseAccessToken) {
    const error = new Error("Supabase runtime config or session token is missing.");
    console.warn("[Supabase] saveTeamRecordToSupabase missing runtime config", {
      hasProjectUrl: Boolean(supabaseProjectUrl),
      hasAnonKey: Boolean(supabaseAnonKey),
      hasAccessToken: Boolean(supabaseAccessToken),
    });
    setStatus(statusElement, error.message, true);
    throw error;
  }

  const singleTeamPayload = mapTeamRecordToDatabaseRow(teamRecord, userId);
  setStatus(statusElement, pendingMessage, false);

  console.info("[Supabase] saving to Supabase", {
    table: `public.${teamsTableName}`,
    userId,
    teamId: singleTeamPayload.id,
    payload: singleTeamPayload,
  });

  console.info("[Supabase] before upsert", {
    table: "public.teams",
    userId,
    teamId: singleTeamPayload.id,
    payload: singleTeamPayload,
  });

  let response;
  let parsedBody = null;
  let rawBody = "";

  try {
    response = await fetch(`${supabaseProjectUrl}/rest/v1/teams?on_conflict=id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAccessToken}`,
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(singleTeamPayload),
    });

    rawBody = await response.text();
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (parseError) {
        parsedBody = rawBody;
      }
    }
  } catch (caughtError) {
    console.error("[Supabase] save threw before completion", {
      error: caughtError,
      message: caughtError?.message || String(caughtError),
      table: "public.teams",
      userId,
      teamId: singleTeamPayload.id,
      payload: singleTeamPayload,
    });
    setStatus(
      statusElement,
      `Supabase save failed: ${describeSupabaseError(caughtError)}`,
      true,
    );
    throw caughtError;
  }

  console.log("[Supabase] upsert completed", {
    table: "public.teams",
    userId,
    teamId: singleTeamPayload.id,
    status: response.status,
    ok: response.ok,
    data: parsedBody,
    error: response.ok ? null : parsedBody || rawBody || response.statusText,
  });

  if (!response.ok) {
    const errorMessage =
      parsedBody?.message ||
      parsedBody?.error_description ||
      parsedBody?.details ||
      rawBody ||
      response.statusText ||
      "Supabase save failed.";
    const error = new Error(errorMessage);
    console.error("[Supabase] upsert failed", {
      error,
      responseStatus: response.status,
      responseBody: parsedBody || rawBody || null,
      payload: singleTeamPayload,
    });
    setStatus(statusElement, `Supabase save failed: ${describeSupabaseError(error)}`, true);
    throw error;
  }

  console.info("[Supabase] Save complete", {
    userId,
    teamId: singleTeamPayload.id,
  });
  setStatus(statusElement, successMessage, false);
}

function getSaveStatusElement() {
  return state.page === "manage" ? exportStatus : configStatus;
}

async function deleteTeamFromSupabase(teamId) {
  if (!supabaseProjectUrl || !supabaseAnonKey || !supabaseAccessToken) {
    throw new Error("Supabase runtime config or session token is missing for team deletion.");
  }

  console.info("[Supabase] before delete", {
    table: "public.teams",
    userId: supabaseUserId,
    teamId,
  });

  const deleteUrl = new URL(`${supabaseProjectUrl}/rest/v1/teams`);
  deleteUrl.searchParams.set("id", `eq.${teamId}`);
  deleteUrl.searchParams.set("user_id", `eq.${supabaseUserId}`);

  let response;
  let responseText = "";
  let responseData = null;

  try {
    response = await fetch(deleteUrl.toString(), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    });

    responseText = await response.text();
    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        responseData = responseText;
      }
    }
  } catch (error) {
    console.error("[Supabase] delete failed", {
      teamId,
      error,
      message: error?.message || String(error),
    });
    throw error;
  }

  console.info("[Supabase] delete result", {
    table: "public.teams",
    userId: supabaseUserId,
    teamId,
    status: response.status,
    ok: response.ok,
    data: responseData,
    error: response.ok ? null : responseData || responseText || response.statusText,
  });

  if (!response.ok) {
    const error = new Error(
      responseData?.message ||
      responseData?.error_description ||
      responseData?.details ||
      responseText ||
      response.statusText ||
      "Supabase delete failed.",
    );
    throw error;
  }
}

async function saveRowToSupabase({ tableName, row, statusElement, pendingMessage, successMessage, label }) {
  if (!supabaseProjectUrl || !supabaseAnonKey || !supabaseAccessToken) {
    throw new Error("Supabase runtime config or session token is missing.");
  }

  setStatus(statusElement, pendingMessage, false);

  console.info(`[Supabase] before ${label} upsert`, {
    table: `public.${tableName}`,
    userId: supabaseUserId,
    row,
  });

  const response = await fetch(`${supabaseProjectUrl}/rest/v1/${tableName}?on_conflict=id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAccessToken}`,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(row),
  });

  const responseText = await response.text();
  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = responseText;
    }
  }

  console.info(`[Supabase] ${label} upsert result`, {
    table: `public.${tableName}`,
    userId: supabaseUserId,
    status: response.status,
    ok: response.ok,
    data: responseData,
  });

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
      responseData?.error_description ||
      responseData?.details ||
      responseText ||
      response.statusText ||
      `Supabase ${label} save failed.`,
    );
  }

  const savedRow = Array.isArray(responseData) ? responseData[0] : responseData;
  setStatus(statusElement, successMessage, false);
  return savedRow || row;
}

async function deleteRowFromSupabase({ tableName, rowId, statusElement, label }) {
  if (!supabaseProjectUrl || !supabaseAnonKey || !supabaseAccessToken) {
    throw new Error("Supabase runtime config or session token is missing.");
  }

  setStatus(statusElement, `Deleting ${label}...`, false);

  const deleteUrl = new URL(`${supabaseProjectUrl}/rest/v1/${tableName}`);
  deleteUrl.searchParams.set("id", `eq.${rowId}`);
  deleteUrl.searchParams.set("user_id", `eq.${supabaseUserId}`);

  const response = await fetch(deleteUrl.toString(), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAccessToken}`,
    },
  });

  const responseText = await response.text();
  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = responseText;
    }
  }

  console.info(`[Supabase] ${label} delete result`, {
    table: `public.${tableName}`,
    userId: supabaseUserId,
    rowId,
    status: response.status,
    ok: response.ok,
    data: responseData,
  });

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
      responseData?.error_description ||
      responseData?.details ||
      responseText ||
      response.statusText ||
      `Supabase ${label} delete failed.`,
    );
  }
}

async function logEventUpdate({ eventId, deliveryMethod, recipientCount, subject, messageText }) {
  try {
    await saveRowToSupabase({
      tableName: eventUpdateLogsTableName,
      row: {
        id: createTeamStorageId(),
        user_id: supabaseUserId,
        team_id: state.activeTeamId,
        event_id: eventId,
        delivery_method: deliveryMethod,
        recipient_count: recipientCount,
        subject: subject || null,
        message_text: messageText,
      },
      statusElement: messageStatus,
      pendingMessage: "Recording update...",
      successMessage: "Update logged.",
      label: "event update log",
    });
  } catch (error) {
    console.error("[Supabase] event update log failed", {
      error,
      message: error?.message || String(error),
    });
  }
}

function mapTeamRecordToDatabaseRow(team, userId) {
  return {
    id: team.id,
    user_id: userId,
    team_name: team.config.teamName || "Untitled team",
    sport_type: team.config.sportType || "football",
    players_on_field: team.config.playersOnField,
    players: team.config.players,
    formations: team.config.formations,
    selected_formation: team.lineup?.formation || team.config.selectedFormation,
    lineup: team.lineup || {
      formation: team.config.selectedFormation,
      slotAssignments: [],
      bench: [],
      absent: [],
    },
  };
}

function mapDatabaseTeamToRecord(row) {
  return {
    id: row.id,
    config: normaliseConfig({
      teamName: row.team_name,
      sportType: row.sport_type || "football",
      playersOnField: row.players_on_field,
      players: Array.isArray(row.players) ? row.players : [],
      formations: Array.isArray(row.formations) ? row.formations : [],
      selectedFormation: row.selected_formation,
    }),
    lineup: row.lineup || null,
  };
}

function mapDatabaseContactToRecord(row) {
  return {
    id: row.id,
    teamId: row.team_id,
    contactName: row.contact_name || "",
    email: row.email || "",
    phone: row.phone || "",
    role: row.role || "",
    linkedPlayers: Array.isArray(row.linked_players) ? row.linked_players : [],
    notes: row.notes || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function mapDatabaseEventToRecord(row) {
  return {
    id: row.id,
    teamId: row.team_id,
    eventTitle: row.event_title || "",
    eventType: row.event_type || "other",
    eventDate: row.event_date || "",
    startTime: row.start_time || row.event_time || "",
    endTime: row.end_time || "",
    location: row.location || "",
    notes: row.notes || "",
    status: row.status || "planned",
    repeatPattern: row.repeat_pattern || "once",
    repeatEndDate: row.repeat_end_date || "",
    repeatDayOfWeek: Number.isInteger(row.repeat_day_of_week) ? row.repeat_day_of_week : (typeof row.repeat_day_of_week === "number" ? row.repeat_day_of_week : null),
    seriesId: row.series_id || "",
    reminder3DayEnabled: row.reminder_3_day_enabled !== false,
    reminder1DayEnabled: row.reminder_1_day_enabled !== false,
    reminderSameDayEnabled: row.reminder_same_day_enabled !== false,
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function mapDatabaseAiDraftToRecord(row) {
  return {
    id: row.id,
    userId: row.user_id || "",
    teamId: row.team_id || "",
    eventId: row.event_id || "",
    rawPrompt: row.raw_prompt || "",
    draftJson: normaliseAiDraft(row.draft_json || {}),
    status: row.status || "draft",
    draftType: row.draft_type || "manual",
    reminderType: row.reminder_type || "",
    scheduledFor: row.scheduled_for || "",
    adminNotifiedAt: row.admin_notified_at || "",
    reviewedAt: row.reviewed_at || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function mapDatabaseUserSettingsToRecord(row) {
  if (!row || typeof row !== "object") {
    return { ...defaultUserSettings };
  }

  return {
    id: row.id || "",
    userId: row.user_id || "",
    defaultReminder3DayEnabled: row.default_reminder_3_day_enabled !== false,
    defaultReminder1DayEnabled: row.default_reminder_1_day_enabled !== false,
    defaultReminderSameDayEnabled: row.default_reminder_same_day_enabled !== false,
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function mapDatabaseRsvpToRecord(row) {
  return {
    id: row.id,
    userId: row.user_id,
    teamId: row.team_id,
    eventId: row.event_id,
    contactId: row.contact_id,
    contactName: row.contact_name || row.contact?.contact_name || "",
    email: row.contact_email || row.contact?.email || "",
    phone: row.contact_phone || row.contact?.phone || "",
    playerName: row.player_name || "",
    response: row.response || "no_response",
    responseNote: row.response_note || "",
    token: row.token || "",
    tokenExpiresAt: row.token_expires_at || "",
    respondedAt: row.responded_at || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
  };
}

function setStatus(element, message, isError) {
  element.textContent = message;
  element.classList.toggle("is-error", Boolean(isError));
}

function clearStatus(element) {
  element.textContent = "";
  element.classList.remove("is-error");
}

function readAppLinkState() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: params.get("page") || "",
    eventId: params.get("eventId") || "",
    draftId: params.get("draftId") || "",
    draftAction: params.get("draftAction") || "",
  };
}

function activateTeamForEventLink(eventId) {
  if (!eventId) {
    return false;
  }

  const teamId = Object.entries(state.eventsByTeamId || {}).find(([, rows]) =>
    Array.isArray(rows) && rows.some((eventRecord) => eventRecord?.id === eventId),
  )?.[0];

  if (!teamId) {
    return false;
  }

  if (teamId !== state.activeTeamId) {
    upsertCurrentTeam();
    const record = state.teams.find((team) => team.id === teamId);

    if (!record) {
      return false;
    }

    const runtime = hydrateTeamRuntime(record);
    state.activeTeamId = record.id;
    state.config = runtime.config;
    state.players = runtime.players;
    state.lineup = runtime.lineup;
    state.selectedContactIds = [];
    state.selectedTarget = null;
  }

  state.selectedEventId = eventId;
  return true;
}

async function applyAppLinkState() {
  if (!appLinkState.page && !appLinkState.eventId && !appLinkState.draftId) {
    return;
  }

  if (appLinkState.draftAction === "send") {
    state.page = "account";
  } else if (appLinkState.page && ["account", "config", "manage", "comms", "training"].includes(appLinkState.page)) {
    state.page = appLinkState.page;
  }

  if (appLinkState.eventId) {
    activateTeamForEventLink(appLinkState.eventId);
  }

  if (appLinkState.draftId && state.selectedEventId) {
    const linkedDraft = getEventDrafts(state.selectedEventId).find((draft) => draft.id === appLinkState.draftId);
    if (linkedDraft && linkedDraft.status === "pending_review") {
      if (appLinkState.draftAction === "send") {
        state.page = "account";
        quickReminderApprovalOpen = true;
        quickReminderApprovalDraftId = linkedDraft.id;
      } else {
        reminderComposerOpen = true;
        reminderComposerEventId = state.selectedEventId;
      }
    } else if (appLinkState.draftAction === "send") {
      state.page = "account";
      quickReminderApprovalOpen = false;
      quickReminderApprovalDraftId = "";
      setStatus(
        accountSettingsStatus,
        "That reminder draft is no longer available. Open the event in Events if you want to review it there.",
        true,
      );
    }
  }

  persistCachedStateOnly();
  if (supabaseUserId) {
    persistUserScopedState();
  }

  renderAll();

  if (appLinkState.draftAction === "dismiss" && appLinkState.draftId) {
    const targetDraft = getEventDrafts(state.selectedEventId).find((draft) => draft.id === appLinkState.draftId);
    if (targetDraft) {
      await dismissSelectedReminderDraft();
    }
  }

  clearAppLinkState();
}

function clearAppLinkState() {
  if (!window.history?.replaceState) {
    return;
  }

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete("page");
  nextUrl.searchParams.delete("eventId");
  nextUrl.searchParams.delete("draftId");
  nextUrl.searchParams.delete("draftAction");
  window.history.replaceState({}, "", nextUrl.toString());
  appLinkState.page = "";
  appLinkState.eventId = "";
  appLinkState.draftId = "";
  appLinkState.draftAction = "";
}

async function copyLineupImage() {
  clearStatus(exportStatus);

  if (!window.ClipboardItem || !navigator.clipboard?.write) {
    setStatus(exportStatus, "Clipboard image copy is not supported here. Use Download PNG instead.", true);
    return;
  }

  try {
    const blob = await createLineupBlob();
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    setStatus(exportStatus, "Lineup image copied to the clipboard.", false);
  } catch (error) {
    setStatus(exportStatus, "Unable to copy the image right now.", true);
  }
}

async function downloadLineupImage() {
  clearStatus(exportStatus);

  try {
    const blob = await createLineupBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(state.config.teamName || "team-board")}-${slugify(getLayoutDisplayLabel(state.config.sportType, state.lineup.formation, state.config.playersOnField))}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(exportStatus, "PNG downloaded.", false);
  } catch (error) {
    setStatus(exportStatus, "Unable to create the PNG right now.", true);
  }
}

async function createLineupBlob() {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 2000;
  const context = canvas.getContext("2d");

  drawExportBackground(context, canvas.width, canvas.height);
  drawExportPitch(context, canvas.width, canvas.height);
  drawExportHeader(context, canvas.width);
  drawExportPlayers(context, canvas.width, canvas.height);
  drawExportBench(context, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("PNG export failed"));
      }
    }, "image/png");
  });
}

function drawExportBackground(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#f6fbf4");
  gradient.addColorStop(1, "#dcebd8");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawExportHeader(context, width) {
  const sportType = state.config.sportType || "football";
  const layoutLabel = getLayoutDisplayLabel(sportType, state.lineup.formation, state.config.playersOnField);

  context.fillStyle = "#102315";
  context.font = "700 68px 'Space Grotesk', sans-serif";
  context.fillText(state.config.teamName || `${getSportDisplayName(sportType)} Team`, 92, 110);

  context.fillStyle = "#55705f";
  context.font = "600 32px 'Barlow', sans-serif";
  context.fillText(
    `${getSportDisplayName(sportType)} | ${layoutLabel} | ${state.config.playersOnField} on field`,
    92,
    158,
  );
}

function drawExportFootballField(context, width, pitchRect) {
  const pitchGradient = context.createLinearGradient(0, pitchRect.y, 0, pitchRect.y + pitchRect.height);
  pitchGradient.addColorStop(0, "#15733f");
  pitchGradient.addColorStop(1, "#1a874b");

  roundRect(context, pitchRect.x, pitchRect.y, pitchRect.width, pitchRect.height, pitchRect.radius);
  context.fillStyle = pitchGradient;
  context.fill();

  const stripeHeight = pitchRect.height / 10;
  for (let stripe = 0; stripe < 10; stripe += 1) {
    context.fillStyle = stripe % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
    context.fillRect(pitchRect.x, pitchRect.y + stripe * stripeHeight, pitchRect.width, stripeHeight);
  }

  context.strokeStyle = "rgba(255,255,255,0.94)";
  context.lineWidth = 8;
  roundRect(
    context,
    pitchRect.x + 24,
    pitchRect.y + 24,
    pitchRect.width - 48,
    pitchRect.height - 48,
    28,
  );
  context.stroke();

  context.beginPath();
  context.moveTo(pitchRect.x + 24, pitchRect.y + pitchRect.height / 2);
  context.lineTo(pitchRect.x + pitchRect.width - 24, pitchRect.y + pitchRect.height / 2);
  context.stroke();

  context.beginPath();
  context.arc(width / 2, pitchRect.y + pitchRect.height / 2, 92, 0, Math.PI * 2);
  context.stroke();

  drawBox(context, width / 2 - 250, pitchRect.y + 24, 500, 180, false);
  drawBox(context, width / 2 - 250, pitchRect.y + pitchRect.height - 204, 500, 180, true);
  drawBox(context, width / 2 - 120, pitchRect.y + 24, 240, 88, false);
  drawBox(context, width / 2 - 120, pitchRect.y + pitchRect.height - 112, 240, 88, true);

  drawSpot(context, width / 2, pitchRect.y + pitchRect.height / 2);
  drawSpot(context, width / 2, pitchRect.y + 210);
  drawSpot(context, width / 2, pitchRect.y + pitchRect.height - 210);
}

function drawExportRugbyField(context, width, pitchRect) {
  const pitchGradient = context.createLinearGradient(0, pitchRect.y, 0, pitchRect.y + pitchRect.height);
  pitchGradient.addColorStop(0, "#126544");
  pitchGradient.addColorStop(1, "#1e7d55");

  roundRect(context, pitchRect.x, pitchRect.y, pitchRect.width, pitchRect.height, pitchRect.radius);
  context.fillStyle = pitchGradient;
  context.fill();

  const stripeHeight = pitchRect.height / 12;
  for (let stripe = 0; stripe < 12; stripe += 1) {
    context.fillStyle = stripe % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
    context.fillRect(pitchRect.x, pitchRect.y + stripe * stripeHeight, pitchRect.width, stripeHeight);
  }

  context.strokeStyle = "rgba(255,255,255,0.94)";
  context.lineWidth = 8;
  roundRect(context, pitchRect.x + 24, pitchRect.y + 24, pitchRect.width - 48, pitchRect.height - 48, 28);
  context.stroke();

  const left = pitchRect.x + 24;
  const right = pitchRect.x + pitchRect.width - 24;
  const top = pitchRect.y + 24;
  const bottom = pitchRect.y + pitchRect.height - 24;
  const halfway = pitchRect.y + pitchRect.height / 2;
  const twentyTwo = pitchRect.height * 0.22;
  const five = pitchRect.height * 0.08;

  context.beginPath();
  context.moveTo(left, halfway);
  context.lineTo(right, halfway);
  context.moveTo(left, top + twentyTwo);
  context.lineTo(right, top + twentyTwo);
  context.moveTo(left, bottom - twentyTwo);
  context.lineTo(right, bottom - twentyTwo);
  context.moveTo(left, top + five);
  context.lineTo(right, top + five);
  context.moveTo(left, bottom - five);
  context.lineTo(right, bottom - five);
  context.stroke();
}

function drawExportCricketField(context, width, pitchRect) {
  roundRect(context, pitchRect.x, pitchRect.y, pitchRect.width, pitchRect.height, pitchRect.radius);
  context.fillStyle = "#1f6b47";
  context.fill();

  context.fillStyle = "rgba(255,255,255,0.08)";
  context.beginPath();
  context.ellipse(width / 2, pitchRect.y + pitchRect.height / 2, pitchRect.width * 0.42, pitchRect.height * 0.42, 0, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "rgba(255,255,255,0.92)";
  context.lineWidth = 8;
  context.beginPath();
  context.ellipse(width / 2, pitchRect.y + pitchRect.height / 2, pitchRect.width * 0.44, pitchRect.height * 0.44, 0, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = "#d4bf96";
  roundRect(context, width / 2 - 48, pitchRect.y + pitchRect.height * 0.28, 96, pitchRect.height * 0.44, 28);
  context.fill();

  context.strokeStyle = "rgba(255,255,255,0.92)";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(width / 2 - 110, pitchRect.y + pitchRect.height * 0.32);
  context.lineTo(width / 2 + 110, pitchRect.y + pitchRect.height * 0.32);
  context.moveTo(width / 2 - 110, pitchRect.y + pitchRect.height * 0.68);
  context.lineTo(width / 2 + 110, pitchRect.y + pitchRect.height * 0.68);
  context.stroke();
}

function drawExportSoftballField(context, width, pitchRect) {
  roundRect(context, pitchRect.x, pitchRect.y, pitchRect.width, pitchRect.height, pitchRect.radius);
  context.fillStyle = "#1f7148";
  context.fill();

  context.fillStyle = "#c9a36a";
  context.beginPath();
  context.moveTo(width / 2, pitchRect.y + pitchRect.height * 0.2);
  context.lineTo(pitchRect.x + pitchRect.width * 0.82, pitchRect.y + pitchRect.height * 0.54);
  context.lineTo(width / 2, pitchRect.y + pitchRect.height * 0.88);
  context.lineTo(pitchRect.x + pitchRect.width * 0.18, pitchRect.y + pitchRect.height * 0.54);
  context.closePath();
  context.fill();

  context.strokeStyle = "rgba(255,255,255,0.92)";
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(width / 2, pitchRect.y + pitchRect.height * 0.2);
  context.lineTo(pitchRect.x + pitchRect.width * 0.82, pitchRect.y + pitchRect.height * 0.54);
  context.lineTo(width / 2, pitchRect.y + pitchRect.height * 0.88);
  context.lineTo(pitchRect.x + pitchRect.width * 0.18, pitchRect.y + pitchRect.height * 0.54);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.arc(width / 2, pitchRect.y + pitchRect.height * 0.62, 52, 0, Math.PI * 2);
  context.stroke();
}

function drawExportPitch(context, width, height) {
  const pitchRect = {
    x: 90,
    y: 220,
    width: width - 180,
    height: 1360,
    radius: 42,
  };
  const sportType = state.config.sportType || "football";
  if (sportType === "rugby") {
    drawExportRugbyField(context, width, pitchRect);
  } else if (sportType === "cricket") {
    drawExportCricketField(context, width, pitchRect);
  } else if (sportType === "softball") {
    drawExportSoftballField(context, width, pitchRect);
  } else {
    drawExportFootballField(context, width, pitchRect);
  }
}

function drawExportPlayers(context, width) {
  const pitchRect = {
    x: 90,
    y: 220,
    width: width - 180,
    height: 1360,
  };

  state.lineup.slots.forEach((slot) => {
    if (!slot.occupantId) {
      return;
    }

    const player = findPlayer(slot.occupantId);
    const x = pitchRect.x + slot.x * pitchRect.width;
    const y = pitchRect.y + slot.y * pitchRect.height;
    const isGoalkeeper = state.config.sportType === "football" && slot.role === "GK";
    const cardWidth = isGoalkeeper ? 252 : 228;
    const cardHeight = isGoalkeeper ? 140 : 120;
    const cardX = x - cardWidth / 2;
    const cardY = y - cardHeight / 2;
    const cardRadius = isGoalkeeper ? 36 : 32;

    context.fillStyle = isGoalkeeper ? "#f2b84a" : "#ffffff";
    context.strokeStyle = isGoalkeeper ? "#9d6c10" : "#0f6a3b";
    context.lineWidth = 8;
    roundRect(context, cardX, cardY, cardWidth, cardHeight, cardRadius);
    context.fill();
    context.stroke();

    context.save();
    roundRect(context, cardX + 6, cardY + 6, cardWidth - 12, cardHeight - 12, Math.max(18, cardRadius - 6));
    context.clip();

    context.fillStyle = "#102315";
    drawFittedCardLabel(context, player.name, x, y - 10, cardWidth - 28, cardHeight - 30);
    context.fillStyle = "#55705f";
    context.font = "700 15px 'Barlow', sans-serif";
    context.textAlign = "center";
    context.fillText(slot.positionLabel.toUpperCase(), x, cardY + cardHeight - 18);
    context.restore();
  });
}

function drawExportBench(context, width, height) {
  const benchPlayers = state.lineup.benchIds.map((playerId) => findPlayer(playerId)).filter(Boolean);

  context.fillStyle = "#102315";
  context.font = "700 34px 'Space Grotesk', sans-serif";
  context.fillText("Bench", 92, 1675);

  if (benchPlayers.length === 0) {
    context.fillStyle = "#55705f";
    context.font = "600 26px 'Barlow', sans-serif";
    context.fillText("No players on the bench", 92, 1720);
    return;
  }

  const cardWidth = (width - 184 - 24) / 2;
  const cardHeight = 96;

  benchPlayers.forEach((player, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 92 + column * (cardWidth + 24);
    const y = 1700 + row * (cardHeight + 18);
    const absent = isPlayerAbsent(player.id);

    roundRect(context, x, y, cardWidth, cardHeight, 20);
    context.fillStyle = absent ? "#f4e6e1" : "#ffffff";
    context.fill();
    context.strokeStyle = absent ? "rgba(157,76,66,0.38)" : "rgba(16,35,21,0.12)";
    context.lineWidth = 2;
    context.stroke();

    if (absent) {
      roundRect(context, x + cardWidth - 152, y + 16, 124, 30, 15);
      context.fillStyle = "#c96b5d";
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = "700 16px 'Barlow', sans-serif";
      context.textAlign = "center";
      context.fillText("ABSENT", x + cardWidth - 90, y + 36);
      context.textAlign = "left";
    }

    context.fillStyle = "#102315";
    context.font = "700 26px 'Space Grotesk', sans-serif";
    drawCenteredText(
      context,
      player.name,
      x + cardWidth / 2,
      y + cardHeight / 2 + 2,
      cardWidth - 40,
      2,
      28,
    );
  });

  if (benchPlayers.length > 6) {
    context.fillStyle = "#55705f";
    context.font = "600 22px 'Barlow', sans-serif";
    context.fillText("Tip: use Download PNG for a full-size copy.", 92, height - 44);
  }
}

function drawBox(context, x, y, width, height, anchoredBottom) {
  context.beginPath();
  if (!anchoredBottom) {
    context.moveTo(x, y + height);
    context.lineTo(x, y);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height);
  } else {
    context.moveTo(x, y);
    context.lineTo(x, y + height);
    context.lineTo(x + width, y + height);
    context.lineTo(x + width, y);
  }
  context.stroke();
}

function drawSpot(context, x, y) {
  context.fillStyle = "rgba(255,255,255,0.94)";
  context.beginPath();
  context.arc(x, y, 7, 0, Math.PI * 2);
  context.fill();
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawFittedCardLabel(context, text, x, y, maxWidth, maxHeight) {
  const fontSizes = [28, 26, 24, 22, 20, 18, 16, 14];
  const maxLines = 2;

  for (const fontSize of fontSizes) {
    context.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
    const lineHeight = Math.max(16, fontSize + 2);
    const lines = measureWrappedLines(context, text, maxWidth);

    if (lines.length <= maxLines && lines.length * lineHeight <= maxHeight) {
      drawCenteredLines(context, lines, x, y, lineHeight);
      return;
    }
  }

  context.font = "700 14px 'Space Grotesk', sans-serif";
  const fallbackLines = measureWrappedLines(context, text, maxWidth);
  drawCenteredLines(context, fallbackLines.slice(0, maxLines), x, y, 16);
}

function measureWrappedLines(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (context.measureText(test).width <= maxWidth || !current) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}

function drawCenteredLines(context, lines, x, y, lineHeight) {
  lines.forEach((line, index) => {
    context.textAlign = "center";
    context.fillText(
      line,
      x,
      y + index * lineHeight - ((lines.length - 1) * lineHeight) / 2,
    );
  });

  context.textAlign = "left";
}

function drawCenteredText(context, text, x, y, maxWidth, maxLines, lineHeight) {
  const lines = measureWrappedLines(context, text, maxWidth).slice(0, maxLines);
  drawCenteredLines(context, lines, x, y, lineHeight);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}
