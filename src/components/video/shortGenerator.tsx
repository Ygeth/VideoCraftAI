'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SceneList } from "@/components/video/scene-list";
import { GenerateScriptShortOutput } from '@/ai/flows/image-generation/generate-script-short-gemini';
import { Tone } from '@/lib/tones';
import { Style, styles } from "@/lib/styles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtStyle, artStyles } from '@/lib/artstyles';
import { useState } from "react";
import { RectangleHorizontal, RectangleVertical, Square, Sparkles } from "lucide-react";

type Scene = GenerateScriptShortOutput['scenes'][0];

interface shortGeneratorProps {
  story: string;
  setStory: (story: string) => void;
  artStyle: string;
  setArtStyle: (artStyle: string) => void;
  isLoading: string | null;
  isLoadingImages: boolean;
  isLoadingAudio: boolean;
  isLoadingVideo: boolean;
  onGenerateScript: () => void;
  onGenerateVideo: (scenes: Scene[]) => void;
  scenes: GenerateScriptShortOutput;
  setScenes: (output: GenerateScriptShortOutput) => void;
  finalVideoId: string | null;
  onDownloadFinalVideo: () => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  style: Style;
  setStyle: (style: Style) => void;
}

export function ShortGenerator({
  story,
  setStory,
  artStyle,
  setArtStyle,
  isLoading,
  isLoadingImages,
  isLoadingAudio,
  isLoadingVideo,
  onGenerateScript,
  onGenerateVideo,
  scenes,
  setScenes,
  finalVideoId,
  onDownloadFinalVideo,
  tone,
  setTone,
  style,
  setStyle
}: shortGeneratorProps) {
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const handleScenesChange = (newScenes: Scene[]) => {
    setScenes({ ...scenes, scenes: newScenes });
  }

  const handleStyleChange = (styleName: string) => {
    const newStyle = styles.find(s => s.name === styleName);
    if (newStyle) {
      setStyle(newStyle);
    }
  }

  const handleArtStyleChange = (artStyleName: string) => {
    const newArtStyle = artStyles.find(a => a.name === artStyleName);
    if (newArtStyle) {
      setArtStyle(newArtStyle.prompt);
    }
  }

  const selectedArtStyle = artStyles.find(a => a.prompt === artStyle);

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Guion y Estilo</CardTitle>
            <Button onClick={() => onGenerateScript()} disabled={!!isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Generating...' : 'Generate Script'}
            </Button>
          </div>
          <CardDescription>
            Escribe una historia, define un estilo visual y genera el guion.
          </CardDescription>

        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4 justify-start">
            <div >
              <Label>Style Preset</Label>
              <Select value={style.name} onValueChange={handleStyleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(s => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div >
              <Label>Art Style Preset</Label>
              <Select value={selectedArtStyle ? selectedArtStyle.name : ""} onValueChange={handleArtStyleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an art style" />
                </SelectTrigger>
                <SelectContent>
                  {artStyles.map(a => (
                    <SelectItem key={a.name} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Aspect Ratio</Label>
              <div className="flex space-x-2">
                <Button
                  variant={aspectRatio === '1:1' ? 'secondary' : 'outline'}
                  onClick={() => setAspectRatio('1:1')}
                  className="flex items-center space-x-2"
                >
                  <Square className="h-5 w-5" />
                  <span>1:1</span>
                </Button>
                <Button
                  variant={aspectRatio === '9:16' ? 'secondary' : 'outline'}
                  onClick={() => setAspectRatio('9:16')}
                  className="flex items-center space-x-2"
                >
                  <RectangleVertical className="h-5 w-5" />
                  <span>9:16</span>
                </Button>
                <Button
                  variant={aspectRatio === '16:9' ? 'secondary' : 'outline'}
                  onClick={() => setAspectRatio('16:9')}
                  className="flex items-center space-x-2"
                >
                  <RectangleHorizontal className="h-5 w-5" />
                  <span>16:9</span>
                </Button>
              </div>
            </div>
            
          </div>
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
            <Label htmlFor="art-style-imagenes">Art Style Prompt (editable)</Label>
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
            <div className="flex gap-2">
              <Button onClick={() => onGenerateVideo(scenes.scenes)} disabled={!!isLoadingImages || !!isLoadingAudio || !!isLoadingVideo || !!isLoading}>
                {(isLoadingImages || isLoadingAudio || isLoadingVideo) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Video
              </Button>
              <Button onClick={onDownloadFinalVideo} disabled={!finalVideoId}>
                Download Video
              </Button>
            </div>
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
                  aspectRatio={aspectRatio}
                  tone={tone}
                  setTone={setTone}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
