'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an image from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { fal } from "@fal-ai/client";
import { ImageInput, ImageInputSchema } from '@/ai/flows/short-videos/schemas';
import { ImageOutput, ImageOutputSchema } from '@/ai/flows/short-videos/schemas';

// Helper to convert aspect ratio string to fal's image_size object
function mapAspectRatioToImageSize(aspectRatio?: string) {
    switch (aspectRatio) {
        case '16:9':
            return 'landscape_16_9';
        case '4:3':
            return 'landscape_4_3';
        case '3:4':
            return 'portrait_4_3';
        case '1:1':
            return 'square_hd';
        case '9:16':
        default:
            return 'portrait_16_9';
    }
}

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
    console.log('Generating image with fal-ai/bytedance/seedream/v4:', input);
    let finalPrompt = input.prompt +
      (input.artStyle ? ". Art Style: " + (input.artStyle) : "");
    
    try {
      const result: any = await fal.subscribe("fal-ai/bytedance/seedream/v4/text-to-image", {
        input: {
          prompt: finalPrompt,
          image_size: mapAspectRatioToImageSize(input.aspectRatio)
        },
        logs: true,
      });

      if (!result || !result.data || !result.data.images || result.data.images.length === 0) {
        console.error('Image generation (fal-ai) failed to return an image.');
        throw new Error('Image generation failed to return an image.');
      }

      const imageUrl = result.data.images[0].url;

      // Fetch the image and convert to data URI
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${imageUrl}: ${response.statusText}`);
      }
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/png';
      const imageDataUri = `data:${contentType};base64,${Buffer.from(imageBuffer).toString('base64')}`;

      return {imageDataUri};
    } catch (error) {
      console.error("Error in generateImageFlow: ", error);
      throw error;
    }
  }
);