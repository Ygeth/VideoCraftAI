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
  model: 'googleai/gemini-2.5-flash',
  name: 'generateScriptShortPrompt',
  input: {schema: GenerateScriptShortInputSchema},
  output: {schema: GenerateScriptShortOutputSchema},
  prompt: `You are a video script writer for short-form vertical videos. Your task is to create a compelling video script inspired on the provided story, elements or the narration can change to improve the narrative. Return it in a structured JSON format.
The script should be an array of scenes. Each scene object must include:
1.  An "narrator" field with the prompt for the voiceover text for the scene. Use the sign punctuation and style that best fits the narration style.
2.  An "imgPromptStart" field with a detailed image generation prompt that captures the essence of the first frame of this scene, following the specified art style.
3.  An "imgPromptEnd" field with a detailed image generation prompt that captures the essence of the last frame of this scene, following the specified art style.
Both images must have the following format:
  Scene Characters:
  - {Name}: Character Prompt: {Character phisical description.}
  - Others characters as needed.
  Scene Description: {A detailed description of the scene, including the environment, background elements, and any relevant details that set the scene. If there are characters, describe their appearance, clothing, and expressions.}
  Scene Composition: {Details about the composition of the scene, such as camera angle, perspective, and focal points.}
  Lighting and mood: {Details about the lighting conditions and the overall mood or atmosphere of the scene.}
3.  A "motionScene" field with a short description of the desired actors actions on the scene, camera movement or animation for the scene (e.g., 'Slow zoom in on the character's face', 'Pan from left to right across the landscape', 'A fast-paced dolly shot').

Art Style:
{{{artStyle}}}

Story:
{{{story}}}

Generate the script, each scene must be 10-15 seconds long, Max 2min all the video.
The image can't violate the content filters. 
Start the first scene with a hook to grab the viewer's attention. Ensure the script flows logically from one scene to the next, creating a cohesive narrative.
Return only the JSON object.`,
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
