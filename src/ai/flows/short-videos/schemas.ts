import { z } from 'zod';

export const SceneSchema = z.object({
  narrator: z.string().describe('The voiceover text for this scene.'),
  imgPrompt: z.string().describe('A detailed image generation prompt that captures the essence of this scene, following the specified art style.'),
  motionScene: z.string().describe('A description of the actors actions on the scene, camera movement or animation for the scene'),
  imageUrl: z.string().optional().describe('The URL of the generated image for this scene.'),
  audioUrl: z.string().optional().describe('The URL of the generated audio for this scene.'),
});

export type Scene = z.infer<typeof SceneSchema>;

export const ImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  artStyle: z.string().describe('The art style to apply to the image.').optional(),
  aspectRatio: z.string().optional().describe('The aspect ratio for the generated image, e.g., "9:16" or "16:9".').optional(),
});
export type ImageInput = z.infer<typeof ImageInputSchema>;


export const ImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type ImageOutput = z.infer<typeof ImageOutputSchema>;
