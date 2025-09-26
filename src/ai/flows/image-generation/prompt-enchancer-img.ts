'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating image scripts from a user prompt.
 *
 * The flow takes a prompt as input and returns a video script.
 * - promptEnhancerImagen - A function that handles the image script generation process.
 * - PromptEnhancerInputImagen - The input type for the generateScriptShort function.
 * - PromptEnhancerInputSchemaImagen - The return type for the generateScriptShort function.
 */

import {ai} from '@/ai/genkit';
import { z } from 'genkit';

const PromptEnhancerInputSchemaImagen = z.object({
  prompt: z.string().describe('The prompt to enhance for image generation.'),
});

export type PromptEnhancerInputImagen = z.infer<typeof PromptEnhancerInputSchemaImagen>;
const PromptEnhancerOutputSchemaImagen = z.object({
  enhancedPrompt: z.string().describe('The enhanced prompt for image generation.'),
});
export type PromptEnhancerOutputVeo3 = z.infer<typeof PromptEnhancerOutputSchemaImagen>;

export async function promptEnhancerImagen(input: PromptEnhancerInputImagen): Promise<PromptEnhancerOutputVeo3> {
  return PromptEnhancerFlowImagen(input);
}

const PromptEnhancerFlowImagen = ai.defineFlow(
  {
    name: 'PromptEnhancerFlowImagen',
    inputSchema: PromptEnhancerInputSchemaImagen,
    outputSchema: PromptEnhancerOutputSchemaImagen,
  },
  async (input) => {
    // console.log('Enhancing prompt for image generation:', input);
    const { output: enhancedPrompt } = await promptEnhancerPromptImagen({ prompt: input.prompt });
    // console.log('Enhanced prompt:', enhancedPrompt?.enhancedPrompt);
    if (!enhancedPrompt) {
      throw new Error('Failed to enhance prompt for image generation.');
    }
    // const { output: guidelines } = await promptEnhancerGuidelinePromptImagen({ prompt: input.prompt });
    // if (!guidelines) {
    //   throw new Error('Failed to guideline prompt for image generation.');
    // }
    // console.log('Guidelines prompt:', guidelines?.enhancedPrompt);

    // return enhancedPrompt;
    return { enhancedPrompt: enhancedPrompt.enhancedPrompt };
  }
);

export const promptEnhancerPromptImagen = ai.definePrompt({
  model: 'googleai/gemini-2.5-flash',
  name: 'promptEnhancerPromptImagen',
  input: { schema: PromptEnhancerInputSchemaImagen },
  output: { schema: PromptEnhancerOutputSchemaImagen },
  // You are an expert prompt engineer for image generation using Imagen4. Your task is to enhance the provided prompt to make it more detailed and suitable for generating high-quality scenes. The enhanced prompt should include specific details about the scene, characters, actions, and any relevant context that would help in creating a vivid and engaging image.
  prompt: `
You are an AI Image Prompt Enhancer Agent, whose sole purpose is to take an initial image idea or basic prompt and transform it into an exhaustive, high-quality, and technically optimized description tailored for an advanced image generation model (like Imagen 4). You must strictly follow the guidelines of specificity, detail, descriptive language, and advanced compositional techniques. Analyze the user's request, identify the subject and context, and then creatively and logically expand upon every aspect: add a multi-sensory description of the main subject (texture, material, action, emotion), an environment rich in context (specific location, time of day, weather, cultural setting), a defined aesthetic atmosphere (color palette, desired mood/emotion), and advanced technical specifications for composition (perspective, framing, lighting style, camera reference, lens details, aperture) and quality (high-resolution, 8K detail, professional photography). The final output must be a single, cohesive, and powerful prompt ready for direct image generation, maximizing the user's original vision.
Input Prompt:
{{{prompt}}}
Enhanced Prompt:
Provide a detailed and vivid description that captures the essence of the scene, including any relevant actions, emotions, and settings. Ensure the prompt is clear and concise, avoiding any ambiguity.
Return only the enhanced prompt as a string.
`,
});

//! Not using Guidelines, the above prompt is sufficient
// const promptEnhancerGuidelinePromptImagen = ai.definePrompt({
//   model: 'googleai/gemini-2.5-flash',
//   name: 'promptEnhancerPromptImagen',
//   input: { schema: PromptEnhancerInputSchemaImagen },
//   output: { schema: PromptEnhancerOutputSchemaImagen },
//   prompt: `
// You are an expert prompt engineer for image generation using Imagen4. Your task is to enhance the provided prompt to make it more detailed and suitable for generating high-quality videos. The enhanced prompt should include specific details about the scene, characters, actions, and any relevant context that would help in creating a vivid and engaging image.
// Input Prompt:
// {{{prompt}}}
// Enhanced Prompt:
// Provide a detailed and vivid description that captures the essence of the scene, including any relevant actions, emotions, and settings. Ensure the prompt is clear and concise, avoiding any ambiguity.
// Follow these template, replacing the placeholders with relevant details from the original prompt:
// {Shot framing and motion}, {Style}: {Lighting and color palette}, {Character details}, {Location and context}, {Action}. If any dialogue in the scene: {Character}: "{Dialogue}". {Narrative elements}
// Return only the enhanced prompt as a string.
// `,
// });
