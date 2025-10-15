import { config } from 'dotenv';
config();

import '@/ai/flows/generate-video-from-scene.ts';
import '@/ai/flows/preview-with-ai-suggestions.ts';
import '@/ai/flows/generate-video-script.ts';
import '@/ai/flows/generate-narration-audio.ts';
import '@/ai
/flows/generate-audio-kokoro.ts';
import '@/ai/flows/image-generation/generate-image-fal';
import '@/ai/flows/image-generation/generate-image-gemini';
import '@/ai/flows/image-generation/generate-image';
import '@/ai/flows/image-generation/generate-script-short-gemini';
import '@/ai/flows/image-generation/generate-script-short-multipleimg-gemini';
import '@/ai/flows/image-generation/generate-speech-gemini';
import '@/ai/flows/veo3-videos/generate-video-scene';
import '@/ai/flows/veo3-videos/prompt-enchancer-veo3';
import '@/ai/flows/generate-character';
import '@/ai/tools/fetch-url.ts';
