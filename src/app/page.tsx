'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FacelessVideoModal } from '@/components/modal/faceless-video-modal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse delay-1000" />

      <FacelessVideoModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <div className="glass p-12 rounded-2xl max-w-4xl w-full flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <Image
            src="https://picsum.photos/seed/landing-art/600/400"
            alt="AI generated art"
            width={600}
            height={400}
            className="relative rounded-lg shadow-2xl ring-1 ring-white/10"
            data-ai-hint="abstract digital art"
          />
        </div>

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight text-glow">
            Crea Videos Virales
            <span className="block text-3xl md:text-5xl mt-2 font-normal text-primary/90">sin Mostrar tu Cara</span>
          </h1>

          <p className="text-xl text-muted-foreground/80 leading-relaxed">
            Usa el poder de la IA para generar videos "faceless" para TikTok, Instagram Reels y YouTube Shorts en segundos.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => setIsModalOpen(true)}
          className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
        >
          Crear "Faceless Video" Ahora
        </Button>
      </div>
    </div>
  );
}
