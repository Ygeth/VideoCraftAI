export const constructImagenPrompt = (prompt: string, artStyle?: string) => {
  return prompt + (artStyle ? `. \n Keep the Art Style: ${artStyle}` : '');
};

export const constructGeminiImagePrompt = (prompt: string, characterImageDataUri?: string) => {
  const promptParts: (
    | { text: string }
    | { media: { url: string; contentType?: string } }
  )[] = [];

  let textPrompt = `${prompt}.`;

  if (characterImageDataUri) {
    promptParts.push({ media: { url: characterImageDataUri } });
    textPrompt += ` Use the character in the first image as a reference.`
  }
  promptParts.push({ text: textPrompt });

  return { promptParts, textPromptOnly: textPrompt };
}
