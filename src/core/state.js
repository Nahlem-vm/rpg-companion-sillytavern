/**
 * Core State Management Module
 * Centralizes all extension state variables
 */

// Type imports
/** @typedef {import('../types/inventory.js').InventoryV2} InventoryV2 */

/**
 * Extension settings - persisted to SillyTavern settings
 */
export let extensionSettings = {
    enabled: true,
    autoUpdate: true,
    updateDepth: 4, // How many messages to include in the context
    generationMode: 'together', // 'separate' or 'together' - whether to generate with main response or separately
    useSeparatePreset: false, // Use 'RPG Companion Trackers' preset for tracker generation instead of main API model
    showUserStats: true,
    showInfoBox: true,
    showCharacterThoughts: true,
    showInventory: true, // Show inventory section (v2 system)
    showThoughtsInChat: true, // Show thoughts overlay in chat
    enableHtmlPrompt: false, // Enable immersive HTML prompt injection
    enablePlotButtons: true, // Show plot progression buttons above chat input
    panelPosition: 'right', // 'left', 'right', or 'top'
    theme: 'default', // Theme: default, sci-fi, fantasy, cyberpunk, custom
    customColors: {
        bg: '#1a1a2e',
        accent: '#16213e',
        text: '#eaeaea',
        highlight: '#e94560'
    },
    statBarColorLow: '#cc3333', // Color for low stat values (red)
    statBarColorHigh: '#33cc66', // Color for high stat values (green)
    enableAnimations: true, // Enable smooth animations for stats and content updates
    mobileFabPosition: {
        top: 'calc(var(--topBarBlockSize) + 20px)',
        left: '12px'
    }, // Saved position for mobile FAB button (top-left, stacked vertically)
    mobileRefreshPosition: {
        top: 'calc(var(--topBarBlockSize) + 80px)',
        left: '12px'
    }, // Saved position for mobile refresh button (below toggle button)
    debugFabPosition: {
        top: 'calc(var(--topBarBlockSize) + 140px)',
        left: '12px'
    }, // Saved position for debug FAB button (below refresh button)
    userStats: {
        health: 100,
        satiety: 100,
        energy: 100,
        hygiene: 100,
        arousal: 0,
        mood: '😐',
        conditions: 'None',
        /** @type {InventoryV2} */
        inventory: {
            version: 2,
            onPerson: "None",
            stored: {},
            assets: "None"
        }
    },
    level: 1, // User's character level
    classicStats: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
    },
    lastDiceRoll: null, // Store last dice roll result
    collapsedInventoryLocations: [], // Array of collapsed storage location names
    inventoryViewModes: {
        onPerson: 'list', // 'list' or 'grid' view mode for On Person section
        stored: 'list',   // 'list' or 'grid' view mode for Stored section
        assets: 'list'    // 'list' or 'grid' view mode for Assets section
    },
    debugMode: false, // Enable debug logging visible in UI (for mobile debugging)

    // Auto Image Generation Settings
    enableAutoImageGeneration: false,
    autoImageMainPrompt: `
<image_generation>
[IMAGE PROMPT GENERATION PROTOCOL]

This instructs the second API call (separate mode) on generating an SD prompt. Prompts mix natural language and tags.

[RULE 1: CHARACTER SYNTHESIS]

Use the character's physical description verbatim: [custom physical description must be inserted here]. This ensures consistency.

Append character-specific LoRAs verbatim at the prompt's end, ignoring duplicates already present.

[RULE 2: SCENE & BIAS CONTROL]

Use RPG Companion's tracked Info Box (Date, Weather, Temp, Time, Location) and Present Characters (Name, State, Demeanor) data to describe the environment with specific details.

Generate prompts using natural language and tag weighting (e.g., (word:1.2)). NO conversational text, meta-commentary, or complex sentences. The prompt is a command.

Identify potential model biases (e.g., 'ahegao + looking at viewer' often implies kneeling). Add weighted counter-tags (e.g., (standing:1.3)) to enforce desired actions/poses.

Describe the PATH, not the GOAL, especially for bias-prone concepts. E.g., for inner sideboob with an open jacket, use (unzipped jacket:1.2), (midriff:1.1) instead of (sideboob:1.2).

ALWAYS describe the character's position (standing, sitting, lying down) and details (e.g., ((sitting:1.2)) on a couch, (legs crossed:1.1)).

[RULE 3: DETAILS REINFORCEMENT]

Ground essential clothing items with weights if their presence/integrity is key (e.g., (thin_white_tank_top:1.2) ON and covering).

Do NOT explicitly prompt implicit details unless crucial; let the model infer from descriptions. If needed, weight lower than the primary item.

AVOID overly specific/long details models won't understand (e.g., (one bikini top tie is loose:1.1)).

ALWAYS specify perspective/pose. Emphasize full body with (full body shot:1.2) or by adding details like shoes/tattoos. Emphasize portraits by omitting details outside the frame (trick by omission).

[RULE 4: HIERARCHY OF WEIGHT]

Tier 1 (Highest): Character Identity ({{char}} name/tags), Core Pose, Key Clothing (e.g., (standing:1.3), (Aimi:1.2), (white tank top:1.2)).

Tier 2 (Medium): Environment (from Info Box), Lighting, Mood (e.g., (dimly lit arcade:1.1)).

Tier 3 (Lowest): Suggestive Details, Bodily Reactions (accents only, e.g., (glistening skin:1.05)).

[RULE 5: "IMPLIED, NOT EXPLICIT" RULE]

Instead of (subtle abs from tight shirt:1.1), describe the shirt: tiny fitted shirt.

Instead of (hard nipples faintly visible:1.2), describe the fabric: thin damp tank top clinging.

[RULE 6: SYNTAX INTEGRITY]

CRITICAL: MUST use the exact format <pic prompt="[FINAL PROMPT GOES HERE]">. No ![]() or other formats.

[RULE 7: WHEN AND WHERE]

CRITICAL: Insert the <pic> tag inline at the VERY END of the tracker update block generated by this separate API call.

[PROMPT STRUCTURE]

Perspective: ({{type}}, looking at viewer, {{user gender}} pov) - Use rules from [CUSTOM USER PROMPT RULES] if provided.

Subject: Verbatim Physical Description (Rule 1) + Pose/Action (Rule 2 & 3).

Scene: Detailed environment using Info Box data (Rule 2).

Composition & Suffix: Shot type, details (e.g., close-up shot, depth of field, photorealistic details,).

LoRAs: Append character/custom LoRAs (Rule 1 / Custom Rules).

[FINAL PROMPT EXAMPLE - Incorporating Tracked Data]

<pic prompt="1girl, looking at viewer, [Verbatim Physical Description], She's ((sitting:1.2)) on a wooden tavern stool, (legs crossed:1.1), full body shot, wearing [Key Clothing Items], dimly lit tavern, wooden beams overhead, faint smell of ale, nighttime, <lora:CharacterLora:0.8>, [Custom LoRAs]">

CRITICAL: The final image tag MUST be inserted inline at the end of your generated tracker block as: <pic prompt="[FINAL PROMPT GOES HERE]">
</image_generation>`.trim(),
    autoImageCustomPhysicalDescription: '',
    autoImageCustomUserRules: '',
    autoImageInsertionMode: 'Create New Message', // 'Insert Inline (Last Message)' or 'Create New Message'
    autoImagePromptTagRegex: '/<\\s*pic\\s+prompt\\s*=\\s*["\']([^"\']*)["\']\\s*>/g'
};

