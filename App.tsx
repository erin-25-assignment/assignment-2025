import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, QuizQuestion, Keyword, QuizType, StudyMaterial, IncorrectAnswer, UserSettings, Theme } from './types';
import { generateStudyAids, generateQuiz } from './services/geminiService';
import Header from './components/Header';
import MaterialInput from './components/MaterialInput';
import StudyAidsView from './components/StudyAidsView';
import QuizSettingsView from './components/QuizSettingsView';
import QuizView from './components/QuizView';
import QuizResults from './components/QuizResults';
import LoadingSpinner from './components/LoadingSpinner';
import SplashScreen from './components/SplashScreen';
import IncorrectNotesView from './components/IncorrectNotesView';
import UserSelection from './components/UserSelection';
import SignUp from './components/SignUp';
import MyPage from './components/MyPage';
import AccountDeletionView from './components/AccountDeletionView';
import ForgotPasswordView from './components/ForgotPasswordView';
import ForgotPasswordConfirmationView from './components/ForgotPasswordConfirmationView';
import ChangePasswordView from './components/ChangePasswordView';

const getNotesStorageKey = (user: string | null) => user ? `studyMateIncorrectAnswers_${user}` : null;
const getSettingsStorageKey = (user: string | null) => user ? `studyMateSettings_${user}` : null;

const defaultSettings: UserSettings = {
  theme: 'system',
  language: 'ko',
  avatar: null,
  displayName: '',
  password: 'password123',
};


