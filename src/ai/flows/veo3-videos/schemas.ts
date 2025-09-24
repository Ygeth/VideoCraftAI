import { z } from 'zod';

export const SceneVeo3Schema = z.object({
  id: z.string().describe('A unique identifier for this scene.'),
  imgPromptStart: z.string().describe('A detailed image generation prompt that captures the essence of this scene, following the specified art style.'),
  imgPromptEnd: z.string().describe('A detailed image generation prompt that captures the essence of this scene, following the specified art style.'),
  imgStartUrl: z.string().optional().describe('The URL of the start frame for this scene.'),
  imgEndUrl: z.string().optional().describe('The URL of the end frame for this scene.'),
  imageStorageId: z.string().optional().describe('The storage ID of the video in the media storage service.'),
});

export type SceneVeo3 = z.infer<typeof SceneVeo3Schema>;

export const Veo3InputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a video from.'),
  artStyle: z.string().describe('The art style to apply to the video.').optional(),
  aspectRatio: z.string().optional().describe('The aspect ratio for the generated video, e.g., "9:16" or "16:9".').optional(),
  imgStartUrl: z.string().optional().describe('The URL of the start video for this scene.'),
  imgEndUrl: z.string().optional().describe('The URL of the end video for this scene.'),
  improvePrompt: z.boolean().optional().describe('Whether to enhance the prompt for better video generation.').default(true),
});
export type Veo3Input = z.infer<typeof Veo3InputSchema>;


export const Veo3OutputSchema = z.object({
  veo3DataUri: z.string().describe('The generated video as a data URI.'),
});
export type Veo3Output = z.infer<typeof Veo3OutputSchema>;
