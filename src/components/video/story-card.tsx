'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StoryboardOutput } from '@/ai/flows/storyboard/schemas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";
import Image from "next/image";

interface StoryCardProps {
  storyboard: StoryboardOutput | undefined;
  onGenerateImage?: (sceneIndex: number) => void;
}

export function StoryCard({ storyboard, onGenerateImage }: StoryCardProps) {
  const [editableStoryboard, setEditableStoryboard] = useState<StoryboardOutput | undefined>(storyboard);

  useEffect(() => {
    setEditableStoryboard(storyboard);
  }, [storyboard]);

  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Storyboard</CardTitle>
        <CardDescription>Visual representation of the story scenes.</CardDescription>
      </CardHeader>
      <CardContent >
        <div className="flex justify-start">
          {/* <section className="w-1/3">
            <h2 className="text-lg font-bold">Story</h2>
            {storyboard ? (
              <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger><h3 className="font-semibold">Refined Story</h3></AccordionTrigger>
                    <AccordionContent>
                      <p>{storyboard.story}</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger><h3 className="font-semibold">Technical Guide</h3></AccordionTrigger>
                    <AccordionContent>
                      <p>{storyboard.technicalGuide}</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                </div>
            ) : (
              <p>No storyboard generated yet.</p>
            )}
          </section> */}
          <section className="w-full ml-6">
            <h2 className="text-lg font-bold">Scenes</h2>
            {editableStoryboard?.scenes.map((scene, index) => (
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
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], title: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-start">
                            <strong className="w-24">Description:</strong>
                            <Textarea
                              value={scene.description || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], description: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-start">
                            <strong className="w-24">imagePrompt:</strong>
                            <Textarea
                              value={scene.imagePrompt || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], imagePrompt: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Shot Type:</strong>
                            <Input
                              value={scene.shotType || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], shotType: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Camera Angle:</strong>
                            <Input
                              value={scene.cameraAngle || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], cameraAngle: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Lighting:</strong>
                            <Input
                              value={scene.lighting || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], lighting: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Mood:</strong>
                            <Input
                              value={scene.mood || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], mood: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Music:</strong>
                            <Input
                              value={scene.music || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], music: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <div className="flex items-center">
                            <strong className="w-24">Voiceover:</strong>
                            <Input
                              value={scene.voiceover || ''}
                              onChange={(e) => {
                                if (editableStoryboard) {
                                  const newScenes = [...editableStoryboard.scenes];
                                  newScenes[index] = { ...newScenes[index], voiceover: e.target.value };
                                  setEditableStoryboard({ ...editableStoryboard, scenes: newScenes });
                                }
                              }}
                              className="ml-2 flex-grow"
                            />
                          </div>
                          <Button onClick={() => onGenerateImage && onGenerateImage(index)} className="mt-2">Generate Image</Button>
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
