# UI Development Guide for AI Flows

This guide is intended for developers or agents who want to build a User Interface on top of the VideoCraftAI orchestration layer.

## Core Principles

1.  **Iterative Refinement**: The UI should allow users to regenerate specific parts (character, single scene image, single voiceover) without restarting the entire process.
2.  **Visual Feedback**: AI flows can take several seconds. Always provide loading states (e.g., skeletons, spinners) for each specific asset being generated.
3.  **Data Consistency**: Use the `Scene` schema as the single source of truth for scene data.

## Key UI Components to Implement

### A. Story & Configuration Panel
- **Inputs**: Textarea for the story, Select/Textarea for the Art Style.
- **Actions**: "Generate Character" and "Generate Script" buttons.
- **Flow Integration**: Call `generateCharacterDetails` -> `generateCharacterImage`. Then call `generateScriptShort`.

### B. Character Preview Card
- **Display**: Name, personality, and the generated image.
- **Action**: A "Regenerate" button to call `generateCharacterImage` again if the user doesn't like the visual result.
- **State**: Keep the character image as a data URI to pass it as a reference to scene image generation.

### C. Storyboard / Scene List
- **Display**: A list of cards, each representing a `Scene`.
- **Components per Scene**:
  - Editable Narrator text.
  - Interactive Image Preview: Display `imageUrl`. If missing, show a "Generate Image" button.
  - Audio Player: Play `audioUrl`. If missing, show a "Generate Audio" button.
- **Actions**: 
  - `onGenerateImage`: Calls `generateImage(prompt, artStyle, aspectRatio, characterImage)`.
  - `onGenerateAudio`: Calls `generateSpeech(text, voice, tone)`.

### D. Final Assembly Area
- **Action**: "Generate Video" button that collects all `Scene` objects (with their `imageUrl` and `audioUrl`) and sends them to the video assembly flow.
- **Action**: "Download" button that appears once the `finalVideoId` is available.

## Implementation Example (Pseudo-code)

```tsx
const handleGenerateImage = async (sceneId: string) => {
  setLoading(sceneId, true);
  try {
    const scene = scenes.find(s => s.id === sceneId);
    const result = await generateImage({
      prompt: scene.imgPrompt,
      characterImageDataUri: character.imageDataUri, // Maintain consistency!
      artStyle: globalArtStyle,
    });
    updateScene(sceneId, { imageUrl: result.imageDataUri });
  } finally {
    setLoading(sceneId, false);
  }
};
```

## Tips for Agents
- When generating images for scenes, **always** include the `characterImageDataUri` if a character has been generated. This is the secret for visual consistency.
- Use the `motionScene` description as the prompt for video generation flows.
