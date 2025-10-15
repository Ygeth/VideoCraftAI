'use client';

import React from 'react';
import { ShortGenerator } from '@/components/video/shortGenerator';
import { Scene, ImageOutput } from '@/ai/flows/image-generation/schemas';
import { useState } from 'react';
import defaultScenes from '@/lib/default-scenes.json';
import { generateScriptShort, GenerateScriptShortOutput } from '@/ai/flows/image-generation/generate-script-short-gemini';
import { useToast } from '@/hooks/use-toast';
import { saveFile, generateTTSCaptionedVideo, downloadFile, mergeVideos, addColorkeyOverlay, checkStatus } from '@/services/aiAgentsTools';
import { generateImage } from '@/ai/flows/image-generation/generate-image';
import { generateSpeech } from '@/ai/flows/image-generation/generate-speech-gemini';
import { generateCharacter, GenerateCharacterOutput } from '@/ai/flows/generate-character';
import { tones, defaultTone, Tone } from '@/lib/tones';
import { styles, defaultStyle, Style } from '@/lib/styles';
import { TaskQueue } from '@/lib/queue';

async function dataUriToToFile(dataUri: string, fileName: string): Promise<File> {
  const response = await fetch(dataUri);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}

export default function ShortVideosPage() {
  const { toast } = useToast();
  const [story, setStory] = useState('A short video about sustainable farming');
  const [artStyle, setArtStyle] = useState(defaultStyle.artStyle);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [scenes, setScenes] = useState<GenerateScriptShortOutput>({ scenes: [] });
  const [character, setCharacter] = useState<GenerateCharacterOutput | null>(null);
  const [styleImage, setStyleImage] = useState<ImageOutput | null>(null);
  const [finalVideoId, setFinalVideoId] = useState<string | null>(null);
  const [backgroundMusicId, setBackgroundMusicId] = useState<string | undefined>(undefined);
  const [tone, setTone] = useState<Tone>(defaultTone);
  const [style, setStyle] = useState<Style>(defaultStyle);

  const handleStyleChange = (newStyle: Style) => {
    setStyle(newStyle);
    setTone(newStyle.tone);
    setArtStyle(newStyle.artStyle);
  };
  
  const handleGenerateCharacter = async () => {
    setIsLoading('Generating character & style...');
    try {
      const characterDetails = await generateCharacter({ story, artStyle });

      const [characterImage, styleRefImage] = await Promise.all([
        generateImage({
          prompt: `Full-body portrait of a character named ${characterDetails.name}.
            Description: ${characterDetails.description}.
            Clothing: ${characterDetails.clothing}.
            Art Style: ${artStyle}.`,
          artStyle: artStyle,
          aspectRatio: '1:1',
        }),
        generateImage({
          prompt: `A scene that captures the essence of this style: ${artStyle}`,
          artStyle: artStyle,
          aspectRatio: '16:9',
        }),
      ]);
      
      const fullCharacter: GenerateCharacterOutput = {
          ...characterDetails,
          imageDataUri: characterImage.imageDataUri,
      }

      setCharacter(fullCharacter);
      setStyleImage(styleRefImage);

      toast({ title: 'Character and Style Generated Successfully' });
    } catch (error) {
      console.error('Error generating character:', error);
      toast({
        variant: 'destructive',
        title: 'Character generation failed',
        description: 'Could not generate the character. Please try again.',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const generateScript = async () => {
    setIsLoading('Generating script...');
    try {
      const scriptOutput: GenerateScriptShortOutput = await generateScriptShort({ story, artStyle });
      
      // Assign a unique ID to each scene for keying purposes in React
      const scenesWithIds = scriptOutput.scenes.map(scene => ({
        ...scene,
        id: Math.random().toString(36).substring(7),
      }));

      const finalOutput = { scenes: scenesWithIds };
      setScenes(finalOutput);

      toast({ title: 'Script Scenes Generated Successfully' });

      setIsLoading('Generating images and audio...');
      
      const imageQueue = new TaskQueue(6000); // 10 images per minute
      
      const processScene = async (scene: Scene) => {
        const imageUrl = await generateImageForScene(scene);
        const audioId = await generateAudioForScene(scene);
        
        // This is a simplified flow. In a real-world scenario, you might want to wait
        // for image/audio to be processed before generating the video for that scene.
        // For now, we'll just update the state as things complete.

        setScenes(prevScenes => ({
          ...prevScenes,
          scenes: prevScenes.scenes.map(s => 
            s.id === scene.id ? { ...s, imageUrl, audioStorageId: audioId } : s
          )
        }));
      };

      finalOutput.scenes.forEach(scene => {
        imageQueue.add(() => processScene(scene));
      });

      toast({ title: 'Image and audio generation queued.' });

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
      const image = await generateImage({ 
        prompt: scene.imgPrompt,
        artStyle: artStyle,
        aspectRatio: "9:16",
        characterImageDataUri: character?.imageDataUri,
        styleImageDataUri: styleImage?.imageDataUri,
      });
      scene.imageUrl = image.imageDataUri;
      return image.imageDataUri;

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
    return undefined;
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
    return undefined;
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
    return undefined;
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

  const pollFileStatus = async (processScene: string) => {
    let status = '';
    let maxRetries = 10; // Limit to avoid infinite loops
    while (status !== 'ready' && maxRetries > 0) {
      try {
        status = await checkStatus(processScene);
        if (status === 'failed' || status === 'not_found') {
          throw new Error(`File processing failed or file not found. Status: ${status}`);
        }
        if (status !== 'ready') {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before polling again
        }
      } catch (error) {
        console.error(`Error polling status for file ${processScene}:`, error);
        // throw error;
      }
      maxRetries--;
    }
    return status;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Short Videos</h1>
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
        onGenerateCharacter={ handleGenerateCharacter }
        onGenerateVideo={ generateVideo }
        scenes={scenes}
        character={character}
        styleImage={styleImage}
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
