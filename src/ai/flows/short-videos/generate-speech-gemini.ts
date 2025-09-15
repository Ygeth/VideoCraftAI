'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating narration audio from text.
 *
 * - generateSpeech - A function that handles the audio generation process.
 * - GenerateSpeechInput - The input type for the function.
 * - GenerateSpeechOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

export async function generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async input => {
    console.log('Generating narration audio with Gemini TTS:', input);
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {voiceName: 'Pulcherrima'},
            },
          },
        },
        prompt: input.text,
      });
      if (!media) {
        console.error('Gemini TTS returned no media.');
        throw new Error('no media returned');
      }
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      
      const wavData = await toWav(audioBuffer);
      const audioDataUri = `data:audio/wav;base64,${wavData}`;

      return { audioDataUri };
    } catch (error) {
      console.error("Error in generateSpeechFlow: ", error);
      throw error;
    }
  }
);

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

    let bufs: any[] = [];
    writer.on('error', (err) => {
      console.error('WAV encoding error:', err);
      reject(err);
    });
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
