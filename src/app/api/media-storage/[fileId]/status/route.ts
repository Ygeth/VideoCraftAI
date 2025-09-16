import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
  try {
    const { fileId } = await params;
    if (!fileId) {
      return NextResponse.json({ message: 'File ID is missing' }, { status: 400 });
    }

    const externalServiceUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}/api/v1/media/storage/${fileId}/status`;

    console.log(`Checking status from: ${externalServiceUrl}`);
    const response = await fetch(externalServiceUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to check status from external service. Status: ${response.status}. Message: ${errorText}`);
      return new NextResponse(errorText, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error in media storage status proxy (GET):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
