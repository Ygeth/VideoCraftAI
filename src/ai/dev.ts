import { config } from 'dotenv';
config();

import '@/ai/flows/generate-video-from-scene.ts';
import '@/ai/flows/preview-with-ai-suggestions.ts';
import '@/ai/flows/generate-video-script.ts';
import '@/ai/flows/short-videos/generate-image-fal';
import '@/ai/flows/generate-image-gemini-image.ts';
import '@/ai/flows/generate-narration-audio.ts';
import '@/ai/flows/generate-audio-kokoro.ts';
import '@/ai/tools/fetch-url.ts';
