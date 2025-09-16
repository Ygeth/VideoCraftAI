import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const externalServiceUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}/api/v1/media/video-tools/generate/tts-captioned-video`;

    const response = await fetch(externalServiceUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Failed to generate video from external service. Status: ${response.status}. Message: ${error.message}`);
      return NextResponse.json({ message: error.message || `Failed to generate video: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in video generation proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
