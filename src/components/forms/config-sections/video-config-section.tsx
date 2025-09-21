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
import { Loader2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormValues } from '../faceless-config-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { artStyles } from '@/lib/artstyles';
import { Textarea } from '@/components/ui/textarea';

interface VideoConfigSectionProps {
  form: UseFormReturn<FormValues>;
}

export function VideoConfigSection({ form }: VideoConfigSectionProps) {
  const [backgroundMusicFile, setBackgroundMusicFile] = useState<File | null>(null);
  const [sampleAudioFile, setSampleAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

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

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Video Configuration</AccordionTrigger>
      <AccordionContent className="space-y-8 pt-6">
        <FormField
          control={form.control}
          name="art_style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Art Style</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selectedStyle = artStyles.find(style => style.name === value);
                  if (selectedStyle) {
                    form.setValue('art_style', selectedStyle.prompt);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an art style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {artStyles.map(style => (
                    <SelectItem key={style.name} value={style.name}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea {...field} rows={10} />
              <FormMessage />
            </FormItem>
          )}
        />
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
  );
}