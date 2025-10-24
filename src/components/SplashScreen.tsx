import React from 'react';
import { AutoAwesomeIcon } from './icons';
import { Language } from '../types';

interface SplashScreenProps {
  language: Language;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ language }) => {
  return (
    <div className="relative flex h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center justify-center w-full h-full p-4 fade-in">
        <div className="w-full grow flex flex-col justify-center items-center gap-6">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/20">
            <AutoAwesomeIcon className="text-primary text-7xl" />
          </div>
          <div className="text-center">
            <h1 className="text-slate-800 dark:text-white tracking-light text-[32px] font-bold leading-tight">스터디메이트 AI</h1>
            <p className="text-slate-600 dark:text-gray-300 text-base font-normal leading-normal pt-2">
              {language === 'ko' ? 'AI와 함께 똑똑하게 복습하세요' : 'Review smart with AI'}
            </p>
          </div>
        </div>
        <div className="w-full max-w-xs flex flex-col gap-3 p-4">
          <div className="rounded bg-gray-200 dark:bg-gray-700 h-2">
            <div className="h-2 rounded bg-primary progress-bar-animation"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;