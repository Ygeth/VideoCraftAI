import { z } from 'zod';

export const SceneSchema = z.object({
  id: z.string().describe('A unique identifier for this scene.'),
  narrator: z.string().describe('The voiceover text for this scene.'),
  imgPrompt: z.string().describe('A detailed image generation prompt that captures the scene, following the specified art style.'),
  motionPrompt: z.string().describe('A detailed description of the character actions, camera movements, and cinematic motion for this scene.'),
  imageUrl: z.string().optional().describe('The URL of the generated image for this scene.'),
  audioUrl: z.string().optional().describe('The URL of the generated audio for this scene.'),
  imageStorageId: z.string().optional().describe('The storage ID of the image in the media storage service.'),
  audioStorageId: z.string().optional().describe('The storage ID of the audio in the media storage service.'),
});

export type Scene = z.infer<typeof SceneSchema>;