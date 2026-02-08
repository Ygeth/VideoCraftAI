import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const StoryboardInputSchema = z.object({
  story: z.string().describe('The story to use as inspiration for the video script.'),
  artStyle: z.string().describe('The art style to use for the video script image prompts.'),
  character: z.string().optional().describe('The main character name to include in the video script.'),
  tone: z.string().optional().describe('The tone or mood of the video, e.g., humorous, dramatic, inspirational.'),
});
export type StoryboardInput = z.infer<typeof StoryboardInputSchema>;

export const StoryboardSceneSchema = z.object({
  title: z.string().describe('A concise title for the scene.'),
  description: z.string().describe('A detailed description of the scene, including actions and setting.'),
  imagePrompt: z.string().describe('A detailed prompt for generating the scene image, following the specified art style.'),
  showCharacter: z.boolean().describe('Whether the character should be shown in the scene.'),
  shotType: z.string().describe('The type of shot, e.g., "Close-up", "Medium Shot", "Wide Shot".'),
  cameraAngle: z.string().describe('The camera angle, e.g., "Low Angle", "High Angle", "Eye-level".'),
  lighting: z.string().describe('The lighting style, e.g., "Bright", "Dim", "Dramatic".'),
  mood: z.string().describe('The emotional mood of the scene, e.g., "Joyful", "Suspenseful", "Calm".'),
  motionPrompt: z.string().describe('Technical description of the camera movement and character actions.'),
  voiceover: z.string().describe('The voiceover text for the scene.').optional(),
  imageUrl: z.string().optional().describe('The URL of the generated image for this scene. NOT FILL BY THE LLM'),
  audioUrl: z.string().optional().describe('The URL of the generated audio for this scene. NOT FILL BY THE LLM'),
});
export type StoryboardScene = z.infer<typeof StoryboardSceneSchema>;

export const StoryboardOutputSchema = z.object({
  story: z.string().describe('The refined story used for generating the video script.'),
  technicalGuide: z.string().describe('A technical guide for producing the video, including camera angles, lighting, and other production notes.'),
  scenes: z.array(StoryboardSceneSchema).describe('An array of scenes detailing the storyboard.'),
});
export type StoryboardOutput = z.infer<typeof StoryboardOutputSchema>;

export const generateScriptStoryboardPrompt = ai.definePrompt({
  model: 'googleai/gemini-2.5-flash',
  name: 'generateScriptStoryboardPrompt',
  input: { schema: StoryboardInputSchema },
  output: { schema: StoryboardOutputSchema },
  prompt: `Act as a Senior Art Director and Cinematic Scriptwriter. Your mission is to transform a basic story into a captivating visual storyboard, optimized for AI image generators (e.g., Midjourney, DALL-E) and video synthesis tools (e.g., Runway, Luma, Pika).

### NARRATIVE GUIDELINES:
1. Based on the "User Story," expand or adapt the narrative to maximize emotional impact, pacing, and visual storytelling.
2. The first scene MUST start with a visual "Hook" to immediately engage the viewer.
3. Ensure visual continuity (consistency in character appearance and environments) across all scenes.
4. The narrative flow must be logical, cohesive, and cinematic.

### JSON FORMAT SPECIFICATIONS:
Return ONLY a valid JSON object. Do not include any conversational filler, introductions, or markdown prose outside the JSON block.
  - "title": "A concise title for the scene.",
  - "description": "A detailed description of the scene, including actions and setting.",
  - "shotType": "The type of shot (e.g., Close-up, Wide Shot).",
  - "cameraAngle": "The camera angle (e.g., Low Angle, Eye-level).",
  - "lighting": "The lighting style (e.g., Dramatic, Soft).",
  - "mood": "The emotional mood of the scene.",
  - "voiceover": "The suggested voiceover text or dialogue for this scene.",
  - "imagePrompt": "Scene Description: [Detailed environment, subjects, clothing, and expressions]. Scene Composition: [Lens type, camera angle, and framing]. Lighting and Mood: [Atmosphere, lighting conditions, and color palette]. Art Style: {{{artStyle}}}",
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

Response in JSON format:
`,
});
