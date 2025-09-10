
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redditUrl = searchParams.get('url');

  if (!redditUrl) {
    return NextResponse.json({ message: 'Reddit URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(redditUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (!response.ok) {
        console.error("Reddit API request failed with status:", response.status, response.statusText);
        const errorText = await response.text();
        console.error('Reddit API Error Body:', errorText);
        return NextResponse.json({ message: `Failed to fetch from Reddit: ${response.statusText}` }, { status: response.status });
    }

    const json = await response.json();
    const stories = json.data.children;

    const filteredStories = stories
        .map((story: any) => story.data)
        .filter((data: any) => 
            data.selftext &&
            data.selftext.length > 1500 &&
            !data.is_video &&
            data.media === null
        )
        .map((data: any) => ({
            id: data.id,
            title: data.title,
            selftext: data.selftext,
        }));

    return NextResponse.json(filteredStories);
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
