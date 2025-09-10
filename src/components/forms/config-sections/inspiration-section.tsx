'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, BookOpen, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getStoriesFromTopics, RedditStory } from '@/services/reddit-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormValues } from '../faceless-config-form';


interface InspirationSectionProps {
  form: UseFormReturn<FormValues>;
}

export function InspirationSection({ form }: InspirationSectionProps) {
    const [stories, setStories] = useState<RedditStory[]>([]);
    const [isFetchingStories, setIsFetchingStories] = useState(false);

    const handleFetchStories = async () => {
        const url = form.getValues('reddit_url');
        if (!url) {
            toast({
                variant: 'destructive',
                title: 'Reddit URL is not set',
                description: 'Please configure the Reddit URL to fetch stories.',
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
  );
}
