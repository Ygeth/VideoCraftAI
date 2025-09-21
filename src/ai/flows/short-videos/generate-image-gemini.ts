'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an image from a text prompt using the gemini-2.5-flash-image-preview model.
 *
 * - generateImageGemini - A function that handles the image generation process.
 * - GenerateImageGeminiInput - The input type for the function.
 * - GenerateImageGeminiOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { ImageInput, ImageInputSchema } from '@/ai/flows/short-videos/schemas';
import { ImageOutput, ImageOutputSchema } from '@/ai/flows/short-videos/schemas';

export async function generateImageGemini(input: ImageInput): Promise<ImageOutput> {
  return generateImageGeminiFlow(input);
}

const generateImageGeminiFlow = ai.defineFlow(
  {
    name: 'generateImageGeminiFlow',
    inputSchema: ImageInputSchema,
    outputSchema: ImageOutputSchema,
  },
  async input => {
    console.log('Generating image with Gemini Image:', input);
    let auxPrompt = "Aspect ratio: '9:16'. " + input.prompt +
      (input.artStyle ? " in the style of " + (input.artStyle) : "");
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: auxPrompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'], // Important: IMAGE only won't work
        },
      });
  
      const imageDataUri = media?.url;
      if (!imageDataUri) {
        console.error('Image generation (Gemini) failed to return a data URI.');
        throw new Error('Image generation failed to return a data URI.');
      }
  
      return {imageDataUri};
    } catch (error) {
      console.error("Error in generateImageGeminiFlow: ", error);
      throw error;
    }
  }
);
