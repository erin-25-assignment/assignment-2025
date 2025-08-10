import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChoiceButton from "./components/ChoiceButton";
import ImageViewer from "./components/ImageViewer";
import StoryView from "./components/StoryView";
import "./App.css";

interface Choice {
  text: string;
}

interface StoryResponse {
  story: string;
  choices: Choice[];
  image: string;
  isEnding: boolean;
}

function App() {
  const [story, setStory] = useState<string>("");
  const [choices, setChoices] = useState<Choice[]>([]);
  const [image, setImage] = useState<string>("");
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const [choiceHistory, setChoiceHistory] = useState<string[]>([]);

  const cache = useRef<Record<string, StoryResponse>>({});

  useEffect(() => {
    fetchStory([]);
  }, []);

  const fetchStory = async (history: string[]) => {
    const key = JSON.stringify(history);

    if (cache.current[key]) {
      const cached = cache.current[key];
      setStory(cached.story);
      setChoices(cached.choices);
      setImage(cached.image);
      setIsEnding(cached.isEnding);
      return;
    }

    try {
      const response = await axios.post<StoryResponse>("/api/story", {
        choices: history,
      });

      cache.current[key] = response.data;

      setStory(response.data.story);
      setChoices(response.data.choices);
      setImage(response.data.image);
      setIsEnding(response.data.isEnding);
    } catch (error) {
      console.error("API 호출 실패:", error);
    }
  };

  const handleChoice = (choice: string) => {
    if (isEnding) return;
    const updatedHistory = [...choiceHistory, choice];
    setChoiceHistory(updatedHistory);
    fetchStory(updatedHistory);
  };

  return (
    <div className="app-container">
      {image && <ImageViewer imageUrl={image} />}
      <StoryView text={story} />
      {!isEnding && choices.length > 0 && (
        <div className="choices-container">
          {choices.map((choice, index) => (
            <ChoiceButton
              key={index}
              text={choice.text}
              onClick={() => handleChoice(choice.text)}
            />
          ))}
        </div>
      )}
      {isEnding && (
        <p className="ending-text">💀 이야기가 끝났습니다. 새로고침으로 다시 시작하세요.</p>
      )}
    </div>
  );
}

export default App;
