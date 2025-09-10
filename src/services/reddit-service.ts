
export interface RedditStory {
    id: string;
    title: string;
    selftext: string;
}

export async function getStoriesFromTopics(url: string): Promise<RedditStory[]> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    const json = await response.json();
    const stories = json.data.children;

    return stories
        .map((story: any) => story.data)
        .filter((data: any) => 
            data.selftext &&
            data.selftext.length > 1500 &&
            !data.is_video &&
            data.media === null
        )
        .map((data: any): RedditStory => ({
            id: data.id,
            title: data.title,
            selftext: data.selftext,
        }));
}
