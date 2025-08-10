'use server';

/**
 * @fileOverview A Genkit flow to generate subtle narrative variations based on player choices and character.
 *
 * - generateNarrativeVariation - A function that generates narrative variations.
 * - NarrativeVariationInput - The input type for the generateNarrativeVariation function.
 * - NarrativeVariationOutput - The return type for the generateNarrativeVariation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { GameCharacter } from '@/lib/types';

const NarrativeVariationInputSchema = z.object({
  baseText: z.string().describe('The original text to be varied.'),
  playerChoices: z.array(z.string()).describe('An array of player choices made so far.'),
  characterType: z.nativeEnum(GameCharacter).describe('The character type (rio or sera).'),
});
type NarrativeVariationInput = z.infer<typeof NarrativeVariationInputSchema>;

const NarrativeVariationOutputSchema = z.object({
  variedText: z.string().describe('The subtly varied text.'),
});
type NarrativeVariationOutput = z.infer<typeof NarrativeVariationOutputSchema>;

export async function generateNarrativeVariation(input: NarrativeVariationInput): Promise<NarrativeVariationOutput> {
  return narrativeVariationFlow(input);
}

const narrativeVariationPrompt = ai.definePrompt({
  name: 'narrativeVariationPrompt',
  input: {schema: NarrativeVariationInputSchema},
  output: {schema: NarrativeVariationOutputSchema},
  prompt: `You are a narrative designer who is subtlely changing the story based on the player's actions and character.

  The goal is to make the story feel more personalized and dynamic, without drastically altering the core plot.

  Here is the original text:
  {{baseText}}

  Here are the player's choices so far:
  {{#each playerChoices}}
  - {{this}}
  {{/each}}

  The player is playing as the character: {{characterType}}

  Based on this information, subtly vary the text. Focus on small details and flavor. 
  Do not change the core meaning or plot.
  Do not add any new plot points or story beats. Focus on subtle variations in wording.
  Vary sentence structure.
  If the player has picked up an item, consider adding flavor text about it.
  If the player has not picked up an item, consider removing text about it.  

  Return only the varied text.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const narrativeVariationFlow = ai.defineFlow(
  {
    name: 'narrativeVariationFlow',
    inputSchema: NarrativeVariationInputSchema,
    outputSchema: NarrativeVariationOutputSchema,
  },
  async input => {
    const {output} = await narrativeVariationPrompt(input);
    return {variedText: output!.variedText!};
  }
);
