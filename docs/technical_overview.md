# VideoCraftAI Technical Overview

This document provides a deep dive into the technical architecture, AI flows, capabilities, and current technical debt of the VideoCraftAI project.

## 1. Architecture Overview

- **Framework**: Next.js 14+ (App Router)
- **AI Orchestration**: Google Genkit (`src/ai/genkit.ts`)
- **Integration Pattern**: React Server Actions (`'use server'`) directly called from Client Components.
- **Models Used**:
  - `googleai/gemini-2.5-flash` (Logic/Scripting)
  - `googleai/imagen-4.0-fast-generate-001` (Image Generation)
  - `googleai/veo-3.0-fast-generate-001` (Video Generation)

## 2. AI Flows (`src/ai/flows`)

The core intelligence resides in `src/ai/flows`. These are Genkit flows exposed as Server Actions.

### 2.1 Character Generation (`generate-character.ts`)
- **Goal**: Create a consistent character for stories.
- **Input**: Story concept, Art Style.
- **Process**:
    1.  **Details Generation**: Uses `generateCharacterDetailsPrompt` to create name, description, and visual prompt.
    2.  **Image Generation**: Calls `generateImage` with the character's visual description.
- **Output**: Character metadata + Image Data URI.

### 2.2 Video Script Generation (`generate-video-script.ts`)
- **Goal**: Turn a story idea into a structured video script.
- **Process**:
    1.  Receives Story and Art Style.
    2.  Prompt asks for a JSON structure containing an array of **Scenes**.
    3.  Each Scene includes: `narrator` (text), `imgPrompt` (visual description), `motionScene` (camera movement).
- **Output**: JSON Array of Scenes.

### 2.3 Image Generation (`image-generation/generate-image.ts`)
- **Goal**: Generate visuals for scenes or characters.
- **Logic**:
    - **Prompt Enhancement**: Uses `promptEnhancerImagen` to refine the user's prompt.
    - **Model Selection Strategy**:
        - If a `characterImageDataUri` is provided (Reference Image), it attempts to use **Gemini 2.5** for image-to-image generation (`generateWithNanoBana`).
        - Uses **Imagen 4.0** as a fallback or for text-to-image generation (`generateWithImagen`).

### 2.4 Video Generation (`veo3-videos/generate-video-scene.ts`)
- **Goal**: Animate a static scene using Veo3.
- **Process**:
    1.  Takes a `prompt` and an optional start image (`imgStartUrl`).
    2.  Calls `videoAI.generate` (Veo3 model).
    3.  Polls the operation until completion (`videoAI.checkOperation`).
    4.  Downloads the resulting video from the temporary URL.
- **Output**: Video Data URI (Base64).

## 3. Current Capabilities

| Feature | Status | Details |
| :--- | :--- | :--- |
| **Scripting** | ✅ Working | Generates multi-scene scripts with direction. |
| **Character Consistency** | ⚠️ Partial | Uses reference images in Gemini, but consistency varies. |
| **Scene Visualization** | ✅ Working | Uses Imagen 4.0 for high-quality static shots. |
| **Video Rendering** | 🚧 Beta | Uses Veo3. Currently limited to **single scene** generation. |
| **Preview** | 🚧 Experimental | `preview-with-ai-suggestions` attempts to suggest assets. |

## 4. Technical Debt & Analysis

### 4.1 Critical Debt (Priority High)
- **Video Stitching Missing**: The frontend (`src/app/create/page.tsx`) and backend currently only generate video for the *first scene* (`handleRenderVideo`). There is no loop or stitching logic to compile a full video from all scenes.
- **Fake Data URIs in Preview**: `src/ai/flows/preview-with-ai-suggestions.ts` prompt instructs the LLM to "Provide direct data URIs". LLMs cannot generate actual media files as text strings; they hallucinate placeholders. This flow likely fails or returns invalid data.

### 4.2 Code Quality & Maintenance
- **Manual String Concatenation**: In `generate-character.ts`, prompts are built using template literals inside function calls instead of using structured Genkit prompts consistently.
- **Error Handling**: `generateWithImagen` and other flows use generic `try/catch` blocks that throw generic errors ("Failed to generate..."), masking specific API issues.
- **Hardcoded Configuration**: Veo3 configuration (aspect ratio, duration) is partially hardcoded in `generate-video-scene.ts` or passed from the UI without full validation.

### 4.3 Recommendations
1.  **Implement Timeline/Stitcher**: Create a new flow `generate-full-video.ts` that iterates through all scenes, generates clips for valid ones, and uses `ffmpeg` (or a cloud media service) to stitch them.
2.  **Refactor Preview Flow**: Remove the request for Data URIs in `preview-with-ai-suggestions.ts`. Instead, return search queries or keywords that the frontend can use to fetch stock assets.
3.  **Standardize Prompts**: Move all prompt logic to `*.prompt` files or consistent `ai.definePrompt` definitions.
