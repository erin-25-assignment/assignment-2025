import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StoryView from "../components/StoryView";
import ChoiceButton from "../components/ChoiceButton";
import ImageViewer from "../components/ImageViewer";
import { getNextStory, StoryResponse } from "../utils/api";

const MAX_STEPS = 10;

export default function Game() {
  const [story, setStory] = useState("당신은 어두운 방에서 눈을 떴다.");
  const [choices, setChoices] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [history, setHistory] = useState<
    { story: string; choice: string; image: string }[]
  >([]);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 캐시: key = JSON.stringify(history), value = StoryResponse
  const cache = useRef<Record<string, StoryResponse>>({});

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const stored = localStorage.getItem("story_history");
      let restoredHistory: typeof history = [];
      if (stored) {
        try {
          restoredHistory = JSON.parse(stored);
          setHistory(restoredHistory);
          setStep(restoredHistory.length);
        } catch {
          restoredHistory = [];
        }
      }

      const cacheKey = JSON.stringify(restoredHistory);
      if (cache.current[cacheKey]) {
        const cached = cache.current[cacheKey];
        setStory(cached.story);
        setChoices(cached.choices);
        setImageUrl(cached.image);
        setIsLoading(false);
        return;
      }

      const initResp = await getNextStory(restoredHistory);
      setStory(initResp.story);
      setChoices(initResp.choices);
      setImageUrl(initResp.image);
      cache.current[cacheKey] = initResp;
      setIsLoading(false);
    }
    init();
  }, []);

  const selectEnding = (): StoryResponse => {
    const endingMap: {
      [key: string]: { story: string; choices: string[]; image: string; isEnding: boolean };
    } = {
      "평화롭게 끝내기": {
        story: "당신은 평화롭게 방을 떠났습니다. (엔딩 1)",
        choices: [],
        image: "https://dummyimage.com/512x512/00ff00/fff&text=Peaceful+Ending",
        isEnding: true,
      },
      "모험을 계속한다": {
        story: "모험이 계속됩니다... (엔딩 2)",
        choices: [],
        image: "https://dummyimage.com/512x512/ff0000/fff&text=Adventure+Ending",
        isEnding: true,
      },
      "비밀을 발견한다": {
        story: "비밀이 밝혀졌습니다. (엔딩 3)",
        choices: [],
        image: "https://dummyimage.com/512x512/0000ff/fff&text=Secret+Ending",
        isEnding: true,
      },
      "모든 것이 환상이었다": {
        story: "모든 것이 환상이었습니다. (엔딩 4)",
        choices: [],
        image: "https://dummyimage.com/512x512/ffff00/000&text=Fantasy+Ending",
        isEnding: true,
      },
    };

    const lastChoice = history[history.length - 1]?.choice || "";
    return endingMap[lastChoice] || endingMap["모든 것이 환상이었다"];
  };

  const handleChoice = async (choice: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const newHistory = [...history, { story, choice, image: imageUrl }];
    setHistory(newHistory);

    if (step + 1 >= MAX_STEPS) {
      // 엔딩 처리
      const ending = selectEnding();
      setStory(ending.story);
      setChoices([]);
      setImageUrl(ending.image);
      setStep(MAX_STEPS);
      setIsLoading(false);

      // 히스토리 저장
      localStorage.setItem("story_history", JSON.stringify(newHistory));

      setTimeout(() => {
        alert("게임 종료! 히스토리 페이지로 이동합니다.");
        navigate("/history");
      }, 500);

      return;
    }

    const cacheKey = JSON.stringify(newHistory);
    if (cache.current[cacheKey]) {
      const cached = cache.current[cacheKey];
      setStory(cached.story);
      setChoices(cached.choices);
      setImageUrl(cached.image);
      setStep(step + 1);
      setIsLoading(false);
      return;
    }

    const next: StoryResponse = await getNextStory(newHistory);
    setStory(next.story);
    setChoices(next.choices);
    setImageUrl(next.image);
    setStep(step + 1);
    cache.current[cacheKey] = next;
    setIsLoading(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto dark:bg-gray-900 min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI 스토리 게임</h1>
        {/* 여기에 앨범 아이콘, 새로하기, 이어하기 버튼 추가 가능 */}
      </header>

      <div className="mb-4 text-gray-700 dark:text-gray-300">
        단계: {step} / {MAX_STEPS}
      </div>

      <StoryView text={story} />

      <ImageViewer imageUrl={imageUrl} />

      <section className="mt-6 grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {choices.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">선택지가 없습니다.</p>}
        {choices.map((choice, idx) => (
          <ChoiceButton
            key={idx}
            text={choice}
            onClick={() => handleChoice(choice)}
            disabled={isLoading}
          />
        ))}
      </section>

      {isLoading && (
        <p className="mt-4 text-center text-gray-500 dark:text-gray-400 animate-pulse">
          로딩 중...
        </p>
      )}
    </main>
  );
}
