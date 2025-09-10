'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FacelessVideoModal } from '@/components/modal/faceless-video-modal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <FacelessVideoModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      
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
