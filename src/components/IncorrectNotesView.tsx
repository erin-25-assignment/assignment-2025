import React, { useState, useMemo } from 'react';
import { IncorrectAnswer, Language, StudyMaterial } from '../types';
import { CheckCircleIcon, CancelIcon, TaskAltIcon, ArrowDropDownIcon, SwapVertIcon, MenuBookIcon, DownloadIcon, DeleteIcon } from './icons';

interface IncorrectNotesViewProps {
  notes: IncorrectAnswer[];
  onRestart: () => void;
  onDeleteNote: (id: string) => void;
  language: Language;
  studyMaterial: StudyMaterial | null;
}

type SortOrder = 'newest' | 'oldest';

const IncorrectNotesView: React.FC<IncorrectNotesViewProps> = ({ notes, onRestart, onDeleteNote, language, studyMaterial }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  const text = {
    emptyTitle: { ko: "오답 노트가 비어있습니다.", en: "Incorrect notes are empty." },
    emptyDescription: { ko: "퀴즈를 풀고 틀린 문제를 확인해보세요!", en: "Take a quiz and check your incorrect answers!" },
    subjectAll: { ko: "과목 전체", en: "All Subjects" },
    sortNewest: { ko: "최신순", en: "Newest" },
    sortOldest: { ko: "오래된순", en: "Oldest" },
    download: { ko: "다운로드", en: "Download" },
    deleteNoteAria: { ko: "오답노트 삭제", en: "Delete note" },
    myAnswer: { ko: "나의 답:", en: "My Answer:" },
    correctAnswer: { ko: "정답:", en: "Correct Answer:" },
    startNewStudy: { ko: "새 학습 시작하기", en: "Start New Study" },
  }

  const subjects = useMemo(() => ['all', ...Array.from(new Set(notes.map(note => note.subject)))], [notes]);

  const filteredAndSortedNotes = useMemo(() => {
    return notes
      .filter(note => selectedSubject === 'all' || note.subject === selectedSubject)
      .sort((a, b) => {
        if (sortOrder === 'newest') {
          return b.timestamp - a.timestamp;
        }
        return a.timestamp - b.timestamp;
      });
  }, [notes, sortOrder, selectedSubject]);

  const handleDownload = () => {
    const labels = language === 'ko' 
      ? { subject: '과목', question: '문제', myAnswer: '나의 답', correctAnswer: '정답', explanation: '해설' }
      : { subject: 'Subject', question: 'Question', myAnswer: 'My Answer', correctAnswer: 'Correct Answer', explanation: 'Explanation' };
      
    const content = filteredAndSortedNotes.map(note => 
      `${labels.subject}: ${note.subject}\n` +
      `${labels.question}: ${note.question}\n` +
      `${labels.myAnswer}: ${note.userAnswer}\n` +
      `${labels.correctAnswer}: ${note.answer}\n` +
      `${labels.explanation}: ${note.explanation}\n\n` +
      `------------------------------------\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymate_incorrect_notes_${selectedSubject === 'all' ? 'all' : selectedSubject}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (notes.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center mt-16">
            <div className="flex items-center justify-center size-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-6">
                <TaskAltIcon className="text-5xl text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">{text.emptyTitle[language]}</h3>
            <p className="text-gray-500 dark:text-gray-400">{text.emptyDescription[language]}</p>
        </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-3 px-4 pb-4 items-center">
            <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="appearance-none flex h-10 shrink-0 items-center justify-center gap-x-1 rounded-lg bg-white dark:bg-gray-700 pl-4 pr-8 shadow-sm text-text-light dark:text-text-dark text-sm font-medium focus:ring-2 focus:ring-primary"
                >
                    <option value="all">{text.subjectAll[language]}</option>
                    {subjects.filter(s => s !== 'all').map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
                 <ArrowDropDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-light dark:text-text-dark" />
            </div>
            <div className="relative">
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="appearance-none flex h-10 shrink-0 items-center justify-center gap-x-1 rounded-lg bg-white dark:bg-gray-700 pl-4 pr-8 shadow-sm text-text-light dark:text-text-dark text-sm font-medium focus:ring-2 focus:ring-primary"
                >
                    <option value="newest">{text.sortNewest[language]}</option>
                    <option value="oldest">{text.sortOldest[language]}</option>
                </select>
                <SwapVertIcon className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-light dark:text-text-dark" />
            </div>
            <button onClick={handleDownload} className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-700 px-4 shadow-sm text-text-light dark:text-text-dark text-sm font-medium ml-auto">
                <DownloadIcon />
                <span>{text.download[language]}</span>
            </button>
        </div>
        <div className="flex flex-col gap-4 px-4">
        {filteredAndSortedNotes.map((note) => (
            <div key={note.id} className="relative flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm group">
                <button onClick={() => onDeleteNote(note.id)} aria-label={text.deleteNoteAria[language]} className="absolute top-2 right-2 p-1.5 rounded-full bg-transparent hover:bg-red-500/10 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteIcon className="text-lg" />
                </button>
                <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0 size-12">
                        <MenuBookIcon />
                    </div>
                    <div className="flex flex-col justify-center flex-1 pr-6">
                        <p className="text-xs font-semibold text-primary">{note.subject}</p>
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal mt-1">{note.question}</p>
                         <p className="text-gray-400 dark:text-gray-500 text-xs font-normal leading-normal mt-1">{new Date(note.timestamp).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US')}</p>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-error">
                        <CancelIcon className="text-base mt-0.5 shrink-0"/>
                        <p><span className="font-semibold">{text.myAnswer[language]}</span> {note.userAnswer}</p>
                    </div>
                    <div className="flex items-start gap-2 text-success">
                        <CheckCircleIcon className="text-base mt-0.5 shrink-0"/>
                        <p><span className="font-semibold">{text.correctAnswer[language]}</span> {note.answer}</p>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 pt-2 text-xs italic">{note.explanation}</p>
                </div>
            </div>
        ))}
        </div>
         <div className="px-4 pt-8">
            <button onClick={onRestart} className="w-full flex items-center justify-center rounded-lg h-12 px-4 bg-primary text-white text-base font-medium leading-normal hover:bg-primary/90">
                <span className="truncate">{text.startNewStudy[language]}</span>
            </button>
        </div>
    </div>
  );
};

export default IncorrectNotesView;