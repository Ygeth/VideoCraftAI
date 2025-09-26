'use client';

import React from 'react';
import { ShortGeneratorMultipleImages } from '@/components/video/shortGeneratorMultipleImages';
import { Scene, ImageOutput } from '@/ai/flows/image-generation/schemas';
import { useState } from 'react';
import defaultScenes from '@/lib/default-scenes.json';
import { generateScriptShort, GenerateScriptShortOutput } from '@/ai/flows/image-generation/generate-script-short-gemini';
import { useToast } from '@/hooks/use-toast';
import { saveFile, generateTTSCaptionedVideo, downloadFile, mergeVideos, addColorkeyOverlay, checkStatus } from '@/services/aiAgentsTools';
import { audioTestData } from '@/lib/audio-test-data';
import { imageTestData } from '@/lib/image-test-data';
import { SelectLabel } from '@radix-ui/react-select';
// import { generateImageGemini } from '@/ai/flows/image-generation/generate-image-gemini';
import { generateImage } from '@/ai/flows/image-generation/generate-image';
// import { generateImage as generateImageFal } from '@/ai/flows/image-generation/generate-image-fal';
import { generateSpeech } from '@/ai/flows/image-generation/generate-speech-gemini';
import { tones, defaultTone, Tone } from '@/lib/tones';
import { styles, defaultStyle, Style } from '@/lib/styles';
import { TaskQueue } from '@/lib/queue';

async function dataUriToToFile(dataUri: string, fileName: string): Promise<File> {
  const response = await fetch(dataUri);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}

export default function VideoMultipleImagesPage() {
  const { toast } = useToast();
  const [story, setStory] = useState('A short video about sustainable farming');
  const [artStyle, setArtStyle] = useState(defaultStyle.artStyle);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [scenes, setScenes] = useState<GenerateScriptShortOutput>({ scenes: [] });
  const [finalVideoId, setFinalVideoId] = useState<string | null>(null);
  const [backgroundMusicId, setBackgroundMusicId] = useState<string | undefined>(undefined);
  const [tone, setTone] = useState<Tone>(defaultTone);
  const [style, setStyle] = useState<Style>(defaultStyle);

  const handleStyleChange = (newStyle: Style) => {
    setStyle(newStyle);
    setTone(newStyle.tone);
    setArtStyle(newStyle.artStyle);
  };

  const generateScript = async () => {
    setIsLoading('Generating script...');
    try {
      const scriptOutput: GenerateScriptShortOutput = await generateScriptShort({ story, artStyle });
      setScenes(scriptOutput);
      toast({ title: 'Script Scenes Generated Successfully' });

      setIsLoading('Generating images, audio and videos...');
      
      const imageQueue = new TaskQueue(6000); // 10 images per minute
      const audioQueue = new TaskQueue(1000); // No limit specified, using 1 second
      const videoQueue = new TaskQueue(1000); // No limit specified, using 1 second

      const processScene = async (scene: Scene) => {
        const imageIds = await generateImageForScene(scene);
        const audioId = await generateAudioForScene(scene);

        let videoTTSId: string | undefined;
        // if (imageIds && imageIds.startImageId && audioId) {
        //   await pollFileStatus(imageIds.startImageId);
        //   await pollFileStatus(audioId);
        //   const tempScene = { ...scene, imageStorageId: imageIds.startImageId, audioStorageId: audioId };
        //   videoTTSId = await generateVideoForScene(tempScene);
        // }

        setScenes(prevScenes => ({
          ...prevScenes,
          scenes: prevScenes.scenes.map(s => 
            s.id === scene.id ? { ...s, imageStorageId: imageIds?.startImageId, audioStorageId: audioId, videoTTSId: videoTTSId } : s
          )
        }));
      };

      scriptOutput.scenes.forEach(scene => {
        imageQueue.add(() => processScene(scene));
      });

      // Añadir Musica de fondo
      if (style.bgMusicUrl) {
        const bgMusicResponse = await fetch(style.bgMusicUrl);
        const bgMusicBlob = await bgMusicResponse.blob();
        const fileName = style.bgMusicUrl.split('/').pop() || 'bg_music';
        const bgMusicFile = new File([bgMusicBlob], fileName, { type: bgMusicBlob.type });
        const savedBgMusic = await saveFile(bgMusicFile, 'audio');

        await pollFileStatus(savedBgMusic.file_id);
        setBackgroundMusicId(savedBgMusic.file_id);
      } else {
        setBackgroundMusicId(undefined);
      }

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

  const generateImageForScene = async (scene: Scene): Promise<{startImageId?: string, endImageId?: string} | undefined> => {
    setIsLoadingImages(true);
    try {
      const startImage = await generateImage({ prompt: scene.imgPromptStart, artStyle: artStyle });
      scene.startImageUrl = startImage.imageDataUri;

      const endImage = await generateImage({ prompt: scene.imgPromptEnd, artStyle: artStyle });
      scene.endImageUrl = endImage.imageDataUri;

      let startImageId, endImageId;

      if (startImage.imageDataUri && startImage.imageDataUri.startsWith('data:')) {
        const imageFile = await dataUriToToFile(startImage.imageDataUri, `scene-${scene.id}-start.png`);
        const imageSavedFile = await saveFile(imageFile, 'image');
        startImageId = imageSavedFile.file_id;
      }

      if (endImage.imageDataUri && endImage.imageDataUri.startsWith('data:')) {
        const imageFile = await dataUriToToFile(endImage.imageDataUri, `scene-${scene.id}-end.png`);
        const imageSavedFile = await saveFile(imageFile, 'image');
        endImageId = imageSavedFile.file_id;
      }
      return { startImageId, endImageId };

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
      const audio = await generateSpeech({
        text: scene.narrator,
        voice: tone.voice,
        tonePrompt: tone.tonePrompt,
      });
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
      console.log('Final video ID:', finalVideo);

      if (style.overlayUrl) {
        const overlayResponse = await fetch(style.overlayUrl);
        const overlayBlob = await overlayResponse.blob();
        const fileName = style.overlayUrl.split('/').pop() || 'overlay';
        const overlayFile = new File([overlayBlob], fileName, { type: overlayBlob.type });
        const savedOverlay = await saveFile(overlayFile, 'video');

        await pollFileStatus(finalVideo.file_id);
        await pollFileStatus(savedOverlay.file_id);
        const videoWithOverlay = await addColorkeyOverlay(finalVideo.file_id, savedOverlay.file_id, '#000000');
        await pollFileStatus(videoWithOverlay.file_id);
        
        setFinalVideoId(videoWithOverlay.file_id);
      } else {
        setFinalVideoId(finalVideo.file_id);
      }
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
      }
      maxRetries--;
    }
    return status;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Video Multiple Images</h1>
      </div>

      <ShortGeneratorMultipleImages 
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
        tone={tone}
        setTone={setTone}
        style={style}
        setStyle={handleStyleChange}
      />
    </main>
  );
}
