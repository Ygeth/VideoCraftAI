'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormValues } from '../faceless-config-form';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';


interface ScriptSectionProps {
  form: UseFormReturn<FormValues>;
  onGenerateScript: () => void;
  isGeneratingScript: boolean;
  story?: string;
}

export function ScriptSection({ form, onGenerateScript, isGeneratingScript, story }: ScriptSectionProps) {
  return (
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
                <Textarea rows={10} {...field} placeholder="Paste your story here..." />
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
         <Button onClick={onGenerateScript} disabled={isGeneratingScript || !story}>
            {isGeneratingScript ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Generar Guion
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
