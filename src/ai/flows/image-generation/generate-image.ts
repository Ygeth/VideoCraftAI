'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an image from a text prompt.
 * It can optionally take a reference character image to maintain consistency.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai, imageAI, nanoBananaAI} from '@/ai/genkit';
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
    console.log('Generating image with multi-model logic:', input.prompt.substring(0, 50), '...');

    // 1. Enhance the prompt
    let finalPrompt = input.prompt + (input.artStyle ? '. \n Keep the Art Style: ' + input.artStyle : '');
    const {enhancedPrompt} = await promptEnhancerImagen({prompt: finalPrompt});
    finalPrompt = enhancedPrompt ?? finalPrompt;

    // 2. Decide which model to use
    if (input.characterImageDataUri) {
      try {
        // Use Gemini for image-to-image/reference generation
        return generateWithNanoBana(finalPrompt, input.characterImageDataUri);
      } catch (error) {
        console.error('Error in Gemini generation, falling back to Imagen: ', error);
        return generateWithImagen(finalPrompt, input.aspectRatio); // Fallback to Imagen if Gemini fails
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

async function generateWithNanoBana(prompt: string, characterImageDataUri: string): Promise<ImageOutput> {
  console.log('Using Gemini with reference images.');
  try {
    const promptParts: (
      | {text: string}
      | {media: {url: string; contentType?: string}}
    )[] = [];
    
    let textPrompt = `${prompt}.`;

    if (characterImageDataUri) {
      promptParts.push({ media: { url: characterImageDataUri }});
      textPrompt += ` Use the character in the first image as a reference.`
    }
    promptParts.push({ text: textPrompt });
    console.log('Final enhanced prompt for image generation: ', textPrompt.substring(0, 100), '...');
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
    return { imageDataUri };
  } catch (error) {
    console.error('Error in generateWithNanoBana (Gemini): ', error);
    throw error;
  }
}