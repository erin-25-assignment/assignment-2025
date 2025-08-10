"use server";

import type { NarrativeVariationInput, GenerateImageInput } from "@/lib/types";

export async function getVariedText(input: NarrativeVariationInput): Promise<string> {
  // "깊은 눈 속에 묻힌 산장"으로 시작하는 초기 텍스트는 page.tsx에서 처리하므로 여기서는 바로 AI를 호출합니다.
  if (!input.baseText) {
      return "";
  }
  
  try {
    const { generateNarrativeVariation } = await import("@/ai/flows/narrative-variation");
    const result = await generateNarrativeVariation(input);
    return result.variedText;
  } catch (error) {
    console.error("Error generating narrative variation:", error);
    // 오류 발생 시 원본 텍스트를 반환합니다.
    return input.baseText;
  }
}

export async function getStoryImage(input: GenerateImageInput): Promise<string | null> {
  try {
    const { generateImage } = await import("@/ai/flows/generate-image");
    const result = await generateImage(input);
    return result.imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}