'use server';
/**
 * @fileOverview Converts a scene (image + narration) into video content using Veo3.
 *
 * - generateVideoFromScene - A function that handles the video creation process.
 * - GenerateVideoFromSceneInput - The input type for the function.
 * - GenerateVideoFromSceneOutput - The return type for the function.
 */
import { videoAI } from '@/ai/genkit';
import { MediaPart } from 'genkit';
import * as fs from 'fs';
import { Readable } from 'stream';
import { SceneVeo3, Veo3Input, Veo3Output, Veo3InputSchema, Veo3OutputSchema } from "./schemas";

export async function generateVideoFromScene(input: Veo3Input): Promise<Veo3Output> {
  return veo3SceneVideoGeneration(input);
}

const enhancePrompt = async (prompt: string): Promise<string> => {
  // Call the veo3PromptEnhancer flow to enhance the prompt
  const { veo3PromptEnhancer } = await import('./veo3-prompt-enchancer');
  const result = await veo3PromptEnhancer({ prompt });
  return result.enhancedPrompt;
}

const generateMediaPartFromFile = (input: Veo3Input): MediaPart => {
  if (!input.imgStartUrl) {
    return { media: { contentType: '', url: '' } };
  }
  const match = input.imgStartUrl.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
    console.error('Invalid image data URI format for Veo.');
    throw new Error('Invalid image data URI format.');
  }
  const mimeType = match[1];
  const base64Data = match[2];
  return {
    media: {
      url: `data:${mimeType};base64,${base64Data}`,
      contentType: mimeType
    }
  };
}

// Define the Veo3 video generation flow
export const veo3SceneVideoGeneration = videoAI.defineFlow(
  {
    name: "veo3SceneVideoGeneration",
    inputSchema: Veo3InputSchema,
    outputSchema: Veo3OutputSchema
  },
  async (input) => {
    console.log('Generating Veo3 video from scene with input:', input);
    // Enhance the prompt if improvePrompt is true
    if (input.improvePrompt) input.prompt = await enhancePrompt(input.prompt);

    // Check if input image is provided, if so, convert to ImageDTO
    // let image: ImageDTO = { imageBytes: '', mimeType: '' };
    let mediaPartImg: MediaPart = { media: { contentType: '', url: '' } };
    if (input.imgStartUrl) {
      mediaPartImg = generateMediaPartFromFile(input);
      input.prompt = `Animate this image based on the following scene ${input.prompt}`;
    }

    // Veo3
    let {operation} = await videoAI.generate({
      // prompt: [
      //   { text: input.prompt },
      //   { media: mediaPartImg.media },
      // ],
      system: `You are a professional video director and editor. Create a compelling and engaging video based on the user's prompt and the provided image. Ensure the video is visually appealing, coherent, and effectively conveys the intended message or story. Use cinematic techniques to enhance the storytelling, including appropriate transitions, pacing, and visual effects. The video should be suitable for a wide audience and adhere to community guidelines.`,
      prompt: input.prompt,
      image: {
        bytesBase64Encoded: mediaPartImg.media.url?.split(',')[1] || '',
        mimeType: mediaPartImg.media.contentType || ''
      },
      config: {
        aspectRatio: input.aspectRatio || '9:16',
        // durationSeconds: 1,
        // fps: 24,
        // generateAudio: true,
        // resolution: "720p",
        personGeneration: 'allow_all',
        // personGeneration: 'allow_adult',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await videoAI.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    
    
    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }
    // await downloadVideo(video, 'output.mp4');
    const videoDataUri = await downloadVideo(video, 'output.mp4');
    return { veo3DataUri: videoDataUri };
  });

async function downloadVideo(video: MediaPart, path: string) {
  const fetch = (await import('node-fetch')).default;
  // Add API key before fetching the video.
  const videoDownloadResponse = await fetch(`${video.media!.url}&key=${process.env.GEMINI_API_KEY}`);
  if (!videoDownloadResponse || videoDownloadResponse.status !== 200 || !videoDownloadResponse.body) {
    throw new Error('Failed to fetch video');
  }

  Readable.from(videoDownloadResponse.body).pipe(fs.createWriteStream(path));
  const videoBuffer = await videoDownloadResponse.arrayBuffer();
  const base64Video = Buffer.from(videoBuffer).toString('base64');
  const mimeType = video.media!.contentType || 'video/mp4';
  return `data:${mimeType};base64,${base64Video}`;
}
