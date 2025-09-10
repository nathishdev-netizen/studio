'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing user profiles
 * into concise descriptions for potential matches.
 *
 * - summarizeProfile - A function that takes a user profile and returns a summarized description.
 * - SummarizeProfileInput - The input type for the summarizeProfile function.
 * - SummarizeProfileOutput - The return type for the summarizeProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProfileInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  interests: z.array(z.string()).describe('A list of the user\u2019s interests.'),
  hobbies: z.array(z.string()).describe('A list of the user\u2019s hobbies.'),
  likesDislikes: z.string().describe('A string containing what the user likes and dislikes.'),
});
export type SummarizeProfileInput = z.infer<typeof SummarizeProfileInputSchema>;

const SummarizeProfileOutputSchema = z.object({
  summary: z.string().describe('A concise and appealing summary of the user profile.'),
});
export type SummarizeProfileOutput = z.infer<typeof SummarizeProfileOutputSchema>;

export async function summarizeProfile(input: SummarizeProfileInput): Promise<SummarizeProfileOutput> {
  return summarizeProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProfilePrompt',
  input: {schema: SummarizeProfileInputSchema},
  output: {schema: SummarizeProfileOutputSchema},
  prompt: `You are a dating profile writer. Create a short, appealing summary of the user using the information provided.

Name: {{{name}}}
Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Hobbies: {{#each hobbies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Likes and Dislikes: {{{likesDislikes}}}

Summary: `,
});

const summarizeProfileFlow = ai.defineFlow(
  {
    name: 'summarizeProfileFlow',
    inputSchema: SummarizeProfileInputSchema,
    outputSchema: SummarizeProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
