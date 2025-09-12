'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateVideoScript, GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { previewWithAiSuggestions } from '@/ai/flows/preview-with-ai-suggestions';
import { generateVideoFromScene } from '@/ai/flows/generate-video-from-scene';
import { Loader2, Beaker, Video, TestTube, Bot, Clapperboard, User, Image as ImageIcon, AudioLines, Settings, Mic, Film } from 'lucide-react';
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
import { VeoFlow } from '@/components/flows/VeoFlow';
import { N8nFlow } from '@/components/flows/N8nFlow';
import { ImagenesFlow } from '@/components/flows/ImagenesFlow';
import { KokoroFlow } from '@/components/flows/KokoroFlow';
import { WhisperFlow } from '@/components/flows/WhisperFlow';
import { RemotionFlow } from '@/components/flows/RemotionFlow';


type Scene = GenerateVideoScriptOutput['scenes'][0];
type ActiveFlow = 'n8n' | 'veo' | 'imagenes' | 'kokoro' | 'whisper' | 'remotion';

export default function AdminPage() {
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
            motionScene: scene.motionScene,
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
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveFlow('imagenes')} isActive={activeFlow === 'imagenes'}>
                        <ImageIcon />
                        <span className="group-data-[collapsible=icon]:hidden">Flujo Imagenes</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveFlow('kokoro')} isActive={activeFlow === 'kokoro'}>
                        <AudioLines />
                        <span className="group-data-[collapsible=icon]:hidden">Flujo Kokoro</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveFlow('whisper')} isActive={activeFlow === 'whisper'}>
                        <Mic />
                        <span className="group-data-[collapsible=icon]:hidden">Flujo Whisper</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveFlow('remotion')} isActive={activeFlow === 'remotion'}>
                        <Film />
                        <span className="group-data-[collapsible=icon]:hidden">Flujo Remotion</span>
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
                <Settings className="h-10 w-10 text-accent" />
                <div>
                <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
                <p className="text-muted-foreground">
                    A dedicated space to experiment with individual AI flows.
                </p>
                </div>
            </div>
            {activeFlow === 'veo' && (
              <VeoFlow 
                story={story}
                setStory={setStory}
                artStyle={artStyle}
                setArtStyle={setArtStyle}
                isLoading={isLoading}
                handleTest={handleTest}
                scriptOutput={scriptOutput}
                setScriptOutput={setScriptOutput}
                selectedSceneIndex={selectedSceneIndex}
                setSelectedSceneIndex={setSelectedSceneIndex}
                videoUri={videoUri}
              />
            )}
             {activeFlow === 'n8n' && (
              <N8nFlow 
                story={story}
                setStory={setStory}
                artStyle={artStyle}
                setArtStyle={setArtStyle}
                isLoading={isLoading}
                handleTest={handleTest}
                scriptOutput={scriptOutput}
                setScriptOutput={setScriptOutput}
              />
            )}
            {activeFlow === 'imagenes' && (
                <ImagenesFlow 
                    story={story}
                    setStory={setStory}
                    artStyle={artStyle}
                    setArtStyle={setArtStyle}
                    isLoading={isLoading}
                    handleTest={handleTest}
                    scriptOutput={scriptOutput}
                    setScriptOutput={setScriptOutput}
                />
            )}
             {activeFlow === 'kokoro' && (
                <KokoroFlow />
            )}
            {activeFlow === 'whisper' && (
                <WhisperFlow />
            )}
            {activeFlow === 'remotion' && (
                <RemotionFlow />
            )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
