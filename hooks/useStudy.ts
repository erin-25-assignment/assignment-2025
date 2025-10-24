import { useState, useCallback } from 'react';
import { StudyMaterial, Keyword, QuizQuestion, QuizType, Language, IncorrectAnswer } from '../types';
import { generateStudyAids, generateQuiz } from '../services/geminiService';

interface UseStudyProps {
  language: Language;
}

export const useStudy = ({ language }: UseStudyProps) => {
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [subject, setSubject] = useState<string>(language === 'ko' ? '일반' : 'General');
  const [summary, setSummary] = useState<string>('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const analyzeMaterial = useCallback(async (material: StudyMaterial, newSubject: string) => {
    setIsLoading(true);
    setLoadingMessage(language === 'ko' ? 'AI가 자료를 분석하고 학습 보조 자료를 생성 중입니다...' : 'AI is analyzing the material and generating study aids...');
    setError(null);
    setStudyMaterial(material);
    setSubject(newSubject);

    try {
      const result = await generateStudyAids(material, language);
      setSummary(result.summary);
      setKeywords(result.keywords);
      return { success: true };
    } catch (e) {
      console.error(e);
      setError(language === 'ko' ? '학습 보조 자료 생성에 실패했습니다. 지원하지 않는 파일 형식이거나 내용이 유효하지 않을 수 있습니다.' : 'Failed to generate study aids. The file format may be unsupported or the content may be invalid.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const generateNewQuiz = useCallback(async (type: QuizType, count: number) => {
    const typeName = language === 'en' 
        ? (type === QuizType.MCQ ? "Multiple Choice" : type === QuizType.TF ? "T/F" : "Short Answer") 
        : type;
    setIsLoading(true);
    setLoadingMessage(language === 'ko' ? `${count}개의 ${typeName} 문제를 생성 중입니다...` : `Generating ${count} ${typeName} questions...`);
    setError(null);

    const quizContext = (studyMaterial && studyMaterial.type === 'text') ? studyMaterial.content : summary;

    if (!quizContext) {
      setError(language === 'ko' ? "퀴즈를 생성할 내용을 찾을 수 없습니다." : "Could not find content to generate a quiz from.");
      setIsLoading(false);
      return { success: false };
    }

    try {
      const generatedQuiz = await generateQuiz(quizContext, type, count, language, studyMaterial);
      setQuiz(generatedQuiz);
      return { success: true };
    } catch (e) {
      console.error(e);
      setError(language === 'ko' ? '퀴즈 생성에 실패했습니다. 다시 시도해 주세요.' : 'Failed to generate quiz. Please try again.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [studyMaterial, summary, language]);
  
  const submitQuiz = useCallback((score: number, incorrects: Omit<IncorrectAnswer, 'id' | 'timestamp' | 'subject'>[]) => {
      setQuizScore(score);
      return { score, incorrects };
  }, []);

  const resetStudy = useCallback(() => {
    setStudyMaterial(null);
    setSummary('');
    setKeywords([]);
    setQuiz([]);
    setQuizScore(0);
    setError(null);
    setSubject(language === 'ko' ? '일반' : 'General');
  }, [language]);

  return {
    studyState: { studyMaterial, subject, summary, keywords, quiz, quizScore },
    loadingState: { isLoading, loadingMessage },
    error,
    analyzeMaterial,
    generateNewQuiz,
    submitQuiz,
    resetStudy,
  };
};
