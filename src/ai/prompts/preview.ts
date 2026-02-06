import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const PreviewWithAiSuggestionsInputSchema = z.object({
  videoScript: z.string().describe('The video script to generate a preview for.'),
});

export type PreviewWithAiSuggestionsInput = z.infer<
  typeof PreviewWithAiSuggestionsInputSchema
>;

export const PreviewWithAiSuggestionsOutputSchema = z.object({
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

export const previewWithAiSuggestionsPrompt = ai.definePrompt({
  name: 'previewWithAiSuggestionsPrompt',
  input: { schema: PreviewWithAiSuggestionsInputSchema },
  output: { schema: PreviewWithAiSuggestionsOutputSchema },
  prompt: `Given the following video script, generate suggestions for media, subtitles, and music to enhance the video.

Video Script: {{{videoScript}}}

Consider the script's content and tone when making your suggestions. Provide direct data URIs for media and music, and plain text for subtitles.`,
});
