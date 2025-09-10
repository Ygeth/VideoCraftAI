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

const GenerateVideoFromSceneInputSchema = z.object({
  motionScene: z.string().describe('How the scene must narration for the scene.'),
  narration: z.string().describe('The narration for the scene.'),
  imageDataUri: z
    .string()
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

    const match = input.imageDataUri.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
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

    // Veo2 Example (commented out)
    /*
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: [
        {text: `Animate this image based on the following scene: ${input.motionScene}.
          The narration is: ${input.narration}.`},
        {media: { contentType: mimeType, url: `data:${mimeType};base64,${base64Data}` }},
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: input.aspectRatio || '9:16',
      },
    });
    */

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      console.error(operation)
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
