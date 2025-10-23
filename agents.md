# Image Auto-Generation Feature

## Purpose

The Image Auto-Generation feature is designed to automatically create and insert image prompts into the chat through a pic tag '<pic prompt="[prompt here]">'

## How It Works

1. This feature is specifically designed to work only when the **Generation Mode** is set to **"Separate Generation"**.
2. The user inputs a prompt specifying their rules on how the LLM needs to structure the prompt
3. The user inputs the character or character physical descriptions
4. The extension appends this information with the rpg-companion preset prompt
5. The LLM returns with a response, the trackers are updated with the rpg-companion and the image prompt is inserted within the pic tag inline with the last reply

The process is as follows:

1.  **Triggering the Feature**: The image generation process is triggered within the same trigger for the rpg-companion-extension trackers. The feature takes the custom prompt and physical description for image generation prompt structure that the user have configured in the settings and combines with the tracker prompt of the extension. 
2.  **Prompt Creation & LLM Generation**: This combined text is sent to the LLM, isolated API call (that's how the extension works in separate mode right now). The LLM then generates a concise, descriptive prompt suitable for an image generation model and also updates the extension trackers.
3.  **Tag Insertion**: The response from the LLM is cleaned up and inserted into a `<pic>` tag, like this: `<pic prompt="[LLM's cleaned prompt response goes here]">`.
4.  **Inline Message**: This `<pic>` tag is then added to the chat as an inline message, after the last reply text (it must edit `{{last message}}`), which the extension auto-image-generation then uses to generate and display an image.

In conclusion: the entire feature must be the generation and proper appending of the `<pic>` tag and nothing more. This entire process is designed to happen alongside the same core RPG-companion tracker functionality.

## How to Configure

To enable and configure the Image Auto-Generation feature, follow these steps:

1.  Open the **RPG Companion** panel.
2.  Click on **Settings** to open the settings modal.
3.  Navigate to the **Generation** tab.
4.  Choose separate mode. The **Enable Auto Image Generation** will show up below.
5.  Toggle the **Enable Auto Image Generation** switch to the "on" position.
6.  In the text area below the toggle, you can write your custom prompt and after that, the physical description.

### Main Prompt (not visible to user)

This is the main prompt that must be appended with the trackers main prompt. This is designed to explain the LLM what it needs to do AFTER the trackers update.

```
[IMAGE PROMPT GENERATION PROTOCOL]

This is for auto image generation. Prompts must be written in a mix of natural language and tags.

[RULE 1: CHARACTER SYNTHESIS]
- You must consider the physical descriptions verbatim as such `[custom physical description must be inserted here]`. This is not optional. The goal is consistent character identity. LoRAs, if any, must be verbatim and appended by the very end of the prompt. Any duplicates of tags or loras found that exists within this prompt or user custom prompt should be ignored.

[RULE 2: SCENE & BIAS CONTROL]
- After analyzing the current scene context to update the trackers, use the information to describe the environment with at least THREE distinct, non-generic details. Be specific and proactive in your descriptions to guide the image model away from its default training.
- Generate prompts using ONLY natural language and tag-based weighting (word:1.2).
- NO conversational explanations, NO meta-commentary, NO complex sentence structures.
- The prompt is a command, not a story.
- The system MUST identify possible potential model biases (e.g., 'ahegao + looking at viewer' = kneeling).
- When a bias is identified, the system MUST add a weighted counter-tag to enforce the desired action. Example: (standing:1.3).
- Do not prompt for the desired end result directly if it has a common model bias (e.g., sideboob = outer sideboob). Instead, prompt for the elements that will logically CREATE that result. Prompt for the PATH, not the GOAL. Instead of using (sideboob:1.2) to render the INNER sideboob when the rendered person is using a opened jacket, instead use: (unzipped jacket:1.2), (midriff:1.1).
- A position must always be described. Is {{char}} standing? Sitting? Layd down? If sitting, where? How? For example: 'She's ((sitted:1.2)) at a couch, her (legs crossed:1.1)'. Observe how grounded (weighted) the sitting position is, while giving an atributte for her position (legs crossed).
- Do NOT use negatives enforcements/weighting in this prompt.

[RULE 3: DETAILS REINFORCEMENTS]
- When describing an item of clothing, if its presence and integrity are non-negotiable, like if a thin white tank top, as an example, is supposed to be ON and covering the torso, NOT pulled up, ground it more with subtle weights like ‘(thin_white_tank_top:1.2)’.
- Implicit details should NOT be explicitly prompted unless it is the absolute focus. The model should infer it from the clothing description. If its must be prompted, its weight must be lower than the clothing item itself.
- Details that are too long, uncommon or too specific, like: (one bikini top tie is loose:1.1), are strictly prohibited. No model understands that. Avoid it at all costs
- Pespectives and poses must ALWAYS be present somehow. For example, if we need to emphasize her whole body, for example, use (whole body shoot:1.2) or trick the model by giving her an ankle tattoo, jewerly, shoes, etc. This can also be done to emphasize a portrait, by removing anything that shouldn't appear in the image, even if its part of the physical description. We trick the image model by omission, not addition.
  
[RULE 4: THE HIERARCHY OF WEIGHT]
- Tier 1 (Highest): Character, Core Pose, Key Clothing Items (e.g. "(standing:1.3), (Aimi:1.2), (white tank top:1.2), (black gym shorts:1.2), ").
- Tier 2 (Medium): Environment, Lighting, General Mood. (dimly lit arcade:1.1).
- Tier 3 (Lowest): Suggestive Details & Bodily Reactions (e.g. "(glistening skin:1.05), "). These are accents, not the main event. They must NOT overpower Tier 1.

[RULE 5: THE "IMPLIED, NOT EXPLICIT" RULE]

- Instead of (subtle abs from tight shirt:1.1), simply describe the shirt: tiny, fitted shirt, tight fit, etc.... Let the model do the work. Avoid giving too much adjectives.
- Instead of (hard nipples faintly visible:1.2), describe the state of the fabric: thin, damp tank top clinging to her chest. The visibility is a result, not a command.

[RULE 6: SYNTAX INTEGRITY]
- CRITICAL: You MUST ALWAYS use the `<pic prompt="[FINAL PROMPT GOES HERE]">` format. Under NO circumstances are you to generate Markdown image syntax like `![]()` or any other format. The extension is specifically designed to replace the `<pic>` tag. Failure to use this exact tag will break the entire process. Do not deviate.

[RULE 7: WHEN AND WHERE]
- CRITICAL: You MUST ALWAYS insert an inline at EVERY message, regardless of character,  as `<pic prompt="[FINAL PROMPT GOES HERE]">` format by the end of the reply.

[PROMPT STRUCTURE]
1.  **Perspective:** (`{{type}}`, looking at viewer)
2.  **Subject:** Verbatim Physical Description of Main Rule 1 and the action from RULE 3.
3.  **Scene:** A detailed description of the background, incorporating the specifics from RULE 2. (e.g., 'on a sun-drenched California beach, rolling waves, distant palm trees, clear blue sky').
4.  **Composition & Suffix:** Explicitly describe the shot type and details. 'close-up shot, depth of field, photorealistic details,'
5. If the character specify any other LoRA used, must be appended by the end"

[FINAL PROMPT EXAMPLE]

"1girl, looking at viewer, chinese young_adult, captivating alluring light-grey eyes, eye makeup, high cheekbones, small nose, small mouth, pink full wavy-lips, gorgeous face, (medium_messy_gray_hair:1.1), ((flat_stomach:1.1)), tan tight_bod, soft_body, narrow waist, ((small_rounded_breasts:1.3)), (extremely_thick_thighs:1.1), She's (standing:1.1) straight, whole body shot, wearing a tiny leather micro-bikini, <lora:Expressive_H-000001:0.8>, "

CRITICAL: The final image tag MUST be inserted inline as such: <pic prompt="[FINAL PROMPT GOES HERE]">

```

### User Custom Auto Image Generation Prompt 

This one defines the custom structure and/or rules the user wants the LLM to follow. Anything stablished here superseeds the main prompt and is taken with higher priority. Below is an example of what a user might use.

```
[CUSTOM USER PROMPT RULES] 

"[CUSTOM RULE 1: PERSPECTIVE & FOCUS]
- If the scene involves direct physical interaction with {{user}}, the perspective is '`{{user gender}}` pov'.
- If {{user}} is not physically interacting with {{char}}, the perspective is '`{{type}}`, looking at viewer' OR an appropriate third-person description (`{{type}}` e.g. 1girl, 1boy, 1futa, 2girl, 2boy, etc...). The focus is {{char}} and their autonomous action.

[CUSTOM RULE 2: LoRAs]
- Append any LoRA as specified in the character individual %prompt% block or physical description by the end of the prompt."

```
