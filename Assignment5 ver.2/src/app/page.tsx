
// // "use client";

// import React, { useState, useEffect, useReducer } from "react";
// import { storyNodes, GameState, GameAction, Choice, isEndingNode, totalEndings } from "@/lib/story";
// import { getVariedText, getStoryImage } from "./actions";
// import { ArrowLeft, RefreshCw, BookImage } from "lucide-react";
// import { GameCharacter } from "@/lib/types";

// // This loader is necessary for next/image to handle base64 data URIs
// const imageLoader = ({ src }: { src: string }) => {
//   return src;
// };

// const initialState: GameState = {
//   character: null,
//   currentNodeKey: "start",
//   inventory: {},
//   history: ["start"],
//   playerChoices: [],
//   seenEndings: [],
// };

// function gameReducer(state: GameState, action: GameAction): GameState {
//   switch (action.type) {
//     case 'SELECT_CHARACTER':
//       return {
//         ...initialState,
//         character: action.payload,
//         currentNodeKey: action.payload === GameCharacter.Rio ? 'rio_intro' : 'sera_intro',
//         history: [action.payload === GameCharacter.Rio ? 'rio_intro' : 'sera_intro'],
//         seenEndings: state.seenEndings,
//       };
//     case 'MAKE_CHOICE': {
//       const choice = action.payload;
//       const nextNode = storyNodes[choice.next];
//       if (!nextNode) return state;

//       const newSeenEndings = isEndingNode(choice.next) && !state.seenEndings.includes(choice.next)
//         ? [...state.seenEndings, choice.next]
//         : state.seenEndings;

//       return {
//         ...state,
//         currentNodeKey: choice.next,
//         history: [...state.history, choice.next],
//         playerChoices: choice.choiceText ? [...state.playerChoices, choice.choiceText] : state.playerChoices,
//         seenEndings: newSeenEndings,
//       };
//     }
//     case 'GO_BACK':
//       if (state.history.length <= 1) return state;
//       const newHistory = [...state.history];
//       newHistory.pop();
//       const prevNodeKey = newHistory[newHistory.length - 1]!;
//       return {
//         ...state,
//         currentNodeKey: prevNodeKey,
//         history: newHistory,
//       };
//     case 'RESET_GAME':
//       return {
//         ...initialState,
//         seenEndings: state.seenEndings, 
//       };
//     case 'LOAD_STATE':
//       return action.payload;
//     default:
//       return state;
//   }
// }

// // Re-implementing basic components since ShadCN/Tailwind is removed.
// const Button = ({ onClick, children, className = '', disabled = false }: { onClick?: () => void; children: React.ReactNode; className?: string; disabled?: boolean }) => (
//     <button onClick={onClick} className={`button ${className}`} disabled={disabled}>
//         {children}
//     </button>
// );

// export default function Home() {
//   const [state, dispatch] = useReducer(gameReducer, initialState);
//   const [variedText, setVariedText] = useState<string>("");
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   const currentNode = storyNodes[state.currentNodeKey];

//   useEffect(() => {
//     setIsMounted(true);
//     try {
//       const savedState = localStorage.getItem("lostInTheBlizzardState");
//       if (savedState) {
//         const parsedState: GameState = JSON.parse(savedState);
//          if (parsedState.currentNodeKey && storyNodes[parsedState.currentNodeKey]) {
//            dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsedState } });
//         }
//       }
//     } catch (error) {
//       console.error("Failed to load state from localStorage", error);
//     }
//   }, []);

//   useEffect(() => {
//     if(isMounted) {
//       try {
//         localStorage.setItem("lostInTheBlizzardState", JSON.stringify(state));
//       } catch (error) {
//         console.error("Failed to save state to localStorage", error);
//       }
//     }
//   }, [state, isMounted]);

//   useEffect(() => {
//     if (!currentNode) return;

//     if (state.character) {
//       setIsLoading(true);
//       setVariedText("");
//       getVariedText({
//         baseText: currentNode.text,
//         playerChoices: state.playerChoices,
//         characterType: state.character,
//       })
//         .then(setVariedText)
//         .finally(() => setIsLoading(false));
//     } else {
//       setVariedText(currentNode.text);
//     }

//     if(currentNode?.image && currentNode?.hint && state.character) {
//       setIsImageLoading(true);
//       setImageUrl(null);
//       getStoryImage({
//         prompt: currentNode.hint,
//         character: state.character,
//         story_context: currentNode.text,
//       }).then(url => {
//         setImageUrl(url);
//         setIsImageLoading(false);
//       });
//     } else {
//        setImageUrl(currentNode?.image || null);
//        setIsImageLoading(false);
//     }

//   }, [state.currentNodeKey, state.character, currentNode]);
  
