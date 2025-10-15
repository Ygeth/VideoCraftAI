'use client';

import { useEffect, useState } from 'react';
import { SceneCard } from './scene-card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { GenerateScriptShortOutput, ImageOutput } from '@/ai/flows/image-generation/schemas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { tones, Tone } from '@/lib/tones';
import { GenerateCharacterOutput } from '@/ai/flows/generate-character';

type Scene = GenerateScriptShortOutput['scenes'][0];
type Scenes = GenerateScriptShortOutput['scenes'];

interface SceneListProps {
  scenes: Scenes;
  onScenesChange: (scenes: Scenes) => void;
  artStyle: string;
  aspectRatio: string;
  tone: Tone;
  setTone: (tone: Tone) => void;
  character: GenerateCharacterOutput | null;
  styleImage: ImageOutput | null;
}

export function SceneList({ scenes, onScenesChange, artStyle, aspectRatio, tone, setTone, character, styleImage }: SceneListProps) {
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
        id: Math.random().toString(36).substring(7),
        narrator: 'New scene narration.',
        imgPrompt: 'A new image prompt.',
        motionScene: 'Static scene, no movement.',
    };
    const newScenes = [..._scenes, newScene];
    handleSceneUpdate(newScenes);
  }

  const handleToneChange = (toneName: string) => {
    const newTone = tones.find(t => t.name === toneName);
    if (newTone) {
      setTone(newTone);
    }
  };

  if (!_scenes) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="tone-select">Audio Tone</Label>
        <Select onValueChange={handleToneChange} value={tone.name}>
          <SelectTrigger id="tone-select">
            <SelectValue placeholder="Select a tone" />
          </SelectTrigger>
          <SelectContent>
            {tones.map(tone => (
              <SelectItem key={tone.name} value={tone.name}>
                {tone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {_scenes.map((scene, index) => (
        <SceneCard
          key={scene.id || index}
          scene={scene}
          sceneIndex={index}
          artStyle={artStyle}
          aspectRatio={aspectRatio}
          tone={tone}
          onDelete={handleDeleteScene}
          onUpdate={handleUpdateScene}
          character={character}
          styleImage={styleImage}
        />
      ))}
      <Button onClick={handleAddScene} variant="outline" className="w-full">
        <Plus className="mr-2" />
        Add Scene
      </Button>
    </div>
  );
}
