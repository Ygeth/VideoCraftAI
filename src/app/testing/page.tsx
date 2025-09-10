'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateVideoScript, GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { previewWithAiSuggestions } from '@/ai/flows/preview-with-ai-suggestions';
import { generateVideoFromScene } from '@/ai/flows/generate-video-from-scene';
import { Loader2, Beaker, Video, TestTube, Bot, Clapperboard, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import defaultArtStyle from '@/lib/art-style-default.json';
import defaultScenes from '@/lib/default-scenes.json';
import { SceneList } from '@/components/video/scene-list';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SidebarProvider, Sidebar, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


type Scene = GenerateVideoScriptOutput['scenes'][0];
type ActiveFlow = 'n8n' | 'veo';

export default function TestingPage() {
  const [story, setStory] = useState('A short video about sustainable farming');
  const [artStyle, setArtStyle] = useState(defaultArtStyle.art_style);
  const [scriptOutput, setScriptOutput] = useState<GenerateVideoScriptOutput>({ scenes: defaultScenes.scenes });
  const [videoUri, setVideoUri] = useState('');
  const [previewOutput, setPreviewOutput] = useState(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [activeFlow, setActiveFlow] = useState<ActiveFlow>('veo');

  const handleTest = async (flow: 'script' | 'preview' | 'video', data?: any) => {
    setIsLoading(flow);
    try {
      if (flow === 'script') {
        const result = await generateVideoScript({ story, artStyle });
        setScriptOutput(result);
        toast({ title: 'Script Generated Successfully' });
      } else if (flow === 'preview') {
        const scriptText = scriptOutput ? JSON.stringify(scriptOutput) : story;
        const result = await previewWithAiSuggestions({ videoScript: scriptText });
        setPreviewOutput(result as any);
        toast({ title: 'Preview Generated Successfully' });
      } else if (flow === 'video') {
        const scene = data as Scene;
        if (!scene.imageUrl) {
            toast({ variant: 'destructive', title: 'Image not generated for this scene.'});
            return;
        }
        const result = await generateVideoFromScene({ 
            narration: scene.narrator,
            imageDataUri: scene.imageUrl,
            aspectRatio: '9:16'
        });
        setVideoUri(result.videoDataUri);
        toast({ title: 'Video Rendered Successfully' });
      }
    } catch (error: any) {
      console.error(`Error testing ${flow}:`, error);
      toast({
        variant: 'destructive',
        title: `Error testing ${flow}`,
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleSetScenes = (scenes: GenerateVideoScriptOutput['scenes']) => {
    setScriptOutput({ scenes });
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
                <Clapperboard className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                    VideoCraft AI
                </span>
            </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveFlow('n8n')} isActive={activeFlow === 'n8n'}>
                        <Bot />
                        <span className="group-data-[collapsible=icon]:hidden">Flujo n8n</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveFlow('veo')} isActive={activeFlow === 'veo'}>
                        <TestTube />
                        <span className="group-data-[collapsible=icon]:hidden">Flujo Veo</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <Avatar className="size-7">
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <span className="group-data-[collapsible=icon]:hidden">User</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <SidebarTrigger />
                <Beaker className="h-10 w-10 text-accent" />
                <div>
                <h1 className="text-3xl font-bold font-headline">GenAI Testing Lab</h1>
                <p className="text-muted-foreground">
                    A dedicated space to experiment with individual AI flows.
                </p>
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
                {/* Common Test */}
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

                {/* Veo Flow Tests */}
                {activeFlow === 'veo' && (
                    <>
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
                                                <SceneList scenes={scriptOutput.scenes} setScenes={handleSetScenes} artStyle={artStyle} aspectRatio='9:16' />
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
                                                        <img src={scene.imageUrl} alt={`Scene ${index+1}`} className="w-10 h-10 object-cover rounded-md" /> 
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
                    </>
                )}


                {/* n8n Flow Test */}
                {activeFlow === 'n8n' && (
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
                                            <SceneList scenes={scriptOutput.scenes} setScenes={handleSetScenes} artStyle={artStyle} aspectRatio='9:16' />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
