'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating video scripts from a user prompt.
 *
 * The flow takes a prompt as input and returns a video script.
 * - generateScriptShort - A function that handles the video script generation process.
 * - GenerateScriptShortInput - The input type for the generateScriptShort function.
 * - GenerateScriptShortOutput - The return type for the generateScriptShort function.
 */

import { ai } from '@/ai/genkit';
import {
  generateScriptShortPrompt,
  GenerateScriptShortInput,
  GenerateScriptShortInputSchema,
  GenerateScriptShortOutput,
  GenerateScriptShortOutputSchema
} from '@/ai/prompts/gen-text/script-short-gemini';

export async function generateScriptShort(input: GenerateScriptShortInput): Promise<GenerateScriptShortOutput> {
  return generateScriptShortFlow(input);
}

const generateScriptShortFlow = ai.defineFlow(
  {
    name: 'generateScriptShortFlow',
    inputSchema: GenerateScriptShortInputSchema,
    outputSchema: GenerateScriptShortOutputSchema,
  },
  async input => {
    console.log('Generating video script:', input);
    try {
      const { output } = await generateScriptShortPrompt(input);
      if (!output) {
        console.error('generateScriptShortPrompt returned no output.');
        throw new Error('Failed to generate video script.');
      }
      console.log('Generated script:', JSON.stringify(output, null, 2));
      return output;
    } catch (error) {
      console.error("Error in generateScriptShortFlow: ", error);
      throw error;
    }
  }
);
