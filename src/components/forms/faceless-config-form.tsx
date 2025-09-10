'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import defaultConfig from '@/lib/faceless-config-default.json';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion'
import { Upload, Copy, Loader2, BookOpen } from 'lucide-react';
import { getStoriesFromTopics, RedditStory } from '@/services/reddit-service';
import { ScrollArea } from '../ui/scroll-area';
import defaultArtStyle from '@/lib/art-style-default.json';


const formSchema = z.object({
  story: z.string().optional(),
  art_style: z.string().min(10),
  // advanced config
  postiz_api_url: z.string().url().optional(),
  background_music_volume: z.number().min(0).max(1).optional(),
  chatterbox_exaggeration: z.number().min(0).max(1).optional(),
  chatterbox_cfg_weight: z.number().min(0).max(1).optional(),
  chatterbox_temperature: z.number().min(0).max(1).optional(),
  AI_AGENTS_NO_CODE_TOOLS_URL: z.string().url().optional(),
  background_music_id: z.string().optional(),
  sample_audio_id: z.string().optional(),
  reddit_url: z.string().url().optional(),
}).partial();

export type FormValues = z.infer<typeof formSchema>;

interface FacelessConfigFormProps {
    onFormChange: (data: FormValues) => void;
}

export function FacelessConfigForm({ onFormChange }: FacelessConfigFormProps) {
  const [backgroundMusicFile, setBackgroundMusicFile] = useState<File | null>(null);
  const [sampleAudioFile, setSampleAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [stories, setStories] = useState<RedditStory[]>([]);
  const [isFetchingStories, setIsFetchingStories] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ...defaultConfig,
        art_style: defaultArtStyle.art_style,
        AI_AGENTS_NO_CODE_TOOLS_URL: process.env.NEXT_PUBLIC_AI_AGENTS_NO_CODE_TOOLS_URL || 'http://localhost:8000/',
        background_music_id: '',
        sample_audio_id: '',
        story: '',
    },
  });

  const watchedValues = form.watch();
  useEffect(() => {
    onFormChange(watchedValues);
  }, [watchedValues, onFormChange]);


  function onSubmit(data: FormValues) {
    console.log(data);
    toast({
      title: 'Configuration Saved',
      description: 'Your settings have been updated successfully.',
    });
  }

  async function onCheckHealth() {
    const url = form.getValues('AI_AGENTS_NO_CODE_TOOLS_URL');
    if (!url) {
        toast({
            variant: 'destructive',
            title: 'URL is empty',
            description: 'Please enter a URL to check.',
        });
        return;
    }
    try {
        const healthUrl = new URL('/health', url).toString();
        const response = await fetch(healthUrl);
        if (response.ok) {
            toast({
                title: 'Health Check Successful',
                description: 'The service is running correctly.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Health Check Failed',
                description: `The service returned status: ${response.status}`,
            });
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Health Check Error',
            description: 'Could not connect to the service. Please check the URL and if the service is running.',
        });
    }
  }

  const handleFileUpload = async (file: File | null, fieldName: 'background_music_id' | 'sample_audio_id', mediaType: 'audio') => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    setIsUploading(fieldName);
    const url = form.getValues('AI_AGENTS_NO_CODE_TOOLS_URL');
    if (!url) {
        toast({
            variant: 'destructive',
            title: 'AI Agents URL is not set',
            description: 'Please configure the AI Agents URL in advanced settings.',
        });
        setIsUploading(null);
        return;
    }
    const uploadUrl = new URL('/api/v1/media/storage', url).toString();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('media_type', mediaType);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        form.setValue(fieldName, result.file_id);
        toast({
          title: 'Upload Successful',
          description: `${file.name} has been uploaded and its ID is set.`,
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: errorData.detail || `Server returned status: ${response.status}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: error.message || 'An unknown error occurred during upload.',
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleFetchStories = async () => {
    const url = form.getValues('reddit_url');
    if (!url) {
        toast({
            variant: 'destructive',
            title: 'Reddit URL is not set',
            description: 'Please configure the Reddit URL in advanced settings.',
        });
        return;
    }
    setIsFetchingStories(true);
    try {
        const fetchedStories = await getStoriesFromTopics(url);
        setStories(fetchedStories);
        if (fetchedStories.length === 0) {
            toast({
                title: 'No stories found',
                description: 'No stories matched the criteria. Try a different subreddit.',
            });
        }
    } catch (error: any) {
        console.error(error)
        toast({
            variant: 'destructive',
            title: 'Failed to fetch stories',
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setIsFetchingStories(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    form.setValue('story', text);
    navigator.clipboard.writeText(text);
    toast({
        title: 'Story copied and pasted!',
        description: "The story has been copied to your clipboard and pasted into the 'Story' field.",
    });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      <AccordionItem value="item-1">
          <AccordionTrigger>Inspiration</AccordionTrigger>
          <AccordionContent className="space-y-6 pt-6">
                <FormField
                control={form.control}
                name="reddit_url"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Reddit URL</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleFetchStories} disabled={isFetchingStories}>
                            {isFetchingStories ? <Loader2 className="animate-spin" /> : <BookOpen />}
                            Get Stories
                        </Button>
                    </div>
                    <FormDescription>
                        Enter a Reddit URL (.json) to fetch stories for inspiration.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {stories.length > 0 && (
                    <ScrollArea className="h-72 w-full rounded-md border p-4">
                         <div className="space-y-4">
                            {stories.map((story) => (
                                <div key={story.id} className="p-4 border rounded-lg relative">
                                    <h4 className="font-bold mb-2 pr-10">{story.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{story.selftext}</p>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="absolute top-2 right-2 h-8 w-8"
                                        onClick={() => handleCopyToClipboard(story.selftext)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-guion">
            <AccordionTrigger>Guión</AccordionTrigger>
            <AccordionContent className="space-y-8 pt-6">
            <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Story</FormLabel>
                    <FormControl>
                        <Textarea rows={10} {...field} placeholder="Paste your story here..."/>
                    </FormControl>
                    <FormDescription>
                        The story you want to turn into a video.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="art_style"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Art Style</FormLabel>
                    <FormControl>
                        <Textarea rows={10} {...field} />
                    </FormControl>
                    <FormDescription>
                        Describe the desired visual style for the generated art.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Video Configuration</AccordionTrigger>
          <AccordionContent className="space-y-8 pt-6">
            <FormItem>
              <FormLabel>Background Music</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input 
                    type="file" 
                    accept=".mp3" 
                    onChange={(e) => setBackgroundMusicFile(e.target.files?.[0] || null)}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline"
                  size="icon"
                  onClick={() => handleFileUpload(backgroundMusicFile, 'background_music_id', 'audio')}
                  disabled={!backgroundMusicFile || !!isUploading}
                >
                  {isUploading === 'background_music_id' ? <Loader2 className="animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
              <FormDescription>
                ID: {form.watch('background_music_id') || 'Not uploaded'}
              </FormDescription>
            </FormItem>

            <FormItem>
              <FormLabel>Sample Audio</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input 
                    type="file" 
                    accept=".mp3" 
                    onChange={(e) => setSampleAudioFile(e.target.files?.[0] || null)}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline"
                  size="icon"
                  onClick={() => handleFileUpload(sampleAudioFile, 'sample_audio_id', 'audio')}
                  disabled={!sampleAudioFile || !!isUploading}
                >
                   {isUploading === 'sample_audio_id' ? <Loader2 className="animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
               <FormDescription>
                ID: {form.watch('sample_audio_id') || 'Not uploaded'}
              </FormDescription>
            </FormItem>

          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger>Advanced Configuration</AccordionTrigger>
            <AccordionContent className="space-y-8 pt-6">
                <FormField
                control={form.control}
                name="AI_AGENTS_NO_CODE_TOOLS_URL"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>AI Agents No-Code Tools URL</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={onCheckHealth}>Check</Button>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="postiz_api_url"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Postiz API URL</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="background_music_volume"
                render={({ field: { onChange, value } }) => (
                    <FormItem>
                    <FormLabel>Background Music Volume: {value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(val) => onChange(val[0])}
                        value={[value || 0.1]}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="chatterbox_exaggeration"
                render={({ field: { onChange, value } }) => (
                    <FormItem>
                    <FormLabel>Chatterbox Exaggeration: {value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(val) => onChange(val[0])}
                        value={[value || 0.6]}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="chatterbox_cfg_weight"
                render={({ field: { onChange, value } }) => (
                    <FormItem>
                    <FormLabel>Chatterbox CFG Weight: {value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(val) => onChange(val[0])}
                        value={[value || 0.5]}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="chatterbox_temperature"
                render={({ field: { onChange, value } }) => (
                    <FormItem>
                    <FormLabel>Chatterbox Temperature: {value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(val) => onChange(val[0])}
                        value={[value || 0.8]}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                 <Button type="submit">Save Configuration</Button>
            </AccordionContent>
        </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
