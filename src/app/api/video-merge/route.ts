import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Video merge request received');
    const formData = await request.formData();
    const video_ids = formData.get('video_ids') as string;
    const background_music_id = formData.get('background_music_id') as string | null;
    const background_music_volume = formData.get('background_music_volume') as string | null;

    console.log('Video IDs:', video_ids);
    console.log('Background Music ID:', background_music_id);
    console.log('Background Music Volume:', background_music_volume);

    if (!video_ids) {
      console.error('No video_ids found in the request');
      return NextResponse.json({ message: 'No video_ids found in the request' }, { status: 400 });
    }

    const externalServiceUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}/api/v1/media/video-tools/merge`;
    console.log('External service URL:', externalServiceUrl);

    const proxyFormData = new FormData();
    proxyFormData.append('video_ids', video_ids);

    if (background_music_id) {
      proxyFormData.append('background_music_id', background_music_id);
    }
    if (background_music_volume) {
      proxyFormData.append('background_music_volume', background_music_volume);
    }

    console.log('Proxying request to external service...');
    const response = await fetch(externalServiceUrl, {
      method: 'POST',
      body: proxyFormData,
    });

    console.log('Response from external service:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to merge videos in external service. Status: ${response.status}. Message: ${errorText}`);
      return NextResponse.json({ message: `Failed to merge videos: ${errorText}` }, { status: response.status });
    }

    const result = await response.json();
    console.log('Video merge successful:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in video merge proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
