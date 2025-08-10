'use server';
/**
 * @fileOverview A Genkit flow to generate images for the story based on hints.
 * 
 * - generateImage - A function that generates an image based on a text prompt.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GameCharacter } from '@/lib/types';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe("A short text prompt describing the desired image scene."),
  character: z.nativeEnum(GameCharacter).nullable().describe("The player's character, if selected."),
  story_context: z.string().describe("The current text of the story node for more context."),
});
type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image."),
});
type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ prompt, character, story_context }) => {
    const fullPrompt = `Generate a cinematic, atmospheric, and slightly melancholic image for a mystery story set in a snowy, isolated mountain cabin. 
    The style should be photorealistic with a touch of digital painting. 
    Scene: ${prompt}.
    Main Character in scene (if applicable): ${character || 'unspecified'}.
    Current Story Moment: "${story_context}"
    Focus on creating a strong mood of isolation, mystery, and suspense. Avoid overly bright or cheerful colors.`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: fullPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed to return a URL.');
    }

    return { imageUrl: media.url };
  }
);