const App: React.FC = () => {
  const [appStep, setAppStep] = useState<AppStep>(AppStep.SPLASH);
  const [currentUser, setCurrentUser] = useState<string | null>(null); // This will be the user's email/ID
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [subject, setSubject] = useState<string>('일반');
  const [summary, setSummary] = useState<string>('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
  const [allUsers, setAllUsers] = useState<string[]>([]);

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const userKeys = allKeys
      .filter(key => key.startsWith('studyMateSettings_'))
      .map(key => key.replace('studyMateSettings_', ''));
    setAllUsers(userKeys);
  }, [currentUser]);

  // Load user data (notes and settings) from localStorage on user change
  useEffect(() => {
    if (!currentUser) {
      setIncorrectAnswers([]);
      setUserSettings(defaultSettings);
      return;
    }
    try {
      const notesKey = getNotesStorageKey(currentUser);
      if (notesKey) {
          const savedNotes = localStorage.getItem(notesKey);
          setIncorrectAnswers(savedNotes ? JSON.parse(savedNotes) : []);
      }
      const settingsKey = getSettingsStorageKey(currentUser);
      if(settingsKey) {
        const savedSettings = localStorage.getItem(settingsKey);
        setUserSettings(savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings);
      }
    } catch (e) {
      console.error("Failed to load user data from storage:", e);
      setIncorrectAnswers([]);
      setUserSettings(defaultSettings);
    }
  }, [currentUser]);


  // Save incorrect answers to localStorage whenever they change
  useEffect(() => {
    if (!currentUser) return;
    try {
        const key = getNotesStorageKey(currentUser);
        if (key) {
            localStorage.setItem(key, JSON.stringify(incorrectAnswers));
        }
    } catch (e) {
      console.error("Failed to save incorrect answers to storage:", e);
    }
  }, [incorrectAnswers, currentUser]);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!currentUser) return;
    const key = getSettingsStorageKey(currentUser);
    if (key) {
        try {
            localStorage.setItem(key, JSON.stringify(userSettings));
        } catch (e) {
            console.error("Failed to save settings to storage:", e);
        }
    }
  }, [userSettings, currentUser]);
  
  // Apply theme based on user settings
  useEffect(() => {
    const root = window.document.documentElement;
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (theme: Theme) => {
        root.classList.remove('light', 'dark');
        if (theme === 'dark' || (theme === 'system' && systemIsDark)) {
            root.classList.add('dark');
        } else {
            root.classList.add('light');
        }
    };
    
    applyTheme(userSettings.theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (userSettings.theme === 'system') {
            applyTheme('system');
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [userSettings.theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (appStep === AppStep.SPLASH) {
            setAppStep(AppStep.USER_SELECTION);
        }
    }, 2500);
    return () => clearTimeout(timer);
  }, [appStep]);

  const handleUserSelect = (username: string) => {
    setCurrentUser(username);
    setAppStep(AppStep.INPUT);
  };

  const handleSignUp = (email: string, displayName: string, password?: string) => {
    const newUserSettings = { ...defaultSettings, displayName, password: password || 'password123' };
    const settingsKey = getSettingsStorageKey(email);
    const notesKey = getNotesStorageKey(email);

    if (settingsKey) localStorage.setItem(settingsKey, JSON.stringify(newUserSettings));
    if (notesKey) localStorage.setItem(notesKey, JSON.stringify([]));

    setCurrentUser(email);
    setAppStep(AppStep.INPUT);
  };

  const handleSocialLogin = (email: string, displayName: string) => {
    const settingsKey = getSettingsStorageKey(email);
    
    // Check if user exists, if not, create them (sign up)
    if (settingsKey && !localStorage.getItem(settingsKey)) {
        const newUserSettings = { ...defaultSettings, displayName, password: 'socialLoginPassword' };
        const notesKey = getNotesStorageKey(email);
        
        localStorage.setItem(settingsKey, JSON.stringify(newUserSettings));
        if (notesKey) {
            localStorage.setItem(notesKey, JSON.stringify([]));
        }
    }

    // Log them in
    setCurrentUser(email);
    setAppStep(AppStep.INPUT);
  };

  const handleAnalyzeMaterial = useCallback(async (material: StudyMaterial, subject: string) => {
    setIsLoading(true);
    setLoadingMessage(userSettings.language === 'ko' ? 'AI가 자료를 분석하고 학습 보조 자료를 생성 중입니다...' : 'AI is analyzing the material and generating study aids...');
    setError(null);
    setStudyMaterial(material);
    setSubject(subject);

    try {
      const result = await generateStudyAids(material, userSettings.language);
      setSummary(result.summary);
      setKeywords(result.keywords);
      setAppStep(AppStep.VIEWING_AIDS);
    } catch (e) {
      console.error(e);
      setError(userSettings.language === 'ko' ? '학습 보조 자료 생성에 실패했습니다. 지원하지 않는 파일 형식이거나 내용이 유효하지 않을 수 있습니다.' : 'Failed to generate study aids. The file format may be unsupported or the content may be invalid.');
      setAppStep(AppStep.INPUT);
    } finally {
      setIsLoading(false);
    }
  }, [userSettings.language]);
  
  const handleGoToQuizSettings = useCallback(() => {
    setAppStep(AppStep.GENERATING_QUIZ);
  }, []);

  const handleGenerateQuiz = useCallback(async (type: QuizType, count: number) => {
    const typeName = userSettings.language === 'en' 
        ? (type === QuizType.MCQ ? "Multiple Choice" : type === QuizType.TF ? "T/F" : "Short Answer") 
        : type;
    setIsLoading(true);
    setLoadingMessage(userSettings.language === 'ko' ? `${count}개의 ${typeName} 문제를 생성 중입니다...` : `Generating ${count} ${typeName} questions...`);
    setError(null);

    const quizContext = (studyMaterial && studyMaterial.type === 'text') ? studyMaterial.content : summary;

    if (!quizContext) {
      setError(userSettings.language === 'ko' ? "퀴즈를 생성할 내용을 찾을 수 없습니다." : "Could not find content to generate a quiz from.");
      setIsLoading(false);
      setAppStep(AppStep.VIEWING_AIDS);
      return;
    }

    try {
      const generatedQuiz = await generateQuiz(quizContext, type, count, userSettings.language, studyMaterial);
      setQuiz(generatedQuiz);
      setAppStep(AppStep.TAKING_QUIZ);
    } catch (e) {
      console.error(e);
      setError(userSettings.language === 'ko' ? '퀴즈 생성에 실패했습니다. 다시 시도해 주세요.' : 'Failed to generate quiz. Please try again.');
      setAppStep(AppStep.GENERATING_QUIZ);
    } finally {
      setIsLoading(false);
    }
  }, [studyMaterial, summary, userSettings.language]);
  
  const handleQuizSubmit = (score: number, incorrects: Omit<IncorrectAnswer, 'id' | 'timestamp' | 'subject'>[]) => {
    setQuizScore(score);
    const newIncorrectAnswers = incorrects.map(inc => ({
        ...inc,
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        subject: subject,
    })) as IncorrectAnswer[];

    setIncorrectAnswers(prev => {
        const uniqueNewAnswers = newIncorrectAnswers.filter(newAns => !prev.some(p => p.question === newAns.question));
        return [...prev, ...uniqueNewAnswers];
    });

    setAppStep(AppStep.QUIZ_RESULTS);
  };

  const resetStudyState = () => {
    setStudyMaterial(null);
    setSummary('');
    setKeywords([]);
    setQuiz([]);
    setQuizScore(0);
    setError(null);
    setSubject(userSettings.language === 'ko' ? '일반' : 'General');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    resetStudyState();
    setAppStep(AppStep.USER_SELECTION);
  };
  
  const handleDeleteCurrentUser = () => {
    if (currentUser) {
        const notesKey = getNotesStorageKey(currentUser);
        const settingsKey = getSettingsStorageKey(currentUser);
        if (notesKey) localStorage.removeItem(notesKey);
        if (settingsKey) localStorage.removeItem(settingsKey);
        handleLogout();
    }
  };

  const handleRestart = () => {
    resetStudyState();
    setAppStep(AppStep.INPUT);
  };
  
  const handleDeleteNote = (id: number) => {
    setIncorrectAnswers(prev => prev.filter(note => note.id !== id));
  };

  const handleGoToNotes = () => {
    setAppStep(AppStep.REVIEWING_NOTES);
  };
  
  const handleGoToMyPage = () => {
    setAppStep(AppStep.MY_PAGE);
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => ({...prev, ...newSettings}));
  }

  const handleChangePassword = (currentPassword: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!currentUser) {
            reject(new Error(userSettings.language === 'ko' ? '사용자 정보를 찾을 수 없습니다.' : 'User not found.'));
            return;
        }
        const currentUserSettings = userSettings;
        if (currentUserSettings.password !== currentPassword) {
            reject(new Error(userSettings.language === 'ko' ? '현재 비밀번호가 일치하지 않습니다.' : 'Current password does not match.'));
            return;
        }
        handleUpdateSettings({ password: newPassword });
        resolve();
    });
  };

  const handleBack = () => {
     switch (appStep) {
        case AppStep.SIGN_UP:
            setAppStep(AppStep.USER_SELECTION);
            break;
        case AppStep.VIEWING_AIDS:
            handleRestart();
            break;
        case AppStep.GENERATING_QUIZ:
            setAppStep(AppStep.VIEWING_AIDS);
            break;
        case AppStep.TAKING_QUIZ:
            setAppStep(AppStep.GENERATING_QUIZ);
            break;
        case AppStep.QUIZ_RESULTS:
            setAppStep(AppStep.INPUT);
            break;
        case AppStep.REVIEWING_NOTES:
            if (quiz.length > 0) {
                setAppStep(AppStep.QUIZ_RESULTS);
            } else {
                setAppStep(AppStep.INPUT);
            }
            break;
        case AppStep.MY_PAGE:
            setAppStep(AppStep.INPUT);
            break;
        case AppStep.ACCOUNT_DELETION:
            setAppStep(AppStep.MY_PAGE);
            break;
        case AppStep.FORGOT_PASSWORD:
        case AppStep.FORGOT_PASSWORD_CONFIRMATION:
            setAppStep(AppStep.USER_SELECTION);
            break;
        case AppStep.CHANGE_PASSWORD:
            setAppStep(AppStep.MY_PAGE);
            break;
        default:
             setAppStep(AppStep.USER_SELECTION);
            break;
     }
  }

  const handleShare = async () => {
    const title = userSettings.language === 'ko' 
      ? `[${subject}] 스터디메이트 AI 요약` 
      : `[${subject}] StudyMate AI Summary`;
    const text = userSettings.language === 'ko' 
      ? `[AI 요약 - ${subject}]\n${summary}`
      : `[AI Summary - ${subject}]\n${summary}`;
      
    const shareData = { title, text };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
             alert(userSettings.language === 'ko' ? '이 브라우저에서는 공유하기가 지원되지 않습니다.' : 'Sharing is not supported on this browser.');
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
  };


  const renderContent = () => {
    if (appStep === AppStep.SPLASH) {
        return <SplashScreen language={userSettings.language} />;
    }
    
    if (isLoading) {
      return <div className="pt-16"><LoadingSpinner message={loadingMessage} language={userSettings.language} /></div>;
    }

    switch (appStep) {
      case AppStep.USER_SELECTION:
        return <UserSelection onUserSelect={handleUserSelect} onGoToSignUp={() => setAppStep(AppStep.SIGN_UP)} onGoToForgotPassword={() => setAppStep(AppStep.FORGOT_PASSWORD)} onSocialLogin={handleSocialLogin} existingUsers={allUsers} language={userSettings.language}/>;
      case AppStep.SIGN_UP:
        return <SignUp onSignUp={handleSignUp} onBack={handleBack} onSocialLogin={handleSocialLogin} existingUsers={allUsers} language={userSettings.language} />;
      case AppStep.FORGOT_PASSWORD:
        return <ForgotPasswordView onEmailSent={() => setAppStep(AppStep.FORGOT_PASSWORD_CONFIRMATION)} onBack={handleBack} language={userSettings.language} allUsers={allUsers} />;
      case AppStep.FORGOT_PASSWORD_CONFIRMATION:
        return <ForgotPasswordConfirmationView onBackToLogin={() => setAppStep(AppStep.USER_SELECTION)} onResend={() => setAppStep(AppStep.FORGOT_PASSWORD)} language={userSettings.language} />;
      case AppStep.INPUT:
        return <MaterialInput onAnalyze={handleAnalyzeMaterial} language={userSettings.language} />;
      case AppStep.VIEWING_AIDS:
        return <StudyAidsView summary={summary} keywords={keywords} onGoToQuizSettings={handleGoToQuizSettings} language={userSettings.language} studyMaterial={studyMaterial} />;
      case AppStep.GENERATING_QUIZ:
        return <QuizSettingsView onGenerateQuiz={handleGenerateQuiz} language={userSettings.language} />;
      case AppStep.TAKING_QUIZ:
        return <QuizView questions={quiz} onSubmit={handleQuizSubmit} language={userSettings.language} studyMaterial={studyMaterial} />;
      case AppStep.QUIZ_RESULTS:
        return <QuizResults score={quizScore} total={quiz.length} onRestart={handleRestart} onReviewNotes={handleGoToNotes} language={userSettings.language} />;
      case AppStep.REVIEWING_NOTES:
        return <IncorrectNotesView notes={incorrectAnswers} onRestart={handleRestart} onDeleteNote={handleDeleteNote} language={userSettings.language} studyMaterial={studyMaterial} />;
      case AppStep.MY_PAGE:
        return <MyPage currentUser={currentUser} settings={userSettings} onUpdateSettings={handleUpdateSettings} onLogout={handleLogout} onGoToDeleteAccount={() => setAppStep(AppStep.ACCOUNT_DELETION)} onGoToChangePassword={() => setAppStep(AppStep.CHANGE_PASSWORD)} onBack={handleBack} />;
      case AppStep.CHANGE_PASSWORD:
        return <ChangePasswordView onChangePassword={handleChangePassword} onBack={handleBack} language={userSettings.language} />;
      case AppStep.ACCOUNT_DELETION:
        return <AccountDeletionView onDelete={handleDeleteCurrentUser} onBack={handleBack} language={userSettings.language} />;
      default:
        return <UserSelection onUserSelect={handleUserSelect} onGoToSignUp={() => setAppStep(AppStep.SIGN_UP)} onGoToForgotPassword={() => setAppStep(AppStep.FORGOT_PASSWORD)} onSocialLogin={handleSocialLogin} existingUsers={allUsers} language={userSettings.language} />;
    }
  };
  
  const showBackButton = ![AppStep.INPUT, AppStep.SPLASH, AppStep.USER_SELECTION].includes(appStep);
  const showNotesButton = appStep === AppStep.INPUT && incorrectAnswers.length > 0;
  const showShareButton = appStep === AppStep.VIEWING_AIDS;

  const nonHeaderSteps = [
    AppStep.SPLASH,
    AppStep.USER_SELECTION,
    AppStep.SIGN_UP,
    AppStep.MY_PAGE,
    AppStep.ACCOUNT_DELETION,
    AppStep.FORGOT_PASSWORD,
    AppStep.FORGOT_PASSWORD_CONFIRMATION,
    AppStep.CHANGE_PASSWORD
  ];
  
  const showHeader = !nonHeaderSteps.includes(appStep);
  const useContainer = !nonHeaderSteps.includes(appStep);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      {showHeader && <Header 
        step={appStep} 
        currentUser={currentUser}
        userSettings={userSettings}
        language={userSettings.language}
        onBack={showBackButton ? handleBack : undefined} 
        onGoToNotes={showNotesButton ? handleGoToNotes : undefined} 
        onShare={showShareButton ? handleShare : undefined} 
        onGoToMyPage={currentUser ? handleGoToMyPage : undefined}
      />}
      <main className={useContainer ? "container mx-auto px-4 py-5" : ""}>
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">{userSettings.language === 'ko' ? '오류!' : 'Error!'}</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;