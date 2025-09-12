import {NextRequest, NextResponse} from 'next/server';
import {JSDOM} from 'jsdom';

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const url = searchParams.get('url');

  console.log(`Fetching content from URL: ${url}`);

  if (!url) {
    console.error('URL is required but was not provided.');
    return NextResponse.json({message: 'URL is required'}, {status: 400});
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch from URL. Status: ${response.status} ${response.statusText}. URL: ${url}. Body: ${errorText}`);
      return NextResponse.json(
        {message: `Failed to fetch from URL: ${response.statusText}`},
        {status: response.status}
      );
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Remove script and style elements
    doc.querySelectorAll('script, style').forEach(el => el.remove());

    // Get text content
    const textContent = doc.body.textContent || '';
    const cleanText = textContent.replace(/\s+/g, ' ').trim();

    console.log(`Successfully fetched and parsed content from ${url}.`);
    return NextResponse.json({content: cleanText});
  } catch (error: any) {
    console.error(`Error in URL fetch proxy for URL: ${url}. Error:`, error);
    return NextResponse.json(
      {message: 'An internal server error occurred', error: error.message},
      {status: 500}
    );
  }
}
