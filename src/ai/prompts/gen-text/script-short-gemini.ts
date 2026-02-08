import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SceneSchema } from '../../flows/text/schemas';

export const GenerateScriptShortInputSchema = z.object({
  story: z.string().describe('The story to use as inspiration for the video script.'),
  artStyle: z.string().describe('The art style to use for the video script image prompts.'),
});
export type GenerateScriptShortInput = z.infer<typeof GenerateScriptShortInputSchema>;

export const GenerateScriptShortOutputSchema = z.object({
  scenes: z.array(SceneSchema).describe('The generated video script, divided into scenes.'),
});
export type GenerateScriptShortOutput = z.infer<typeof GenerateScriptShortOutputSchema>;

export const generateScriptShortPrompt = ai.definePrompt({
  model: 'googleai/gemini-2.5-flash',
  name: 'generateScriptShortPrompt',
  input: { schema: GenerateScriptShortInputSchema },
  output: { schema: GenerateScriptShortOutputSchema },
  prompt: `Act as a Senior Art Director and Cinematic Scriptwriter. Your mission is to transform a basic story into a captivating visual storyboard, optimized for AI image generators (e.g., Midjourney, DALL-E) and video synthesis tools (e.g., Runway, Luma, Pika).

### NARRATIVE GUIDELINES:
1. Based on the "User Story," expand or adapt the narrative to maximize emotional impact, pacing, and visual storytelling.
2. The first scene MUST start with a visual "Hook" to immediately engage the viewer.
3. Ensure visual continuity (consistency in character appearance and environments) across all scenes.
4. The narrative flow must be logical, cohesive, and cinematic.

### JSON FORMAT SPECIFICATIONS:
Return ONLY a valid JSON object. Do not include any conversational filler, introductions, or markdown prose outside the JSON block.
  - "narrator": "The suggested voiceover text or dialogue for this scene.",
  - "imgPrompt": "Scene Description: [Detailed environment, subjects, clothing, and expressions]. Scene Composition: [Lens type, camera angle, and framing]. Lighting and Mood: [Atmosphere, lighting conditions, and color palette]. Art Style: {{{artStyle}}}",
  - "motionPrompt": "Technical description of the camera movement and character actions (e.g., 'Slow zoom in', 'Pan left to right', 'Cinematic drone shot')."

### TECHNICAL CONSTRAINTS:
- Image prompts must be descriptive and objective. Avoid abstract adjectives like "stunning" or "amazing"; use photographic and cinematographic terminology instead.
- Content must strictly adhere to safety guidelines (no explicit violence or restricted content).
- The "motionPrompt" should describe both character action and camera physics.
- Each scene should be around 8 seconds long.

### USER INPUTS:
Art Style: 
{{{artStyle}}}

User Story: 
{{{story}}}

Response in JSON format:`,
});
