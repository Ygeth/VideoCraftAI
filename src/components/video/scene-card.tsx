'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Loader2, Sparkles, Volume2 } from 'lucide-react';
import type { GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { generateImage } from '@/ai/flows/generate-image';
import { generateImageGeminiImage } from '@/ai/flows/generate-image-gemini-image';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { ttsService } from '@/services/tts-service';

type Scene = GenerateVideoScriptOutput['scenes'][0];

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const handleNarrationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, narrator: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, 'img-prompt': e.target.value });
  };
  
  const handleMotionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, motionScene: e.target.value });
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const { imageDataUri } = await generateImage({ 
        prompt: scene['img-prompt'],
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
      const {imageDataUri} = await generateImageGeminiImage({
        prompt: scene['img-prompt'],
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

  const handleSpeak = () => {
    if (!scene.narrator) {
      toast({
        variant: 'destructive',
        title: 'Narration is empty',
        description: 'Please provide narration text to speak.',
      });
      return;
    }
    if (isSpeaking) {
      ttsService.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    ttsService.speak(scene.narrator, () => setIsSpeaking(false));
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
                    alt={scene['img-prompt']}
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
                alt={scene['img-prompt']}
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
                  <Button onClick={handleSpeak} variant="ghost" size="sm" className="text-xs">
                    {isSpeaking ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Volume2 className="mr-1 h-3 w-3" />
                    )}
                    {isSpeaking ? 'Stop' : 'Speak'}
                  </Button>
                </div>
                <Textarea
                    id={`narrator-${sceneIndex}`}
                    value={scene.narrator}
                    onChange={handleNarrationChange}
                    placeholder="Scene narration..."
                    className="h-24 text-sm"
                />
            </div>
            <div className="grid w-full gap-1.5 flex-grow">
                <Label htmlFor={`img-prompt-${sceneIndex}`}>Image Prompt</Label>
                <Textarea
                    id={`img-prompt-${sceneIndex}`}
                    value={scene['img-prompt']}
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
              <div className="flex gap-2">
                <Button onClick={handleGenerateImage} disabled={isGeneratingImage} variant="outline" size="sm">
                  {isGeneratingImage ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  Generate Image (Imagen)
                </Button>
                <Button onClick={handleGenerateImageGemini} disabled={isGeneratingImage} variant="outline" size="sm">
                  {isGeneratingImage ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  Generate Image (Gemini)
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
