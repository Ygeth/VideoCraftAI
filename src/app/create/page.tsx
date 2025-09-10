'use client';

import { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateVideoScript, GenerateVideoScriptInput, GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { generateVideoFromScene } from '@/ai/flows/generate-video-from-scene';
import { Stepper } from '@/components/ui/stepper';
import { FacelessConfigForm, FormValues } from '@/components/forms/faceless-config-form';
import defaultArtStyle from '@/lib/art-style-default.json';
import { FacelessVideoForm } from '@/components/forms/faceless-video-form';


const steps = [
  { id: 'prompt', name: 'Configuración' },
  { id: 'script', name: 'Guion' },
  { id: 'video', name: 'Generación' },
];

export default function VideoCreationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scenes, setScenes] = useState<GenerateVideoScriptOutput['scenes']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormValues>({
    art_style: defaultArtStyle.art_style,
    story: '',
  });

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
    if (!formState.story) {
      toast({
        variant: 'destructive',
        title: 'Story is required',
        description: 'Please provide a story to generate the script.',
      });
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Generating script...');
    try {
      const input: GenerateVideoScriptInput = {
        story: formState.story,
        artStyle: formState.art_style!
      };
      const result = await generateVideoScript(input);
      setScenes(result.scenes);
      nextStep();
    } catch (error) {
      handleError(error, 'generate script');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenderVideo = async () => {
    // This function will now generate video for the first scene as an example.
    // A more complex implementation could generate a video for each scene and stitch them together.
    const firstSceneWithImage = scenes.find(scene => scene.imageUrl);

    if (!firstSceneWithImage) {
      toast({
        variant: 'destructive',
        title: 'No image generated',
        description: 'Please generate an image for at least one scene before rendering a video.',
      });
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Rendering your video... This may take a minute.');
    try {
      const { videoDataUri } = await generateVideoFromScene({ 
        narration: firstSceneWithImage.narrator,
        imageDataUri: firstSceneWithImage.imageUrl!,
        aspectRatio: '9:16'
      });
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
    setScenes([]);
    setVideoUri(null);
  }


  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <Stepper steps={steps} currentStep={currentStep} className="mb-12" />

        {steps[currentStep].id === 'prompt' && (
           <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2 font-headline">
               <Wand2 className="text-accent" />
               Paso 1: Configura y empieza con una idea
             </CardTitle>
             <CardDescription>
               Ajusta los parámetros de la IA y luego describe el video que quieres crear.
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
             <FacelessConfigForm 
                onFormChange={setFormState} 
                onGenerateScript={handleGenerateScript} 
                isGeneratingScript={isLoading}
                story={formState.story}
             />
           </CardContent>
         </Card>
        )}

        {steps[currentStep].id === 'script' && (
          <FacelessVideoForm 
            scenes={scenes}
            setScenes={setScenes}
            artStyle={formState.art_style!}
            aspectRatio="9:16"
            isLoading={isLoading}
            onRenderVideo={handleRenderVideo}
            onPrevStep={prevStep}
          />
        )}

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
              {isLoading && !videoUri ? (
                 <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-8 h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg font-semibold text-primary">{loadingMessage}</p>
                 </div>
              ) : videoUri ? (
                <video controls src={videoUri} className="w-full rounded-lg border bg-black">
                  Tu navegador no soporta la etiqueta de video.
                </video>
              ) : null}
            </CardContent>
            <CardFooter>
                <Button onClick={startOver}>Empezar de nuevo</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
