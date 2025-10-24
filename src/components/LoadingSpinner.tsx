import React from 'react';
import { Language } from '../types';

interface LoadingSpinnerProps {
  message: string;
  language: Language;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, language }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-6"></div>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{message}</p>
        <p className="text-sm text-slate-500 mt-2">{language === 'ko' ? '잠시만 기다려 주세요.' : 'Please wait.'}</p>
    </div>
  );
};

export default LoadingSpinner;