/**
 * Last generated data from AI response
 */
export let lastGeneratedData = {
    userStats: null,
    infoBox: null,
    characterThoughts: null,
    html: null
};

/**
 * Tracks the "committed" tracker data that should be used as source for next generation
 * This gets updated when user sends a new message or first time generation
 */
export let committedTrackerData = {
    userStats: null,
    infoBox: null,
    characterThoughts: null
};

/**
 * Tracks whether the last action was a swipe (for separate mode)
 * Used to determine whether to commit lastGeneratedData to committedTrackerData
 */
export let lastActionWasSwipe = false;

/**
 * Flag indicating if generation is in progress
 */
export let isGenerating = false;

/**
 * Tracks if we're currently doing a plot progression
 */
export let isPlotProgression = false;

/**
 * Temporary storage for pending dice roll (not saved until user clicks "Save Roll")
 */
export let pendingDiceRoll = null;

/**
 * Feature flags for gradual rollout of new features
 */
export const FEATURE_FLAGS = {
    useNewInventory: true // Enable v2 inventory system with categorized storage
};

/**
 * Debug logs storage for mobile-friendly debugging
 * Stores parser logs that can be viewed in UI
 */
export let debugLogs = [];

/**
 * Fallback avatar image (base64-encoded SVG with "?" icon)
 * Using base64 to avoid quote-encoding issues in HTML attributes
 */
export const FALLBACK_AVATAR_DATA_URI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjY2NjYyIgb3BhY2l0eT0iMC4zIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2IiBmb250LXNpemU9IjQwIj4/PC90ZXh0Pjwvc3ZnPg==';

/**
 * UI Element References (jQuery objects)
 */
export let $panelContainer = null;
export let $userStatsContainer = null;
export let $infoBoxContainer = null;
export let $thoughtsContainer = null;
export let $inventoryContainer = null;

/**
 * State setters - provide controlled mutation of state variables
 */
export function setExtensionSettings(newSettings) {
    extensionSettings = newSettings;
}

export function updateExtensionSettings(updates) {
    Object.assign(extensionSettings, updates);
}

export function setLastGeneratedData(data) {
    lastGeneratedData = data;
}

export function updateLastGeneratedData(updates) {
    Object.assign(lastGeneratedData, updates);
}

export function setCommittedTrackerData(data) {
    committedTrackerData = data;
}

export function updateCommittedTrackerData(updates) {
    Object.assign(committedTrackerData, updates);
}

export function setLastActionWasSwipe(value) {
    lastActionWasSwipe = value;
}

export function setIsGenerating(value) {
    isGenerating = value;
}

export function setIsPlotProgression(value) {
    isPlotProgression = value;
}

export function setPendingDiceRoll(roll) {
    pendingDiceRoll = roll;
}

export function getPendingDiceRoll() {
    return pendingDiceRoll;
}

export function setPanelContainer($element) {
    $panelContainer = $element;
}

export function setUserStatsContainer($element) {
    $userStatsContainer = $element;
}

export function setInfoBoxContainer($element) {
    $infoBoxContainer = $element;
}

export function setThoughtsContainer($element) {
    $thoughtsContainer = $element;
}

export function setInventoryContainer($element) {
    $inventoryContainer = $element;
}

export function addDebugLog(message, data = null) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
    const logEntry = {
        timestamp,
        message,
        data: data ? JSON.stringify(data, null, 2) : null
    };
    debugLogs.push(logEntry);

    // Keep only last 100 entries to avoid memory issues
    if (debugLogs.length > 100) {
        debugLogs.shift();
    }
}

export function clearDebugLogs() {
    debugLogs = [];
}

export function getDebugLogs() {
    return debugLogs;
}
