'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting conversation starters to the user, based on their profile and past chats.
 *
 * - aiChatSuggestion - A function that generates conversation starters.
 * - AIChatSuggestionInput - The input type for the aiChatSuggestion function.
 * - AIChatSuggestionOutput - The return type for the aiChatSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatSuggestionInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  profile: z.record(z.any()).describe('The user profile data.'),
  pastChats: z.array(z.record(z.any())).describe('The user past chats with the AI companion.'),
});

export type AIChatSuggestionInput = z.infer<typeof AIChatSuggestionInputSchema>;

const AIChatSuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Array of suggested conversation starters.'),
});

export type AIChatSuggestionOutput = z.infer<typeof AIChatSuggestionOutputSchema>;

export async function aiChatSuggestion(input: AIChatSuggestionInput): Promise<AIChatSuggestionOutput> {
  return aiChatSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatSuggestionPrompt',
  input: {schema: AIChatSuggestionInputSchema},
  output: {schema: AIChatSuggestionOutputSchema},
  prompt: `You are an AI companion whose role is to suggest relevant and engaging conversation starters to the user, based on their profile and past chats. Return 3 suggestions.

  User Profile:
  {{profile}}

  Past Chats:
  {{#each pastChats}}
    {{this}}
  {{/each}}
  `,
});

const aiChatSuggestionFlow = ai.defineFlow(
  {
    name: 'aiChatSuggestionFlow',
    inputSchema: AIChatSuggestionInputSchema,
    outputSchema: AIChatSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
