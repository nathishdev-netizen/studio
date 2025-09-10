'use server';

/**
 * @fileOverview An AI profile generator for new users.
 *
 * - generateProfile - A function that generates a profile description.
 * - AIProfileGeneratorInput - The input type for the generateProfile function.
 * - AIProfileGeneratorOutput - The return type for the generateProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProfileGeneratorInputSchema = z.object({
  interests: z
    .string()
    .describe('A short prompt describing the user\'s interests.'),
});

export type AIProfileGeneratorInput = z.infer<typeof AIProfileGeneratorInputSchema>;

const AIProfileGeneratorOutputSchema = z.object({
  profileDescription: z
    .string()
    .describe('A draft profile description based on the user\'s interests.'),
});

export type AIProfileGeneratorOutput = z.infer<typeof AIProfileGeneratorOutputSchema>;

export async function generateProfile(input: AIProfileGeneratorInput): Promise<AIProfileGeneratorOutput> {
  return aiProfileGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProfileGeneratorPrompt',
  input: {schema: AIProfileGeneratorInputSchema},
  output: {schema: AIProfileGeneratorOutputSchema},
  prompt: `You are an expert dating profile writer. You will generate a short, engaging profile description based on the user's stated interests.

Interests: {{{interests}}}

Profile Description:`,
});

const aiProfileGeneratorFlow = ai.defineFlow(
  {
    name: 'aiProfileGeneratorFlow',
    inputSchema: AIProfileGeneratorInputSchema,
    outputSchema: AIProfileGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
