# RPG Companion - Auto Image Generation Feature Changelog

## Core Changes

- **`src/core/state.js`**:
  - Added new properties to the `extensionSettings` object to manage the auto image generation feature. This includes settings for enabling the feature, storing the main prompt, custom physical descriptions, user rules, image insertion mode, and the prompt tag regex.

- **`template.html`**:
  - Added a new section to the "Advanced" settings group in the settings modal (`#rpg-settings-popup`).
  - This new section, with the ID `rpg-auto-image-generation-settings`, contains all the UI elements for the auto image generation feature, including the enable/disable toggle, textareas for prompts and rules, a dropdown for insertion mode, and an input for the regex.
  - The main prompt textarea is set to be read-only by default, with an "Edit" button to unlock it.

- **`index.js`**:
  - Implemented the `updateAutoImageGenerationVisibility` function to conditionally display the new settings section based on the "Generation Mode" and "Use model connected to RPG Companion Trackers preset" settings.
  - Added event listeners for all the new UI elements to update the `extensionSettings` object and save the changes.
  - Implemented the "Edit" button functionality to toggle the `readonly` state of the main prompt textarea.
  - Ensured that the initial state of the UI is set correctly when the extension is loaded.

- **`src/systems/generation/promptBuilder.js`**:
  - Modified the `generateSeparateUpdatePrompt` function to append the image generation prompt to the tracker prompt when the auto image generation feature is enabled.
  - The custom physical description and user rules are inserted into the main prompt.

- **`src/systems/generation/apiClient.js`**:
  - Imported `appendMediaToMessage` and `updateChat` from `script.js` and `addDebugLog` from `state.js`.
  - Modified the `updateRPGData` function to parse the response from the separate API call and extract the image prompt using the user-defined regex.
  - Added the `handleImageGeneration` function to trigger the `/sd` command with the extracted prompt and handle the image insertion based on the user's settings.
  - If no image prompt is found in the response, a debug message is logged.
  - The "Create New Message" option creates a new chat message with the generated image.
  - The "Insert Inline (Last Message)" option inserts the image into the last assistant message.
