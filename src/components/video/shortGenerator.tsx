'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SceneList } from "@/components/video/scene-list";
import { GenerateScriptShortOutput } from '@/ai/flows/short-videos/generate-script-short-gemini';

type Scene = GenerateScriptShortOutput['scenes'][0];

interface shortGeneratorProps {
  story: string;
  setStory: (story: string) => void;
  artStyle: string;
  setArtStyle: (artStyle: string) => void;
  isLoading: string | null;
  isLoadingImages: boolean;
  isLoadingAudio: boolean;
  onGenerateScript: () => void;
  onGenerateVideo: (scenes: Scene[]) => void;
  scenes: GenerateScriptShortOutput;
  setScenes: (output: GenerateScriptShortOutput) => void;
}

export function ShortGenerator({
  story,
  setStory,
  artStyle,
  setArtStyle,
  isLoading,
  isLoadingImages,
  isLoadingAudio,
  onGenerateScript,
  onGenerateVideo,
  scenes,
  setScenes
}: shortGeneratorProps) {

  const handleScenesChange = (newScenes: Scene[]) => {
    setScenes({ ...scenes, scenes: newScenes });
  }

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Guion y Estilo</CardTitle>
            <Button onClick={() => onGenerateScript()} disabled={!!isLoading}>
              {isLoading === 'script' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Script
            </Button>
          </div>
          <CardDescription>
            Escribe una historia, define un estilo visual y genera el guion.
          </CardDescription>

        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="story-imagenes">Guion (Story)</Label>
            <Textarea
              id="story-imagenes"
              placeholder="Enter a story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={10}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="art-style-imagenes">Art Style</Label>
            <Textarea
              id="art-style-imagenes"
              placeholder="Enter the art style"
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              rows={10}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Escenas</CardTitle>
            <Button onClick={() => onGenerateVideo(scenes.scenes)} disabled={!!isLoadingImages || !!isLoadingAudio || isLoading === 'video'}>
              {isLoading === 'video' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Video
            </Button>
          </div>
          <CardDescription>
            Revisa las escenas y genera las imágenes con los modelos de IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scenes && (
            <div>
              <div className="rounded-md border bg-muted p-4 max-h-[70vh] overflow-y-auto">
                <SceneList
                  scenes={scenes.scenes}
                  onScenesChange={handleScenesChange}
                  artStyle={artStyle}
                  aspectRatio='9:16'
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
