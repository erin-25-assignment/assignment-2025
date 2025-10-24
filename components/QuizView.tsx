import React, { useState, useMemo } from 'react';
import { QuizQuestion, QuizType, IncorrectAnswer, Language, StudyMaterial } from '../types';
import { ArrowForwardIcon, CheckCircleIcon, CancelIcon } from './icons';

interface QuizViewProps {
  questions: QuizQuestion[];
  onSubmit: (score: number, incorrects: Omit<IncorrectAnswer, 'id' | 'timestamp' | 'subject'>[]) => void;
  language: Language;
  studyMaterial: StudyMaterial | null;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, language, onSubmit, studyMaterial }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Omit<IncorrectAnswer, 'id' | 'timestamp' | 'subject'>[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const text = {
    progress: { ko: "진행도", en: "Progress" },
    submit: { ko: "제출하기", en: "Submit" },
    next: { ko: "다음 문제로", en: "Next" },
    viewResults: { ko: "결과 보기", en: "View Results" },
    correct: { ko: "정답입니다!", en: "Correct!" },
    incorrect: { ko: "오답입니다.", en: "Incorrect." },
    correctAnswer: { ko: "정답:", en: "Correct Answer:" },
    yourAnswerPlaceholder: { ko: "여기에 답을 입력하세요", en: "Type your answer here" },
  }

  const isCorrect = useMemo(() => {
    if (!isSubmitted || !selectedAnswer) return null;
    return selectedAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
  }, [isSubmitted, selectedAnswer, currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setIsSubmitted(true);
    const correct = selectedAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    if (correct) {
      setScore(s => s + 1);
    } else {
      setIncorrectAnswers(prev => [...prev, { ...currentQuestion, userAnswer: selectedAnswer }]);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(score, incorrectAnswers);
    } else {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    }
  };
  
  const getMCQOptionClass = (option: string) => {
    if (!isSubmitted) {
        return 'border-gray-200 dark:border-gray-700 hover:bg-primary/10 has-[:checked]:bg-primary/20 has-[:checked]:border-primary';
    }
    if (option === currentQuestion.answer) {
        return 'border-success bg-success/10';
    }
    if (option === selectedAnswer && option !== currentQuestion.answer) {
        return 'border-error bg-error/10';
    }
    return 'border-gray-200 dark:border-gray-700';
  };

  const renderQuestionBody = () => {
    switch (currentQuestion.type) {
      case QuizType.MCQ:
        return (
            <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                <label key={index} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${getMCQOptionClass(option)}`}>
                    <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    disabled={isSubmitted}
                    className="form-radio h-5 w-5 text-primary focus:ring-primary disabled:opacity-50"
                    />
                    <span className="ml-4 text-text-light dark:text-text-dark">{option}</span>
                    {isSubmitted && option === currentQuestion.answer && <CheckCircleIcon className="ml-auto text-success" />}
                    {isSubmitted && option === selectedAnswer && option !== currentQuestion.answer && <CancelIcon className="ml-auto text-error" />}
                </label>
                ))}
            </div>
        );
      case QuizType.TF:
         const tfOptions = language === 'ko' ? ['참', '거짓'] : ['True', 'False'];
         return (
          <div className="flex gap-4 justify-center pt-4">
            {tfOptions.map((option) => (
                <button 
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isSubmitted}
                    className={`flex-1 flex items-center justify-center gap-2 h-20 rounded-xl font-bold text-4xl transition-colors disabled:opacity-70 border-2 
                    ${isSubmitted ? 
                        (option === currentQuestion.answer ? 'bg-success/10 border-success text-success' : 'bg-gray-100 dark:bg-gray-800 border-transparent text-text-light/50 dark:text-text-dark/50') :
                        (selectedAnswer === option ? 'bg-primary/20 border-primary text-primary' : 'bg-white dark:bg-slate-800 border-primary text-primary hover:bg-primary/10')
                    }`}
                >
                    {(option === '참' || option === 'True') ? 'O' : 'X'}
                </button>
            ))}
          </div>
        );
      case QuizType.SHORT_ANSWER:
        return (
          <textarea
            value={selectedAnswer || ''}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            disabled={isSubmitted}
            className={`w-full min-h-[120px] p-4 rounded-lg bg-white dark:bg-slate-800 border-2 text-text-light dark:text-text-dark disabled:opacity-70 resize-none
                ${isSubmitted ? 
                    (isCorrect ? 'border-success focus:ring-success' : 'border-error focus:ring-error') :
                    'border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-primary'
                }`}
            placeholder={text.yourAnswerPlaceholder[language]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Progress Bar */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-text-light/80 dark:text-text-dark/80">{text.progress[language]}</span>
                <span className="text-sm font-bold text-primary">{currentQuestionIndex + 1} / {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
        
        {/* Question Area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
            <div className="flex items-center gap-3">
                <span className="text-accent font-bold text-lg">Q{currentQuestionIndex + 1}.</span>
                <span className="bg-accent/20 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">{currentQuestion.type}</span>
            </div>
            <p className="text-text-light dark:text-text-dark text-lg leading-relaxed">
                {currentQuestion.question}
            </p>
            <div className="pt-2">
                {renderQuestionBody()}
            </div>
        </div>

        {/* Feedback Area */}
        {isSubmitted && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-error/10'}`}>
                <h4 className={`font-bold ${isCorrect ? 'text-success' : 'text-error'}`}>
                    {isCorrect ? text.correct[language] : text.incorrect[language]}
                </h4>
                {!isCorrect && <p className="text-sm text-text-light dark:text-text-dark mt-1"><b>{text.correctAnswer[language]}</b> {currentQuestion.answer}</p>}
                <p className={`text-sm mt-2 pt-2 border-t ${isCorrect ? 'border-success/20 text-success/80' : 'border-error/20 text-error/80'}`}>{currentQuestion.explanation}</p>
            </div>
        )}
        
        {/* Action Button */}
        <div className="pt-4 pb-8">
            <button
                onClick={isSubmitted ? handleNext : handleSubmit}
                disabled={!isSubmitted && selectedAnswer === null}
                className={`flex w-full items-center justify-center overflow-hidden rounded-xl h-14 text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] transition-all transform hover:scale-102 hover:shadow-lg disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed
                ${isSubmitted ? (isCorrect ? 'bg-success' : 'bg-error') : 'bg-accent'}
                `}
            >
                <span>{isSubmitted ? (isLastQuestion ? text.viewResults[language] : text.next[language]) : text.submit[language]}</span>
                {isSubmitted && !isLastQuestion && <ArrowForwardIcon />}
            </button>
        </div>
    </div>
  );
};

export default QuizView;