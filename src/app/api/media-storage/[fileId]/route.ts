import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
  try {
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json({ message: 'File ID is missing' }, { status: 400 });
    }

    const externalServiceUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}/api/v1/media/storage/${fileId}`;

    console.log(`Fetching file from: ${externalServiceUrl}`);
    const response = await fetch(externalServiceUrl);

    console.log(response);

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
