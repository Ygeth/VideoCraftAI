'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SceneList } from "@/components/video/scene-list";
import { GenerateVideoScriptOutput } from "@/ai/flows/generate-video-script";
import { Loader2 } from "lucide-react";

type Scene = GenerateVideoScriptOutput['scenes'][0];

interface N8nFlowProps {
    story: string;
    setStory: (story: string) => void;
    artStyle: string;
    setArtStyle: (artStyle: string) => void;
    isLoading: string | null;
    handleTest: (flow: 'script' | 'preview' | 'video', data?: any) => void;
    scriptOutput: GenerateVideoScriptOutput;
    handleSetScenes: (scenes: Scene[]) => void;
}

export function N8nFlow({
    story,
    setStory,
    artStyle,
    setArtStyle,
    isLoading,
    handleTest,
    scriptOutput,
    handleSetScenes
}: N8nFlowProps) {
    return (
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
            <AccordionItem value="item-1" className="border rounded-lg">
                <AccordionTrigger className="p-6 font-headline text-lg">
                    1. Test `generateVideoScript`
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="space-y-4 pt-6">
                        <p className="text-muted-foreground">Input a story and an art style to generate a video script.</p>
                        <div className="grid gap-2">
                            <Label htmlFor="story-n8n">Story</Label>
                            <Textarea
                                id="story-n8n"
                                placeholder="Enter a story"
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                rows={5}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="art-style-script-n8n">Art Style</Label>
                            <Textarea
                                id="art-style-script-n8n"
                                placeholder="Enter the art style"
                                value={artStyle}
                                onChange={(e) => setArtStyle(e.target.value)}
                                rows={8}
                            />
                        </div>
                        <Button onClick={() => handleTest('script')} disabled={!!isLoading}>
                            {isLoading === 'script' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Script
                        </Button>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border rounded-lg">
                <AccordionTrigger className="p-6 font-headline text-lg">
                    2. Test `generateImage`
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="space-y-4 pt-6">
                        <p className="text-muted-foreground">
                            Modify the Art Style and then generate images for the scenes below. The scenes are pre-populated but you can also generate a new script in Step 1.
                        </p>
                        <div className="grid gap-2">
                            <Label htmlFor="art-style-image-n8n">Art Style</Label>
                            <Textarea
                                id="art-style-image-n8n"
                                placeholder="Enter the art style"
                                value={artStyle}
                                onChange={(e) => setArtStyle(e.target.value)}
                                rows={8}
                            />
                        </div>
                        {scriptOutput && (
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">Scenes:</h4>
                                <div className="rounded-md border bg-muted p-4">
                                    <SceneList scenes={scriptOutput.scenes} setScenes={handleSetScenes} artStyle={artStyle} aspectRatio='9:16' />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
