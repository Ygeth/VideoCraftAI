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

export const nanoBananaAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash-image-preview',
});

export const videoAI = genkit({
  plugins: [googleAI()],
  // model: 'googleai/veo-3.0-generate-001',
  model: 'googleai/veo-3.0-fast-generate-001',
});