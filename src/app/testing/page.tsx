'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateVideoScript } from '@/ai/flows/generate-video-script';
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

export default function TestingPage() {
  const [prompt, setPrompt] = useState('A short video about sustainable farming');
  const [script, setScript] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [previewOutput, setPreviewOutput] = useState(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTest = async (flow: 'script' | 'preview' | 'video') => {
    setIsLoading(flow);
    try {
      if (flow === 'script') {
        const result = await generateVideoScript({ prompt });
        setScript(result.script);
        toast({ title: 'Script Generated Successfully' });
      } else if (flow === 'preview') {
        const result = await previewWithAiSuggestions({ videoScript: script || prompt });
        setPreviewOutput(result as any);
        toast({ title: 'Preview Generated Successfully' });
      } else if (flow === 'video') {
        const result = await textToVideo({ script: script || prompt });
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

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1" className="border rounded-lg">
          <AccordionTrigger className="p-6 font-headline text-lg">
            1. Test `generateVideoScript`
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Input a prompt to generate a video script.</p>
              <Input
                placeholder="Enter a prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button onClick={() => handleTest('script')} disabled={!!isLoading}>
                {isLoading === 'script' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Script
              </Button>
              {script && (
                <div className="mt-4">
                  <h4 className="font-semibold">Output:</h4>
                  <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                    {script}
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
                Uses the script from above (or the prompt as fallback) to generate suggestions.
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
                Uses the script from step 1 (or the prompt as fallback) to render a video.
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
