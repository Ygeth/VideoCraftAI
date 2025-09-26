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

const PromptEnhancerInputSchemaVeo3 = z.object({
  prompt: z.string().describe('The prompt to enhance for video generation.'),
});

export type PromptEnhancerInputVeo3 = z.infer<typeof PromptEnhancerInputSchemaVeo3>;
const PromptEnhancerOutputSchemaVeo3 = z.object({
  enhancedPrompt: z.string().describe('The enhanced prompt for video generation.'),
});
export type PromptEnhancerOutputVeo3 = z.infer<typeof PromptEnhancerOutputSchemaVeo3>;

export async function promptEnhancerVeo3(input: PromptEnhancerInputVeo3): Promise<PromptEnhancerOutputVeo3> {
  return PromptEnhancerFlowVeo3(input);
}

const PromptEnhancerFlowVeo3 = ai.defineFlow(
  {
    name: 'PromptEnhancerFlowVeo3',
    inputSchema: PromptEnhancerInputSchemaVeo3,
    outputSchema: PromptEnhancerOutputSchemaVeo3,
  },
  async (input) => {
    console.log('Enhancing prompt for Veo3 video generation:', input);
    const { output: enhancedPrompt } = await promptEnhancerPromptVeo3({ prompt: input.prompt });
    console.log('Enhanced prompt:', enhancedPrompt?.enhancedPrompt);
    if (!enhancedPrompt) {
      throw new Error('Failed to enhance prompt for Veo3 video generation.');
    }
    const { output: guidelines } = await promptEnhancerGuidelinePromptVeo3({ prompt: enhancedPrompt.enhancedPrompt });
    if (!guidelines) {
      throw new Error('Failed to guideline prompt for Veo3 video generation.');
    }
    console.log('Guidelines prompt:', guidelines?.enhancedPrompt);

    // return enhancedPrompt;
    return { enhancedPrompt: guidelines.enhancedPrompt };
  }
);

const promptEnhancerPromptVeo3 = ai.definePrompt({
  model: 'googleai/gemini-2.5-flash-lite',
  name: 'promptEnhancerPromptVeo3',
  input: { schema: PromptEnhancerInputSchemaVeo3 },
  output: { schema: PromptEnhancerOutputSchemaVeo3 },
  prompt: `
You are an expert prompt engineer for video generation using Veo3. Your task is to enhance the provided prompt to make it more detailed and suitable for generating high-quality videos. The enhanced prompt should include specific details about the scene, characters, actions, and any relevant context that would help in creating a vivid and engaging video.
Input Prompt:
{{{prompt}}}
Enhanced Prompt:
Provide a detailed and vivid description that captures the essence of the scene, including any relevant actions, emotions, and settings. Ensure the prompt is clear and concise, avoiding any ambiguity.
Return only the enhanced prompt as a string.
`,
});

const promptEnhancerGuidelinePromptVeo3 = ai.definePrompt({
  model: 'googleai/gemini-2.5-flash',
  name: 'promptEnhancerPromptVeo3',
  input: { schema: PromptEnhancerInputSchemaVeo3 },
  output: { schema: PromptEnhancerOutputSchemaVeo3 },
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
