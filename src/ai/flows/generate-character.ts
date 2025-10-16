'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a main character for a story.
 *
 * - generateCharacter - A function that handles the character generation process.
 * - GenerateCharacterInput - The input type for the generateCharacter function.
 * - GenerateCharacterOutput - The return type for the generateCharacter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateImage } from './image-generation/generate-image';

const GenerateCharacterInputSchema = z.object({
  story: z.string().describe('The story or theme to base the character on.'),
  artStyle: z.string().describe('The art style to use for the character image.'),
});
export type GenerateCharacterInput = z.infer<typeof GenerateCharacterInputSchema>;

const CharacterDetailsSchema = z.object({
    name: z.string().describe("The character's name."),
    description: z.string().describe("A brief description of the character's personality and background."),
    imgPrompt: z.string().describe("A detailed prompt for generating the character's image, including clothing and style."),
});

const GenerateCharacterOutputSchema = CharacterDetailsSchema.extend({
    imageDataUri: z.string().describe("The generated image of the character as a data URI.").optional(),
});
export type GenerateCharacterOutput = z.infer<typeof GenerateCharacterOutputSchema>;


export async function generateCharacterDetails(input: GenerateCharacterInput): Promise<GenerateCharacterOutput> {
  const characterDetails = await generateCharacterDetailsFlow(input);
  if (!characterDetails) {
    throw new Error('Failed to generate character details.');
  }

  return characterDetails;
}

export async function generateCharacterImage(input: { characterDetails: Omit<GenerateCharacterOutput, 'imageDataUri'>; artStyle: string; }): Promise<{
    imageDataUri: string;
}> {
  const { characterDetails, artStyle } = input;
  const characterImage = generateImage({
            prompt: `Full-body portrait of a character named ${characterDetails.name}.
              imgPrompt: ${characterDetails.imgPrompt}.`,
            artStyle: artStyle,
            aspectRatio: '1:1',
  });
  return characterImage;
}

const generateCharacterDetailsFlow = ai.defineFlow(
  {
    name: 'generateCharacterDetailsFlow',
    inputSchema: GenerateCharacterInputSchema,
    outputSchema: CharacterDetailsSchema,
  },
  async (input) => {
    console.log('Generating character details for story:', input.story);
    const { output } = await generateCharacterDetailsPrompt(input);

    if (!output) {
      throw new Error('Failed to generate character details.');
    }
    return output;
  }
);


const generateCharacterDetailsPrompt = ai.definePrompt({
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
