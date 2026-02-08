'use client';

import React, { useState } from 'react';
import { generateScriptStoryboard } from '@/ai/flows/storyboard/generate-script-storyboard';
import { generateSpeech } from '@/ai/flows/speech/generate-speech-gemini';
import { generateCharacterDetails, generateCharacterImage, GenerateCharacterOutput } from '@/ai/flows/generate-character';
import { generateImage } from '@/ai/flows/image-generation/generate-image';
import { StoryboardOutput, StoryboardScene } from '@/ai/prompts/gen-text/storyboard';
import { artStyles, ArtStyle } from '@/lib/artstyles';
import { tones, defaultTone, Tone } from '@/lib/tones';
import { Sparkles, User, Film, Play, Pause, RefreshCw, Download, ChevronDown, ChevronUp, Loader2, ImageIcon, Volume2 } from 'lucide-react';

export default function CharacterStoryboardPage() {
  // Input state
  const [story, setStory] = useState('');
  const [selectedArtStyle, setSelectedArtStyle] = useState<ArtStyle>(artStyles[0]);
  const [selectedTone, setSelectedTone] = useState<Tone>(defaultTone);

  // Character state
  const [characterDetails, setCharacterDetails] = useState<GenerateCharacterOutput | null>(null);
  const [characterImage, setCharacterImage] = useState<string | undefined>(undefined);

  // Storyboard state
  const [storyboard, setStoryboard] = useState<StoryboardOutput | null>(null);
  const [scenes, setScenes] = useState<(StoryboardScene & { imageUrl?: string; audioUrl?: string })[]>([]);
  const [showTechnicalGuide, setShowTechnicalGuide] = useState(false);

  // Loading states
  const [isLoadingStoryboard, setIsLoadingStoryboard] = useState(false);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false);
  const [loadingSceneImages, setLoadingSceneImages] = useState<Set<number>>(new Set());
  const [loadingSceneAudio, setLoadingSceneAudio] = useState<Set<number>>(new Set());

  // Audio playback
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  const handleGenerateStoryboard = async () => {
    if (!story.trim()) return;

    setIsLoadingStoryboard(true);
    try {
      const result = await generateScriptStoryboard({
        story,
        artStyle: selectedArtStyle.prompt,
        character: characterDetails?.name,
        tone: selectedTone.name,
      });

      setStoryboard(result);
      setScenes(result.scenes.map(scene => ({ ...scene })));
    } catch (error) {
      console.error('Error generating storyboard:', error);
    } finally {
      setIsLoadingStoryboard(false);
    }
  };

  const handleGenerateCharacter = async () => {
    if (!story.trim()) return;

    setIsLoadingCharacter(true);
    try {
      const details = await generateCharacterDetails({
        story,
        artStyle: selectedArtStyle.prompt,
      });
      setCharacterDetails(details);

      const image = await generateCharacterImage({
        characterDetails: details,
        artStyle: selectedArtStyle.prompt,
      });
      setCharacterImage(image.imageDataUri);
    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setIsLoadingCharacter(false);
    }
  };

  const handleGenerateSceneImage = async (index: number) => {
    const scene = scenes[index];
    if (!scene.imagePrompt) return;

    setLoadingSceneImages(prev => new Set(prev).add(index));
    try {
      console.log('Generating image for scene:', scene);
      const result = await generateImage({
        prompt: scene.imagePrompt,
        artStyle: selectedArtStyle.prompt,
        aspectRatio: '16:9',
        showCharacter: scene.showCharacter,
        characterImageDataUri: characterImage,
      });

      setScenes(prev => prev.map((s, i) =>
        i === index ? { ...s, imageUrl: result.imageDataUri } : s
      ));
    } catch (error) {
      console.error('Error generating scene image:', error);
    } finally {
      setLoadingSceneImages(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const handleGenerateSceneAudio = async (index: number) => {
    const scene = scenes[index];
    if (!scene.voiceover) return;

    setLoadingSceneAudio(prev => new Set(prev).add(index));
    try {
      const result = await generateSpeech({
        text: scene.voiceover,
        voice: selectedTone.voice,
        tonePrompt: selectedTone.tonePrompt,
      });

      setScenes(prev => prev.map((s, i) =>
        i === index ? { ...s, audioUrl: result.audioDataUri } : s
      ));
    } catch (error) {
      console.error('Error generating scene audio:', error);
    } finally {
      setLoadingSceneAudio(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const handleGenerateAllMedia = async () => {
    for (let i = 0; i < scenes.length; i++) {
      if (!scenes[i].imageUrl) {
        await handleGenerateSceneImage(i);
      }
      if (!scenes[i].audioUrl && scenes[i].voiceover) {
        await handleGenerateSceneAudio(i);
      }
    }
  };

  const playAudio = (index: number) => {
    const scene = scenes[index];
    if (!scene.audioUrl) return;

    if (playingAudio === index) {
      setPlayingAudio(null);
      return;
    }

    const audio = new Audio(scene.audioUrl);
    audio.onended = () => setPlayingAudio(null);
    audio.play();
    setPlayingAudio(index);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[50%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200 text-glow mb-2">
            Character & Storyboard
          </h1>
          <p className="text-white/60 text-lg">
            Create compelling characters and professional storyboards with AI
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Story Input Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Your Story
              </h2>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Describe your story idea, theme, or concept..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* Art Style Selector */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Art Style</h2>
              <div className="grid grid-cols-2 gap-3">
                {artStyles.map((style) => (
                  <button
                    key={style.code || style.name}
                    onClick={() => setSelectedArtStyle(style)}
                    className={`p-3 rounded-xl border transition-all text-left ${selectedArtStyle.name === style.name
                      ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    <span className="text-sm font-medium text-white">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Voice Tone</h2>
              <select
                value={selectedTone.name}
                onChange={(e) => setSelectedTone(tones.find(t => t.name === e.target.value) || defaultTone)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500/50 transition-all"
              >
                {tones.map((tone) => (
                  <option key={tone.name} value={tone.name} className="bg-slate-900">
                    {tone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGenerateStoryboard}
                disabled={!story.trim() || isLoadingStoryboard}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isLoadingStoryboard ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Storyboard...
                  </>
                ) : (
                  <>
                    <Film className="w-5 h-5" />
                    Generate Storyboard
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateCharacter}
                disabled={!story.trim() || isLoadingCharacter}
                className="w-full py-4 px-6 bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/20 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                {isLoadingCharacter ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Character...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Generate Character
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Character Card */}
            {(characterDetails || isLoadingCharacter) && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Character
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Character Image */}
                  <div className="w-full md:w-48 h-48 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
                    {isLoadingCharacter && !characterImage ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                      </div>
                    ) : characterImage ? (
                      <img src={characterImage} alt="Character" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Character Details */}
                  <div className="flex-1">
                    {characterDetails ? (
                      <>
                        <h3 className="text-2xl font-bold text-white mb-2">{characterDetails.name}</h3>
                        <p className="text-white/70 leading-relaxed">{characterDetails.description}</p>
                        <button
                          onClick={handleGenerateCharacter}
                          disabled={isLoadingCharacter}
                          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-white flex items-center gap-2 transition-all"
                        >
                          <RefreshCw className={`w-4 h-4 ${isLoadingCharacter ? 'animate-spin' : ''}`} />
                          Regenerate
                        </button>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="h-6 bg-white/10 rounded animate-pulse w-1/3" />
                        <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
                        <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Storyboard Section */}
            {(storyboard || isLoadingStoryboard) && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-purple-400" />
                    Storyboard
                  </h2>

                  {scenes.length > 0 && (
                    <button
                      onClick={handleGenerateAllMedia}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600/50 to-cyan-600/50 hover:from-purple-600 hover:to-cyan-600 rounded-lg text-sm text-white flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate All Media
                    </button>
                  )}
                </div>

                {isLoadingStoryboard ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="ml-3 text-white/60">Creating your storyboard...</span>
                  </div>
                ) : storyboard ? (
                  <>
                    {/* Technical Guide (Collapsible) */}
                    <div className="mb-6">
                      <button
                        onClick={() => setShowTechnicalGuide(!showTechnicalGuide)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                      >
                        {showTechnicalGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span className="text-sm">Technical Guide</span>
                      </button>
                      {showTechnicalGuide && (
                        <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-white/70 text-sm whitespace-pre-wrap">{storyboard.technicalGuide}</p>
                        </div>
                      )}
                    </div>

                    {/* Scenes Grid */}
                    <div className="space-y-4">
                      {scenes.map((scene, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Scene Image */}
                            <div className="w-full md:w-64 h-40 bg-black/30 flex-shrink-0 relative">
                              {loadingSceneImages.has(index) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                </div>
                              ) : scene.imageUrl ? (
                                <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" />
                              ) : (
                                <button
                                  onClick={() => handleGenerateSceneImage(index)}
                                  className="absolute inset-0 flex flex-col items-center justify-center text-white/40 hover:text-white/60 hover:bg-white/5 transition-all"
                                >
                                  <ImageIcon className="w-8 h-8 mb-2" />
                                  <span className="text-xs">Generate Image</span>
                                </button>
                              )}
                            </div>

                            {/* Scene Content */}
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {index + 1}. {scene.title}
                                </h3>
                                <div className="flex gap-2">
                                  {/* Audio Controls */}
                                  {scene.voiceover && (
                                    loadingSceneAudio.has(index) ? (
                                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                    ) : scene.audioUrl ? (
                                      <button
                                        onClick={() => playAudio(index)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                                      >
                                        {playingAudio === index ? (
                                          <Pause className="w-4 h-4 text-white" />
                                        ) : (
                                          <Play className="w-4 h-4 text-white" />
                                        )}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleGenerateSceneAudio(index)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                                        title="Generate Audio"
                                      >
                                        <Volume2 className="w-4 h-4 text-white/60" />
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>

                              <p className="text-white/60 text-sm mb-3">{scene.description}</p>

                              {/* Voiceover */}
                              {scene.voiceover && (
                                <div className="mb-3 p-3 bg-white/5 rounded-lg">
                                  <p className="text-white/80 text-sm italic">"{scene.voiceover}"</p>
                                </div>
                              )}

                              {/* Motion Prompt */}
                              {scene.motionPrompt && (
                                <div className="mb-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                  <h4 className="text-xs font-semibold text-cyan-400 uppercase mb-1">Motion</h4>
                                  <p className="text-white/80 text-xs">{scene.motionPrompt}</p>
                                </div>
                              )}

                              {/* Scene Metadata Badges */}
                              <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                  {scene.shotType}
                                </span>
                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                                  {scene.cameraAngle}
                                </span>
                                <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                                  {scene.mood}
                                </span>
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                                  {scene.lighting}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {/* Empty State */}
            {!storyboard && !isLoadingStoryboard && !characterDetails && !isLoadingCharacter && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Ready to Create</h3>
                <p className="text-white/50 max-w-md">
                  Enter your story idea, select an art style and voice tone, then generate your storyboard or character.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
