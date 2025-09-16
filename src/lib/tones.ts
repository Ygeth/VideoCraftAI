export interface Tone {
  name: string;
  voice: string;
  tonePrompt: string;
}

export const tones: Tone[] = [
  {
    name: 'Spooky',
    voice: 'Enceladus',
    tonePrompt: 'In a ominous tone, fast speaking: ',
  },
  {
    name: 'Friendly',
    voice: 'Autonoe',
    tonePrompt: 'In a friendly and engaging tone: ',
  },
];

export const defaultTone = tones[0];