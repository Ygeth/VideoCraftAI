import { config } from 'dotenv';
config();

import '@/ai/flows/generate-video-from-scene.ts';
import '@/ai/flows/preview-with-ai-suggestions.ts';
import '@/ai/flows/generate-video-script.ts';
import '@/ai/flows/generate-narration-audio.ts';
import '@/ai/flows/generate-audio-kokoro.ts';
import '@/ai/flows/short-videos/generate-image-fal';
import '@/ai/flows/short-videos/generate-image-gemini';
import '@/ai/flows/short-videos/generate-image';
import '@/ai/flows/short-videos/generate-script-short-gemini';
import '@/ai/flows/short-videos/generate-script-short-multipleimg-gemini';
import '@/ai/flows/short-videos/generate-speech-gemini';
import '@/ai/flows/veo3-videos/generate-video-scene';
import '@/ai/flows/veo3-videos/veo3-prompt-enchancer';
import '@/ai/tools/fetch-url.ts';
