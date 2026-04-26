const formationLibrary = {
  5: ["2-1-1", "1-2-1", "1-1-2"],
  6: ["2-2-1", "3-1-1", "1-3-1"],
  7: ["2-3-1", "3-2-1", "2-2-2"],
  8: ["3-3-1", "2-3-2", "3-2-2"],
  9: ["3-4-1", "3-3-2", "2-5-1", "2-4-2"],
  10: ["3-4-2", "4-3-2", "3-3-3"],
  11: ["4-3-3", "4-4-2", "3-5-2", "4-2-3-1"],
};

const sampleConfig = {
  teamName: "Harbour United U12",
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
const configEndpoint = "/api/config";
const feedbackEndpoint = "/api/feedback";

const teamNameInput = document.querySelector("#teamName");
const playersOnFieldInput = document.querySelector("#playersOnField");
const playerNamesInput = document.querySelector("#playerNames");
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
const feedbackForm = document.querySelector("#feedbackForm");
const feedbackMessageInput = document.querySelector("#feedbackMessage");
const feedbackStatus = document.querySelector("#feedbackStatus");

const navAccount = document.querySelector("#navAccount");
const navConfig = document.querySelector("#navConfig");
const navManage = document.querySelector("#navManage");
const accountPage = document.querySelector("#accountPage");
const configPage = document.querySelector("#configPage");
const managePage = document.querySelector("#managePage");
const teamSwitcher = document.querySelector("#teamSwitcher");
const newTeamButton = document.querySelector("#newTeam");
const deleteTeamButton = document.querySelector("#deleteTeam");

const statPlayers = document.querySelector("#statPlayers");
const statOnField = document.querySelector("#statOnField");
const statFormationCount = document.querySelector("#statFormationCount");

const teamNameSummary = document.querySelector("#teamNameSummary");
const formationSelect = document.querySelector("#formationSelect");
const fillEmptyPositionsButton = document.querySelector("#fillEmptyPositions");
const resetLineupButton = document.querySelector("#resetLineup");
const copyImageButton = document.querySelector("#copyImage");
const exportStatus = document.querySelector("#exportStatus");
const selectionHint = document.querySelector("#selectionHint");
const sendSelectedToBenchButton = document.querySelector("#sendSelectedToBench");
const benchList = document.querySelector("#benchList");
const pitch = document.querySelector("#pitch");
const pitchTitle = document.querySelector("#pitchTitle");

let formationDraft = [];
let state = loadState();
let supabaseClient = null;
let supabaseReady = false;
let supabaseUserId = null;
let supabaseUserEmail = "";
let remoteSaveTimeout = null;
let remoteSaveQueue = Promise.resolve();
const deletedTeamIds = new Set();

bootstrapApp();

configForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveConfigFromForm();
});

playersOnFieldInput.addEventListener("change", () => {
  const playersOnField = Number(playersOnFieldInput.value);
  const validExisting = formationDraft.filter((formation) =>
    isValidFormation(formation, playersOnField),
  );
  formationDraft = validExisting.length > 0
    ? validExisting
    : getSuggestedFormations(playersOnField).slice(0, 3);
  renderFormationChoices();
});

