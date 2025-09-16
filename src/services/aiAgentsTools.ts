export interface StorageFile {
    id: string;
}

export async function getStoriesFromTopics(url: string): Promise<StorageFile[]> {
    console.log(`Calling Reddit proxy to get stories from: ${url}`);
    // We call our own API route which will then call Reddit.
    // This is to avoid CORS issues.
    const response = await fetch(`/api/reddit-stories?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
        const error = await response.json();
        console.error(`Failed to fetch stories from proxy. Status: ${response.status}. Message: ${error.message}`);
        throw new Error(error.message || `Failed to fetch stories: ${response.statusText}`);
    }

    const stories = await response.json();
    console.log(`Received ${stories.length} stories from proxy.`);
    return stories;
}

const mediaStorageUrl = '/api/media-storage';

export async function saveFile(file: File, mediaType: 'video' | 'image' | 'audio' | 'tmp'): Promise<{ file_id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('media_type', mediaType);

    try {
        const response = await fetch(mediaStorageUrl, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to save file. Status: ${response.status}. Message: ${error.message}`);
            throw new Error(error.message || `Failed to save file: ${response.statusText}`);
            
        }
        const result = await response.json();
        console.log(`File saved with id: ${result.file_id}`);
        return result;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }

}

export async function saveFileBase64(base64: string, mediaType: 'video' | 'image' | 'audio' | 'tmp'): Promise<{ id: string }> {
    const response = await fetch(base64);
    const blob = await response.blob();
    const file = new File([blob], `file.${blob.type.split('/')[1]}`, { type: blob.type });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('media_type', mediaType);

    const apiResponse = await fetch(mediaStorageUrl, {
        method: 'POST',
        body: formData,
    });

    if (!apiResponse.ok) {
        const error = await apiResponse.json();
        console.error(`Failed to save file. Status: ${apiResponse.status}. Message: ${error.message}`);
        throw new Error(error.message || `Failed to save file: ${apiResponse.statusText}`);
    }

    const result = await apiResponse.json();
    console.log(`File saved with id: ${result.file_id}`);
    return result;
}

export async function downloadFile(fileId: string): Promise<Blob> {
    const url = `${mediaStorageUrl}/${fileId}`;
    console.log(`Downloading file from: ${url}`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to download file. Status: ${response.status}. Message: ${errorText}`);
            throw new Error(`Failed to download file: ${response.statusText}`);
        }

        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

import { z } from 'zod';

export const ttsVideoConfigSchema = z.object({
    caption_config_line_count: z.number().default(2).describe('Number of lines for captions.'),
    caption_config_line_max_length: z.number().default(15).describe('Maximum length of each caption line.'),
    caption_config_font_size: z.number().optional().default(80).describe('Font size for captions.'),
    caption_config_font_color: z.string().optional().default('#FFFFFF').describe('Font color for captions in HEX format.'),
    caption_config_font_bold: z.boolean().optional().default(true).describe('Whether the caption font should be bold.'),
    caption_config_subtitle_position: z.enum(['top', 'bottom']).optional().default('bottom').describe('Position of the subtitles on the video.'),
    image_effect: z.string().optional().default('pan').describe('Effects to apply to the image, e.g., "zoom in", "pan left".'),  
});
export type ttsVideoConfig = z.infer<typeof ttsVideoConfigSchema>;
export async function generateTTSCaptionedVideo(imageId: string, audioId: string, text: string, config?: ttsVideoConfig): Promise<{ file_id: string }> { 
    const finalConfig = config || ttsVideoConfigSchema.parse({});
    // randomize finalConfig.image_effect between "ken_burns", "pan", "still"
    const effects = ['ken_burns', 'pan', 'still'];
    finalConfig.image_effect = effects[Math.floor(Math.random() * effects.length)];

    const formData = new FormData();
    formData.append('background_id', imageId);
    formData.append('audio_id', audioId);
    formData.append('text', text);
    formData.append('caption_config_line_count', finalConfig.caption_config_line_count.toString());
    formData.append('caption_config_line_max_length', finalConfig.caption_config_line_max_length.toString());
    formData.append('caption_config_font_size', finalConfig.caption_config_font_size?.toString() || '80');
    formData.append('caption_config_font_color', finalConfig.caption_config_font_color || '#FFFFFF');
    formData.append('caption_config_font_bold', finalConfig.caption_config_font_bold ? 'true' : 'false');
    formData.append('caption_config_subtitle_position', finalConfig.caption_config_subtitle_position || 'bottom');
    formData.append('image_effect', finalConfig.image_effect || 'still');


    const videoGenerationUrl = '/api/generate-tts-captioned-video';

    try {
        const response = await fetch(videoGenerationUrl, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to generate video. Status: ${response.status}. Message: ${error.message}`);
            throw new Error(error.message || `Failed to generate video: ${response.statusText}`);
            
        }
        const result = await response.json();
        console.log(`Video generated with id: ${result.file_id}`);
        return result;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

export async function mergeVideos(videoIds: string[], backgroundMusicId?: string, backgroundMusicVolume?: number): Promise<{ file_id: string }> {
    const formData = new FormData();
    formData.append('video_ids', videoIds.join(','));
    formData.append('background_music_id', backgroundMusicId ?? "");
    formData.append('background_music_volume', backgroundMusicVolume?.toString() ?? "0.2");

    console.log(`Merging videos...`);
    console.log(formData.get('video_ids'));
    console.log(formData.get('background_music_id'));
    console.log(formData.get('background_music_volume'));
    const videoMergeUrl = '/api/video-merge';

    try {
        const response = await fetch(videoMergeUrl, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to merge videos. Status: ${response.status}. Message: ${error.message}`);
            throw new Error(error.message || `Failed to merge videos: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(`Videos merged with id: ${result.file_id}`);
        return result;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

export async function addColorkeyOverlay(videoId: string, overlayVideoId: string, color: string): Promise<{ file_id: string }> {
    const formData = new FormData();
    formData.append('video_id', videoId);
    formData.append('overlay_video_id', overlayVideoId);
    formData.append('color', color);

    console.log(`Adding colorkey overlay...`);
    const addOverlayUrl = '/api/add-colorkey-overlay';

    try {
        const response = await fetch(addOverlayUrl, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to add colorkey overlay. Status: ${response.status}. Message: ${error.message}`);
            throw new Error(error.message || `Failed to add colorkey overlay: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(`Colorkey overlay added, new video id: ${result.file_id}`);
        return result;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

export async function checkStatus(file_id: string): Promise<string> {
    const url = `${mediaStorageUrl}/${file_id ?? 0}/status`;
    console.log(`Checking status for file: ${file_id}`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to check status. Status: ${response.status}. Message: ${errorText}`);
            throw new Error(`Failed to check status: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`Status for file ${file_id} is: ${result.status}`);
        return result.status;
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

