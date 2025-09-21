import { Tone, tones } from './tones';
import { artStyles } from './artstyles';
export interface Style {
  name: string;
  description?: string;
  tone: Tone;
  bgMusicUrl: string | null;
  overlayUrl: string | null;
  artStyle: string;
}

export const styles: Style[] = [
  {
    name: 'Friendly - Aquarela',
    description: 'A soft, warm, and inviting style with watercolor and colored pencil illustrations.',
    tone: tones.find(t => t.name === 'F Friendly')!,
    bgMusicUrl: '/music/bg_friendly_daydream.mp3',
    overlayUrl: null,
    artStyle: artStyles.find(a => a.code === 'watercolor')!.prompt,
  },
  {
    name: 'Spooky - Gothic Ilustration',
    description: "A dark, eerie scene with gothic horror elements, inspired by classic horror illustrations.",
    tone: tones.find(t => t.name === 'M Spooky')!,
    bgMusicUrl: '/music/bg_spooky.mp3',
    overlayUrl: null, // '/video/bg_1.mp4',
    artStyle: artStyles.find(a => a.code === 'gothic')!.prompt,
  },
  {
    name: 'Detective Serious - No Overlay',
    description: "A highly cinematic scene with a moody, noir atmosphere, inspired by detective and crime thriller films from the 1970s and 1980s.",
    tone: tones.find(t => t.name === 'M Serious - Energetic')!,
    bgMusicUrl: '/music/bg_spooky.mp3',
    overlayUrl: null,
    artStyle: artStyles.find(a => a.code === 'noir')!.prompt,
  },
];

export const defaultStyle = styles[0];