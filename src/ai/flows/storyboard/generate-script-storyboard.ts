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
  generateScriptStoryboardPrompt,
  StoryboardInput,
  StoryboardInputSchema,
  StoryboardOutput,
  StoryboardOutputSchema
} from '@/ai/prompts/gen-text/storyboard';

export async function generateScriptStoryboard(input: StoryboardInput): Promise<StoryboardOutput> {
  return generateScriptStoryboardFlow(input);
}

const generateScriptStoryboardFlow = ai.defineFlow(
  {
    name: 'generateScriptStoryboard',
    inputSchema: StoryboardInputSchema,
    outputSchema: StoryboardOutputSchema,
  },
  async input => {
    console.log('Generating Storyboard:', input);
    try {
      const { output } = await generateScriptStoryboardPrompt(input);
      if (!output) {
        console.error('generateScriptStoryboardFlow returned no output.');
        throw new Error('Failed to generate Storyboard.');
      }
      console.log('Generated script:', JSON.stringify(output, null, 2));
      return output;
    } catch (error) {
      console.error("Error in generateScriptStoryboardFlow: ", error);
      throw error;
    }
  }
);
