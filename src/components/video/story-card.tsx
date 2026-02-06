'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StoryboardOutput } from '@/ai/flows/storyboard/schemas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";
import Image from "next/image";

interface StoryCardProps {
  storyboard: StoryboardOutput | undefined;
  onGenerateImage?: (sceneIndex: number) => void;
  onGenerateVoiceover?: (sceneIndex: number, text: string) => void;
  onStoryboardChange?: (storyboard: StoryboardOutput) => void;
}

export function StoryCard({ storyboard, onGenerateImage, onGenerateVoiceover, onStoryboardChange }: StoryCardProps) {

  if (!storyboard) {
    return (
      <Card className="md:col-span-3 glass-card border-none bg-black/20 text-white">
        <CardHeader>
          <CardTitle>Storyboard</CardTitle>
          <CardDescription className="text-white/60">visual representation of the story scenes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/40">No storyboard generated yet.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSceneChange = (index: number, field: keyof StoryboardOutput['scenes'][0], value: string) => {
    if (onStoryboardChange && storyboard) {
      const newScenes = [...storyboard.scenes];
      newScenes[index] = { ...newScenes[index], [field]: value };
      onStoryboardChange({ ...storyboard, scenes: newScenes });
    }
  };

  return (
    <Card className="md:col-span-3 glass-card border-none bg-black/20 text-white">
      <CardHeader>
        <CardTitle>Storyboard</CardTitle>
        <CardDescription className="text-white/60">Visual representation of the story scenes.</CardDescription>
      </CardHeader>
      <CardContent >
        <div className="flex justify-start">
          <section className="w-full ml-6">
            <h2 className="text-lg font-bold">Scenes</h2>
            {storyboard.scenes.map((scene, index) => (
              <div className="" key={index}>
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`scene-${index}`}>
                      <AccordionTrigger>
                        <h3 className="font-semibold">Scene {index + 1}: {scene.title}</h3>
                      </AccordionTrigger>
                      <AccordionContent className="flex space-x-4">
                        {/* Image Preview */}
                        {scene.imageUrl && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="aspect-[1/1] w-auto h-52 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer">
                                <Image
                                  src={scene.imageUrl}
                                  alt="Scene Preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[90vh]">
                              <VisuallyHidden>
                                <DialogTitle>Scene Preview</DialogTitle>
                              </VisuallyHidden>
                              <div className="w-full h-full relative">
                                <Image
                                  src={scene.imageUrl}
                                  alt="Character Preview"
                                  fill
                                  className="object-contain rounded-lg"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Story */}
                        <div className="w-full border rounded-md p-3 mt-2 space-y-2">
                          <div className="flex items-center">
                            <strong className="w-24">Title:</strong>
                            <Input
                              value={scene.title || ''}
                              onChange={(e) => handleSceneChange(index, 'title', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-start">
                            <strong className="w-24">Description:</strong>
                            <Textarea
                              value={scene.description || ''}
                              onChange={(e) => handleSceneChange(index, 'description', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-start">
                            <strong className="w-24">imagePrompt:</strong>
                            <Textarea
                              value={scene.imagePrompt || ''}
                              onChange={(e) => handleSceneChange(index, 'imagePrompt', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Shot Type:</strong>
                            <Input
                              value={scene.shotType || ''}
                              onChange={(e) => handleSceneChange(index, 'shotType', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Camera Angle:</strong>
                            <Input
                              value={scene.cameraAngle || ''}
                              onChange={(e) => handleSceneChange(index, 'cameraAngle', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Lighting:</strong>
                            <Input
                              value={scene.lighting || ''}
                              onChange={(e) => handleSceneChange(index, 'lighting', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Mood:</strong>
                            <Input
                              value={scene.mood || ''}
                              onChange={(e) => handleSceneChange(index, 'mood', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Music:</strong>
                            <Input
                              value={scene.music || ''}
                              onChange={(e) => handleSceneChange(index, 'music', e.target.value)}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Voiceover:</strong>
                            <Input
                              value={scene.voiceover || ''}
                              onChange={(e) => handleSceneChange(index, 'voiceover', e.target.value)}
                            />
                          </div>
                          {scene.audioUrl && (
                            <audio controls src={scene.audioUrl} className="w-full h-10 mt-2 opacity-80 hover:opacity-100 transition-opacity">
                              Your browser does not support the audio element.
                            </audio>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Button onClick={() => onGenerateImage && onGenerateImage(index)}>Generate Image</Button>
                            <Button onClick={() => onGenerateVoiceover && onGenerateVoiceover(index, scene.voiceover || '')} variant="secondary">Generate Voiceover</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ))}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
