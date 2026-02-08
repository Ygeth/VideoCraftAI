'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating video scripts from a user prompt.
 *
 * The flow takes a prompt as input and returns a video script.
 * - generateVideoScript - A function that handles the video script generation process.
 * - GenerateVideoScriptInput - The input type for the generateVideoScript function.
 * - GenerateVideoScriptOutput - The return type for the generateVideoScript function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  GenerateVideoScriptInputSchema,
  type GenerateVideoScriptInput,
  GenerateVideoScriptOutputSchema,
  type GenerateVideoScriptOutput,
  generateVideoScriptPrompt
} from '@/ai/prompts/gen-text/video-script';

export type { GenerateVideoScriptInput, GenerateVideoScriptOutput };

export async function generateVideoScript(input: GenerateVideoScriptInput): Promise<GenerateVideoScriptOutput> {
  return generateVideoScriptFlow(input);
}

const generateVideoScriptFlow = ai.defineFlow(
  {
    name: 'generateVideoScriptFlow',
    inputSchema: GenerateVideoScriptInputSchema,
    outputSchema: GenerateVideoScriptOutputSchema,
  },
  async input => {
    console.log('Generating video script:', input);
    try {
      const { output } = await generateVideoScriptPrompt(input);
      if (!output) {
        console.error('generateVideoScriptPrompt returned no output.');
        throw new Error('Failed to generate video script.');
      }
      console.log('Generated script:', JSON.stringify(output, null, 2));
      return output;
    } catch (error) {
      console.error("Error in generateVideoScriptFlow: ", error);
      throw error;
    }
  }
);
