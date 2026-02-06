// preview-with-ai-suggestions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for previewing a video with AI-generated suggestions for media, subtitles, and music.
 *
 * - `previewWithAiSuggestions`: An async function that takes a video script and returns a preview with AI suggestions.
 * - `PreviewWithAiSuggestionsInput`: The input type for the `previewWithAiSuggestions` function.
 * - `PreviewWithAiSuggestionsOutput`: The output type for the `previewWithAiSuggestions` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  PreviewWithAiSuggestionsInputSchema,
  type PreviewWithAiSuggestionsInput,
  PreviewWithAiSuggestionsOutputSchema,
  type PreviewWithAiSuggestionsOutput,
  previewWithAiSuggestionsPrompt
} from '@/ai/prompts/preview';

export type { PreviewWithAiSuggestionsInput, PreviewWithAiSuggestionsOutput };

export async function previewWithAiSuggestions(
  input: PreviewWithAiSuggestionsInput
): Promise<PreviewWithAiSuggestionsOutput> {
  return previewWithAiSuggestionsFlow(input);
}

const previewWithAiSuggestionsFlow = ai.defineFlow(
  {
    name: 'previewWithAiSuggestionsFlow',
    inputSchema: PreviewWithAiSuggestionsInputSchema,
    outputSchema: PreviewWithAiSuggestionsOutputSchema,
  },
  async input => {
    const { output } = await previewWithAiSuggestionsPrompt(input);
    return output!;
  }
);
