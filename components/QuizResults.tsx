import React from 'react';
import { Language } from '../types';

interface QuizResultsProps {
  score: number;
  total: number;
  onRestart: () => void;
  onReviewNotes: () => void;
  language: Language;
}

const QuizResults: React.FC<QuizResultsProps> = ({ score, total, onRestart, onReviewNotes, language }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  const text = {
    title: { ko: "퀴즈 완료!", en: "Quiz Complete!" },
    subtitle: { ko: "결과는 다음과 같습니다:", en: "Here are your results:" },
    scoreFeedback: {
        ko: `총 ${total}문제 중 ${score}문제를 맞혔습니다`,
        en: `You answered ${score} out of ${total} questions correctly`
    },
    restart: { ko: "새로운 자료로 학습하기", en: "Start with New Material" },
    reviewNotes: { ko: "오답 노트 보기", en: "Review Incorrect Notes" },
  };

  const getFeedback = () => {
    if (language === 'en') {
        if (percentage === 100) return "Perfect! You're a master of learning!";
        if (percentage >= 80) return "Excellent! You're doing great.";
        if (percentage >= 60) return "Good! A little more review and you'll be perfect.";
        return "Keep learning! You'll get the hang of it soon.";
    }
    if (percentage === 100) return "완벽해요! 당신은 학습의 마스터!";
    if (percentage >= 80) return "훌륭해요! 정말 잘 하고 있어요.";
    if (percentage >= 60) return "좋아요! 조금만 더 복습하면 완벽할 거예요.";
    return "계속 학습해봐요! 곧 익숙해질 거예요.";
  };
  
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 text-center rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">{text.title[language]}</h2>
      <p className="text-slate-500 mb-6">{text.subtitle[language]}</p>
      
      <div className="relative inline-flex items-center justify-center w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-slate-200 dark:text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className="text-primary"
            strokeWidth="10"
            strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
          />
        </svg>
        <span className="absolute text-4xl font-bold text-primary">{percentage}%</span>
      </div>

      <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-6">
        {text.scoreFeedback[language]}
      </p>
      <p className="text-slate-600 dark:text-slate-400 mt-2 mb-8">{getFeedback()}</p>

      <div className="flex flex-col gap-3">
        {score < total && (
            <button
                onClick={onReviewNotes}
                className="w-full flex items-center justify-center rounded-xl h-14 bg-accent text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg hover:bg-accent/90 transition-colors"
            >
                {text.reviewNotes[language]}
            </button>
        )}
        <button
            onClick={onRestart}
            className="w-full flex items-center justify-center rounded-xl h-14 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg hover:bg-primary/90 transition-colors"
        >
            {text.restart[language]}
        </button>
      </div>
    </div>
  );
};

export default QuizResults;