//   const handleChoice = (choice: Choice) => {
//     dispatch({ type: 'MAKE_CHOICE', payload: choice });
//   };

//   const resetGame = () => {
//     try {
//       localStorage.removeItem("lostInTheBlizzardState");
//     } catch (error) {
//        console.error("Failed to clear state from localStorage", error);
//     }
//     dispatch({ type: 'RESET_GAME' });
//   };
  
//   if (!isMounted) {
//      return (
//       <div className="main-container">
//         <div className="card">
//             <p>로딩 중...</p>
//         </div>
//       </div>
//      );
//   }
  
//   const handleCharacterSelect = (character: GameCharacter) => {
//     dispatch({ type: 'SELECT_CHARACTER', payload: character });
//   };

//   if (!state.character) {
//     return (
//       <main className="main-container">
//         <div className="card">
//           <h1 className="card-title">눈 너머의 이야기</h1>
//           <p className="card-description">{storyNodes.start.text}</p>
//           <div className="card-content">
//               <Button className="button-primary" onClick={() => handleCharacterSelect(GameCharacter.Rio)}>리오 (구조대원)</Button>
//               <Button className="button-secondary" onClick={() => handleCharacterSelect(GameCharacter.Sera)}>세라 (조난자)</Button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (!currentNode) {
//     return (
//       <div className="main-container">
//         <div>
//           <h2 style={{color: 'hsl(var(--destructive-hsl))'}}>오류: 이야기 노드를 찾을 수 없습니다!</h2>
//           <p>이야기 흐름에 문제가 발생했습니다.</p>
//           <Button onClick={resetGame} className="button-primary"><RefreshCw style={{marginRight: '0.5rem'}}/> 처음부터 다시 시작</Button>
//         </div>
//       </div>
//     );
//   }

//   const renderEnding = () => (
//      <main className="main-container">
//         <div className="card">
//            <h1 className="card-title">{currentNode.title || '엔딩'}</h1>
//           <div className="card-content">
//              {isImageLoading ? <p>이미지 생성 중...</p> : (imageUrl && <img src={imageUrl} alt={currentNode.title || 'Ending scene'} style={{width: '100%', borderRadius: '0.5rem'}} data-ai-hint={currentNode.hint}/>)}
//              <div style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>
//               {currentNode.text.split('\n\n').map((paragraph, index) => (
//                 <p key={index} style={{fontWeight: index === 0 ? 'bold' : 'normal'}}>{paragraph}</p>
//               ))}
//              </div>
//             <Button className="button-primary" onClick={resetGame}><RefreshCw style={{marginRight: '0.5rem'}}/>다시 플레이하기</Button>
//           </div>
//         </div>
//       </main>
//   );

//   if (currentNode.isEnd) {
//     return renderEnding();
//   }

//   return (
//     <main className="main-container">
//       <header className="game-header">
//         <h1 className="game-title">눈 너머의 이야기</h1>
//         <div className="header-actions">
//            <Button className="button-icon button-secondary" onClick={() => dispatch({ type: 'GO_BACK' })} disabled={state.history.length <= 1}>
//             <ArrowLeft />
//             <span className="sr-only">뒤로 가기</span>
//            </Button>
//            <Button className="button-icon button-destructive" onClick={resetGame}>
//             <RefreshCw />
//             <span className="sr-only">다시 시작</span>
//            </Button>
//         </div>
//       </header>

//       <div className="game-card">
//         {isImageLoading ? <div className="game-image-placeholder"><p>이미지 생성 중...</p></div> : (imageUrl && (
//             <img
//               src={imageUrl}
//               alt="Story scene"
//               className="game-image"
//               data-ai-hint={currentNode.hint}
//             />
//         ))}
//         <div className="game-content">
//           {isLoading ? 
//             <p className="game-text">텍스트 생성 중...</p>
//           : <p className="game-text">{variedText}</p>
//           }
//            <div className="choices-grid">
//             {currentNode.choices.map((choice, index) => (
//                 <Button
//                   key={index}
//                   className="choice-button"
//                   onClick={() => handleChoice(choice)}
//                 >
//                   {choice.text}
//                 </Button>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import React, { useState, useEffect, useReducer } from "react";
import { storyNodes, GameState, GameAction, Choice, isEndingNode, totalEndings } from "@/lib/story";
import { getVariedText, getStoryImage } from "./actions";
import { ArrowLeft, RefreshCw, BookImage } from "lucide-react";
import { GameCharacter } from "@/lib/types";

