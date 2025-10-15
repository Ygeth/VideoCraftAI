'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageOutput } from "@/ai/flows/image-generation/schemas";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";

interface StyleCardProps {
  styleImage: ImageOutput | null;
}

export function StyleCard({ styleImage }: StyleCardProps) {
  if (!styleImage || !styleImage.imageDataUri) {
    return (
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon />
                    Estilo Visual
                </CardTitle>
                <CardDescription>
                    Una imagen de referencia para el estilo artístico.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                    <p className="text-muted-foreground text-sm p-4 text-center">Genere un personaje para crear también una imagen de estilo.</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ImageIcon />
            Estilo Visual
        </CardTitle>
        <CardDescription>
            Imagen de referencia para el estilo artístico.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer">
                    <Image
                        src={styleImage.imageDataUri}
                        alt="Style reference"
                        fill
                        className="object-cover"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh]">
                <VisuallyHidden>
                    <DialogTitle>Style Image Preview</DialogTitle>
                </VisuallyHidden>
                <div className="w-full h-full relative">
                    <Image
                        src={styleImage.imageDataUri}
                        alt="Style reference"
                        fill
                        className="object-contain rounded-lg"
                    />
                </div>
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
