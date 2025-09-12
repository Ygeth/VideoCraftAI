'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { SceneList } from "@/components/video/scene-list";
import { GenerateVideoScriptOutput } from "@/ai/flows/generate-video-script";
import { Loader2, Video } from "lucide-react";

type Scene = GenerateVideoScriptOutput['scenes'][0];

interface VeoFlowProps {
    story: string;
    setStory: (story: string) => void;
    artStyle: string;
    setArtStyle: (artStyle: string) => void;
    isLoading: string | null;
    handleTest: (flow: 'script' | 'preview' | 'video', data?: any) => void;
    scriptOutput: GenerateVideoScriptOutput;
    setScriptOutput: (output: GenerateVideoScriptOutput) => void;
    selectedSceneIndex: number;
    setSelectedSceneIndex: (index: number) => void;
    videoUri: string;
}

export function VeoFlow({
    story,
    setStory,
    artStyle,
    setArtStyle,
    isLoading,
    handleTest,
    scriptOutput,
    setScriptOutput,
    selectedSceneIndex,
    setSelectedSceneIndex,
    videoUri
}: VeoFlowProps) {

    const handleScenesChange = (newScenes: Scene[]) => {
        setScriptOutput({ ...scriptOutput, scenes: newScenes });
    }

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
                            <Label htmlFor="story">Story</Label>
                            <Textarea
                                id="story"
                                placeholder="Enter a story"
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                rows={5}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="art-style-script">Art Style</Label>
                            <Textarea
                                id="art-style-script"
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
                            <Label htmlFor="art-style-image">Art Style</Label>
                            <Textarea
                                id="art-style-image"
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
                                    <SceneList 
                                        scenes={scriptOutput.scenes} 
                                        onScenesChange={handleScenesChange}
                                        artStyle={artStyle} 
                                        aspectRatio='9:16' 
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border rounded-lg">
                <AccordionTrigger className="p-6 font-headline text-lg">
                    3. Test `generateVideoFromScene`
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="space-y-4 pt-6">
                        <p className="text-muted-foreground">
                            First, generate an image for a scene in Step 2. Then, select a scene below and click "Render Video" to animate it.
                        </p>
                        <Card>
                            <CardHeader>
                                <CardTitle>Select a scene to render</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={String(selectedSceneIndex)}
                                    onValueChange={(val) => setSelectedSceneIndex(Number(val))}
                                    className="gap-4"
                                >
                                    {scriptOutput.scenes.map((scene, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem value={String(index)} id={`scene-${index}`} />
                                            <Label htmlFor={`scene-${index}`} className="flex-grow flex items-center gap-4 cursor-pointer">
                                                {scene.imageUrl ?
                                                    <img src={scene.imageUrl} alt={`Scene ${index + 1}`} className="w-10 h-10 object-cover rounded-md" />
                                                    : <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                                        <Video className="h-5 w-5" />
                                                    </div>
                                                }
                                                <span className="truncate">{scene.narrator}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                        <Button className="mt-4" onClick={() => handleTest('video', scriptOutput.scenes[selectedSceneIndex])} disabled={!!isLoading}>
                            {isLoading === 'video' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Render Video
                        </Button>
                        {videoUri && (
                            <div className="mt-4">
                                <h4 className="font-semibold">Output:</h4>
                                <video controls src={videoUri} className="mt-2 w-full max-w-lg rounded-md border bg-black" />
                            </div>
                        )}
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
