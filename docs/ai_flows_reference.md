# AI Flows Reference

This document provides a detailed reference for the available AI flows in VideoCraftAI. Each flow is designed to be used independently or as part of a larger video crafting pipeline.

## 1. Text & Scripting Flows

### `generateScriptShort`
Generates a full video script based on a story description and an art style.
- **Location**: `src/ai/flows/text/generate-script-short-gemini.ts`
- **Input**:
  - `story` (string): The inspiration for the script.
  - `artStyle` (string): The visual style to guide image prompts.
- **Output**:
  - `scenes` (Array<Scene>): A list of scenes, each containing narration, image prompts, and motion descriptions.

### `generateCharacterDetails`
Generates a personality and physical description for a main character.
- **Location**: `src/ai/flows/generate-character.ts`
- **Input**:
  - `story` (string): The context for the character.
  - `artStyle` (string): To ensure consistency.
- **Output**:
  - `name`, `personality`, `physicalDescription`, `imgPrompt`.

## 2. Image Generation Flows

### `generateImage`
The core engine for generating visual assets.
- **Location**: `src/ai/flows/image-generation/generate-image.ts`
- **Input**:
  - `prompt` (string): Detailed description.
  - `artStyle` (string): Optional style preset.
  - `aspectRatio` (string): e.g., "9:16", "16:9", "1:1".
  - `characterImageDataUri` (string, optional): Use a character as image reference.
- **Output**:
  - `imageDataUri` (string): The generated image in base64.

### `generateCharacterImage`
Specialized flow to create a character's portrait.
- **Location**: `src/ai/flows/generate-character.ts`
- **Input**: `characterDetails`, `artStyle`.
- **Output**: `imageDataUri`.

## 3. Audio & Speech Flows

### `generateSpeech`
Converts text into narration audio using Gemini TTS.
- **Location**: `src/ai/flows/speech/generate-speech-gemini.ts`
- **Input**:
  - `text` (string): The text to narrate.
  - `voice` (string): The voice identity.
  - `tonePrompt` (string): Description of the required tone (e.g., "Exciting", "Calm").
- **Output**:
  - `audioDataUri` (string): The generated audio in base64.

## 4. Video Generation Flows

### `generateVideoFromScene`
Generates a video clip from an existing image and motion description.
- **Location**: `src/ai/flows/generate-video-from-scene.ts`
- **Input**: `scene` (Scene object), `artStyle`.
- **Output**: `videoUrl` or storage ID.

---

## Core Schema: `Scene`
Many flows interact with the `Scene` object, defined in `src/ai/flows/image-generation/schemas.ts`:

- `id`: Unique identifier.
- `narrator`: Text to be spoken.
- `imgPrompt`: Main prompt for image generation.
- `motionScene`: Description of movements/camera actions.
- `imageUrl`: (Optional) URL of the generated scene image.
- `audioUrl`: (Optional) URL of the generated narration.
- `videoTTSId`: (Optional) Storage ID of the final scene video.
