"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RectangleHorizontal, RectangleVertical, Sparkles } from "lucide-react";
import { generateVideoFromScene } from "@/ai/flows/veo3-videos/generate-video-scene";
import { veo3PromptEnhancer } from "@/ai/flows/veo3-videos/veo3-prompt-enchancer";
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
  const [generatedVideo, setGeneratedVideo] = useState<string | null>("/video/veo3/default_reporterFlood.mp4");
  const [running, setRunning] = useState(false);
  const [story, setStory] = useState('A short video about sustainable farming');
  const [artStyle, setArtStyle] = useState(defaultStyle.artStyle);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [style, setStyle] = useState<Style>(defaultStyle);
  const [firstImagePreview, setFirstImagePreview] = useState<string | null>(null);
  const [lastImagePreview, setLastImagePreview] = useState<string | null>(null);
  const [improvePrompt, setImprovePrompt] = useState(true);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'firstImage' | 'lastImage') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpdate({ ...scene, [field]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
          if (field === 'firstImage') {
              setFirstImagePreview(reader.result as string);
          } else {
              setLastImagePreview(reader.result as string);
          }
      };
      reader.readAsDataURL(file);
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
      aspectRatio: aspectRatio,
      imgStartUrl: firstImageBase64,
      imgEndUrl: lastImageBase64,
      improvePrompt: improvePrompt,
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

  const handleImprovePrompt = async () => {
    setIsImprovingPrompt(true);
    try {
      const { enhancedPrompt } = await veo3PromptEnhancer({ prompt: scene.script });
      onUpdate({ ...scene, script: enhancedPrompt });
    } catch (error) {
      console.error('Error improving prompt:', error);
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Scene Veo3 {scene.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <div className="w-1/2 space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`script-${scene.id}`}>Script</Label>
              <Textarea id={`script-${scene.id}`} value={scene.script} onChange={(e) => onUpdate({ ...scene, script: e.target.value })}
                placeholder="Enter the script for this scene" rows={12} />
                 <Button onClick={handleImprovePrompt} disabled={isImprovingPrompt} className="mt-2">
                <Sparkles className="mr-2 h-4 w-4" />
                {isImprovingPrompt ? 'Improving...' : 'Improve Prompt'}
              </Button>
            </div>
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-1.5 w-1/2">
                  <Label htmlFor={`first-image-${scene.id}`}>First Image</Label>
                  <Input id={`first-image-${scene.id}`} type="file" onChange={(e) => handleFileChange(e, 'firstImage')} />
                  {firstImagePreview && <img src={firstImagePreview} alt="First image preview" className="mt-2 h-24 w-24 object-cover" />}
              </div>
              <div className="flex flex-col space-y-1.5 w-1/2">
                  <Label htmlFor={`last-image-${scene.id}`}>Last Image</Label>
                  <Input id={`last-image-${scene.id}`} type="file" onChange={(e) => handleFileChange(e, 'lastImage')} />
                  {lastImagePreview && <img src={lastImagePreview} alt="Last image preview" className="mt-2 h-24 w-24 object-cover" />}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Aspect Ratio</Label>
              <div className="flex space-x-2">
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
            <div className="flex items-center space-x-2">
               <Checkbox id="improve-prompt" checked={improvePrompt} onCheckedChange={(checked) => setImprovePrompt(!!checked)} />
               <Label htmlFor="improve-prompt">Improve Prompt</Label>
            </div>
            <div className="flex space-x-2">
                <Button onClick={handleGenerateVideo} disabled={running}>
                    {running ? 'Generating...' : 'Generate Video'}
                </Button>
                <Button variant="destructive" onClick={() => onDelete(scene.id)}>Delete Scene</Button>
            </div>
          </div>
          <div className="w-1/2">
            {generatedVideo && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Generated Video</h3>
                <video src={generatedVideo} controls className="w-full" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
  );
};