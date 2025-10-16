'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating video scripts from a user prompt.
 *
 * The flow takes a prompt as input and returns a video script.
 * - generateScriptShort - A function that handles the video script generation process.
 * - GenerateScriptShortInput - The input type for the generateScriptShort function.
 * - GenerateScriptShortOutput - The return type for the generateScriptShort function.
 */

import {ai} from '@/ai/genkit';
import { StoryboardInputSchema, StoryboardOutputSchema, StoryboardInput, StoryboardOutput } from './schemas';

export async function generateScriptStoryboard(input: StoryboardInput): Promise<StoryboardOutput> {
  return generateScriptStoryboardFlow(input);
}

const generateScriptShortPrompt = ai.definePrompt({
  // model: 'googleai/gemini-2.5-flash',
  name: 'generateScriptStoryboard',
  input: {schema: StoryboardInputSchema},
  output: { schema: StoryboardOutputSchema },
  system: `You are a professional screenwriter and storyboard artist. Your task is to create a compelling video script and a technical guide for producing the storyboard, inspired by the provided story. 
  The script and guide should be tailored to the specified art style and tone.
  The story can be fictional or based on real events, but it should be engaging and suitable for a wide audience.`,
  prompt: `User Story: 
  {{{story}}}
  
  Art Style:
  {{{artStyle}}}
  
  ---
  Stick to the content filters: no sexual content.
`
});

const generateScriptStoryboardFlow = ai.defineFlow(
  {
    name: 'generateScriptStoryboard',
    inputSchema: StoryboardInputSchema,
    outputSchema: StoryboardOutputSchema,
  },
  async input => {
    console.log('Generating Storyboard:', input);
    try {
      const {output} = await generateScriptShortPrompt(input);
      if (!output) {
        console.error('generateScriptStoryboardFlow returned no output.');
        throw new Error('Failed to generate Storyboard.');
      }
      console.log('Generated script:', JSON.stringify(output, null, 2));
      return output;
    } catch (error) {
      console.error("Error in generateScriptShortFlow: ", error);
      throw error;
    }
  }
);
