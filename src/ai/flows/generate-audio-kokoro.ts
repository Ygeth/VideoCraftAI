'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating audio from text using Kokoro.
 *
 * - generateAudioKokoro - A function that handles the audio generation process.
 * - GenerateAudioKokoroInput - The input type for the function.
 * - GenerateAudioKokoroOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { kokoroInstance } from '@/services/kokoro';

const GenerateAudioKokoroInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voice: z.string().optional().describe('The voice to use for the audio generation.'),
});
export type GenerateAudioKokoroInput = z.infer<typeof GenerateAudioKokoroInputSchema>;

const GenerateAudioKokoroOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
  audioDuration: z.number().describe('The duration of the audio in seconds.')
});
export type GenerateAudioKokoroOutput = z.infer<typeof GenerateAudioKokoroOutputSchema>;

export async function generateAudioKokoro(input: GenerateAudioKokoroInput): Promise<GenerateAudioKokoroOutput> {
  return generateAudioKokoroFlow(input);
}

const generateAudioKokoroFlow = ai.defineFlow(
  {
    name: 'generateAudioKokoroFlow',
    inputSchema: GenerateAudioKokoroInputSchema,
    outputSchema: GenerateAudioKokoroOutputSchema,
  },
  async (input) => {
    // Default to a known stable voice if not provided
    const voiceToUse = input.voice || 'bf_isabella';

    const { audioWav, audioDuration } = await kokoroInstance.generate(input.text, voiceToUse as any);
    
    const audioDataUri = `data:audio/wav;base64,${Buffer.from(audioWav).toString('base64')}`;

    return {
      audioDataUri,
      audioDuration: audioDuration,
    };
  }
);
