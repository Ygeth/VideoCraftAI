import { z } from 'zod';

export const SceneSchema = z.object({
  id: z.string().describe('A unique identifier for this scene.'),
  narrator: z.string().describe('The voiceover text for this scene.'),
  imgPrompt: z.string().describe('A detailed image generation prompt that captures the essence of this scene, following the specified art style.'),
  imgPromptStart: z.string().describe('A detailed image generation prompt that captures the essence of this scene, following the specified art style.'),
  imgPromptEnd: z.string().describe('A detailed image generation prompt that captures the essence of this scene, following the specified art style.'),
  motionScene: z.string().describe('A description of the actors actions on the scene, camera movement or animation for the scene'),
  imageUrl: z.string().optional().describe('The URL of the generated image for this scene.'),
  imageUrls: z.array(z.string()).optional().describe('The URLs of the generated images for this scene.'),
  startImageUrl: z.string().optional().describe('The URL of the start image for this scene.'),
  endImageUrl: z.string().optional().describe('The URL of the end image for this scene.'),
  audioUrl: z.string().optional().describe('The URL of the generated audio for this scene.'),
  imageStorageId: z.string().optional().describe('The storage ID of the image in the media storage service.'),
  audioStorageId: z.string().optional().describe('The storage ID of the audio in the media storage service.'),
  videoTTSId: z.string().optional().describe('The storage ID of the scene video in the media storage service.'),
});

export type Scene = z.infer<typeof SceneSchema>;

export const ImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  artStyle: z.string().describe('The art style to apply to the image.').optional(),
  aspectRatio: z.string().optional().describe('The aspect ratio for the generated image, e.g., "9:16" or "16:9".').optional(),
  characterImageDataUri: z.string().optional().describe('Optional data URI of a character image to use as a reference.'),
});
export type ImageInput = z.infer<typeof ImageInputSchema>;


export const ImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type ImageOutput = z.infer<typeof ImageOutputSchema>;
