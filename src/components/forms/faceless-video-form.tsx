'use client';

import {
  FileText,
  ImageIcon,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface FacelessVideoFormProps {
  script: string;
  setScript: (script: string) => void;
  isLoading: boolean;
  onRenderVideo: () => void;
  onPrevStep: () => void;
}

export function FacelessVideoForm({
  script,
  setScript,
  isLoading,
  onRenderVideo,
  onPrevStep,
}: FacelessVideoFormProps) {
  // Placeholder para la funcionalidad de escenas
  const scenes = []; 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FileText className="text-accent" />
              Paso 2: Revisa tu Guion
            </CardTitle>
            <CardDescription>
              Aquí puedes ver el guion completo. Edítalo si es necesario antes de generar el video.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={15}
              disabled={isLoading}
              className="font-mono text-sm"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={onPrevStep} disabled={isLoading}>
              Atrás
            </Button>
            <Button onClick={onRenderVideo} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generar Video
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Generar Escena</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <ImageIcon className="text-muted-foreground h-16 w-16" />
                </div>
                <Textarea placeholder="Narración de la escena..." rows={4} />
                <Button className="w-full mt-4">Generar Imagen de Escena</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
