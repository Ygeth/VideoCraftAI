"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Scene {
  id: number;
  script: string;
  firstImage?: File;
  lastImage?: File;
}

const SceneCard = ({ scene, onUpdate, onDelete }: { scene: Scene, onUpdate: (scene: Scene) => void, onDelete: (id: number) => void }) => {
  const [script, setScript] = useState(scene.script);

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
    onUpdate({ ...scene, script: e.target.value });
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Scene {scene.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`script-${scene.id}`}>Script</Label>
            <Textarea id={`script-${scene.id}`} value={script} onChange={handleScriptChange} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`first-image-${scene.id}`}>First Image</Label>
            <Input id={`first-image-${scene.id}`} type="file" onChange={(e) => handleFileChange(e, 'firstImage')} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={`last-image-${scene.id}`}>Last Image</Label>
            <Input id={`last-image-${scene.id}`} type="file" onChange={(e) => handleFileChange(e, 'lastImage')} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={() => onDelete(scene.id)}>Delete Scene</Button>
      </CardFooter>
    </Card>
  );
};

export const VeoFlow = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const addScene = () => {
    const newScene: Scene = {
      id: scenes.length + 1,
      script: "",
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (updatedScene: Scene) => {
    setScenes(scenes.map(scene => scene.id === updatedScene.id ? updatedScene : scene));
  };

  const deleteScene = (id: number) => {
    setScenes(scenes.filter(scene => scene.id !== id));
  };

  const generateVideo = () => {
    const formData = new FormData();
    formData.append('scenes', JSON.stringify(scenes));
    scenes.forEach(scene => {
      if (scene.firstImage) {
        formData.append(`firstImage-${scene.id}`, scene.firstImage);
      }
      if (scene.lastImage) {
        formData.append(`lastImage-${scene.id}`, scene.lastImage);
      }
    });

    fetch('/api/video-flow', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setGeneratedVideo(data.videoDataUri);
      });
  };

  return (
    <div>
      {scenes.map(scene => (
        <SceneCard key={scene.id} scene={scene} onUpdate={updateScene} onDelete={deleteScene} />
      ))}
      <Button onClick={addScene} className="mr-2">Add Scene</Button>
      <Button onClick={generateVideo}>Generate Video</Button>
      {generatedVideo && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Generated Video</h2>
          <video src={generatedVideo} controls className="w-full" />
        </div>
      )}
    </div>
  );
};