addFormationButton.addEventListener("click", () => {
  const playersOnField = Number(playersOnFieldInput.value);
  const formation = normaliseFormation(customFormationInput.value);

  if (!formation) {
    setStatus(configStatus, "Enter a formation before adding it.", true);
    return;
  }

  if (!isValidFormation(formation, playersOnField)) {
    setStatus(
      configStatus,
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
  setStatus(configStatus, `${formation} added to your formation list.`, false);
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await signUpWithEmail();
});

loginButton.addEventListener("click", async () => {
  await signInWithEmail();
});

logoutButton.addEventListener("click", async () => {
  await signOutUser();
});

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await submitFeedback();
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
  const options = Array.from({ length: 7 }, (_, offset) => offset + 5)
    .map(
      (value) =>
        `<option value="${value}">${value} players</option>`,
    )
    .join("");

  playersOnFieldInput.innerHTML = options;
}

async function bootstrapApp() {
  initialisePlayersOnFieldOptions();
  syncFormFromState();
  renderAll();
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
  renderAuthState();

  if (!supabaseUserId) {
    console.info("[Supabase] No authenticated user session");
    state = createStateFromPersisted({
      page: "account",
      activeTeamId: null,
      teams: [],
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
  await hydrateStateFromSupabase();
  console.info("[Supabase] Initial sync complete", {
    teamCount: state.teams.length,
    activeTeamId: state.activeTeamId,
  });
}

function renderAuthState() {
  const isLoggedIn = Boolean(supabaseUserId);
  authGuestPanel.classList.toggle("hidden", isLoggedIn);
  authUserPanel.classList.toggle("hidden", !isLoggedIn);
  authUserEmail.textContent = supabaseUserEmail || "Signed in";
  teamSwitcher.disabled = !isLoggedIn;
  newTeamButton.disabled = !isLoggedIn;
  deleteTeamButton.disabled = !isLoggedIn || state.teams.length === 0;
}

async function hydrateStateFromSupabase() {
  console.info("[Supabase] Fetching teams");
  const teamsResult = await supabaseClient
    .from("teams")
    .select(
      "id, team_name, players_on_field, players, formations, selected_formation, lineup, created_at, updated_at",
    )
    .eq("user_id", supabaseUserId)
    .order("updated_at", { ascending: false });

  if (teamsResult.error) {
    console.error("[Supabase] Teams query failed", {
      error: teamsResult.error,
      message: teamsResult.error?.message || String(teamsResult.error),
      details: teamsResult.error?.details || null,
      hint: teamsResult.error?.hint || null,
      code: teamsResult.error?.code || null,
    });
    throw teamsResult.error;
  }

  const remoteTeams = (teamsResult.data || []).map(mapDatabaseTeamToRecord);
  const cachedState = loadState();

  if (remoteTeams.length === 0) {
    state = createStateFromPersisted({
      page: cachedState.page,
      activeTeamId: cachedState.activeTeamId,
      teams: [],
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
  });

  persistCachedStateOnly();
  syncFormFromState();
  renderAll();
  clearStatus(configStatus);
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

  setStatus(authStatus, "Saving your latest changes before logout...", false);

  try {
    await flushPendingRemoteSave();
  } catch (error) {
    console.error("[Supabase] Final save before logout failed", {
      error,
      message: error?.message || String(error),
    });
    setStatus(
      authStatus,
      "Your latest changes could not be saved yet. Please wait a moment and try logging out again.",
      true,
    );
    return;
  }

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

function describeSupabaseError(error) {
  const message = String(error?.message || error || "");

  if (message.includes("Invalid API key") || message.includes("JWT")) {
    return "Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct.";
  }

  if (message.includes("relation") || message.includes("column")) {
    return "The database schema does not match the app yet. Run the latest supabase-schema.sql in Supabase.";
  }

  if (message.includes("row-level security") || message.includes("permission denied")) {
    return "Supabase RLS is blocking this request. Update your policies to allow anon access for this public app.";
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
  const activeTeamId = teams.some((team) => team.id === saved.activeTeamId)
    ? saved.activeTeamId
    : (teams[0] || fallbackTeam).id;
  const activeTeam = teams.find((team) => team.id === activeTeamId) || fallbackTeam;
  const runtime = hydrateTeamRuntime(activeTeam);

  return {
    page: ["account", "config", "manage"].includes(saved.page) ? saved.page : "config",
    teams: teams.length > 0 ? teams : [fallbackTeam],
    activeTeamId: activeTeam.id,
    config: runtime.config,
    players: runtime.players,
    lineup: runtime.lineup,
    selectedTarget: null,
  };
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
    lineup: buildLineup(players, config.playersOnField, config.selectedFormation),
  };

  return applySavedLineup(runtime, teamRecord.lineup);
}

function applySavedLineup(runtime, savedLineup) {
  if (!savedLineup?.formation || !runtime.config.formations.includes(savedLineup.formation)) {
    return runtime;
  }

  runtime.lineup = buildLineup(runtime.players, runtime.config.playersOnField, savedLineup.formation);

  const availablePlayers = new Map(runtime.players.map((player) => [player.name, player.id]));
  const used = new Set();

  runtime.lineup.slots.forEach((slot, index) => {
    const playerName = savedLineup.slotAssignments?.[index];
    const playerId = availablePlayers.get(playerName);

    if (playerId && !used.has(playerId)) {
      slot.occupantId = playerId;
      used.add(playerId);
    } else {
      slot.occupantId = null;
    }
  });

  runtime.lineup.benchIds = [];
  (savedLineup.bench || []).forEach((name) => {
    const playerId = availablePlayers.get(name);

    if (playerId && !used.has(playerId)) {
      runtime.lineup.benchIds.push(playerId);
      used.add(playerId);
    }
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
  const playersOnField = Number(config.playersOnField) || 9;
  const players = Array.isArray(config.players) ? dedupeNames(config.players) : [];
  const formations = Array.from(
    new Set((config.formations || []).map(normaliseFormation)),
  ).filter((formation) => isValidFormation(formation, playersOnField));
  const safeFormations = formations.length > 0
    ? formations
    : getSuggestedFormations(playersOnField).slice(0, 1);

  return {
    ...config,
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

function buildLineup(players, playersOnField, formation) {
  const slots = buildFormationSlots(formation, playersOnField).map((slot) => ({
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
    slots,
    benchIds: players.slice(slots.length).map((player) => player.id),
  };
}

function syncFormFromState() {
  applyConfigToForm(state.config);
}

function applyConfigToForm(config) {
  teamNameInput.value = config.teamName;
  playersOnFieldInput.value = String(config.playersOnField);
  playerNamesInput.value = config.players.join("\n");
  formationDraft = [...config.formations];
  renderFormationChoices();
}

function renderFormationChoices() {
  const playersOnField = Number(playersOnFieldInput.value);
  const suggestions = getSuggestedFormations(playersOnField);
  const combined = Array.from(new Set([...formationDraft, ...suggestions]))
    .filter((formation) => isValidFormation(formation, playersOnField))
    .sort(compareFormationStrings);

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
  renderStats();
  renderManagerControls();
  renderBench();
  renderPitch();
}

function renderTeamSwitcher() {
  teamSwitcher.innerHTML = state.teams
    .map((team) => {
      const selected = team.id === state.activeTeamId ? "selected" : "";
      const label = team.config.teamName || "Untitled team";
      return `<option value="${team.id}" ${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");

  deleteTeamButton.disabled = !supabaseUserId || state.teams.length === 0;
}

function renderPage() {
  const accountActive = state.page === "account";
  const configActive = state.page === "config";
  const manageActive = state.page === "manage";

  accountPage.classList.toggle("hidden", !accountActive);
  configPage.classList.toggle("hidden", !configActive);
  managePage.classList.toggle("hidden", !manageActive);
  navAccount.classList.toggle("is-active", accountActive);
  navConfig.classList.toggle("is-active", configActive);
  navManage.classList.toggle("is-active", manageActive);
}

function renderStats() {
  statPlayers.textContent = String(state.players.length);
  statOnField.textContent = String(state.config.playersOnField);
  statFormationCount.textContent = String(state.config.formations.length);
}

function renderManagerControls() {
  teamNameSummary.textContent = state.config.teamName || "Untitled team";
  pitchTitle.textContent = `${state.config.teamName || "Football"} | ${state.lineup.formation}`;
  selectionHint.textContent = state.selectedTarget
    ? describeSelection(state.selectedTarget)
    : "Select a player on the field or bench, then select another player or an empty position.";

  formationSelect.innerHTML = state.config.formations
    .map(
      (formation) =>
        `<option value="${formation}" ${formation === state.lineup.formation ? "selected" : ""}>${formation}</option>`,
    )
    .join("");
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
          class="bench-player ${isSelected("bench", index) ? "is-selected" : ""}"
          type="button"
          draggable="true"
          data-target-type="bench"
          data-target-index="${index}"
        >
          <span class="player-name">${escapeHtml(player.name)}</span>
          <span class="player-meta">Bench player</span>
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

function renderPitch() {
  const markings = `
    <div class="pitch-circle" aria-hidden="true"></div>
    <div class="pitch-box top-box" aria-hidden="true"></div>
    <div class="pitch-box bottom-box" aria-hidden="true"></div>
    <div class="pitch-goal-box top-goal-box" aria-hidden="true"></div>
    <div class="pitch-goal-box bottom-goal-box" aria-hidden="true"></div>
    <div class="pitch-centre-spot" aria-hidden="true"></div>
    <div class="pitch-penalty-spot top-spot" aria-hidden="true"></div>
    <div class="pitch-penalty-spot bottom-spot" aria-hidden="true"></div>
  `;

  const slotMarkup = state.lineup.slots
    .map((slot, index) => {
      const player = slot.occupantId ? findPlayer(slot.occupantId) : null;
      const isGoalkeeper = slot.role === "GK";
      const selectedClass = isSelected("slot", index) ? "is-selected" : "";
      const emptyClass = player ? "" : "empty";

      return `
        <div
          class="slot"
          style="left: ${slot.x * 100}%; top: ${slot.y * 100}%"
        >
          <div class="slot-role">${escapeHtml(slot.roleLabel)}</div>
          <button
            class="player-token ${isGoalkeeper ? "goalkeeper" : ""} ${selectedClass} ${emptyClass}"
            type="button"
            draggable="${player ? "true" : "false"}"
            data-target-type="slot"
            data-target-index="${index}"
            data-empty="${player ? "false" : "true"}"
          >
            <span class="player-name">${player ? escapeHtml(player.name) : "Open Slot"}</span>
            <span class="player-meta">${player ? escapeHtml(slot.positionLabel) : "Tap to place"}</span>
          </button>
        </div>
      `;
    })
    .join("");

  pitch.innerHTML = markings + slotMarkup;
}

function saveConfigFromForm() {
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
  const nextRuntime = hydrateTeamRuntime({
    id: existingId || createTeamStorageId(),
    config: config.value,
    lineup: existingId === state.activeTeamId ? createLineupSnapshot(state) : null,
  });

  state.config = nextRuntime.config;
  state.players = nextRuntime.players;
  state.lineup = nextRuntime.lineup;
  state.activeTeamId = existingId || createTeamStorageId();
  upsertCurrentTeam();
  state.page = "manage";
  state.selectedTarget = null;
  persistState();
  setStatus(configStatus, "Team setup saved.", false);
  renderAll();
}

function buildConfigFromForm() {
  const teamName = teamNameInput.value.trim();
  const playersOnField = Number(playersOnFieldInput.value);
  const players = dedupeNames(parsePlayerNames(playerNamesInput.value));
  const formations = formationDraft.filter((formation) =>
    isValidFormation(formation, playersOnField),
  );

  if (!teamName) {
    return { ok: false, message: "Add a team name first." };
  }

  if (players.length < playersOnField) {
    return {
      ok: false,
      message: `You need at least ${playersOnField} players to fill the field.`,
    };
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

function getSuggestedFormations(playersOnField) {
  return formationLibrary[playersOnField] || [];
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

function isValidFormation(formation, playersOnField) {
  const parts = formation
    .split("-")
    .map((part) => Number(part))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (parts.length === 0) {
    return false;
  }

  return parts.reduce((sum, value) => sum + value, 0) === playersOnField - 1;
}

function buildFormationSlots(formation, playersOnField) {
  if (!isValidFormation(formation, playersOnField)) {
    return buildFormationSlots(getSuggestedFormations(playersOnField)[0], playersOnField);
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
    if (!slot.occupantId && state.lineup.benchIds.length > 0) {
      slot.occupantId = state.lineup.benchIds.shift();
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
  state.lineup = buildLineup(state.players, state.config.playersOnField, state.lineup.formation);
  state.selectedTarget = null;
  persistState();
  setStatus(exportStatus, "Lineup reset to squad order.", false);
  renderAll();
}

function setFormation(formation) {
  if (!state.config.formations.includes(formation)) {
    return;
  }

  const orderedPlayers = [
    ...state.lineup.slots.map((slot) => slot.occupantId).filter(Boolean),
    ...state.lineup.benchIds,
  ];
  const freshSlots = buildFormationSlots(formation, state.config.playersOnField).map((slot, index) => ({
    ...slot,
    occupantId: orderedPlayers[index] || null,
  }));

  state.lineup = {
    formation,
    slots: freshSlots,
    benchIds: orderedPlayers.slice(freshSlots.length),
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

  return player
    ? `${player.name} selected. Choose another player or an open spot to move them.`
    : "Select a player on the field or bench, then select another player or an empty position.";
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
  state.selectedTarget = null;
  persistState();
  syncFormFromState();
  renderAll();
}

function createNewTeamDraft() {
  if (!supabaseUserId) {
    setStatus(configStatus, "Log in before creating teams.", true);
    return;
  }

  upsertCurrentTeam();
  const playersOnField = Number(playersOnFieldInput.value) || 9;
  const blankConfig = {
    teamName: "",
    playersOnField,
    players: [],
    formations: getSuggestedFormations(playersOnField).slice(0, 3),
    selectedFormation: getSuggestedFormations(playersOnField)[0],
  };

  state.activeTeamId = createTeamStorageId();
  state.config = normaliseConfig(blankConfig);
  state.players = [];
  state.lineup = buildLineup([], state.config.playersOnField, state.config.selectedFormation);
  state.selectedTarget = null;
  state.page = "config";
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

  deletedTeamIds.add(currentTeam.id);

  const remainingTeams = state.teams.filter((team) => team.id !== state.activeTeamId);

  if (remainingTeams.length === 0) {
    const playersOnField = 9;
    state.teams = [];
    state.activeTeamId = createTeamStorageId();
    state.config = normaliseConfig({
      teamName: "",
      playersOnField,
      players: [],
      formations: getSuggestedFormations(playersOnField).slice(0, 3),
      selectedFormation: getSuggestedFormations(playersOnField)[0],
    });
    state.players = [];
    state.lineup = buildLineup([], state.config.playersOnField, state.config.selectedFormation);
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
  state.selectedTarget = null;
  syncFormFromState();
  persistState();
  renderAll();
  setStatus(configStatus, `${label} deleted.`, false);
}

function persistState() {
  upsertCurrentTeam();
  persistCachedStateOnly();
  queueRemoteSave();
}

function persistCachedStateOnly() {
  const saved = {
    page: state.page,
    activeTeamId: state.activeTeamId,
    teams: state.teams,
  };

  localStorage.setItem(storageKey, JSON.stringify(saved));
}

function queueRemoteSave() {
  if (!supabaseReady || !supabaseClient || !supabaseUserId) {
    return;
  }

  window.clearTimeout(remoteSaveTimeout);
  remoteSaveTimeout = window.setTimeout(() => {
    const snapshot = buildRemoteSaveSnapshot();
    remoteSaveQueue = remoteSaveQueue
      .then(() => saveStateToSupabase(snapshot))
      .catch(() => {
        setStatus(
          configStatus,
          "The latest change is still saved locally, but Supabase sync hit an error.",
          true,
        );
      });
  }, 250);
}

function buildRemoteSaveSnapshot() {
  return {
    userId: supabaseUserId,
    teamRows: state.teams.map(mapTeamRecordToDatabaseRow),
    deletedTeamIds: Array.from(deletedTeamIds),
    activeTeamId: state.activeTeamId,
  };
}

async function flushPendingRemoteSave() {
  if (!supabaseReady || !supabaseClient || !supabaseUserId) {
    return;
  }

  window.clearTimeout(remoteSaveTimeout);
  remoteSaveTimeout = null;
  const snapshot = buildRemoteSaveSnapshot();
  remoteSaveQueue = remoteSaveQueue.then(() => saveStateToSupabase(snapshot));
  await remoteSaveQueue;
}

async function saveStateToSupabase(snapshot = buildRemoteSaveSnapshot()) {
  if (!snapshot.userId) {
    return;
  }

  const { teamRows, deletedTeamIds: pendingDeletes, activeTeamId } = snapshot;
  console.info("[Supabase] Saving state", {
    teamCount: teamRows.length,
    deletedTeamCount: pendingDeletes.length,
    activeTeamId,
    userId: snapshot.userId,
  });

  if (teamRows.length > 0) {
    const { error: upsertError } = await supabaseClient
      .from("teams")
      .upsert(teamRows, { onConflict: "id" });

    if (upsertError) {
      console.error("[Supabase] Team upsert failed", {
        error: upsertError,
        message: upsertError?.message || String(upsertError),
        details: upsertError?.details || null,
        hint: upsertError?.hint || null,
        code: upsertError?.code || null,
      });
      throw upsertError;
    }
  }

  if (pendingDeletes.length > 0) {
    for (const teamId of pendingDeletes) {
      const { error: deleteError } = await supabaseClient
        .from("teams")
        .delete()
        .eq("id", teamId);

      if (deleteError) {
        console.error("[Supabase] Team delete failed", {
          teamId,
          error: deleteError,
          message: deleteError?.message || String(deleteError),
          details: deleteError?.details || null,
          hint: deleteError?.hint || null,
          code: deleteError?.code || null,
        });
        throw deleteError;
      }

      deletedTeamIds.delete(teamId);
    }
  }

  console.info("[Supabase] Save complete");
  clearStatus(configStatus);
}

function mapTeamRecordToDatabaseRow(team) {
  return {
    id: team.id,
    user_id: supabaseUserId,
    team_name: team.config.teamName || "Untitled team",
    players_on_field: team.config.playersOnField,
    players: team.config.players,
    formations: team.config.formations,
    selected_formation: team.lineup?.formation || team.config.selectedFormation,
    lineup: team.lineup || {
      formation: team.config.selectedFormation,
      slotAssignments: [],
      bench: [],
    },
  };
}

function mapDatabaseTeamToRecord(row) {
  return {
    id: row.id,
    config: normaliseConfig({
      teamName: row.team_name,
      playersOnField: row.players_on_field,
      players: Array.isArray(row.players) ? row.players : [],
      formations: Array.isArray(row.formations) ? row.formations : [],
      selectedFormation: row.selected_formation,
    }),
    lineup: row.lineup || null,
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
    link.download = `${slugify(state.config.teamName || "team-board")}-${state.lineup.formation}.png`;
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
  context.fillStyle = "#102315";
  context.font = "700 68px 'Space Grotesk', sans-serif";
  context.fillText(state.config.teamName || "Football Team", 92, 110);

  context.fillStyle = "#55705f";
  context.font = "600 32px 'Barlow', sans-serif";
  context.fillText(
    `${state.lineup.formation} formation | ${state.config.playersOnField} on field`,
    92,
    158,
  );
}

function drawExportPitch(context, width, height) {
  const pitchRect = {
    x: 90,
    y: 220,
    width: width - 180,
    height: 1360,
    radius: 42,
  };

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
    const radius = slot.role === "GK" ? 64 : 58;

    context.fillStyle = slot.role === "GK" ? "#f2b84a" : "#ffffff";
    context.strokeStyle = slot.role === "GK" ? "#9d6c10" : "#0f6a3b";
    context.lineWidth = 8;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.fillStyle = "#102315";
    context.font = "700 24px 'Space Grotesk', sans-serif";
    drawCenteredText(context, player.name, x, y - 8, radius * 1.5, 2, 28);
    context.fillStyle = "#55705f";
    context.font = "700 16px 'Barlow', sans-serif";
    context.textAlign = "center";
    context.fillText(slot.positionLabel.toUpperCase(), x, y + 34);
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
  const cardHeight = 92;

  benchPlayers.forEach((player, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 92 + column * (cardWidth + 24);
    const y = 1700 + row * (cardHeight + 18);

    roundRect(context, x, y, cardWidth, cardHeight, 20);
    context.fillStyle = "#ffffff";
    context.fill();
    context.strokeStyle = "rgba(16,35,21,0.12)";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "#102315";
    context.font = "700 28px 'Space Grotesk', sans-serif";
    context.fillText(player.name, x + 24, y + 38);
    context.fillStyle = "#55705f";
    context.font = "600 20px 'Barlow', sans-serif";
    context.fillText("Bench player", x + 24, y + 68);
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

function drawCenteredText(context, text, x, y, maxWidth, maxLines, lineHeight) {
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

  lines.slice(0, maxLines).forEach((line, index) => {
    context.textAlign = "center";
    context.fillText(
      line,
      x,
      y + index * lineHeight - ((Math.min(lines.length, maxLines) - 1) * lineHeight) / 2,
    );
  });

  context.textAlign = "left";
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
