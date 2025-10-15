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
    clothing: z.string().describe("Details about the character's typical clothing."),
    skills: z.array(z.string()).describe("A list of the character's key skills or abilities."),
});

const GenerateCharacterOutputSchema = CharacterDetailsSchema.extend({
    imageDataUri: z.string().describe("The generated image of the character as a data URI.").optional(),
});
export type GenerateCharacterOutput = z.infer<typeof GenerateCharacterOutputSchema>;


export async function generateCharacter(input: GenerateCharacterInput): Promise<GenerateCharacterOutput> {
  const characterDetails = await generateCharacterDetailsFlow(input);
  if (!characterDetails) {
    throw new Error('Failed to generate character details.');
  }

  const imagePrompt = `Full-body portrait of a character named ${characterDetails.name}.
Description: ${characterDetails.description}.
Clothing: ${characterDetails.clothing}.
Art Style: ${input.artStyle}.`;
  
  try {
    const image = await generateImage({
      prompt: imagePrompt,
      artStyle: input.artStyle,
      aspectRatio: '1:1',
    });

    return {
      ...characterDetails,
      imageDataUri: image.imageDataUri,
    };
    
  } catch (error) {
    console.error("Error generating character image, returning details only.", error);
    return {
      ...characterDetails,
      imageDataUri: undefined,
    }
  }
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
