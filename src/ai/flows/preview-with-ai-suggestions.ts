// preview-with-ai-suggestions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for previewing a video with AI-generated suggestions for media, subtitles, and music.
 *
 * - `previewWithAiSuggestions`: An async function that takes a video script and returns a preview with AI suggestions.
 * - `PreviewWithAiSuggestionsInput`: The input type for the `previewWithAiSuggestions` function.
 * - `PreviewWithAiSuggestionsOutput`: The output type for the `previewWithAiSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PreviewWithAiSuggestionsInputSchema = z.object({
  videoScript: z.string().describe('The video script to generate a preview for.'),
});

export type PreviewWithAiSuggestionsInput = z.infer<
  typeof PreviewWithAiSuggestionsInputSchema
>;

const PreviewWithAiSuggestionsOutputSchema = z.object({
  suggestedMedia: z
    .string()
    .describe('AI suggested media to use in the video, as a data URI.'),
  suggestedSubtitles: z
    .string()
    .describe('AI suggested subtitles for the video script.'),
  suggestedMusic: z
    .string()
    .describe('AI suggested music to use in the video, as a data URI.'),
});

export type PreviewWithAiSuggestionsOutput = z.infer<
  typeof PreviewWithAiSuggestionsOutputSchema
>;

export async function previewWithAiSuggestions(
  input: PreviewWithAiSuggestionsInput
): Promise<PreviewWithAiSuggestionsOutput> {
  return previewWithAiSuggestionsFlow(input);
}

const previewWithAiSuggestionsPrompt = ai.definePrompt({
  name: 'previewWithAiSuggestionsPrompt',
  input: {schema: PreviewWithAiSuggestionsInputSchema},
  output: {schema: PreviewWithAiSuggestionsOutputSchema},
  prompt: `Given the following video script, generate suggestions for media, subtitles, and music to enhance the video.

Video Script: {{{videoScript}}}

Consider the script's content and tone when making your suggestions. Provide direct data URIs for media and music, and plain text for subtitles.`,
});

const previewWithAiSuggestionsFlow = ai.defineFlow(
  {
    name: 'previewWithAiSuggestionsFlow',
    inputSchema: PreviewWithAiSuggestionsInputSchema,
    outputSchema: PreviewWithAiSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await previewWithAiSuggestionsPrompt(input);
    return output!;
  }
);
