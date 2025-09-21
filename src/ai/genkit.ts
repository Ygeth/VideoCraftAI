import {genkit} from 'genkit';
import { googleAI} from '@genkit-ai/googleai'; // GenAI

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

export const imageAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/imagen-4.0-fast-generate-001',
});

export const videoAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/veo-3.0-fast-generate-001',
});