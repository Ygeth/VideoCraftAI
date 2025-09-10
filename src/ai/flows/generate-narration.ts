'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating narration for a video scene.
 *
 * - generateNarration - A function that handles the narration generation process.
 * - GenerateNarrationInput - The input type for the generateNarration function.
 * - GenerateNarrationOutput - The return type for the generateNarration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNarrationInputSchema = z.object({
  imgPrompt: z.string().describe('The image prompt for the scene, which will be used as context for the narration.'),
  artStyle: z.string().optional().describe('The general art style of the video for tonal consistency.'),
});
export type GenerateNarrationInput = z.infer<typeof GenerateNarrationInputSchema>;

const GenerateNarrationOutputSchema = z.object({
  narration: z.string().describe('The generated narration text for the scene.'),
});
export type GenerateNarrationOutput = z.infer<typeof GenerateNarrationOutputSchema>;

export async function generateNarration(input: GenerateNarrationInput): Promise<GenerateNarrationOutput> {
  return generateNarrationFlow(input);
}

const generateNarrationPrompt = ai.definePrompt({
  name: 'generateNarrationPrompt',
  input: {schema: GenerateNarrationInputSchema},
  output: {schema: GenerateNarrationOutputSchema},
  prompt: `You are a script writer for short, viral videos. Your task is to write a single, compelling sentence of narration for a video scene.
The narration should be mysterious, engaging, and concise.

Use the following image prompt as the main inspiration for the narration. The art style is provided for tonal consistency.

Art Style:
{{{artStyle}}}

Image Prompt:
{{{imgPrompt}}}

Generate a single sentence of narration.`,
});


const generateNarrationFlow = ai.defineFlow(
  {
    name: 'generateNarrationFlow',
    inputSchema: GenerateNarrationInputSchema,
    outputSchema: GenerateNarrationOutputSchema,
  },
  async input => {
    const {output} = await generateNarrationPrompt(input);
    return output!;
  }
);
