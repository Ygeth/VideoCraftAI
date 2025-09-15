'use client';

import { useEffect, useState } from 'react';
import { SceneCard } from './scene-card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { GenerateScriptShortOutput } from '@/ai/flows/short-videos/generate-script-short-gemini';
type Scene = GenerateScriptShortOutput['scenes'][0];
type Scenes = GenerateScriptShortOutput['scenes'];

interface SceneListProps {
  scenes: Scenes;
  onScenesChange: (scenes: Scenes) => void;
  artStyle: string;
  aspectRatio: string;
}

export function SceneList({ scenes, onScenesChange, artStyle, aspectRatio }: SceneListProps) {
  const [_scenes, _setScenes] = useState(scenes);

  useEffect(() => {
    _setScenes(scenes);
  }, [scenes]);

  const handleSceneUpdate = (updatedScenes: Scenes) => {
    _setScenes(updatedScenes);
    onScenesChange(updatedScenes);
  }

  const handleDeleteScene = (index: number) => {
    const newScenes = _scenes.filter((_, i) => i !== index);
    handleSceneUpdate(newScenes);
  };

  const handleUpdateScene = (index: number, updatedScene: Scene) => {
    const newScenes = [..._scenes];
    newScenes[index] = updatedScene;
    handleSceneUpdate(newScenes);
  };

  const handleAddScene = () => {
    const newScene: Scene = {
        narrator: 'New scene narration.',
        imgPrompt: 'A new image prompt.',
        motionScene: 'Static scene, no movement.',
    };
    const newScenes = [..._scenes, newScene];
    handleSceneUpdate(newScenes);
  }

  if (!_scenes) {
    return null;
  }

  return (
    <div className="space-y-4">
      {_scenes.map((scene, index) => (
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
