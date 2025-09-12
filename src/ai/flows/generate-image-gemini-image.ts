'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an image from a text prompt using the gemini-2.5-flash-image-preview model.
 *
 * - generateImageGeminiImage - A function that handles the image generation process.
 * - GenerateImageGeminiImageInput - The input type for the function.
 * - GenerateImageGeminiImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageGeminiImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageGeminiImageInput = z.infer<typeof GenerateImageGeminiImageInputSchema>;

const GenerateImageGeminiImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageGeminiImageOutput = z.infer<typeof GenerateImageGeminiImageOutputSchema>;

export async function generateImageGeminiImage(input: GenerateImageGeminiImageInput): Promise<GenerateImageGeminiImageOutput> {
  return generateImageGeminiImageFlow(input);
}

const generateImageGeminiImageFlow = ai.defineFlow(
  {
    name: 'generateImageGeminiImageFlow',
    inputSchema: GenerateImageGeminiImageInputSchema,
    outputSchema: GenerateImageGeminiImageOutputSchema,
  },
  async input => {
    console.log('Generating image with Gemini Image:', input);
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: input.prompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'], // Important: IMAGE only won't work
        },
      });
  
      const imageDataUri = media.url;
      if (!imageDataUri) {
        console.error('Image generation (Gemini) failed to return a data URI.');
        throw new Error('Image generation failed to return a data URI.');
      }
  
      return {imageDataUri};
    } catch (error) {
      console.error("Error in generateImageGeminiImageFlow: ", error);
      throw error;
    }
  }
);
