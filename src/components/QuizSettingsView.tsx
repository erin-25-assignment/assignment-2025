import React, { useState } from 'react';
import { QuizType, Language } from '../types';
import { AutoAwesomeIcon } from './icons';

interface QuizSettingsViewProps {
  onGenerateQuiz: (type: QuizType, count: number) => void;
  language: Language;
}

const getQuizTypeName = (type: QuizType, lang: Language) => {
    if (lang === 'en') {
        if (type === QuizType.MCQ) return 'Multiple Choice';
        if (type === QuizType.TF) return 'T/F';
        if (type === QuizType.SHORT_ANSWER) return 'Short Answer';
    }
    return type;
}

const QuizSettingsView: React.FC<QuizSettingsViewProps> = ({ onGenerateQuiz, language }) => {
  const [quizType, setQuizType] = useState<QuizType>(QuizType.MCQ);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleGenerateClick = () => {
    onGenerateQuiz(quizType, questionCount);
  };

  const quizTypes = [QuizType.MCQ, QuizType.SHORT_ANSWER, QuizType.TF];
  
  const text = {
    title: { ko: "문제 설정", en: "Quiz Settings" },
    selectType: { ko: "문제 유형을 선택하세요", en: "Select quiz type" },
    selectCount: { ko: "문제 개수를 선택하세요", en: "Select number of questions" },
    countUnit: { ko: "개", en: "questions" },
    generate: { ko: "AI로 문제 만들기", en: "Create Quiz with AI" }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-2">
      <div className="space-y-6" id="settings-section">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 text-text-light dark:text-text-dark">{text.title[language]}</h2>
        <div>
          <p className="text-base font-medium leading-normal pb-3 pt-1 px-4 text-text-light dark:text-text-dark">{text.selectType[language]}</p>
          <div className="flex gap-3 p-3 flex-wrap pr-4">
              {quizTypes.map(type => (
                   <button 
                      key={type}
                      onClick={() => setQuizType(type)}
                      className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-transform transform hover:scale-105 text-sm font-medium ${quizType === type ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-primary/20'}`}
                  >
                      {getQuizTypeName(type, language)}
                  </button>
              ))}
          </div>
        </div>
        
        <div className="px-4">
          <div className="relative flex w-full flex-col items-start justify-between gap-3 py-4">
            <div className="flex w-full shrink-[3] items-center justify-between">
              <p className="text-base font-medium leading-normal text-text-light dark:text-text-dark">{text.selectCount[language]}</p>
              <p className="text-sm font-bold leading-normal text-primary">{questionCount}{language === 'ko' ? text.countUnit.ko : ` ${text.countUnit.en}`}</p>
            </div>
             <input
                type="range"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
            />
          </div>
        </div>
        
        <div className="px-4 pt-4">
          <button 
              onClick={handleGenerateClick}
              className="flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] transition-transform transform hover:scale-102 hover:shadow-lg"
          >
            <span>{text.generate[language]}</span>
            <AutoAwesomeIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSettingsView;