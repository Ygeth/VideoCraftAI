'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Loader2, Sparkles } from 'lucide-react';
import type { GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { generateImage } from '@/ai/flows/generate-image';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type Scene = GenerateVideoScriptOutput['scenes'][0];

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  artStyle: string;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updatedScene: Scene) => void;
}

export function SceneCard({ scene, sceneIndex, artStyle, onDelete, onUpdate }: SceneCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleNarrationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, narrator: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, 'img-prompt': e.target.value });
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const { imageDataUri } = await generateImage({ 
        prompt: scene['img-prompt'],
        artStyle: artStyle,
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
      setIsGenerating(false);
    }
  };

  const imageSrc = scene.imageUrl || `https://picsum.photos/seed/${sceneIndex + 1}/1280/720`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Dialog>
            <DialogTrigger asChild>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative cursor-pointer">
                {isGenerating ? (
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
            <DialogContent className="max-w-4xl">
              <div className="aspect-video relative">
                <Image
                  src={imageSrc}
                  alt={scene['img-prompt']}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="md:col-span-2 space-y-3">
          <Textarea
            value={scene.narrator}
            onChange={handleNarrationChange}
            placeholder="Scene narration..."
            className="h-24 text-sm"
          />
          <Textarea
            value={scene['img-prompt']}
            onChange={handlePromptChange}
            placeholder="Image generation prompt..."
            className="h-24 text-sm font-mono"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Button onClick={handleGenerateImage} disabled={isGenerating} variant="outline" size="sm">
                {isGenerating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                Generate Image
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => onDelete(sceneIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
