'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Loader2, Sparkles, AudioLines, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/services/aiAgentsTools';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from '../ui/visually-hidden';
import { Label } from '../ui/label';
import { ImageOutput } from '@/ai/flows/image-generation/schemas';
import { GenerateScriptShortOutput } from '@/ai/flows/text/generate-script-short-gemini';
import { GenerateCharacterOutput } from '@/ai/flows/generate-character';
import { Tone } from '@/lib/tones';

type Scene = GenerateScriptShortOutput['scenes'][0];

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  artStyle: string;
  aspectRatio: string;
  tone: Tone;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updatedScene: Scene) => void;
  character: GenerateCharacterOutput | null;
  onGenerateImageForScene: (scene: Scene) => Promise<void>;
  onGenerateAudio: (scene: Scene) => Promise<void>;
}

export function SceneCard({ scene, sceneIndex, artStyle, aspectRatio, tone, onDelete, onUpdate, character, onGenerateImageForScene, onGenerateAudio }: SceneCardProps) {
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const { toast } = useToast();

  const handleDownloadVideo = async () => {
    if (scene.videoTTSId) {
      try {
        const videoBlob = await downloadFile(scene.videoTTSId);
        const url = window.URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video_scene_${sceneIndex}.mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading video:', error);
        toast({
          variant: 'destructive',
          title: 'Download failed',
          description: 'Could not download the video. Please try again.',
        });
      }
    }
  };

  const handleNarrationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, narrator: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, imgPrompt: e.target.value });
  };

  const handleMotionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(sceneIndex, { ...scene, motionScene: e.target.value });
  };

  const imageSrc = scene.imageUrl || `https://picsum.photos/seed/${sceneIndex + 1}/720/1280`;

  return (
    <Card className="overflow-hidden glass-card border-none bg-black/20 text-white hover:bg-black/30 transition-colors">
      <CardContent className="p-4 flex flex-row gap-4 items-start">
        <Dialog>
          <DialogTrigger asChild>
            <div className="aspect-[9/16] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center relative cursor-pointer w-32 flex-shrink-0 hover:border-white/20 transition-all">
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
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[90vh] glass border-white/10 bg-black/80">
            <VisuallyHidden>
              <DialogTitle>Image Preview</DialogTitle>
            </VisuallyHidden>
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

        <div className="space-y-4 flex flex-col flex-grow h-full">
          <div className="grid w-full gap-2 flex-grow">
            <div className="flex justify-between items-center">
              <Label htmlFor={`narrator-${sceneIndex}`} className="text-white/80">Narrator</Label>
            </div>
            <Textarea
              id={`narrator-${sceneIndex}`}
              value={scene.narrator}
              onChange={handleNarrationChange}
              placeholder="Scene narration..."
              className="h-24 text-sm glass-input"
            />
          </div>
          {scene.audioUrl && (
            <audio controls src={scene.audioUrl} className="w-full h-10 opacity-80 hover:opacity-100 transition-opacity">
              Your browser does not support the audio element.
            </audio>
          )}
          <div className="grid w-full gap-2 flex-grow">
            <Label htmlFor={`imgPrompt-${sceneIndex}`} className="text-white/80">Image Prompt</Label>
            <Textarea
              id={`imgPrompt-${sceneIndex}`}
              value={scene.imgPrompt}
              onChange={handlePromptChange}
              placeholder="Image generation prompt..."
              className="h-24 text-sm font-mono glass-input"
            />
          </div>
          <div className="grid w-full gap-2 flex-grow">
            <Label htmlFor={`motion-scene-${sceneIndex}`} className="text-white/80">Motion Scene</Label>
            <Textarea
              id={`motion-scene-${sceneIndex}`}
              value={scene.motionScene}
              onChange={handleMotionChange}
              placeholder="e.g., 'Slow zoom in', 'Pan from left to right'..."
              className="h-16 text-sm glass-input"
            />
          </div>
          <div className="flex items-center justify-between mt-auto pt-2 gap-2">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => onGenerateImageForScene(scene)}
                disabled={false}
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Image
              </Button>
              <Button
                onClick={() => onGenerateAudio(scene)}
                disabled={isGeneratingAudio}
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <AudioLines className="mr-2 h-4 w-4" />
                Generate Audio
              </Button>
              {scene.videoTTSId && (
                <Button
                  onClick={handleDownloadVideo}
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  Download Video
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/50 hover:text-destructive hover:bg-white/5"
              onClick={() => onDelete(sceneIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
