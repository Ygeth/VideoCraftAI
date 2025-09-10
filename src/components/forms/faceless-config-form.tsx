'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const formSchema = z.object({
  postiz_api_url: z.string().url(),
  background_music_volume: z.number().min(0).max(1),
  chatterbox_exaggeration: z.number().min(0).max(1),
  chatterbox_cfg_weight: z.number().min(0).max(1),
  chatterbox_temperature: z.number().min(0).max(1),
  art_style: z.string().min(10),
});

type FormValues = z.infer<typeof formSchema>;

export function FacelessConfigForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ...defaultConfig,
    },
  });

  function onSubmit(data: FormValues) {
    // Here you would typically save the configuration
    console.log(data);
    toast({
      title: 'Configuration Saved',
      description: 'Your settings have been updated successfully.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
            <AccordionTrigger>Advanced Configuration</AccordionTrigger>
            <AccordionContent className="space-y-8 pt-6">
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
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Background Music Volume: {field.value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => field.onChange(value[0])}
                        value={[field.value]}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="chatterbox_exaggeration"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Chatterbox Exaggeration: {field.value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => field.onChange(value[0])}
                        value={[field.value]}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="chatterbox_cfg_weight"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Chatterbox CFG Weight: {field.value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => field.onChange(value[0])}
                        value={[field.value]}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="chatterbox_temperature"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Chatterbox Temperature: {field.value}</FormLabel>
                    <FormControl>
                        <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => field.onChange(value[0])}
                        value={[field.value]}
                        />
                    </FormControl>
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
                 <Button type="submit">Save Configuration</Button>
            </AccordionContent>
        </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
