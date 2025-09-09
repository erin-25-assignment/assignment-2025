'use server';
/**
 * @fileOverview Summarizes a long note to provide key takeaways.
 *
 * - summarizeLongNote - A function that handles the summarization process.
 * - SummarizeLongNoteInput - The input type for the summarizeLongNote function.
 * - SummarizeLongNoteOutput - The return type for the summarizeLongNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLongNoteInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to summarize.'),
});
export type SummarizeLongNoteInput = z.infer<typeof SummarizeLongNoteInputSchema>;

const SummarizeLongNoteOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the note.'),
});
export type SummarizeLongNoteOutput = z.infer<typeof SummarizeLongNoteOutputSchema>;

export async function summarizeLongNote(input: SummarizeLongNoteInput): Promise<SummarizeLongNoteOutput> {
  return summarizeLongNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLongNotePrompt',
  input: {schema: SummarizeLongNoteInputSchema},
  output: {schema: SummarizeLongNoteOutputSchema},
  prompt: `Summarize the following note, providing the key takeaways:\n\n{{{noteContent}}}`, // Changed from note to noteContent
});

const summarizeLongNoteFlow = ai.defineFlow(
  {
    name: 'summarizeLongNoteFlow',
    inputSchema: SummarizeLongNoteInputSchema,
    outputSchema: SummarizeLongNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
