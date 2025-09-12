'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AudioLines } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAudioKokoro } from '@/ai/flows/generate-audio-kokoro';

export function KokoroFlow() {
    const [text, setText] = useState('Hello, this is a test of the Kokoro text-to-speech engine.');
    const [isLoading, setIsLoading] = useState(false);
    const [audioData, setAudioData] = useState<{ uri: string, duration: number } | null>(null);
    const { toast } = useToast();

    const handleGenerateAudio = async () => {
        setIsLoading(true);
        setAudioData(null);
        try {
            const { audioDataUri, audioDuration } = await generateAudioKokoro({ text });
            setAudioData({ uri: audioDataUri, duration: audioDuration });
            toast({
                title: 'Audio Generated',
                description: `Successfully generated ${audioDuration.toFixed(2)}s of audio.`,
            });
        } catch (error: any) {
            console.error('Error generating audio with Kokoro:', error);
            toast({
                variant: 'destructive',
                title: 'Audio Generation Failed',
                description: error.message || 'An unknown error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AudioLines className="text-accent" />
                    Test Kokoro TTS
                </CardTitle>
                <CardDescription>
                    Generate audio from text using the self-hosted Kokoro model.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="kokoro-text">Text to Synthesize</Label>
                    <Textarea
                        id="kokoro-text"
                        placeholder="Enter text..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={8}
                    />
                </div>
                <Button onClick={handleGenerateAudio} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AudioLines className="mr-2 h-4 w-4" />}
                    Generate Audio
                </Button>
                {audioData && (
                    <div className="mt-4 space-y-2">
                         <h4 className="font-semibold">Output:</h4>
                        <audio controls src={audioData.uri} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
