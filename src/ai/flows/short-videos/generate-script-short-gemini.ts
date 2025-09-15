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
import {z} from 'genkit';
import { SceneSchema } from './schemas';

const GenerateScriptShortInputSchema = z.object({
  story: z.string().describe('The story to use as inspiration for the video script.'),
  artStyle: z.string().describe('The art style to use for the video script image prompts.'),
});
export type GenerateScriptShortInput = z.infer<typeof GenerateScriptShortInputSchema>;

const GenerateScriptShortOutputSchema = z.object({
  scenes: z
    .array(SceneSchema).describe('The generated video script, divided into scenes.'),
});
export type GenerateScriptShortOutput = z.infer<typeof GenerateScriptShortOutputSchema>;

export async function generateScriptShort(input: GenerateScriptShortInput): Promise<GenerateScriptShortOutput> {
  return generateScriptShortFlow(input);
}

const generateScriptShortPrompt = ai.definePrompt({
  name: 'generateScriptShortPrompt',
  input: {schema: GenerateScriptShortInputSchema},
  output: {schema: GenerateScriptShortOutputSchema},
  prompt: `You are a video script writer for short-form vertical videos. Your task is to create a compelling video script based on the provided story and return it in a structured JSON format.
The script should be an array of scenes. Each scene object must include:
1.  A "narrator" field with the voiceover text for the scene.
2.  An "imgPrompt" field with a detailed image generation prompt that captures the essence of the scene, following the specified art style.
3.  A "motionScene" field with a short description of the desired actors actions on the scene, camera movement or animation for the scene (e.g., 'Slow zoom in on the character's face', 'Pan from left to right across the landscape', 'A fast-paced dolly shot').

Art Style:
{{{artStyle}}}

Story:
{{{story}}}

Generate the script.`,
});

const generateScriptShortFlow = ai.defineFlow(
  {
    name: 'generateScriptShortFlow',
    inputSchema: GenerateScriptShortInputSchema,
    outputSchema: GenerateScriptShortOutputSchema,
  },
  async input => {
    console.log('Generating video script:', input);
    try {
      const {output} = await generateScriptShortPrompt(input);
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
