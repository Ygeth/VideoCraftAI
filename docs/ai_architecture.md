# AI Architecture Overview

This document describes the core AI architecture of VideoCraftAI, located in `src/ai`. The application uses **Genkit** as the orchestration framework to manage various AI models and flows.

## Genkit Configuration

The main configuration is found in `src/ai/genkit.ts`. It initializes several Genkit instances targeting different specialized models:

| Instance | Model | Purpose |
| :--- | :--- | :--- |
| `ai` | `googleai/gemini-2.5-flash` | General purpose text generation, scripts, and reasoning. |
| `imageAI` | `googleai/imagen-4.0-fast-generate-001` | High-speed image generation. |
| `videoAI` | `googleai/veo-3.0-fast-generate-001` | Video generation from images and prompts. |
| `nanoBananaAI` | `googleai/gemini-2.5-flash-image-preview` | Lightweight image analysis and previews. |

## Core Directory Structure

- `src/ai/flows/`: Contains the logic for specific AI tasks. Each flow is typically a Genkit `defineFlow` that encapsulates input validation, prompt execution, and output parsing.
- `src/ai/prompts/`: Standardized prompt templates.
- `src/ai/tools/`: Custom tools that AI agents can use.
- `src/ai/genkit.ts`: Entry point for AI configuration.

## Flow Types

The application distinguishes between several types of flows:

1.  **Text Flows**: Story scripting, character detail generation.
2.  **Image Flows**: Scene illustration, character image creation.
3.  **Audio Flows**: Voiceover generation (TTS).
4.  **Video Flows**: Converting scenes and images into video clips.

## How to use a Flow

All flows are exported as functions that return a `Promise`. They are TypeSafe thanks to Genkit's Zod integration.

```typescript
import { generateScriptShort } from '@/ai/flows/text/generate-script-short-gemini';

const script = await generateScriptShort({ 
  story: "A space adventure",
  tone: "Epic"
});
```
