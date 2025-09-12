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
import { generate as generateKokoroAudio } from '@/services/kokoro/Kokoro';

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

    const { audio, sampling_rate, audioLength } = await generateKokoroAudio(input.text, voiceToUse as any);
    
    // Convert Float32Array to WAV ArrayBuffer
    const wavBuffer = encodeWAV(audio, sampling_rate);
    const audioDataUri = `data:audio/wav;base64,${Buffer.from(wavBuffer).toString('base64')}`;

    return {
      audioDataUri,
      audioDuration: audioLength,
    };
  }
);


function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    // fmt sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // Audio format 1 is PCM
    view.setUint16(22, 1, true); // 1 channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    // data sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write the PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
