'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import { generateVideoScript, GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { previewWithAiSuggestions } from '@/ai/flows/preview-with-ai-suggestions';
import { textToVideo } from '@/ai/flows/text-to-video';
import { Loader2, Beaker } from 'lucide-react';
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

export default function TestingPage() {
  const [story, setStory] = useState('A short video about sustainable farming');
  const [artStyle, setArtStyle] = useState(defaultArtStyle.art_style);
  const [scriptOutput, setScriptOutput] = useState<GenerateVideoScriptOutput | null>(null);
  const [videoUri, setVideoUri] = useState('');
  const [previewOutput, setPreviewOutput] = useState(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTest = async (flow: 'script' | 'preview' | 'video') => {
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
        const scriptText = scriptOutput ? scriptOutput.scenes.map(s => s.narrator).join('\n') : story;
        const result = await textToVideo({ script: scriptText });
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
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Beaker className="h-10 w-10 text-accent" />
        <div>
          <h1 className="text-3xl font-bold font-headline">GenAI Testing Lab</h1>
          <p className="text-muted-foreground">
            A dedicated space to experiment with individual AI flows.
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
        <AccordionItem value="item-1" className="border rounded-lg">
          <AccordionTrigger className="p-6 font-headline text-lg">
            1. Test `generateVideoScript`
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
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
                <Label htmlFor="art-style">Art Style</Label>
                <Textarea
                  id="art-style"
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
              {scriptOutput && (
                <div className="mt-4">
                  <h4 className="font-semibold">Output:</h4>
                  <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                    {JSON.stringify(scriptOutput, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border rounded-lg">
          <AccordionTrigger className="p-6 font-headline text-lg">
            2. Test `previewWithAiSuggestions`
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <p className="text-muted-foreground">
                Uses the script from above (or the story as fallback) to generate suggestions.
              </p>
              <Button className="mt-4" onClick={() => handleTest('preview')} disabled={!!isLoading}>
                {isLoading === 'preview' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Preview
              </Button>
              {previewOutput && (
                <div className="mt-4">
                  <h4 className="font-semibold">Output:</h4>
                  <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                    {JSON.stringify(previewOutput, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border rounded-lg">
          <AccordionTrigger className="p-6 font-headline text-lg">
            3. Test `textToVideo`
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <p className="text-muted-foreground">
                Uses the script from step 1 (or the story as fallback) to render a video.
                This may take up to a minute.
              </p>
              <Button className="mt-4" onClick={() => handleTest('video')} disabled={!!isLoading}>
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
    </div>
  );
}
