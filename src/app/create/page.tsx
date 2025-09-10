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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateVideoScript } from '@/ai/flows/generate-video-script';
import { previewWithAiSuggestions, PreviewWithAiSuggestionsOutput } from '@/ai/flows/preview-with-ai-suggestions';
import { textToVideo } from '@/ai/flows/text-to-video';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Stepper } from '@/components/ui/stepper';

type CreationStep = 'prompt' | 'script' | 'preview' | 'video';

const steps = [
  { id: 'prompt', name: 'Configuración' },
  { id: 'script', name: 'Guion' },
  { id: 'video', name: 'Generación' },
];

export default function VideoCreationPage() {
  const [currentStep, setCurrentStep] = useState(0);
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
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
      nextStep();
    } catch (error) {
      handleError(error, 'generate script');
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
      nextStep();
    } catch (error) {
      handleError(error, 'render video');
    } finally {
      setIsLoading(false);
    }
  };
  
  const startOver = () => {
    setCurrentStep(0);
    setPrompt('');
    setScript('');
    setPreview(null);
    setVideoUri(null);
  }

  const previewImage = preview?.suggestedMedia || PlaceHolderImages[0]?.imageUrl || "https://picsum.photos/seed/ai-media/1280/720";

  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <Stepper steps={steps} currentStep={currentStep} className="mb-12" />

        {/* Step 1: Prompt */}
        {steps[currentStep].id === 'prompt' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Wand2 className="text-accent" />
                Paso 1: Empieza con una idea
              </CardTitle>
              <CardDescription>Describe el video que quieres crear. Sé tan específico como quieras.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ej: 'Un anuncio de 30 segundos para una nueva marca de café, centrado en el ritual matutino.'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isLoading}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateScript} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Generar Guion
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Script Editor */}
        {steps[currentStep].id === 'script' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <FileText className="text-accent" />
                Paso 2: Edita tu Guion
              </CardTitle>
              <CardDescription>Refina el guion generado por la IA. Tus cambios se reflejarán en el video final.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={10}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={prevStep} disabled={isLoading}>
                Atrás
              </Button>
              <Button onClick={handleRenderVideo} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Generar Video
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Final Video */}
        {steps[currentStep].id === 'video' && (
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Sparkles className="text-accent" />
                ¡Tu video está listo!
              </CardTitle>
              <CardDescription>Descarga tu video o empieza de nuevo para crear uno nuevo.</CardDescription>
            </CardHeader>
            <CardContent>
              {videoUri ? (
                <video controls src={videoUri} className="w-full rounded-lg border bg-black">
                  Tu navegador no soporta la etiqueta de video.
                </video>
              ) : (
                 <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-8 h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg font-semibold text-primary">{loadingMessage}</p>
                 </div>
              )}
            </CardContent>
            <CardFooter>
                <Button onClick={startOver}>Empezar de nuevo</Button>
            </CardFooter>
          </Card>
        )}
        
        {/* Full screen loader */}
        {isLoading && !videoUri && steps[currentStep].id !== 'video' && (
            <div className="fixed inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold text-primary">{loadingMessage}</p>
            </div>
        )}
      </div>
    </div>
  );
}
