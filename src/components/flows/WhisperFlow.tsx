'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

export function WhisperFlow() {
    const [isLoading, setIsLoading] = useState(false);
    const [transcription, setTranscription] = useState<string | null>(null);
    const { toast } = useToast();

    const handleTranscribe = async () => {
        setIsLoading(true);
        setTranscription(null);
        // Placeholder for actual transcription logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
            title: 'Función no implementada',
            description: 'La transcripción con Whisper aún no está conectada.',
            variant: 'destructive'
        });

        // Example of setting a transcription
        // setTranscription('This is a sample transcription.');

        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mic className="text-accent" />
                    Test Whisper Transcription
                </CardTitle>
                <CardDescription>
                    Upload an audio file and transcribe it using Whisper.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="audio-file">Audio File</Label>
                    <input id="audio-file" type="file" className="text-sm" />
                </div>
                <Button onClick={handleTranscribe} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                    Transcribe Audio
                </Button>
                {transcription && (
                    <div className="mt-4 space-y-2">
                         <h4 className="font-semibold">Transcription:</h4>
                        <p className="p-4 bg-muted rounded-md border text-sm">{transcription}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
