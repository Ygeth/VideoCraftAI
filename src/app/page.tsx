'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoCreationPage from '@/app/create/page';
import Image from 'next/image';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-screen max-h-screen w-screen max-w-none top-0 translate-y-0 pt-16">
          <VideoCreationPage />
        </DialogContent>
      </Dialog>
      
      <div className="mb-8">
        <Image 
            src="https://picsum.photos/seed/landing-art/600/400" 
            alt="AI generated art" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-2xl"
            data-ai-hint="abstract digital art"
        />
      </div>

      <h1 className="text-5xl font-bold font-headline mb-4">Crea Videos Virales sin Mostrar tu Cara</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Usa el poder de la IA para generar videos "faceless" para TikTok, Instagram Reels y YouTube Shorts en segundos.
      </p>
      <Button size="lg" onClick={() => setIsModalOpen(true)}>
        Crear "Faceless Video" Ahora
      </Button>
    </div>
  );
}
