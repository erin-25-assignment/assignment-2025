import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export type StoryResponse = {
  story: string;
  choices: string[];
  image: string;
};

export async function getNextStory(currentStory: string, choice: string): Promise<StoryResponse> {
  try {
    const prompt = `
다음 상황에 맞는 새로운 스토리를 한 문장으로 만들어주세요.
현재 스토리: ${currentStory}
플레이어가 선택한 행동: ${choice}

그리고 이어질 선택지 2개를 배열로 JSON 형태로 만들어주세요.
예시 출력:
{
  "story": "새로운 방을 발견했다...",
  "choices": ["안으로 들어간다", "도망친다"]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const content = completion.choices[0].message?.content || "";

    // GPT가 준 JSON 문자열 파싱
    const parsed = JSON.parse(content);

    // 이미지 프롬프트 간단 생성
    const imagePrompt = `Illustration of: ${parsed.story}`;

    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: "512x512",
    });

    const imageUrl = imageResponse.data?.[0]?.url || "";

    return {
      story: parsed.story,
      choices: parsed.choices,
      image: imageUrl,
    };
  } catch (error) {
    console.error("API 호출 오류:", error);
    return {
      story: "오류가 발생했습니다. 다시 시도해주세요.",
      choices: ["처음으로"],
      image: "",
    };
  }
}
