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
import { z } from 'genkit';

const Veo3PromptEnhancerInputSchema = z.object({
  prompt: z.string().describe('The prompt to enhance for video generation.'),
});

export type Veo3PromptEnhancerInput = z.infer<typeof Veo3PromptEnhancerInputSchema>;
const Veo3PromptEnhancerOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced prompt for video generation.'),
});
export type Veo3PromptEnhancerOutput = z.infer<typeof Veo3PromptEnhancerOutputSchema>;

export async function veo3PromptEnhancer(input: Veo3PromptEnhancerInput): Promise<Veo3PromptEnhancerOutput> {
  return veo3PromptEnhancerFlow(input);
}

const veo3PromptEnhancerFlow = ai.defineFlow(
  {
    name: 'veo3PromptEnhancerFlow',
    inputSchema: Veo3PromptEnhancerInputSchema,
    outputSchema: Veo3PromptEnhancerOutputSchema,
  },
  async (input) => {
    console.log('Enhancing prompt for Veo3 video generation:', input);
    const { output: enhancedPrompt } = await veo3PromptEnhancerPrompt({ prompt: input.prompt });
    console.log('Enhanced prompt:', enhancedPrompt?.enhancedPrompt);
    if (!enhancedPrompt) {
      throw new Error('Failed to enhance prompt for Veo3 video generation.');
    }
    const { output: guidelines } = await veo3PromptEnhancerGuidelinePrompt({ prompt: enhancedPrompt.enhancedPrompt });
    if (!guidelines) {
      throw new Error('Failed to guideline prompt for Veo3 video generation.');
    }
    console.log('Guidelines prompt:', guidelines?.enhancedPrompt);

    // return enhancedPrompt;
    return { enhancedPrompt: guidelines.enhancedPrompt };
  }
);

const veo3PromptEnhancerPrompt = ai.definePrompt({
  model: 'googleai/gemini-2.5-flash',
  name: 'veo3PromptEnhancerPrompt',
  input: { schema: Veo3PromptEnhancerInputSchema },
  output: { schema: Veo3PromptEnhancerOutputSchema },
  prompt: `
You are an expert prompt engineer for video generation using Veo3. Your task is to enhance the provided prompt to make it more detailed and suitable for generating high-quality videos. The enhanced prompt should include specific details about the scene, characters, actions, and any relevant context that would help in creating a vivid and engaging video.
Input Prompt:
{{{prompt}}}
Enhanced Prompt:
Provide a detailed and vivid description that captures the essence of the scene, including any relevant actions, emotions, and settings. Ensure the prompt is clear and concise, avoiding any ambiguity.
Return only the enhanced prompt as a string.
`,
});

const veo3PromptEnhancerGuidelinePrompt = ai.definePrompt({
  model: 'googleai/gemini-2.5-flash',
  name: 'veo3PromptEnhancerPrompt',
  input: { schema: Veo3PromptEnhancerInputSchema },
  output: { schema: Veo3PromptEnhancerOutputSchema },
  prompt: `
You are an expert prompt engineer for video generation using Veo3. Your task is to enhance the provided prompt to make it more detailed and suitable for generating high-quality videos. The enhanced prompt should include specific details about the scene, characters, actions, and any relevant context that would help in creating a vivid and engaging video.
Input Prompt:
{{{prompt}}}
Enhanced Prompt:
Provide a detailed and vivid description that captures the essence of the scene, including any relevant actions, emotions, and settings. Ensure the prompt is clear and concise, avoiding any ambiguity.
Follow these template, replacing the placeholders with relevant details from the original prompt:
{Shot framing and motion}, {Style}: {Lighting and color palette}, {Character details}, {Location and context}, {Action}. If any dialogue in the scene: {Character}: "{Dialogue}". {Narrative elements}
Return only the enhanced prompt as a string.
`,
});
