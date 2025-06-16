'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate alternative project descriptions for SEO optimization.
 *
 * - generateProjectDescriptions - A function that generates alternative project descriptions based on the project title.
 * - GenerateProjectDescriptionsInput - The input type for the generateProjectDescriptions function.
 * - GenerateProjectDescriptionsOutput - The return type for the generateProjectDescriptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectDescriptionsInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
});
export type GenerateProjectDescriptionsInput = z.infer<typeof GenerateProjectDescriptionsInputSchema>;

const GenerateProjectDescriptionsOutputSchema = z.object({
  alternativeDescription: z.string().describe('An alternative description of the project based on its title.'),
  keywords: z.array(z.string()).describe('Relevant keywords for the project.'),
});
export type GenerateProjectDescriptionsOutput = z.infer<typeof GenerateProjectDescriptionsOutputSchema>;


const keywordFitsTool = ai.defineTool({
  name: 'keywordFits',
  description: 'Determines if a keyword is relevant to the project title.',
  inputSchema: z.object({
    keyword: z.string().describe('The keyword to check for relevance.'),
    projectTitle: z.string().describe('The title of the project.'),
  }),
  outputSchema: z.boolean(),
}, async (input) => {
  // Basic implementation: check if the keyword is present in the project title.
  // More sophisticated implementations could use embeddings and similarity checks.
  return input.projectTitle.toLowerCase().includes(input.keyword.toLowerCase());
});

export async function generateProjectDescriptions(input: GenerateProjectDescriptionsInput): Promise<GenerateProjectDescriptionsOutput> {
  return generateProjectDescriptionsFlow(input);
}

const generateProjectDescriptionsPrompt = ai.definePrompt({
  name: 'generateProjectDescriptionsPrompt',
  input: {schema: GenerateProjectDescriptionsInputSchema},
  output: {schema: GenerateProjectDescriptionsOutputSchema},
  tools: [keywordFitsTool],
  prompt: `You are an SEO expert generating alternative descriptions and keywords for portfolio projects.

  Based on the project title, create a concise and engaging alternative description.

  Project Title: {{{projectTitle}}}

  Output:
  - alternativeDescription: A new description for the project.
  - keywords:  Generate an array of keywords relevant to the project title. Use the keywordFits tool to ensure each keyword is relevant to the title.
  `,
});

const generateProjectDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionsFlow',
    inputSchema: GenerateProjectDescriptionsInputSchema,
    outputSchema: GenerateProjectDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await generateProjectDescriptionsPrompt(input);
    return output!;
  }
);
