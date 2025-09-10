'use client';

import {
  FileText,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { SceneList } from '../video/scene-list';

interface FacelessVideoFormProps {
  scenes: GenerateVideoScriptOutput['scenes'];
  setScenes: (scenes: GenerateVideoScriptOutput['scenes']) => void;
  isLoading: boolean;
  onRenderVideo: () => void;
  onPrevStep: () => void;
}

export function FacelessVideoForm({
  scenes,
  setScenes,
  isLoading,
  onRenderVideo,
  onPrevStep,
}: FacelessVideoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <FileText className="text-accent" />
          Paso 2: Revisa tu Guion
        </CardTitle>
        <CardDescription>
          Aquí puedes ver las escenas generadas por la IA. Edita el texto si es necesario y prepárate para generar el video.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SceneList scenes={scenes} setScenes={setScenes} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onPrevStep} disabled={isLoading}>
          Atrás
        </Button>
        <Button onClick={onRenderVideo} disabled={isLoading || scenes.length === 0}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          Generar Video
        </Button>
      </CardFooter>
    </Card>
  );
}
