export interface ArtStyle {
  code?: string;
  name: string;
  prompt: string;
}

export const artStyles: ArtStyle[] = [
  {
    code: 'noir',
    name: 'Cinematic Noir',
    prompt: 'Scene: Highly cinematic with a moody, noir atmosphere, inspired by detective and crime thriller films from the 1970s and 1980s. The setting can be anything, from an interior room to a suburban street, depicted in a tense, suspenseful moment. Emphasize the following details:\n\n- **Lighting:** Strong directional lighting with deep shadows; use cool blue and teal color grading with subtle hints of warm light from lamps or windows. The lighting should cast dramatic shadows across the scene.\n- **Mood:** Mysterious, somber, and slightly surreal ambiance, evoking a sense of unease or suspense.\n- **Subjects:** Human figures should appear contemplative, searching, tense, or whatever the scene calls for.\n- **Color Palette:** Dominant cold blues and teals contrasted by occasional soft warm light from lamps or daylight through curtains. The overall tone should be desaturated and muted.\n- **Cinematic Framing:** Framed like a movie still, with careful composition and leading lines, sometimes viewed through doorways or windows for added depth.\n- **Exterior Scenes:** Overcast skies, muted and overexposed daylight.\n\n**Style influences:** Denis Villeneuve, David Fincher, *Zodiac*, *Mindhunter*, *True Detective*, Gregory Crewdson, neo-noir photography.'
  },
  {
    code: 'gothic',
    name: 'Gothic Illustration',
    prompt: "Gothic horror illustration, meticulously detailed in the style of Gustave Doré's intricate wood engravings and the macabre whimsy of Edward Gorey. The scene features cross-hatching so fine it creates a texture akin to woven fabric, with a focus on dramatic colored lighting that casts immense, oppressive shadows. The composition should convey an overwhelming sense of scale. The overall atmosphere should be profoundly ominous, atmospheric, and melancholic, capturing the terror of the unseen."
  },
  {
    code: 'watercolor',
    name: 'Watercolor Illustration',
    prompt: 'soft watercolor and colored pencil illustration, gentle and warm color palette, dreamy atmosphere, intimate slice-of-life, sketchbook style, focus on character emotion, golden hour lighting'
  },
  {
    code: 'anime',
    name: 'Anime',
    prompt: 'A vibrant and detailed anime style, with expressive characters, dynamic action poses, and beautifully rendered backgrounds. Emphasize sharp lines, bright colors, and dramatic lighting effects. Style influences: Your Name by Makoto Shinkai, modern shonen anime.'
  },
  {
    code: 'pixar',
    name: 'Pixar',
    prompt: 'A charming and whimsical 3D animation style reminiscent of Pixar films. Focus on appealing character designs with expressive faces, detailed textures, and warm, inviting lighting. The world should feel lived-in and full of personality. Style influences: *Toy Story*, *Up*, *Coco*.'
  },
  {
    code: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: 'A futuristic and gritty cyberpunk aesthetic. Neon-drenched cityscapes with towering skyscrapers. Characters feature cybernetic enhancements and futuristic fashion. Strong use of contrast between light and shadow. Style influences: *Blade Runner*, *Cyberpunk 2077*, *Ghost in the Shell*.'
  },

];

export const defaultArtStyle = artStyles[0];
