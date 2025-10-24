import React from 'react';
import { AppStep, Language, UserSettings } from '../types';
import { ArrowBackIcon, SchoolIcon, MenuBookIcon, ShareIcon, PersonIcon } from './icons';

interface HeaderProps {
  step: AppStep;
  currentUser: string | null;
  userSettings: UserSettings;
  language: Language;
  onBack?: () => void;
  onGoToNotes?: () => void;
  onShare?: () => void;
  onGoToMyPage?: () => void;
}

const getTitle = (step: AppStep, lang: Language): string => {
  const titles = {
    [AppStep.INPUT]: { ko: "스터디메이트 AI", en: "StudyMate AI" },
    [AppStep.VIEWING_AIDS]: { ko: "AI 요약 및 키워드", en: "AI Summary & Keywords" },
    [AppStep.GENERATING_QUIZ]: { ko: "AI 문제 설정", en: "AI Quiz Settings" },
    [AppStep.TAKING_QUIZ]: { ko: "AI 문제 풀이", en: "AI Quiz" },
    [AppStep.QUIZ_RESULTS]: { ko: "퀴즈 결과", en: "Quiz Results" },
    [AppStep.REVIEWING_NOTES]: { ko: "오답 노트", en: "Incorrect Notes" },
  };

  return titles[step]?.[lang] || "StudyMate AI";
};

const Header: React.FC<HeaderProps> = ({ step, currentUser, userSettings, language, onBack, onGoToNotes, onShare, onGoToMyPage }) => {
  const title = getTitle(step, language);
  
  const text = {
    back: { ko: "뒤로가기", en: "Back" },
    viewNotes: { ko: "오답 노트 보기", en: "View Incorrect Notes" },
    share: { ko: "공유하기", en: "Share" },
    myPage: { ko: "마이페이지", en: "My Page" },
  }

  return (
    <header className="flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-2 justify-between sticky top-0 z-10 shadow-sm @container">
      <div className="flex-1 flex justify-start">
        {onBack ? (
          <button onClick={onBack} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label={text.back[language]}>
            <ArrowBackIcon className="text-text-light dark:text-text-dark" />
          </button>
        ) : (
          <SchoolIcon className="h-8 w-8 text-primary" />
        )}
      </div>
      <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-text-light dark:text-text-dark">
        {title}
      </h1>
      <div className="flex-1 flex items-center justify-end gap-1">
        {onGoToNotes && (
            <button onClick={onGoToNotes} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label={text.viewNotes[language]}>
                <MenuBookIcon className="text-text-light dark:text-text-dark" />
            </button>
        )}
         {onShare && (
             <button onClick={onShare} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label={text.share[language]}>
                <ShareIcon className="text-text-light dark:text-text-dark" />
            </button>
        )}
        {currentUser && onGoToMyPage && (
            <button onClick={onGoToMyPage} className="flex items-center gap-2 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10" aria-label={text.myPage[language]}>
                <PersonIcon className="text-primary"/>
                <span className="text-primary text-sm font-bold hidden @[24rem]:inline">{userSettings.displayName || currentUser}</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;