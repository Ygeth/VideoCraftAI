'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating narration audio from text.
 *
 * - generateNarrationAudio - A function that handles the text-to-speech conversion.
 * - GenerateNarrationAudioInput - The input type for the generateNarrationAudio function.
 * - GenerateNarrationAudioOutput - The return type for the generateNarrationAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateNarrationAudioInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type GenerateNarrationAudioInput = z.infer<typeof GenerateNarrationAudioInputSchema>;

const GenerateNarrationAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
export type GenerateNarrationAudioOutput = z.infer<typeof GenerateNarrationAudioOutputSchema>;

export async function generateNarrationAudio(input: GenerateNarrationAudioInput): Promise<GenerateNarrationAudioOutput> {
  return generateNarrationAudioFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const generateNarrationAudioFlow = ai.defineFlow(
  {
    name: 'generateNarrationAudioFlow',
    inputSchema: GenerateNarrationAudioInputSchema,
    outputSchema: GenerateNarrationAudioOutputSchema,
  },
  async ({text}) => {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text,
      });

      if (!media) {
        throw new Error('no media returned');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavBase64 = await toWav(audioBuffer);
      
      return {
        audioDataUri: 'data:audio/wav;base64,' + wavBase64,
      };
  }
);
