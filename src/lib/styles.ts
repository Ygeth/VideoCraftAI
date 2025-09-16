import { Tone, tones } from './tones';

export interface Style {
  name: string;
  tone: Tone;
  bgMusicUrl: string | null;
  overlayUrl: string | null;
  artStyle: string;
}

export const styles: Style[] = [
  {
    name: 'Friendly',
    tone: tones.find(t => t.name === 'Friendly')!,
    bgMusicUrl: '/music/bg_friendly_daydream.mp3',
    overlayUrl: null,
    artStyle: 'soft watercolor and colored pencil illustration, gentle and warm color palette, dreamy atmosphere, intimate slice-of-life, sketchbook style, focus on character emotion, golden hour lighting',
  },
  {
    name: 'Spooky',
    tone: tones.find(t => t.name === 'Spooky')!,
    bgMusicUrl: '/music/bg_music.mp3',
    overlayUrl: '/video/bg_1.mp4',
    artStyle: "Scene: Highly cinematic with a moody, noir atmosphere, inspired by detective and crime thriller films from the 1970s and 1980s. The setting can be anything, from an interior room to a suburban street, depicted in a tense, suspenseful moment. Emphasize the following details:\n\n- **Lighting:** Strong directional lighting with deep shadows; use cool blue and teal color grading with subtle hints of warm light from lamps or windows. The lighting should cast dramatic shadows across the scene.\n- **Mood:** Mysterious, somber, and slightly surreal ambiance, evoking a sense of unease or suspense.\n- **Subjects:** Human figures should appear contemplative, searching, tense, or whatever the scene calls for.\n- **Color Palette:** Dominant cold blues and teals contrasted by occasional soft warm light from lamps or daylight through curtains. The overall tone should be desaturated and muted.\n- **Cinematic Framing:** Framed like a movie still, with careful composition and leading lines, sometimes viewed through doorways or windows for added depth.\n- **Exterior Scenes:** Overcast skies, muted and overexposed daylight.\n\n**Style influences:** Denis Villeneuve, David Fincher, *Zodiac*, *Mindhunter*, *True Detective*, Gregory Crewdson, neo-noir photography.",
  },
];

export const defaultStyle = styles[0];