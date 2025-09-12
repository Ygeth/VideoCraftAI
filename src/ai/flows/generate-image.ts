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

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  artStyle: z.string().describe('The art style to apply to the image.'),
  aspectRatio: z.string().optional().describe('The aspect ratio for the generated image, e.g., "9:16" or "16:9".'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async input => {
    console.log('Generating image with Imagen:', input);
    try {
      // Combine the art style and the specific scene prompt.
      const finalPrompt = `Art Style: ${input.artStyle}\n\nPrompt: ${input.prompt}`;

      const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: finalPrompt,
        config: {
          aspectRatio: input.aspectRatio,
        },
      });

      const imageDataUri = media.url;
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
