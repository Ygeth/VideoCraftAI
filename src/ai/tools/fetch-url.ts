'use server';
/**
 * @fileOverview A tool for fetching and parsing text content from a URL.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to fetch.'),
});

const FetchUrlOutputSchema = z.object({
  content: z.string().describe('The extracted text content of the webpage.'),
});

export const fetchUrlTool = ai.defineTool(
  {
    name: 'fetchUrl',
    description: 'Fetches the text content of a given URL. Use this to read articles, blog posts, or other web content.',
    inputSchema: FetchUrlInputSchema,
    outputSchema: FetchUrlOutputSchema,
  },
  async ({url}) => {
    console.log(`Using fetchUrl tool for: ${url}`);
    try {
      // In a real app, this would be an absolute URL to your deployed endpoint
      const response = await fetch(`http://localhost:9002/api/fetch-url?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = `Failed to fetch URL content: ${error.message || response.statusText}`;
        console.error(errorMessage);
        // We return a descriptive error message to the LLM.
        return {content: `Error: ${errorMessage}`};
      }

      const data = await response.json();
      return {content: data.content};
    } catch (error: any) {
      console.error('Error calling /api/fetch-url:', error);
       // We return a descriptive error message to the LLM.
      return {content: `Error: Could not connect to the fetch service. ${error.message}`};
    }
  }
);
