import { useState, useEffect } from "react";
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

  useEffect(() => {
    // 첫 화면에 초기 선택지 생성
    async function init() {
      setIsLoading(true);
      const initResp = await getNextStory(story, "");
      setStory(initResp.story);
      setChoices(initResp.choices);
      setImageUrl(initResp.image);
      setIsLoading(false);
    }
    init();
  }, []);

//  useEffect(() => {
//   console.log("useEffect가 실행됐어요!");
//   async function init() {
//     console.log("init 함수 시작");
//     setIsLoading(true);
//     setStory("테스트 이야기입니다.");
//     setChoices(["왼쪽으로 간다", "오른쪽으로 간다"]);
//     setImageUrl("https://dummyimage.com/600x400/000/fff&text=Test+Image");
//     setIsLoading(false);
//     console.log("init 함수 끝");
//   }
//   init();
// }, []);

  const selectEnding = (): StoryResponse => {
    // endingMap에 인덱스 시그니처 추가 (key: string)
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
      // 히스토리 저장 후 이동
      localStorage.setItem("story_history", JSON.stringify(newHistory));
      setTimeout(() => {
        alert("게임 종료! 히스토리 페이지로 이동합니다.");
        navigate("/history");
      }, 500);
      return;
    }

    // 다음 스토리 요청
    const next: StoryResponse = await getNextStory(story, choice);
    setStory(next.story);
    setChoices(next.choices);
    setImageUrl(next.image);
    setStep(step + 1);
    setIsLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-2">AI 스토리 게임</h1>
      <div className="mb-2">
        단계: {step} / {MAX_STEPS}
      </div>
      <StoryView text={story} />
      <ImageViewer imageUrl={imageUrl} />
      <div className="mt-4 grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
        {choices.length === 0 && <p>선택지가 없습니다.</p>}
        {choices.map((choice, idx) => (
          <ChoiceButton
            key={idx}
            text={choice}
            onClick={() => handleChoice(choice)}
            disabled={isLoading}
          />
        ))}
      </div>
      {isLoading && <p className="mt-2 text-gray-500">로딩 중...</p>}
    </div>
  );
}