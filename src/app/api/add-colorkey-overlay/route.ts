import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video_id = formData.get('video_id') as string;
    const overlay_video_id = formData.get('overlay_video_id') as string;
    const color = formData.get('color') as string;

    if (!video_id || !overlay_video_id || !color) {
      return NextResponse.json({ message: 'Missing required parameters: video_id, overlay_video_id, and color are required.' }, { status: 400 });
    }

    const externalServiceUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}/api/v1/media/video-tools/add-colorkey-overlay`;

    const proxyFormData = new FormData();
    proxyFormData.append('video_id', video_id);
    proxyFormData.append('overlay_video_id', overlay_video_id);
    proxyFormData.append('color', color);

    const response = await fetch(externalServiceUrl, {
      method: 'POST',
      body: proxyFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Failed to add colorkey overlay in external service. Status: ${response.status}. Message: ${error.message}`);
      return NextResponse.json({ message: error.message || `Failed to add colorkey overlay: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in add-colorkey-overlay proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
