import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mediaType = formData.get('media_type') as string;

    if (!file) {
      return NextResponse.json({ message: 'No file found in the request' }, { status: 400 });
    }

    const externalServiceUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}/api/v1/media/storage`;

    const proxyFormData = new FormData();
    proxyFormData.append('file', file);
    proxyFormData.append('media_type', mediaType);

    const response = await fetch(externalServiceUrl, {
      method: 'POST',
      body: proxyFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Failed to save file to external service. Status: ${response.status}. Message: ${error.message}`);
      return NextResponse.json({ message: error.message || `Failed to save file: ${response.statusText}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in media storage proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
    try {
    console.log("GET")
      
    const fileId = request.url.split('/').pop();

    if (!fileId) {
        return NextResponse.json({ message: 'File ID is missing' }, { status: 400 });
    }

    const externalServiceUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}/api/v1/media/storage/${fileId}`;

    console.log(externalServiceUrl)
    const response = await fetch(externalServiceUrl);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch file from external service. Status: ${response.status}. Message: ${errorText}`);
        return new NextResponse(errorText, { status: response.status });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', blob.type);
    headers.set('Content-Length', blob.size.toString());

    return new NextResponse(blob, { status: 200, headers });
  } catch (error: any) {
    console.error('Error in media storage proxy (GET):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
