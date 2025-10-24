export enum AppStep {
  SPLASH,
  USER_SELECTION,
  SIGN_UP,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_CONFIRMATION,
  INPUT,
  VIEWING_AIDS,
  GENERATING_QUIZ,
  TAKING_QUIZ,
  QUIZ_RESULTS,
  REVIEWING_NOTES,
  MY_PAGE,
  CHANGE_PASSWORD,
  ACCOUNT_DELETION,
}

export enum QuizType {
  MCQ = '객관식',
  TF = '참/거짓',
  SHORT_ANSWER = '단답형',
}

export type Language = 'ko' | 'en';
export type Theme = 'system' | 'light' | 'dark';

export interface UserSettings {
  theme: Theme;
  language: Language;
  avatar: string | null;
  displayName: string;
}

export interface StudyMaterial {
  type: 'text' | 'image' | 'audio';
  content: string;
  mimeType?: string;
}

export interface Keyword {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  question: string;
  type: QuizType;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface IncorrectAnswer extends QuizQuestion {
  id: string;
  timestamp: number;
  subject: string;
  userAnswer: string;
}