'use client';

import Link from 'next/link';
import { Film, User, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[50%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200 text-glow mb-4">
            VideoCraftAI
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">
            Create compelling stories, characters, and videos with the power of AI
          </p>
        </header>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Character & Storyboard Card */}
          <Link href="/character" className="group">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">Character & Storyboard</h2>
              <p className="text-white/50">
                Generate unique characters and professional storyboards with AI-powered scene creation and narration.
              </p>
              <div className="mt-6 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="text-sm font-medium">Get Started</span>
                <Sparkles className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          {/* Short Videos Card */}
          <Link href="/video" className="group">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-pink-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Film className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">Short Videos</h2>
              <p className="text-white/50">
                Transform your stories into engaging short videos with automated scene generation and voice narration.
              </p>
              <div className="mt-6 flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span className="text-sm font-medium">Create Video</span>
                <Sparkles className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
