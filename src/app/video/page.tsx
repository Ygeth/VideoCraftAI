'use client';

import React from 'react';
import { ShortGenerator } from '@/components/video/shortGenerator';
import { Scene, ImageOutput } from '@/ai/flows/short-videos/schemas';
import { useState } from 'react';
import defaultArtStyle from '@/lib/art-style-default.json';
import defaultScenes from '@/lib/default-scenes.json';
import { generateScriptShort, GenerateScriptShortOutput } from '@/ai/flows/short-videos/generate-script-short-gemini';
import { useToast } from '@/hooks/use-toast';
import { saveFile, generateTTSCaptionedVideo, downloadFile, mergeVideos, addColorkeyOverlay, checkStatus } from '@/services/aiAgentsTools';
import { audioTestData } from '@/lib/audio-test-data';
import { imageTestData } from '@/lib/image-test-data';
import { SelectLabel } from '@radix-ui/react-select';
import { generateImageGemini } from '@/ai/flows/short-videos/generate-image-gemini';
import { generateSpeech } from '@/ai/flows/short-videos/generate-speech-gemini';

async function dataUriToToFile(dataUri: string, fileName: string): Promise<File> {
  const response = await fetch(dataUri);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}

export default function VideoPage() {
  const { toast } = useToast();
  const [story, setStory] = useState('A short video about sustainable farming');
  const [artStyle, setArtStyle] = useState(defaultArtStyle.art_style);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [scenes, setScenes] = useState<GenerateScriptShortOutput>({ scenes: [] });
  const [finalVideoId, setFinalVideoId] = useState<string | null>(null);
  const [backgroundMusicId, setBackgroundMusicId] = useState<string | undefined>(undefined);

  const generateScript = async () => {
    setIsLoading('Generating script...');
    try {
      const scriptOutput: GenerateScriptShortOutput = await generateScriptShort({ story, artStyle });
      // const scriptOutput: GenerateScriptShortOutput = {
      //   scenes: defaultScenes.scenes.map((scene, index) => ({
      //     id: `${Date.now()}-${index}`,
      //     narrator: scene.narrator,
      //     imgPrompt: scene.imgPrompt,
      //     motionScene: scene.motionScene,
      //   })),
      // };
      setScenes(scriptOutput);
      toast({ title: 'Script Scenes Generated Successfully' });

      setIsLoading('Generating images, audio and videos...');
      const updatedScenes = await Promise.all(scriptOutput.scenes.map(async (scene) => {
        const imageId = await generateImageForScene(scene);
        const audioId = await generateAudioForScene(scene);
        
        let videoTTSId: string | undefined;
        if (imageId && audioId) {
          await pollFileStatus(imageId);
          await pollFileStatus(audioId);
          const tempScene = { ...scene, imageStorageId: imageId, audioStorageId: audioId };
          videoTTSId = await generateVideoForScene(tempScene);
        }
        return { ...scene, imageStorageId: imageId, audioStorageId: audioId, videoTTSId: videoTTSId };
      }));

      
      // Añadir Musica de fondo
      //upload overlay from public/music/.mp4 
      const bgMusicResponse = await fetch('/music/bg_music.mp3');
      const bgMusicBlob = await bgMusicResponse.blob();
      const bgMusicFile = new File([bgMusicBlob], 'bg_music.mp3', { type: 'audio/mpeg' });
      const savedBgMusic = await saveFile(bgMusicFile, 'audio');

      await pollFileStatus(savedBgMusic.file_id);
      setBackgroundMusicId(savedBgMusic.file_id);
      setScenes({ scenes: updatedScenes });

      toast({ title: 'Images, Audio and Scene Videos Generated Successfully' });

    } catch (error) {
      console.error('Error generating script, images, or audio:', error);
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: 'Could not generate the script, images or audio. Please try again.',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const generateImageForScene = async (scene: Scene): Promise<string | undefined> => {
    setIsLoadingImages(true);
    try {
      // const image: ImageOutput = await new Promise(resolve => setTimeout(() => {
      //   resolve({ imageDataUri: imageTestData });
      // }, 2000));
      const image = await generateImageGemini({ prompt: scene.imgPrompt, artStyle: artStyle });
      scene.imageUrl = image.imageDataUri;

      if (image.imageDataUri && image.imageDataUri.startsWith('data:')) {
        const imageFile = await dataUriToToFile(image.imageDataUri, `scene-${scene.id}.png`);
        const imageSavedFile = await saveFile(imageFile, 'image');
        return imageSavedFile.file_id;
      }
    } catch (error) {
      console.error('Error generating image for scene:', error);
      toast({
        variant: 'destructive',
        title: 'Image generation failed',
        description: 'Could not generate the image for this scene. Please try again.',
      });
    } finally {
      setIsLoadingImages(false);
    }
  }

  const generateAudioForScene = async (scene: Scene): Promise<string | undefined> => {
    setIsLoadingAudio(true);
    try {
      // console.log('Generating audio for scene:', scene);
      // const audio: { audioDataUri: string } = await new Promise(resolve => setTimeout(() => {
      //   resolve({ audioDataUri: audioTestData });
      // }, 3000));
      const audio = await generateSpeech({ text: scene.narrator }); //, artStyle: artStyle });
      scene.audioUrl = audio.audioDataUri;
      if (audio.audioDataUri && audio.audioDataUri.startsWith('data:')) {
        const audioFile = await dataUriToToFile(audio.audioDataUri, `scene-${scene.id}.mp3`);
        const audioSavedFile = await saveFile(audioFile, 'audio');
        return audioSavedFile.file_id;
      }
    } catch (error) {
      console.error('Error generating audio for scene:', error);
      toast({
        variant: 'destructive',
        title: 'Audio generation failed',
        description: 'Could not generate audio for this scene. Please try again.',
      });
    } finally {
      setIsLoadingAudio(false);
    }
  }

  const generateVideoForScene = async (scene: Scene): Promise<string | undefined> => {
    setIsLoadingVideo(true);
    try {
      // Generar video con TTS y Captioning
      if (scene.imageStorageId && scene.audioStorageId && scene.narrator) {
        const video = await generateTTSCaptionedVideo(scene.imageStorageId, scene.audioStorageId, scene.narrator);
        console.log(`Video for scene ${scene.id} generated with ID: ${video.file_id}`);
        return video.file_id;
      } else {
        console.warn('Missing required data for video generation:', {
          imageStorageId: scene.imageStorageId,
          audioStorageId: scene.audioStorageId,
          narrator: scene.narrator,
        });
      }
    } catch (error) {
      console.error(`Error generating video for scene ${scene.id}:`, error);
      toast({
        variant: 'destructive',
        title: `Video generation failed for scene ${scene.id}`,
        description: 'Could not generate the video for this scene. Please try again.',
      });
    }finally {
      setIsLoadingVideo(false);
    }
  };
  

  const generateVideo = async (scenes: Scene[]) => {
    try {
      
      const finalVideo = await mergeVideos(scenes.map(s => s.videoTTSId).filter((id): id is string => !!id), backgroundMusicId, 0.3);
      // merge videos de todas las escenas
      console.log('Final video ID:', finalVideo);

      // Añadir overlay
      const overlayResponse = await fetch('/video/bg_1.mp4');
      const overlayBlob = await overlayResponse.blob();
      const overlayFile = new File([overlayBlob], 'bg_1.mp4', { type: 'video/mp4' });
      const savedOverlay = await saveFile(overlayFile, 'video');

      await pollFileStatus(finalVideo.file_id);
      await pollFileStatus(savedOverlay.file_id);
      const videoWithOverlay = await addColorkeyOverlay(finalVideo.file_id, savedOverlay.file_id, '#000000');
      await pollFileStatus(videoWithOverlay.file_id);
      
      setFinalVideoId(videoWithOverlay.file_id);
      handleDownloadFinalVideo()

    } catch (error) {
      console.error('Error generating video:', error);
    }
  };

  const handleDownloadFinalVideo = async () => {
    if (finalVideoId) {
      try {
        const videoBlob = await downloadFile(finalVideoId);
        const url = window.URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'final_video.mp4';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading final video:', error);
        toast({
          variant: 'destructive',
          title: 'Download failed',
          description: 'Could not download the final video. Please try again.',
        });
      }
    }
  };

  const pollFileStatus = async (fileId: string) => {
    let status = '';
    let maxRetries = 10; // Limit to avoid infinite loops
    while (status !== 'ready' && maxRetries > 0) {
      try {
        status = await checkStatus(fileId);
        if (status === 'failed' || status === 'not_found') {
          throw new Error(`File processing failed or file not found. Status: ${status}`);
        }
        if (status !== 'ready') {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before polling again
        }
      } catch (error) {
        console.error(`Error polling status for file ${fileId}:`, error);
        // throw error;
      }
      maxRetries--;
    }
    return status;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Video Page</h1>
      </div>

      <ShortGenerator 
        story={story}
        setStory={setStory}
        artStyle={artStyle}
        setArtStyle={setArtStyle}
        isLoading={isLoading}
        isLoadingImages={isLoadingImages}
        isLoadingAudio={isLoadingAudio}
        isLoadingVideo={isLoadingVideo}
        onGenerateScript={ generateScript }
        onGenerateVideo={ generateVideo }
        scenes={scenes}
        setScenes={setScenes}
        finalVideoId={finalVideoId}
        onDownloadFinalVideo={handleDownloadFinalVideo}
      />
    </main>
  );
}