const initialState: GameState = {
  character: null,
  currentNodeKey: "start",
  inventory: {},
  history: ["start"],
  playerChoices: [],
  seenEndings: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CHARACTER':
      const newKey = action.payload === GameCharacter.Rio ? 'rio_intro' : 'sera_intro';
      return {
        ...initialState,
        character: action.payload,
        currentNodeKey: newKey,
        history: [newKey],
        seenEndings: state.seenEndings,
      };
    case 'MAKE_CHOICE': {
      const choice = action.payload;
      const nextNode = storyNodes[choice.next];
      if (!nextNode) return state;

      const newSeenEndings = isEndingNode(choice.next) && !state.seenEndings.includes(choice.next)
        ? [...state.seenEndings, choice.next]
        : state.seenEndings;

      return {
        ...state,
        currentNodeKey: choice.next,
        history: [...state.history, choice.next],
        playerChoices: choice.choiceText ? [...state.playerChoices, choice.choiceText] : state.playerChoices,
        seenEndings: newSeenEndings,
      };
    }
    case 'GO_BACK':
      if (state.history.length <= 1) return state;
      const newHistory = [...state.history];
      newHistory.pop();
      const prevNodeKey = newHistory[newHistory.length - 1]!;
      return {
        ...state,
        currentNodeKey: prevNodeKey,
        history: newHistory,
      };
    case 'RESET_GAME':
      return {
        ...initialState,
        seenEndings: state.seenEndings, 
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

const Button = ({ onClick, children, className = '', disabled = false }: { onClick?: React.MouseEventHandler<HTMLButtonElement>; children: React.ReactNode; className?: string; disabled?: boolean }) => (
    <button onClick={onClick} className={`button ${className}`} disabled={disabled}>
        {children}
    </button>
);

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [variedText, setVariedText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAlbumVisible, setIsAlbumVisible] = useState(false);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);

  const currentNode = storyNodes[state.currentNodeKey];
  const allEndingKeys = Object.keys(storyNodes).filter(key => storyNodes[key].isEnd);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedState = localStorage.getItem("lostInTheBlizzardState");
      if (savedState) {
        const parsedState: GameState = JSON.parse(savedState);
         if (parsedState.currentNodeKey && storyNodes[parsedState.currentNodeKey]) {
           dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsedState } });
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if(isMounted) {
      try {
        localStorage.setItem("lostInTheBlizzardState", JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [state, isMounted]);

  useEffect(() => {
    if (!currentNode) return;
    
    setIsLoading(true);
    // Always set the placeholder image first
    const placeholder = storyNodes[state.currentNodeKey]?.image || "https://placehold.co/800x450.png";
    setImageUrl(placeholder);

    const textPromise = state.character && currentNode.text && !currentNode.isEnd
      ? getVariedText({
          baseText: currentNode.text,
          playerChoices: state.playerChoices,
          characterType: state.character,
        })
      : Promise.resolve(currentNode.text);

    const imagePromise = (currentNode.hint && state.character) || (currentNode.hint && currentNode.isEnd)
      ? getStoryImage({
          prompt: currentNode.hint!,
          character: state.character,
          story_context: currentNode.text,
        })
      : Promise.resolve(null);

    Promise.all([textPromise, imagePromise]).then(([text, newImageUrl]) => {
      setVariedText(text);
      if (newImageUrl) {
        setImageUrl(newImageUrl);
      }
      setIsLoading(false);
    });

  }, [state.currentNodeKey, state.character]);
  
  const handleChoice = (choice: Choice) => {
    dispatch({ type: 'MAKE_CHOICE', payload: choice });
  };

  const resetGame = () => {
    try {
      localStorage.removeItem("lostInTheBlizzardState");
    } catch (error) {
       console.error("Failed to clear state from localStorage", error);
    }
    dispatch({ type: 'RESET_GAME' });
    setIsAlbumVisible(false);
  };
  
  const handleCharacterSelect = (character: GameCharacter) => {
    dispatch({ type: 'SELECT_CHARACTER', payload: character });
  };

  const showAlbum = () => {
    setIsAlbumVisible(true);
    setSelectedEnding(null);
  };

  const hideAlbum = () => {
    setIsAlbumVisible(false);
  };
  
  if (!isMounted) {
     return (
      <div className="main-container">
        <div className="card">
            <p>로딩 중...</p>
        </div>
      </div>
     );
  }

  if (isAlbumVisible) {
    if (selectedEnding) {
      const endingNode = storyNodes[selectedEnding];
      return (
         <main className="main-container">
            <div className="card">
               <h1 className="card-title">{endingNode.title || '엔딩'}</h1>
              <div className="card-content">
                 {endingNode.image && <img src={endingNode.image} alt={endingNode.title || 'Ending scene'} style={{width: '100%', borderRadius: '0.5rem'}} data-ai-hint={endingNode.hint}/>}
                 <div className="game-text" style={{textAlign: 'left', maxHeight: '40vh', overflowY: 'auto'}}>
                  {endingNode.text.split('\n\n').map((paragraph, index) => (
                    <p key={index} style={{marginBottom: '1rem'}}>{paragraph}</p>
                  ))}
                 </div>
                <Button className="button-primary" onClick={() => setSelectedEnding(null)}>앨범으로 돌아가기</Button>
              </div>
            </div>
          </main>
      )
    }

    return (
      <main className="main-container album-container">
        <header className="album-header">
          <h1 className="album-title">엔딩 앨범 ({state.seenEndings.length}/{totalEndings})</h1>
          <Button onClick={state.character ? hideAlbum : resetGame}>
            {state.character ? "게임으로 돌아가기" : "캐릭터 선택으로"}
          </Button>
        </header>
        <div className="album-grid">
          {allEndingKeys.map(key => {
            const ending = storyNodes[key];
            const isUnlocked = state.seenEndings.includes(key);
            return (
              <div key={key} className={`album-card ${!isUnlocked ? 'album-card-locked' : ''}`} onClick={() => isUnlocked && setSelectedEnding(key)}>
                <img src={ending.image} alt={isUnlocked ? ending.title : '???'} data-ai-hint={ending.hint}/>
                <p>{isUnlocked ? ending.title : '???'}</p>
              </div>
            );
          })}
        </div>
      </main>
    );
  }
  
  if (!state.character) {
    return (
      <main className="main-container">
        <div className="card">
          <h1 className="card-title">눈 너머의 이야기</h1>
          <p className="card-description">{storyNodes.start.text}</p>
          <div className="card-content" style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center'}}>
              <Button className="button-primary" onClick={() => handleCharacterSelect(GameCharacter.Rio)}>리오 (구조대원)</Button>
              <Button className="button" onClick={() => handleCharacterSelect(GameCharacter.Sera)}>세라 (조난자)</Button>
          </div>
          {state.seenEndings.length > 0 && (
            <div style={{marginTop: '1.5rem'}}>
                <Button onClick={showAlbum}>엔딩 앨범 보기</Button>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (!currentNode) {
    return (
      <div className="main-container">
        <div className="card">
          <h2 style={{color: 'hsl(var(--destructive-hsl))'}}>오류: 이야기 노드를 찾을 수 없습니다!</h2>
          <p>이야기 흐름에 문제가 발생했습니다.</p>
          <Button onClick={resetGame} className="button-primary"><RefreshCw style={{marginRight: '0.5rem'}}/> 처음부터 다시 시작</Button>
        </div>
      </div>
    );
  }

  const renderEnding = () => (
     <main className="main-container">
        <div className="card">
           <h1 className="card-title">{currentNode.title || '엔딩'}</h1>
          <div className="card-content">
             {imageUrl && <img src={imageUrl} alt={currentNode.title || 'Ending scene'} style={{width: '100%', borderRadius: '0.5rem'}} data-ai-hint={currentNode.hint}/>}
             <div className="game-text" style={{textAlign: 'left'}}>
              {variedText.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{marginBottom: '1rem'}}>{paragraph}</p>
              ))}
             </div>
            <div style={{display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "center"}}>
                <Button className="button-primary" onClick={resetGame}><RefreshCw style={{marginRight: '0.5rem'}}/>다시 플레이하기</Button>
                <Button onClick={showAlbum}>엔딩 앨범 보기</Button>
            </div>
          </div>
        </div>
      </main>
  );

  if (currentNode.isEnd) {
    return renderEnding();
  }

  return (
    <main className="main-container">
      <header className="game-header">
        <h1 className="game-title">눈 너머의 이야기</h1>
        <div className="header-actions">
           <Button className="button-icon" onClick={() => dispatch({ type: 'GO_BACK' })} disabled={state.history.length <= 1}>
            <ArrowLeft />
            <span className="sr-only">뒤로 가기</span>
           </Button>
           <Button className="button-icon button-destructive" onClick={resetGame}>
            <RefreshCw />
            <span className="sr-only">다시 시작</span>
           </Button>
           {state.seenEndings.length > 0 && (
             <Button className="button-icon" onClick={showAlbum}>
              <BookImage />
              <span className="sr-only">엔딩 앨범</span>
            </Button>
           )}
        </div>
      </header>

      <div className="game-card">
        {imageUrl ? (
            <img
              src={imageUrl}
              alt="Story scene"
              className="game-image"
              data-ai-hint={currentNode.hint}
            />
        ) : <div className="game-image"></div>}
        <div className="game-content">
          {isLoading ? (
             <div className="game-text">
                <p>이야기 불러오는 중...</p>
             </div>
            ) : <p className="game-text">{variedText}</p>
          }
           <div className="choices-grid">
            {currentNode.choices.map((choice, index) => (
                <Button
                  key={index}
                  className="choice-button"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
