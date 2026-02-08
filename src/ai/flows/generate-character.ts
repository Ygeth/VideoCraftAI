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
import {
  GenerateCharacterInputSchema,
  type GenerateCharacterInput,
  CharacterDetailsSchema,
  generateCharacterDetailsPrompt,
  characterImagePromptTemplate
} from '@/ai/prompts/gen-text/character';

export type { GenerateCharacterInput };

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
    prompt: characterImagePromptTemplate(characterDetails.name, characterDetails.imgPrompt),
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
