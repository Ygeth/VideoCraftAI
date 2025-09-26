'use server';

/**
 * @fileOverview Converts a scene (image + narration) into video content using AI.
 *
 * - generateVideoFromScene - A function that handles the video creation process.
 * - GenerateVideoFromSceneInput - The input type for the function.
 * - GenerateVideoFromSceneOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MediaPart} from 'genkit';
import { generateImageGemini } from './image-generation/generate-image-gemini';

const GenerateVideoFromSceneInputSchema = z.object({
  motionScene: z.string().describe('How the scene must narration for the scene.'),
  narration: z.string().describe('The narration for the scene.'),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the scene, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  aspectRatio: z.string().optional().describe('The aspect ratio for the generated video, e.g., "9:16" or "16:9".'),
});
export type GenerateVideoFromSceneInput = z.infer<typeof GenerateVideoFromSceneInputSchema>;

const GenerateVideoFromSceneOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe('The video converted from the script as a data URI.'),
});
export type GenerateVideoFromSceneOutput = z.infer<
  typeof GenerateVideoFromSceneOutputSchema
>;

export async function generateVideoFromScene(
  input: GenerateVideoFromSceneInput
): Promise<GenerateVideoFromSceneOutput> {
  return generateVideoFromSceneFlow(input);
}

const generateVideoFromSceneFlow = ai.defineFlow(
  {
    name: 'generateVideoFromSceneFlow',
    inputSchema: GenerateVideoFromSceneInputSchema,
    outputSchema: GenerateVideoFromSceneOutputSchema,
  },
  async input => {
    console.log('Generating video from scene with Veo:', { motionScene: input.motionScene, narration: input.narration, aspectRatio: input.aspectRatio });
    try {
      let imageDataUri = input.imageDataUri;
      if (!imageDataUri) {
        const image = await generateImageGemini({ prompt: input.motionScene });
        imageDataUri = image.imageDataUri;
      }

      const match = imageDataUri.match(/^data:(image\/\w+);base64,(.*)$/);
      if (!match) {
        console.error('Invalid image data URI format for Veo.');
        throw new Error('Invalid image data URI format.');
      }
      const mimeType = match[1];
      const base64Data = match[2];

      // Veo3
      let {operation} = await ai.generate({
        model: 'googleai/veo-3.0-generate-preview',
        prompt: [
          {text: `Animate this image based on the following scene: ${input.motionScene}. The narration is: ${input.narration}.`},
          {media: { contentType: mimeType, url: `data:${mimeType};base64,${base64Data}` }},
        ],
        config: {
          personGeneration: 'allow_adult',
          //personGeneration: 'allow_all',
        },
      });

      if (!operation) {
        console.error('Veo generate call did not return an operation.');
        throw new Error('Expected the model to return an operation');
      }

      // Wait until the operation completes.
      while (!operation.done) {
        console.log('Checking Veo operation status...');
        operation = await ai.checkOperation(operation);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      if (operation.error) {
        console.error('Veo operation failed:', operation.error);
        throw new Error('failed to generate video: ' + operation.error.message);
      }

      const video = operation.output?.message?.content.find(p => !!p.media);
      if (!video) {
        console.error('Veo operation finished but no video media was found in the output.');
        throw new Error('Failed to find the generated video');
      }
      const videoDataUri = await downloadVideo(video);
      return {videoDataUri};
    } catch (error) {
      console.error("Error in generateVideoFromSceneFlow: ", error);
      throw error;
    }
  }
);

async function downloadVideo(video: MediaPart): Promise<string> {
  console.log('Downloading video from Veo URL...');
  const fetch = (await import('node-fetch')).default;
  const videoUrl = `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`;
  
  try {
    const videoDownloadResponse = await fetch(videoUrl);
    if (
      !videoDownloadResponse ||
      videoDownloadResponse.status !== 200 ||
      !videoDownloadResponse.body
    ) {
      console.error(`Failed to fetch video. Status: ${videoDownloadResponse.status} ${videoDownloadResponse.statusText}`);
      throw new Error('Failed to fetch video');
    }

    const buffer = await videoDownloadResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    console.log('Video downloaded and encoded to Base64 successfully.');
    return `data:video/mp4;base64,${base64}`;
  } catch (error) {
    console.error('Error downloading video from Veo:', error);
    throw error;
  }
}