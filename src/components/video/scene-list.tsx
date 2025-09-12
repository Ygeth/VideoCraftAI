'use client';

import type { GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { SceneCard } from './scene-card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

type Scene = GenerateVideoScriptOutput['scenes'][0];
type Scenes = GenerateVideoScriptOutput['scenes'];

interface SceneListProps {
  scenes: Scenes;
  setScenes: (scenes: Scenes | ((prevScenes: Scenes) => Scenes)) => void;
  artStyle: string;
  aspectRatio: string;
}

export function SceneList({ scenes, setScenes, artStyle, aspectRatio }: SceneListProps) {
  
  const handleDeleteScene = (index: number) => {
    setScenes(prevScenes => prevScenes.filter((_, i) => i !== index));
  };

  const handleUpdateScene = (index: number, updatedScene: Scene) => {
    setScenes(prevScenes => {
      const newScenes = [...prevScenes];
      newScenes[index] = updatedScene;
      return newScenes;
    });
  };

  const handleAddScene = () => {
    const newScene: Scene = {
        narrator: 'New scene narration.',
        'img-prompt': 'A new image prompt.',
        motionScene: 'Static scene, no movement.',
    };
    setScenes(prevScenes => [...prevScenes, newScene]);
  }

  return (
    <div className="space-y-4">
      {scenes.map((scene, index) => (
        <SceneCard
          key={index}
          scene={scene}
          sceneIndex={index}
          artStyle={artStyle}
          aspectRatio={aspectRatio}
          onDelete={handleDeleteScene}
          onUpdate={handleUpdateScene}
        />
      ))}
      <Button onClick={handleAddScene} variant="outline" className="w-full">
        <Plus className="mr-2" />
        Add Scene
      </Button>
    </div>
  );
}
