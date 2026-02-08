import { z } from 'zod';

export const ImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  artStyle: z.string().describe('The art style to apply to the image.').optional(),
  aspectRatio: z.string().optional().describe('The aspect ratio for the generated image, e.g., "9:16" or "16:9".').optional(),
  characterImageDataUri: z.string().optional().describe('Optional data URI of a character image to use as a reference.'),
  showCharacter: z.boolean().optional().describe('Optional flag to indicate whether to show the character in the image.').optional(),
  styleImageDataUri: z.string().optional().describe('Optional data URI of a style reference image to use.'),
});
export type ImageInput = z.infer<typeof ImageInputSchema>;


export const ImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type ImageOutput = z.infer<typeof ImageOutputSchema>;
