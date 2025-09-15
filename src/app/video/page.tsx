'use client';

import React from 'react';
import { ShortGenerator } from '@/components/video/shortGenerator';
import { Scene, ImageOutput } from '@/ai/flows/short-videos/schemas';
import { useState } from 'react';
import defaultArtStyle from '@/lib/art-style-default.json';
import { generateScriptShort, GenerateScriptShortOutput } from '@/ai/flows/short-videos/generate-script-short-gemini';
import { generateImageGemini } from '@/ai/flows/short-videos/generate-image-gemini';
import { generateSpeech } from '@/ai/flows/short-videos/generate-speech-gemini';
import { useToast } from '@/hooks/use-toast';
import { saveFile } from '@/services/aiAgentsTools'

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
  const [scenes, setScenes] = useState<GenerateScriptShortOutput>({ scenes: [] });


  const generateScript = async () => {
    setIsLoading('Generating script...');
    try {
      const scriptOutput: GenerateScriptShortOutput = await generateScriptShort({ story, artStyle });
      setScenes(scriptOutput);
      toast({ title: 'Script Scenes Generated Successfully' });

      setIsLoading('Generating images and audio...');
      await Promise.all(scriptOutput.scenes.map(async (scene) => {
        await generateImageForScene(scene);
        await generateAudioForScene(scene);
      }));
      toast({ title: 'Images and Audio Generated Successfully' });

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

  const generateImageForScene = async (scene: Scene) => {
    setIsLoadingImages(true);
    try {
      const image: ImageOutput = await generateImageGemini({ prompt: scene.imgPrompt, artStyle, aspectRatio: '9:16' });
      setScenes(prevScenes => ({
        ...prevScenes,
        scenes: prevScenes.scenes.map(s => s.id === scene.id ? { ...s, imageUrl: image.imageDataUri } : s),
      }));
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
  const generateAudioForScene = async (scene: Scene) => {
    setIsLoadingAudio(true);
    try {
      const audio = await generateSpeech({ text: scene.narrator });
      setScenes(prevScenes => ({
        ...prevScenes,
        scenes: prevScenes.scenes.map(s => s.id === scene.id ? { ...s, audioUrl: audio.audioDataUri } : s),
      }));
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

  const generateVideo = async (scenes: Scene[]) => {
    console.log('Generating video from scenes:', scenes);

    try {
      const updatedScenes = await Promise.all(scenes.map(async (scene, index) => {
        if (index == 0) {

          if (scene.imageUrl && scene.imageUrl.startsWith('data:')) {
            const imageFile = await dataUriToToFile(scene.imageUrl, `scene-${index}.png`);
            const savedFile = await saveFile(imageFile, 'image');
            console.log(`Image for scene ${index} saved with ID: ${savedFile.id}`);
            // Asocia el ID del archivo guardado con la escena
            return { ...scene, imageStorageId: savedFile.id };
          }
        }
        return scene;
      }));

      console.log('Updated scenes with image storage IDs:', updatedScenes);

      // Aquí puedes continuar con la lógica para generar el video
      // usando los IDs de las imágenes almacenadas.

    } catch (error) {
      console.error('Error generating video:', error);
    }
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
        onGenerateScript={ generateScript }
        onGenerateVideo={ generateVideo }
        scenes={scenes}
        setScenes={setScenes}
      />
    </main>
  );
}
