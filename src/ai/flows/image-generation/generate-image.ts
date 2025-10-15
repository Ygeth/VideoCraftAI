'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an image from a text prompt.
 * It can optionally take a reference character image to maintain consistency.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai, imageAI} from '@/ai/genkit';
import {ImageInput, ImageInputSchema} from '@/ai/flows/image-generation/schemas';
import {ImageOutput, ImageOutputSchema} from '@/ai/flows/image-generation/schemas';
import {promptEnhancerImagen} from '@/ai/flows/image-generation/prompt-enchancer-img';
import {z} from 'genkit';

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
    console.log('Generating image with multi-model logic:', input);

    // 1. Enhance the prompt
    let finalPrompt =
      input.prompt +
      (input.artStyle ? '. \n Keep the Art Style: ' + input.artStyle : '');
    const {enhancedPrompt} = await promptEnhancerImagen({prompt: finalPrompt});
    finalPrompt = enhancedPrompt ?? finalPrompt;

    console.log('Final enhanced prompt for image generation: ', finalPrompt);

    // 2. Decide which model to use
    if (input.characterImageDataUri) {
      // Use Gemini for image-to-image/reference generation
      console.log('Using Gemini with character reference image.');
      try {
        const promptParts: (
          | {text: string}
          | {media: {url: string; contentType?: string}}
        )[] = [
          {
            media: {
              url: input.characterImageDataUri,
            },
          },
          {
            text: `Use the character in this image as a reference. Now, create a new scene based on the following prompt: ${finalPrompt}`,
          },
        ];

        const {media} = await ai.generate({
          model: 'googleai/gemini-2.5-flash-image-preview',
          prompt: promptParts,
          config: {
            responseModalities: ['IMAGE'],
          },
        });

        const imageDataUri = media?.url;
        if (!imageDataUri) {
          throw new Error('Gemini generation failed to return a data URI.');
        }
        return {imageDataUri};
      } catch (error) {
        console.error('Error in Gemini generation, falling back to Imagen: ', error);
        // Fallback to Imagen if Gemini fails
        return generateWithImagen(finalPrompt, input.aspectRatio);
      }
    } else {
      // Use Imagen for text-to-image generation
      console.log('Using Imagen for text-to-image generation.');
      return generateWithImagen(finalPrompt, input.aspectRatio);
    }
  }
);

async function generateWithImagen(
  prompt: string,
  aspectRatio?: string
): Promise<ImageOutput> {
  try {
    const {media} = await imageAI.generate({
      prompt,
      config: {
        aspectRatio: aspectRatio ?? '1:1',
        outputResolution: '1k',
      },
    });

    const imageDataUri = media?.url;
    if (!imageDataUri) {
      throw new Error('Imagen generation failed to return a data URI.');
    }

    return {imageDataUri};
  } catch (error) {
    console.error('Error in generateWithImagen (Imagen): ', error);
    throw error;
  }
}
