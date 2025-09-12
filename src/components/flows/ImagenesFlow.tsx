'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SceneList } from "@/components/video/scene-list";
import { GenerateVideoScriptOutput } from "@/ai/flows/generate-video-script";

type Scene = GenerateVideoScriptOutput['scenes'][0];

interface ImagenesFlowProps {
    story: string;
    setStory: (story: string) => void;
    artStyle: string;
    setArtStyle: (artStyle: string) => void;
    isLoading: string | null;
    handleTest: (flow: 'script' | 'preview' | 'video', data?: any) => void;
    scriptOutput: GenerateVideoScriptOutput;
    setScriptOutput: (output: GenerateVideoScriptOutput) => void;
}

export function ImagenesFlow({
    story,
    setStory,
    artStyle,
    setArtStyle,
    isLoading,
    handleTest,
    scriptOutput,
    setScriptOutput
}: ImagenesFlowProps) {
    
    const handleScenesChange = (newScenes: Scene[]) => {
        setScriptOutput({ ...scriptOutput, scenes: newScenes });
    }

    return (
        <div className="grid md:grid-cols-5 gap-8">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Guion y Estilo</CardTitle>
                    <CardDescription>
                        Escribe una historia, define un estilo visual y genera el guion.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="story-imagenes">Guion (Story)</Label>
                        <Textarea
                            id="story-imagenes"
                            placeholder="Enter a story"
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            rows={10}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="art-style-imagenes">Art Style</Label>
                        <Textarea
                            id="art-style-imagenes"
                            placeholder="Enter the art style"
                            value={artStyle}
                            onChange={(e) => setArtStyle(e.target.value)}
                            rows={10}
                        />
                    </div>
                    <Button onClick={() => handleTest('script')} disabled={!!isLoading}>
                        {isLoading === 'script' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Script
                    </Button>
                </CardContent>
            </Card>
            <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Escenas</CardTitle>
                    <CardDescription>
                        Revisa las escenas y genera las imágenes con los modelos de IA.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {scriptOutput && (
                        <div>
                            <div className="rounded-md border bg-muted p-4 max-h-[70vh] overflow-y-auto">
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
            </Card>
        </div>
    );
}
