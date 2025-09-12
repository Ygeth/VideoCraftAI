
export interface RedditStory {
    id: string;
    title: string;
    selftext: string;
}

export async function getStoriesFromTopics(url: string): Promise<RedditStory[]> {
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
