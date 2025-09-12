'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RemotionFlow() {
    const [isLoading, setIsLoading] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGenerateVideo = async () => {
        setIsLoading(true);
        setVideoUri(null);
        // Placeholder for actual video generation logic
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
            title: 'Función no implementada',
            description: 'La generación de video con Remotion aún no está conectada.',
            variant: 'destructive'
        });
        
        // Example of setting a video URI
        // setVideoUri('path/to/your/video.mp4');

        setIsLoading(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Film className="text-accent" />
                    Test Remotion Video Generation
                </CardTitle>
                <CardDescription>
                    Generate a simple "Hello World" video using Remotion.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleGenerateVideo} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4" />}
                    Generate "Hello World" Video
                </Button>
                {videoUri && (
                    <div className="mt-4 space-y-2">
                         <h4 className="font-semibold">Output:</h4>
                        <video controls src={videoUri} className="w-full max-w-md rounded-lg border bg-black">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
