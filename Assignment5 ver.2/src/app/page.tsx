"use client";

import React, { useState, useEffect, useReducer, useCallback } from "react";
import Image from "next/image";
import { storyNodes, itemsData, GameState, GameAction, Choice, isEndingNode, totalEndings } from "@/lib/story";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import InventoryPanel from "@/components/inventory-panel";
import { getVariedText, getStoryImage } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RefreshCw, BookImage } from "lucide-react";
import { GameCharacter } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      return {
        ...initialState,
        character: action.payload,
        currentNodeKey: action.payload === GameCharacter.Rio ? 'rio_intro' : 'sera_intro',
        history: [action.payload === GameCharacter.Rio ? 'rio_intro' : 'sera_intro'],
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
        seenEndings: state.seenEndings, // Keep seen endings on reset
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}


export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [variedText, setVariedText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const currentNode = storyNodes[state.currentNodeKey];

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
    if (currentNode && state.character) {
      setIsLoading(true);
      setVariedText("");
      getVariedText({
        baseText: currentNode.text,
        playerChoices: state.playerChoices,
        characterType: state.character,
      })
        .then(setVariedText)
        .finally(() => setIsLoading(false));
    } else if (currentNode) {
      setVariedText(currentNode.text);
    }

    if(currentNode?.image && currentNode?.hint && state.character) {
      setIsImageLoading(true);
      setImageUrl(null);
      getStoryImage({
        prompt: currentNode.hint,
        character: state.character,
        story_context: currentNode.text,
      }).then(url => {
        setImageUrl(url);
        setIsImageLoading(false);
      });
    } else {
       setImageUrl(currentNode?.image || null);
    }

  }, [state.currentNodeKey, state.character, state.playerChoices, currentNode]);
  
  const handleChoice = (choice: Choice) => {
    dispatch({ type: 'MAKE_CHOICE', payload: choice });
  };

  const resetGame = () => {
    try {
      localStorage.removeItem("lostInTheBlizzardState");
      dispatch({ type: 'RESET_GAME' });
    } catch (error) {
       console.error("Failed to clear state from localStorage", error);
    }
    // We need to reload to correctly reset the character selection screen
    window.location.reload();
  };
  
  if (!isMounted) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-64 w-full max-w-4xl" />
      </div>
     );
  }
  
  const handleCharacterSelect = (character: GameCharacter) => {
    dispatch({ type: 'SELECT_CHARACTER', payload: character });
  };

  if (!state.character) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="absolute top-4 right-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <BookImage className="h-5 w-5" />
                  <span className="sr-only">엔딩 앨범</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>엔딩 앨범 ({state.seenEndings.length}/{totalEndings})</DialogTitle>
                  <DialogDescription>
                    지금까지 수집한 엔딩 목록입니다.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                  <div className="space-y-4 pr-4">
                  {state.seenEndings.length > 0 ? (
                    state.seenEndings.map((endingKey) => {
                      const endingNode = storyNodes[endingKey];
                      return (
                        <Card key={endingKey}>
                          <CardHeader>
                            <CardTitle className="text-lg">{endingNode.title || `엔딩: ${endingKey}`}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{endingNode.text.split('\n\n')[1] || endingNode.text}</p>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-10">아직 본 엔딩이 없습니다.</p>
                  )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

        <Card className="w-full max-w-4xl text-center">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl">눈 너머의 이야기</CardTitle>
            <CardDescription>{storyNodes.start.text}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => handleCharacterSelect(GameCharacter.Rio)}>리오 (구조대원)</Button>
              <Button size="lg" variant="secondary" onClick={() => handleCharacterSelect(GameCharacter.Sera)}>세라 (조난자)</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!currentNode) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-headline text-destructive">오류: 이야기 노드를 찾을 수 없습니다!</h2>
          <p className="mb-4">이야기 흐름에 문제가 발생했습니다.</p>
          <Button onClick={resetGame}><RefreshCw className="mr-2 h-4 w-4" /> 처음부터 다시 시작</Button>
        </div>
      </div>
    );
  }

  const renderEnding = () => (
     <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <Card className="max-w-2xl">
           <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl">{currentNode.title || '엔딩'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {isImageLoading ? <Skeleton className="w-[600px] h-[400px] rounded-lg" /> : (imageUrl && <Image src={imageUrl} alt={currentNode.title || 'Ending scene'} width={600} height={400} className="mx-auto rounded-lg shadow-lg" data-ai-hint={currentNode.hint}/>)}
             <div className="text-lg leading-relaxed whitespace-pre-wrap text-left">
              {currentNode.text.split('\n\n').map((paragraph, index) => (
                <p key={index} className={index === 0 ? 'font-bold' : ''}>{paragraph}</p>
              ))}
             </div>
            <Button size="lg" onClick={resetGame}><RefreshCw className="mr-2 h-4 w-4" />다시 플레이하기</Button>
          </CardContent>
        </Card>
      </main>
  );

  if (currentNode.isEnd) {
    return renderEnding();
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-4">
        <h1 className="font-headline text-2xl md:text-3xl">눈 너머의 이야기</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" onClick={() => dispatch({ type: 'GO_BACK' })} disabled={state.history.length <= 1}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">뒤로 가기</span>
           </Button>
           <Button variant="destructive" size="icon" onClick={resetGame}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">다시 시작</span>
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
               {isImageLoading ? <Skeleton className="w-full aspect-video rounded-lg" /> : (imageUrl && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt="Story scene"
                    width={800}
                    height={450}
                    className="object-cover w-full h-auto aspect-video"
                    data-ai-hint={currentNode.hint}
                  />
                </div>
              ))}
            </CardHeader>
            <CardContent>
              {isLoading ? 
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              : <p className="text-lg leading-relaxed whitespace-pre-wrap">{variedText}</p>
              }
            </CardContent>
          </Card>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentNode.choices.map((choice, index) => (
                <Button
                  key={index}
                  variant='default'
                  size="lg"
                  className="h-auto py-3 text-base whitespace-normal text-left justify-start"
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

    