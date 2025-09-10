'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Wand2,
  FileText,
  Clapperboard,
  Sparkles,
  Loader2,
  Film,
  Music,
  Captions,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateVideoScript } from '@/ai/flows/generate-video-script';
import { previewWithAiSuggestions, PreviewWithAiSuggestionsOutput } from '@/ai/flows/preview-with-ai-suggestions';
import { textToVideo } from '@/ai/flows/text-to-video';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type CreationStep = 'prompt' | 'script' | 'preview' | 'video';

export default function VideoCreationPage() {
  const [step, setStep] = useState<CreationStep>('prompt');
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [preview, setPreview] = useState<PreviewWithAiSuggestionsOutput | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = (error: any, step: string) => {
    console.error(`Error during ${step}:`, error);
    toast({
      variant: 'destructive',
      title: 'An error occurred',
      description: `Failed to ${step}. Please try again.`,
    });
    setIsLoading(false);
  };

  const handleGenerateScript = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a prompt to generate a script.',
      });
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Generating script...');
    try {
      const { script: generatedScript } = await generateVideoScript({ prompt });
      setScript(generatedScript);
      setStep('script');
    } catch (error) {
      handleError(error, 'generate script');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePreview = async () => {
    if (!script) return;
    setIsLoading(true);
    setLoadingMessage('Creating AI preview...');
    try {
      const previewOutput = await previewWithAiSuggestions({ videoScript: script });
      setPreview(previewOutput);
      setStep('preview');
    } catch (error) {
      handleError(error, 'generate preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenderVideo = async () => {
    if (!script) return;
    setIsLoading(true);
    setLoadingMessage('Rendering your video... This may take a minute.');
    try {
      const { videoDataUri } = await textToVideo({ script });
      setVideoUri(videoDataUri);
      setStep('video');
    } catch (error) {
      handleError(error, 'render video');
    } finally {
      setIsLoading(false);
    }
  };
  
  const startOver = () => {
    setStep('prompt');
    setPrompt('');
    setScript('');
    setPreview(null);
    setVideoUri(null);
  }

  const previewImage = preview?.suggestedMedia || PlaceHolderImages[0]?.imageUrl || "https://picsum.photos/seed/ai-media/1280/720";

  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Step 1: Prompt */}
        <Card className={step !== 'prompt' ? 'opacity-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Wand2 className="text-accent" />
              Step 1: Start with a Prompt
            </CardTitle>
            <CardDescription>Describe the video you want to create. Be as specific as you like.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'A 30-second ad for a new brand of coffee, focusing on the morning ritual.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isLoading || step !== 'prompt'}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateScript} disabled={isLoading || step !== 'prompt'}>
              {isLoading && step === 'prompt' ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate Script
            </Button>
          </CardFooter>
        </Card>

        {/* Step 2: Script Editor */}
        {step !== 'prompt' && (
          <Card className={step !== 'script' ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <FileText className="text-accent" />
                Step 2: Edit Your Script
              </CardTitle>
              <CardDescription>Refine the AI-generated script. Your changes will be reflected in the final video.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={10}
                disabled={isLoading || step !== 'script'}
                className="font-mono text-sm"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleGeneratePreview} disabled={isLoading || step !== 'script'}>
                {isLoading && step === 'script' ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Generate Preview
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: AI Preview */}
        {step === 'preview' && preview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Clapperboard className="text-accent" />
                Step 3: AI-Powered Preview
              </CardTitle>
              <CardDescription>Here's a preview with AI-suggested media, music, and subtitles. Ready to render?</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Film /> Suggested Media</h3>
                <div className="aspect-video relative overflow-hidden rounded-lg border">
                  <Image src={previewImage} alt="AI Suggested Media" layout="fill" objectFit="cover" data-ai-hint="futuristic city" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Music /> Suggested Music</h3>
                <audio controls src={preview.suggestedMusic} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Captions /> Suggested Subtitles</h3>
                <p className="text-sm p-4 bg-muted rounded-lg h-full">{preview.suggestedSubtitles}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRenderVideo} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Render Final Video
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Final Video */}
        {step === 'video' && videoUri && (
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Sparkles className="text-accent" />
                Your Video is Ready!
              </CardTitle>
              <CardDescription>Download your video or start over to create a new one.</CardDescription>
            </CardHeader>
            <CardContent>
              <video controls src={videoUri} className="w-full rounded-lg border bg-black">
                Your browser does not support the video tag.
              </video>
            </CardContent>
            <CardFooter>
                <Button onClick={startOver}>Start Over</Button>
            </CardFooter>
          </Card>
        )}
        
        {/* Loading Indicator */}
        {isLoading && (
            <div className="fixed inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold text-primary">{loadingMessage}</p>
            </div>
        )}

      </div>
    </div>
  );
}
