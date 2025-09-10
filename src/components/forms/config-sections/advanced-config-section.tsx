'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormValues } from '../faceless-config-form';

interface AdvancedConfigSectionProps {
  form: UseFormReturn<FormValues>;
}

export function AdvancedConfigSection({ form }: AdvancedConfigSectionProps) {
  
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

  return (
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
  );
}
