'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, Trash2 } from 'lucide-react';
import type { GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';

type Scene = GenerateVideoScriptOutput['scenes'][0];

interface SceneCardProps {
  scene: Scene;
  sceneIndex: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updatedScene: Scene) => void;
}

export function SceneCard({ scene, sceneIndex, onDelete, onUpdate }: SceneCardProps) {
  const [narrator, setNarrator] = useState(scene.narrator);
  const [imgPrompt, setImgPrompt] = useState(scene['img-prompt']);

  const handleNarrationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNarrator(e.target.value);
    onUpdate(sceneIndex, { ...scene, narrator: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImgPrompt(e.target.value);
    onUpdate(sceneIndex, { ...scene, 'img-prompt': e.target.value });
  };


  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
            <Image
              src={`https://picsum.photos/seed/${sceneIndex + 1}/1280/720`}
              alt={`Placeholder for scene ${sceneIndex + 1}`}
              fill
              className="object-cover rounded-lg"
              data-ai-hint="cinematic"
            />
             <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
        <div className="md:col-span-2 space-y-3">
          <Textarea
            value={narrator}
            onChange={handleNarrationChange}
            placeholder="Scene narration..."
            className="h-24 text-sm"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">Generate Image</Button>
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
