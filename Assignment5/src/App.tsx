// import { useEffect, useState } from "react";
// import axios from "axios";

// interface Choice {
//   text: string;
// }

// interface StoryResponse {
//   story: string;
//   choices: Choice[];
//   image: string;
//   isEnding: boolean;
// }

// function App() {
//   const [story, setStory] = useState<string>("");
//   const [choices, setChoices] = useState<Choice[]>([]);
//   const [image, setImage] = useState<string>("");
//   const [isEnding, setIsEnding] = useState<boolean>(false);
//   const [choiceHistory, setChoiceHistory] = useState<string[]>([]);

//   // 처음 시작 시 API 호출
//   useEffect(() => {
//     fetchStory([]);
//   }, []);

//   const fetchStory = async (history: string[]) => {
//     try {
//       const response = await axios.post<StoryResponse>("/api/gpt", {
//         choices: history,
//       });

//       setStory(response.data.story);
//       setChoices(response.data.choices);
//       setImage(response.data.image);
//       setIsEnding(response.data.isEnding);
//     } catch (error) {
//       console.error("API 호출 실패:", error);
//     }
//   };

//   const handleChoice = (choice: string) => {
//     const updatedHistory = [...choiceHistory, choice];
//     setChoiceHistory(updatedHistory);

//     if (updatedHistory.length >= 10 || isEnding) {
//       return;
//     }

//     fetchStory(updatedHistory);
//   };

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       {image && (
//         <img
//           src={image}
//           alt="스토리 이미지"
//           style={{
//             width: "100%",
//             maxHeight: "300px",
//             objectFit: "cover",
//             borderRadius: "8px",
//           }}
//         />
//       )}
//       <h1 style={{ marginTop: "1rem" }}>{story}</h1>

//       {!isEnding && choices.length > 0 && (
//         <div style={{ marginTop: "1rem" }}>
//           {choices.map((choice, index) => (
//             <button
//               key={index}
//               onClick={() => handleChoice(choice.text)}
//               style={{
//                 display: "block",
//                 margin: "1rem 0",
//                 padding: "0.5rem 1rem",
//                 fontSize: "1rem",
//                 cursor: "pointer",
//               }}
//             >
//               {choice.text}
//             </button>
//           ))}
//         </div>
//       )}

//       {isEnding && <p>💀 이야기가 끝났습니다. 새로고침으로 다시 시작하세요.</p>}
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    fetchStory([]);
  }, []);

  const fetchStory = async (history: string[]) => {
    try {
      const response = await axios.post<StoryResponse>("/api/gpt", {
        choices: history,
      });

      setStory(response.data.story);
      setChoices(response.data.choices);
      setImage(response.data.image);
      setIsEnding(response.data.isEnding);
    } catch (error) {
      console.error("API 호출 실패:", error);
    }
  };

  const handleChoice = (choice: string) => {
    const updatedHistory = [...choiceHistory, choice];
    setChoiceHistory(updatedHistory);

    if (updatedHistory.length >= 10 || isEnding) {
      return;
    }

    fetchStory(updatedHistory);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {image && (
        <img
          src={image}
          alt="스토리 이미지"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}
      <h1 style={{ marginTop: "1rem" }}>{story}</h1>

      {!isEnding && choices.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice.text)}
              style={{
                display: "block",
                margin: "1rem 0",
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {isEnding && <p>💀 이야기가 끝났습니다. 새로고침으로 다시 시작하세요.</p>}
    </div>
  );
}

export default App;

