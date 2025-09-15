import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const mediaType = formData.get('mediaType') as string;

        if (!file) {
            return NextResponse.json({ message: 'No file found in the request' }, { status: 400 });
        }

        const externalApiUrl = `${process.env.AI_AGENTS_NO_CODE_TOOLS_URL}api/v1/media/storage`;

        const externalFormData = new FormData();
        externalFormData.append('file', file);
        externalFormData.append('mediaType', mediaType);

        const response = await fetch(externalApiUrl, {
            method: 'POST',
            body: externalFormData,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to save file to external storage. Status: ${response.status}. Message: ${error.message}`);
            return NextResponse.json({ message: error.message || `Failed to save file: ${response.statusText}` }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Error in media-storage proxy:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
