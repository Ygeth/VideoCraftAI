"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateVideoFromScene } from "@/ai/flows/veo3-videos/generate-video-scene";
import { styles, defaultStyle, Style } from '@/lib/styles';
import { Veo3Input } from "@/ai/flows/veo3-videos/schemas";

// Interfaces
export interface Scene {
  id: number;
  script: string;
  firstImage?: File;
  lastImage?: File;
}

// SceneCardVeo3 Component
export const SceneCardVeo3 = ({ scene, onUpdate, onDelete }: { scene: Scene, onUpdate: (scene: Scene) => void, onDelete: (id: number) => void }) => {
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [story, setStory] = useState('A short video about sustainable farming');
  const [artStyle, setArtStyle] = useState(defaultStyle.artStyle);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [style, setStyle] = useState<Style>(defaultStyle);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'firstImage' | 'lastImage') => {
    if (e.target.files && e.target.files[0]) {
      onUpdate({ ...scene, [field]: e.target.files[0] });
    }
  };

  const handleGenerateVideo = async () => {
    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    let firstImageBase64, lastImageBase64;
    if (scene.firstImage) {
        firstImageBase64 = await toBase64(scene.firstImage);
    }
    if (scene.lastImage) {
        lastImageBase64 = await toBase64(scene.lastImage);
    }
    setRunning(true);

    let veo3Input: Veo3Input = {
      prompt: scene.script,
      artStyle: artStyle,
      aspectRatio: '9:16',
      imgStartUrl: firstImageBase64,
      imgEndUrl: lastImageBase64,
    };
    console.log('Veo3 Input:', veo3Input);

    // Call the generateVideoFromScene function
    generateVideoFromScene(veo3Input).then(response => {
      setGeneratedVideo(response.veo3DataUri);
      setRunning(false);
    }).catch(error => {
      console.error('Error generating video:', error);
      setRunning(false);
    });
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Scene Veo3 {scene.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`script-${scene.id}`}>Script</Label>
            <Textarea id={`script-${scene.id}`} value={scene.script} onChange={(e) => onUpdate({ ...scene, script: e.target.value })} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`first-image-${scene.id}`}>First Image</Label>
            <Input id={`first-image-${scene.id}`} type="file" onChange={(e) => handleFileChange(e, 'firstImage')} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`last-image-${scene.id}`}>Last Image</Label>
            <Input id={`last-image-${scene.id}`} type="file" onChange={(e) => handleFileChange(e, 'lastImage')} />
          </div>
          {generatedVideo && (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Generated Video</h3>
              <video src={generatedVideo} controls className="h-2/5" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleGenerateVideo} disabled={running}>
          {running ? 'Generating...' : 'Generate Video'}
        </Button>
        <Button variant="destructive" onClick={() => onDelete(scene.id)}>Delete Scene</Button>
      </CardFooter>
    </Card>
  );
};