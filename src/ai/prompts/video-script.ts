import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateVideoScriptInputSchema = z.object({
  story: z.string().describe('The story to use as inspiration for the video script.'),
  artStyle: z.string().describe('The art style to use for the video script image prompts.'),
});
export type GenerateVideoScriptInput = z.infer<typeof GenerateVideoScriptInputSchema>;

export const SceneSchema = z.object({
  narrator: z.string().describe('The voiceover text for this scene.'),
  imgPrompt: z
    .string()
    .describe(
      'A detailed image generation prompt that captures the essence of this scene, following the specified art style.'
    ),
  motionScene: z.string().describe('A description of the camera movement or animation for the scene, like "Slow zoom in", "Pan from left to right"'),
  imageUrl: z.string().optional().describe('The URL of the generated image for this scene.'),
  audioUrl: z.string().optional().describe('The URL of the generated audio for this scene.'),
});

export const GenerateVideoScriptOutputSchema = z.object({
  scenes: z
    .array(SceneSchema)
    .describe('The generated video script, divided into scenes.'),
});
export type GenerateVideoScriptOutput = z.infer<typeof GenerateVideoScriptOutputSchema>;

export const generateVideoScriptPrompt = ai.definePrompt({
  name: 'generateVideoScriptPrompt',
  input: { schema: GenerateVideoScriptInputSchema },
  output: { schema: GenerateVideoScriptOutputSchema },
  prompt: `You are a video script writer for short-form vertical videos. Your task is to create a compelling video script based on the provided story and return it in a structured JSON format.
The script should be an array of scenes. Each scene object must include:
1.  A "narrator" field with the voiceover text for the scene.
2.  An "imgPrompt" field with a detailed image generation prompt that captures the essence of the scene, following the specified art style.
3.  A "motionScene" field with a short description of the desired camera movement or animation for the scene (e.g., 'Slow zoom in on the character's face', 'Pan from left to right across the landscape', 'A fast-paced dolly shot').

Art Style:
{{{artStyle}}}

Story:
{{{story}}}

Generate the script.`,
});
