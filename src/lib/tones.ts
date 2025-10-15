export interface Tone {
  name: string;
  voice: string;
  tonePrompt: string;
}

export const tones: Tone[] = [
  {
    name: 'F Standard',
    voice: 'Autonoe',
    tonePrompt: 'In a clear and engaging tone: ',
  },
  {
    name: 'M Spooky',
    voice: 'Enceladus',
    tonePrompt: 'In ominous tone, fast speaking: ',
  },
  {
    name: 'M Serious - Energetic',
    voice: 'Enceladus',
    tonePrompt: 'In a ominous and energetic tone, fast speaking: ',
  },
  {
    name: 'F Excited - Nervous',
    voice: 'Autonoe',
    tonePrompt: 'In a excited and nervous, engaging tone: ',
  },
];

export const defaultTone = tones[0];