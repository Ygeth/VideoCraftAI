'use server';

/**
 * @fileOverview Converts a video script into video content using AI-powered algorithms.
 *
 * - textToVideo - A function that handles the video creation process from a script.
 * - TextToVideoInput - The input type for the textToVideo function, defining the script.
 * - TextToVideoOutput - The return type for the textToVideo function, providing the video data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';
import {Readable} from 'stream';
import {MediaPart} from 'genkit';

const TextToVideoInputSchema = z.object({
  script: z
    .string()
    .describe('The script to convert into video content.'),
});
export type TextToVideoInput = z.infer<typeof TextToVideoInputSchema>;

const TextToVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe('The video converted from the script as a data URI.'),
});
export type TextToVideoOutput = z.infer<typeof TextToVideoOutputSchema>;

export async function textToVideo(input: TextToVideoInput): Promise<TextToVideoOutput> {
  return textToVideoFlow(input);
}

const textToVideoFlow = ai.defineFlow(
  {
    name: 'textToVideoFlow',
    inputSchema: TextToVideoInputSchema,
    outputSchema: TextToVideoOutputSchema,
  },
  async input => {
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: input.script,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }
    const videoDataUri = await downloadVideo(video);
    return {videoDataUri};
  }
);

async function downloadVideo(video: MediaPart): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  // Add API key before fetching the video.
  const videoDownloadResponse = await fetch(
    `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }

  const buffer = await videoDownloadResponse.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:video/mp4;base64,${base64}`;
}
