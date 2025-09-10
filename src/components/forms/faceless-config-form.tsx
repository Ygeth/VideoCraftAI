'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect } from 'react';

import {
  Form,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import defaultConfig from '@/lib/faceless-config-default.json';
import {
    Accordion,
  } from '@/components/ui/accordion'
import defaultArtStyle from '@/lib/art-style-default.json';
import { InspirationSection } from './config-sections/inspiration-section';
import { ScriptSection } from './config-sections/script-section';
import { VideoConfigSection } from './config-sections/video-config-section';
import { AdvancedConfigSection } from './config-sections/advanced-config-section';


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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <InspirationSection form={form} />
            <ScriptSection form={form} />
            <VideoConfigSection form={form} />
            <AdvancedConfigSection form={form} />
        </Accordion>
      </form>
    </Form>
  );
}
