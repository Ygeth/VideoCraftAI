'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an image from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { imageAI } from '@/ai/genkit';
import { ImageInput, ImageInputSchema } from '@/ai/flows/short-videos/schemas';
import { ImageOutput, ImageOutputSchema } from '@/ai/flows/short-videos/schemas';

export async function generateImage(input: ImageInput): Promise<ImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = imageAI.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: ImageInputSchema,
    outputSchema: ImageOutputSchema,
  },
  async input => {
    console.log('Generating image with Imagen:', input);
    let finalPrompt = input.prompt +
      (input.artStyle ? ". Art Style: " + (input.artStyle) : "");
    
    try {
      // Combine the art style and the specific scene prompt.
      const {media} = await imageAI.generate({
        prompt: finalPrompt,
        config: {
          aspectRatio: '9:16', // 1:1, 9:16, 16:9, 4:3, 3:4
          outputResolution: '1k', // 512, 1k, 2k
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
