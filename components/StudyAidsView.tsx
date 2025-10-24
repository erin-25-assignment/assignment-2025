import React, { useState } from 'react';
import { Keyword, Language, StudyMaterial } from '../types';
import { DownloadIcon, ExpandMoreIcon, ThumbUpIcon, ThumbDownIcon, AutoAwesomeIcon } from './icons';

interface StudyAidsViewProps {
  summary: string;
  keywords: Keyword[];
  onGoToQuizSettings: () => void;
  language: Language;
  studyMaterial: StudyMaterial | null;
}

const StudyAidsView: React.FC<StudyAidsViewProps> = ({ summary, keywords, onGoToQuizSettings, language, studyMaterial }) => {
  const [feedback, setFeedback] = useState<'useful' | 'irrelevant' | null>(null);

  const text = {
    summaryTitle: { ko: "AI가 분석한 핵심 요약", en: "AI Analyzed Core Summary" },
    downloadSummary: { ko: "요약본 다운로드", en: "Download Summary" },
    keywordsTitle: { ko: "놓치지 말아야 할 주요 키워드", en: "Must-Know Key Keywords" },
    noKeywords: { ko: "추출된 핵심 용어가 없습니다.", en: "No keywords extracted." },
    feedbackPrompt: { ko: "이 요약이 유용했나요?", en: "Was this summary helpful?" },
    useful: { ko: "유용해요", en: "Useful" },
    irrelevant: { ko: "관련 없어요", en: "Irrelevant" },
    createQuiz: { ko: "AI로 문제 만들기", en: "Create Quiz with AI" },
    originalMaterial: { ko: "학습 원본 자료", en: "Original Study Material" },
    originalMaterialAlt: { ko: "업로드된 학습 자료", en: "Uploaded study material" },
  }

  const handleDownload = () => {
    const content = language === 'ko'
        ? `[AI 요약]\n${summary}\n\n[주요 키워드]\n${keywords.map(kw => `${kw.term}: ${kw.definition}`).join('\n')}`
        : `[AI Summary]\n${summary}\n\n[Key Keywords]\n${keywords.map(kw => `${kw.term}: ${kw.definition}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studymate_summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {studyMaterial?.type === 'image' && (
        <section>
            <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em] mb-3">{text.originalMaterial[language]}</h2>
            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm overflow-hidden">
              <img src={studyMaterial.content} alt={text.originalMaterialAlt[language]} className="max-w-full h-auto rounded-md mx-auto" />
            </div>
        </section>
      )}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">{text.summaryTitle[language]}</h2>
          <button onClick={handleDownload} className="flex items-center gap-2 text-primary dark:text-primary text-sm font-medium py-1 px-3 rounded-full hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors" aria-label={text.downloadSummary[language]}>
            <DownloadIcon className="text-base" />
            <span>{text.downloadSummary[language]}</span>
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm">
          <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em] mb-3">{text.keywordsTitle[language]}</h2>
        <div className="flex flex-col gap-2">
            {keywords.length > 0 ? keywords.map((kw, index) => (
                <details key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm group">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 list-none">
                        <p className="text-primary font-bold">{kw.term}</p>
                        <ExpandMoreIcon className="text-text-light dark:text-text-dark group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-4 pb-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-3">
                            {kw.definition}
                        </p>
                    </div>
                </details>
            )) : (
                 <p className="text-slate-500 text-sm p-4 bg-white dark:bg-slate-800 rounded-lg">{text.noKeywords[language]}</p>
            )}
        </div>
      </section>

      <div className="py-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{text.feedbackPrompt[language]}</p>
        <div className="flex gap-4">
            <button
                onClick={() => setFeedback('useful')}
                disabled={!!feedback}
                className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border rounded-full text-text-light dark:text-text-dark transition-colors disabled:cursor-not-allowed
                ${feedback === 'useful'
                    ? 'border-green-500 bg-green-500/10'
                    : feedback
                        ? 'border-gray-300 dark:border-slate-600 opacity-50'
                        : 'border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
            >
                <ThumbUpIcon className="text-lg text-green-500" />
                {text.useful[language]}
            </button>
            <button
                onClick={() => setFeedback('irrelevant')}
                disabled={!!feedback}
                className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border rounded-full text-text-light dark:text-text-dark transition-colors disabled:cursor-not-allowed
                ${feedback === 'irrelevant'
                    ? 'border-red-500 bg-red-500/10'
                    : feedback
                        ? 'border-gray-300 dark:border-slate-600 opacity-50'
                        : 'border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
            >
                <ThumbDownIcon className="text-lg text-red-500" />
                {text.irrelevant[language]}
            </button>
        </div>
      </div>

       <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 z-10">
         <div className="container mx-auto">
            <button
                onClick={onGoToQuizSettings}
                className="w-full flex items-center justify-center rounded-xl h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] transition-transform transform hover:scale-102 hover:shadow-lg"
            >
                <span>{text.createQuiz[language]}</span>
                <AutoAwesomeIcon />
            </button>
        </div>
      </div>
    </div>
  );
};

export default StudyAidsView;