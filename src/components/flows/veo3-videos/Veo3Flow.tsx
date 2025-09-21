"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SceneCardVeo3, Scene } from "@/components/video/veo3-videos/SceneCardVeo3";

// Interfaces
interface Project {
  id: number;
  name: string;
  scenes: Scene[];
}

// VeoFlow Component
export const Veo3Flow = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const addProject = () => {
    if (newProjectName.trim() === "") return;
    const newProject: Project = {
      id: projects.length + 1,
      name: newProjectName,
      scenes: [],
    };
    const newProjects = [...projects, newProject];
    setProjects(newProjects);
    setActiveProjectId(newProject.id);
    setNewProjectName("");
  };

  const addScene = () => {
    if (!activeProject) return;
    const newScene: Scene = {
      id: activeProject.scenes.length + 1,
      script: "",
    };
    const updatedProject = {
      ...activeProject,
      scenes: [...activeProject.scenes, newScene],
    };
    setProjects(projects.map(p => p.id === activeProjectId ? updatedProject : p));
  };

  const updateScene = (updatedScene: Scene) => {
    if (!activeProject) return;
    const updatedProject = {
      ...activeProject,
      scenes: activeProject.scenes.map(scene => scene.id === updatedScene.id ? updatedScene : scene),
    };
    setProjects(projects.map(p => p.id === activeProjectId ? updatedProject : p));
  };

  const deleteScene = (id: number) => {
    if (!activeProject) return;
    const updatedProject = {
      ...activeProject,
      scenes: activeProject.scenes.filter(scene => scene.id !== id),
    };
    setProjects(projects.map(p => p.id === activeProjectId ? updatedProject : p));
  };

  // const generateVideo = () => {
  //   if (!activeProject) return;
  //   const formData = new FormData();
  //   formData.append('scene', JSON.stringify(activeProject.scenes));
  //   activeProject.scenes.forEach(scene => {
  //     if (scene.firstImage) {
  //       formData.append(`firstImage-${scene.id}`, scene.firstImage);
  //     }
  //     if (scene.lastImage) {
  //       formData.append(`lastImage-${scene.id}`, scene.lastImage);
  //     }
  //   });

  //   fetch('/api/video-flow', {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       setGeneratedVideo(data.videoDataUri);
  //     });
  // };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Select onValueChange={(value) => setActiveProjectId(Number(value))} value={activeProjectId?.toString()}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
                {projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
        />
        <Button onClick={addProject}>Create Project</Button>
      </div>

      {activeProject && (
        <>
          {activeProject.scenes.map(scene => (
            <SceneCardVeo3 key={scene.id} scene={scene} onUpdate={updateScene} onDelete={deleteScene} />
          ))}
          <Button onClick={addScene} className="mr-2">Add Scene</Button>
          {/* <Button onClick={generateVideo}>Generate Video</Button> */}
        </>
      )}

      {generatedVideo && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Generated Video</h2>
          <video src={generatedVideo} controls className="w-full" />
        </div>
      )}
    </div>
  );
};