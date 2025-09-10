
import axios from 'axios';

export interface RedditStory {
    id: string;
    title: string;
    selftext: string;
}

export async function getStoriesFromTopics(url: string): Promise<RedditStory[]> {
    console.log("getStoriesFromTopics with axios");
    const response = await axios.get(url);

    if (response.status !== 200) {
        throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    const json = response.data;
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
