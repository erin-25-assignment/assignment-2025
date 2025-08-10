"use server";

import { generateNarrativeVariation } from "@/ai/flows/narrative-variation";
import { generateImage } from "@/ai/flows/generate-image";
import type { GameCharacter } from "@/lib/types";

// Define types locally as they can't be imported from 'use server' files.
type NarrativeVariationInput = {
    baseText: string;
    playerChoices: string[];
    characterType: GameCharacter;
};

type GenerateImageInput = {
    prompt: string;
    character: GameCharacter | null;
    story_context: string;
};

export async function getVariedText(input: NarrativeVariationInput): Promise<string> {
  // Ensure we don't call the AI for the very first node which is just a character select prompt.
  if (!input.baseText || input.baseText.trim().startsWith("깊은 눈 속에 묻힌 산장")) {
      return input.baseText;
  }
  
  try {
    const result = await generateNarrativeVariation(input);
    return result.variedText;
  } catch (error) {
    console.error("Error generating narrative variation:", error);
    // In case of an AI error, gracefully fall back to the original text.
    return input.baseText;
  }
}

export async function getStoryImage(input: GenerateImageInput): Promise<string | null> {
  try {
    const result = await generateImage(input);
    return result.imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    // In case of an AI error, return null. The UI will handle the fallback.
    return null;
  }
}
