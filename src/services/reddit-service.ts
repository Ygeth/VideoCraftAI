
export interface RedditStory {
    id: string;
    title: string;
    selftext: string;
}

export async function getStoriesFromTopics(url: string): Promise<RedditStory[]> {
    console.log("getStoriesFromTopics from proxy");
    // We call our own API route which will then call Reddit.
    // This is to avoid CORS issues.
    const response = await fetch(`/api/reddit-stories?url=${encodeURIComponent(url)}`);
    console.log(response);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to fetch stories: ${response.statusText}`);
    }

    const stories = await response.json();
    return stories;
}
