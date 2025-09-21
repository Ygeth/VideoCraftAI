import { NextRequest, NextResponse } from 'next/server';
import { generateVideoFromScene } from '@/ai/flows/generate-video-from-scene';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const scenes = JSON.parse(data.get('scenes') as string);

  for (const scene of scenes) {
    const firstImage = data.get(`firstImage-${scene.id}`) as File;
    const lastImage = data.get(`lastImage-${scene.id}`) as File;

    let imageDataUri = '';
    if (firstImage) {
      const buffer = Buffer.from(await firstImage.arrayBuffer());
      imageDataUri = `data:${firstImage.type};base64,${buffer.toString('base64')}`;
    } else if (lastImage) {
      const buffer = Buffer.from(await lastImage.arrayBuffer());
      imageDataUri = `data:${lastImage.type};base64,${buffer.toString('base64')}`;
    }

    const videoOutput = await generateVideoFromScene({
      motionScene: scene.script,
      narration: scene.script,
      imageDataUri,
    });

    const videoBuffer = Buffer.from(videoOutput.videoDataUri.split(',')[1], 'base64');
    const videoPath = path.join('/tmp', `video-${scene.id}.mp4`);
    fs.writeFileSync(videoPath, videoBuffer);
    videoPaths.push(videoPath);
  }

  const mergedVideoPath = path.join('/tmp', `merged-video-${Date.now()}.mp4`);

  await new Promise((resolve, reject) => {
    const command = ffmpeg();
    videoPaths.forEach(videoPath => {
      command.input(videoPath);
    });

    command
      .on('error', (err) => {
        console.error('Error merging videos:', err);
        reject(err);
      })
      .on('end', () => {
        console.log('Videos merged successfully');
        resolve(mergedVideoPath);
      })
      .mergeToFile(mergedVideoPath, '/tmp');
  });

  const mergedVideoBuffer = fs.readFileSync(mergedVideoPath);
  const mergedVideoDataUri = `data:video/mp4;base64,${mergedVideoBuffer.toString('base64')}`;

  videoPaths.forEach(videoPath => fs.unlinkSync(videoPath));
  fs.unlinkSync(mergedVideoPath);

  return NextResponse.json({ videoDataUri: mergedVideoDataUri });
}
