import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateCharacterInputSchema = z.object({
  story: z.string().describe('The story or theme to base the character on.'),
  artStyle: z.string().describe('The art style to use for the character image.'),
});
export type GenerateCharacterInput = z.infer<typeof GenerateCharacterInputSchema>;

export const CharacterDetailsSchema = z.object({
    name: z.string().describe("The character's name."),
    description: z.string().describe("A brief description of the character's personality and background."),
    imgPrompt: z.string().describe("A detailed prompt for generating the character's image, including clothing and style."),
});
export type CharacterDetails = z.infer<typeof CharacterDetailsSchema>;

export const generateCharacterDetailsPrompt = ai.definePrompt({
  name: 'generateCharacterDetailsPrompt',
  input: { schema: GenerateCharacterInputSchema },
  output: { schema: CharacterDetailsSchema },
  prompt: `You are a creative writer. Based on the following story idea, create a compelling main character.
Provide a name, a detailed description of their personality and background, their clothing, and a list of their skills.

Story Idea:
{{{story}}}

Art Style for context:
{{{artStyle}}}

Generate the character details.`,
});

export const characterImagePromptTemplate = (name: string, imgPrompt: string) => 
  `Full-body portrait of a character named ${name}.
  imgPrompt: ${imgPrompt}.`;
