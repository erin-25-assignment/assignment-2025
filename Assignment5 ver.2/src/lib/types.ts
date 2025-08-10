export interface Item {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type ItemsData = Record<string, Item>;

export type Inventory = Record<string, boolean>;

export interface Choice {
  text: string;
  next: string;
  requiredItems?: string[];
  updates?: {
    inventory?: Inventory;
  };
  choiceText?: string;
}

export interface StoryNode {
  text: string;
  title?: string;
  image?: string;
  hint?: string;
  choices: Choice[];
  getItem?: string;
  isEnd?: boolean;
}

export type StoryData = Record<string, StoryNode>;

export enum GameCharacter {
  Rio = 'rio',
  Sera = 'sera',
}

export interface GameState {
  character: GameCharacter | null;
  currentNodeKey: string;
  inventory: Inventory;
  history: string[];
  playerChoices: string[];
  seenEndings: string[];
}

export type GameAction =
  | { type: 'SELECT_CHARACTER'; payload: GameCharacter }
  | { type: 'MAKE_CHOICE'; payload: Choice }
  | { type: 'GO_BACK' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; payload: GameState };
