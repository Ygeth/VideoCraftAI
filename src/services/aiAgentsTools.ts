
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

export async function saveFile(file: File, mediaType: 'video' | 'image' | 'audio' | 'tmp'): Promise<{ id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', mediaType);

    console.log(`Saving file...`);

    const response = await fetch('/api/media-storage', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        console.error(`Failed to save file. Status: ${response.status}. Message: ${error.message}`);
        throw new Error(error.message || `Failed to save file: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`File saved with id: ${result.id}`);
    return result;
}