'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Loader2, Sparkles, AudioLines, Image as ImageIcon } from 'lucide-react';
import { generateImage } from '@/ai/flows/generate-image';
import { generateImageGemini } from '@/ai/flows/short-videos/generate-image-gemini';
import { generateNarrationAudio } from '@/ai/flows/generate-narration-audio';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { GenerateScriptShortOutput } from '@/ai/flows/short-videos/generate-script-short-gemini';
type Scene = GenerateScriptShortOutput['scenes'][0];

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  artStyle: string;
  aspectRatio: string;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updatedScene: Scene) => void;
}

export function SceneCard({ scene, sceneIndex, artStyle, aspectRatio, onDelete, onUpdate }: SceneCardProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const { toast } = useToast();

  const handleNarrationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, narrator: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, imgPrompt: e.target.value });
  };
  
  const handleMotionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, motionScene: e.target.value });
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const { imageDataUri } = await generateImage({ 
        prompt: scene.imgPrompt,
        artStyle: artStyle,
        aspectRatio: aspectRatio,
      });
      onUpdate(sceneIndex, { ...scene, imageUrl: imageDataUri });
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast({
        variant: 'destructive',
        title: 'Image generation failed',
        description: 'Could not generate the image for this scene. Please try again.',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateImageGemini = async () => {
    setIsGeneratingImage(true);
    try {
      const {imageDataUri} = await generateImageGemini({
        prompt: scene.imgPrompt,
        artStyle: artStyle,
        aspectRatio: aspectRatio,
      });
      onUpdate(sceneIndex, {...scene, imageUrl: imageDataUri});
    } catch (error) {
      console.error('Failed to generate image with Gemini:', error);
      toast({
        variant: 'destructive',
        title: 'Image generation failed (Gemini)',
        description:
          'Could not generate the image for this scene. Please try again.',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!scene.narrator) {
      toast({
        variant: 'destructive',
        title: 'Narration is empty',
        description: 'Please provide narration text to generate audio.',
      });
      return;
    }
    setIsGeneratingAudio(true);
    try {
      const { audioDataUri } = await generateNarrationAudio({ text: scene.narrator });
      onUpdate(sceneIndex, { ...scene, audioUrl: audioDataUri });
    } catch (error) {
      console.error('Failed to generate audio:', error);
      toast({
        variant: 'destructive',
        title: 'Audio generation failed',
        description: 'Could not generate audio for this scene. Please try again.',
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const imageSrc = scene.imageUrl || `https://picsum.photos/seed/${sceneIndex + 1}/720/1280`;

  return (
    <Card className="overflow-hidden">
       <CardContent className="p-4 flex flex-row gap-4 items-start">
        <Dialog>
          <DialogTrigger asChild>
            <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center relative cursor-pointer w-32 flex-shrink-0">
              {isGeneratingImage ? (
                <div className="flex flex-col items-center justify-center text-primary">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="mt-2 text-sm">Generating...</p>
                </div>
              ) : (
                <>
                  <Image
                    src={imageSrc}
                    alt={scene.imgPrompt}
                    fill
                    className="object-cover rounded-lg"
                    data-ai-hint="cinematic"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                </>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[90vh]">
            <div className="w-full h-full relative">
              <Image
                src={imageSrc}
                alt={scene.imgPrompt}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2 flex flex-col flex-grow h-full">
            <div className="grid w-full gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`narrator-${sceneIndex}`}>Narrator</Label>
                </div>
                <Textarea
                    id={`narrator-${sceneIndex}`}
                    value={scene.narrator}
                    onChange={handleNarrationChange}
                    placeholder="Scene narration..."
                    className="h-24 text-sm"
                />
            </div>
            {scene.audioUrl && (
              <audio controls src={scene.audioUrl} className="w-full h-10">
                Your browser does not support the audio element.
              </audio>
            )}
            <div className="grid w-full gap-1.5 flex-grow">
                <Label htmlFor={`img-prompt-${sceneIndex}`}>Image Prompt</Label>
                <Textarea
                    id={`img-prompt-${sceneIndex}`}
                    value={scene.imgPrompt}
                    onChange={handlePromptChange}
                    placeholder="Image generation prompt..."
                    className="h-24 text-sm font-mono"
                />
            </div>
             <div className="grid w-full gap-1.5 flex-grow">
                <Label htmlFor={`motion-scene-${sceneIndex}`}>Motion Scene</Label>
                <Textarea
                    id={`motion-scene-${sceneIndex}`}
                    value={scene.motionScene}
                    onChange={handleMotionChange}
                    placeholder="e.g., 'Slow zoom in', 'Pan from left to right'..."
                    className="h-16 text-sm"
                />
            </div>
          <div className="flex items-center justify-between mt-auto pt-2 gap-2">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleGenerateAudio} disabled={isGeneratingAudio} variant="outline" size="sm">
                  {isGeneratingAudio ? <Loader2 className="animate-spin" /> : <AudioLines />}
                  Generate Audio
                </Button>
                <Button onClick={handleGenerateImage} disabled={isGeneratingImage} variant="outline" size="sm">
                  {isGeneratingImage ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                  Image (Imagen)
                </Button>
                <Button onClick={handleGenerateImageGemini} disabled={isGeneratingImage} variant="outline" size="sm">
                  {isGeneratingImage ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  Image (Gemini)
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => onDelete(sceneIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
