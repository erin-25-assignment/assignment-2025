export type StoryResponse = {
  story: string;
  choices: string[];
  image: string;
  isEnding: boolean;
};

export type HistoryStep = {
  story: string;
  choice: string;
  image: string;
};

export async function getNextStory(history: HistoryStep[]): Promise<StoryResponse> {
  try {
    const res = await fetch("http://localhost:4000/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choices: history.map(h => h.choice) }),  // 서버에서 choices 배열만 받는다고 가정
    });

    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status}`);
    }

    const data = await res.json();

    return {
      story: data.story || "스토리를 불러올 수 없습니다.",
      choices: data.choices || [],
      image: data.image || "",
      isEnding: data.isEnding || false,
    };
  } catch (error) {
    console.error("API 호출 오류:", error);
    return {
      story: "오류가 발생했습니다. 다시 시도해주세요.",
      choices: ["처음으로"],
      image: "",
      isEnding: false,
    };
  }
}
