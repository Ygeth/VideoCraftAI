'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an image from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

import { ImageInput, ImageInputSchema } from '@/ai/flows/short-videos/schemas';
import { ImageOutput, ImageOutputSchema } from '@/ai/flows/short-videos/schemas';

export async function generateImage(input: ImageInput): Promise<ImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: ImageInputSchema,
    outputSchema: ImageOutputSchema,
  },
  async input => {
    console.log('Generating image with Imagen:', input);
    let finalPrompt = input.prompt +
      (input.artStyle ? " in the style of " + (input.artStyle) : "");
    
    try {
      // Combine the art style and the specific scene prompt.
      const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: finalPrompt,
        config: {
          aspectRatio: input.aspectRatio,
        },
      });

      const imageDataUri = media?.url;
      if (!imageDataUri) {
        console.error('Image generation (Imagen) failed to return a data URI.');
        throw new Error('Image generation failed to return a data URI.');
      }

      return {imageDataUri};
    } catch (error) {
      console.error("Error in generateImageFlow: ", error);
      throw error;
    }
  }
);
