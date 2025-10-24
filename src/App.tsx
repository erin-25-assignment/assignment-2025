import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, QuizQuestion, Keyword, QuizType, StudyMaterial, IncorrectAnswer, UserSettings, Theme } from './types';
import { auth, db, googleProvider } from './services/firebaseService';
import { signOut, EmailAuthProvider, deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Custom Hooks
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { useTheme } from './hooks/useTheme';
import { useStudy } from './hooks/useStudy';

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

const App: React.FC = () => {
  const [appStep, setAppStep] = useState<AppStep>(AppStep.SPLASH);
  
  // Custom Hooks for state and logic management
  const { currentUser, isAuthLoading, changePassword } = useAuth();
  const { 
    userSettings, 
    incorrectAnswers, 
    updateSettings, 
    addIncorrectNotesBatch, 
    deleteNote 
  } = useUserData(currentUser);
  
  const {
    studyState,
    loadingState,
    error: studyError,
    analyzeMaterial,
    generateNewQuiz,
    submitQuiz,
    resetStudy,
  } = useStudy({ language: userSettings.language });

  // Apply theme based on user settings
  useTheme(userSettings.theme);

  // De-structure for easier use in the component
  const { studyMaterial, summary, keywords, quiz, quizScore, subject } = studyState;
  const { isLoading, loadingMessage } = loadingState;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(studyError);
  }, [studyError]);

  // Effect to handle navigation based on auth state
  useEffect(() => {
    if (isAuthLoading) return;

    // After loading, if we're still on the splash screen, decide where to go.
    if (appStep === AppStep.SPLASH) {
        if (currentUser) {
            setAppStep(AppStep.INPUT);
        } else {
            setAppStep(AppStep.USER_SELECTION);
        }
        return;
    }

    // For other steps, handle redirection if auth state doesn't match the page type
    const isAuthFlowPage = [
        AppStep.USER_SELECTION,
        AppStep.SIGN_UP,
        AppStep.FORGOT_PASSWORD,
        AppStep.FORGOT_PASSWORD_CONFIRMATION
    ].includes(appStep);

    if (currentUser && isAuthFlowPage) {
        setAppStep(AppStep.INPUT);
    } else if (!currentUser && !isAuthFlowPage) {
        resetStudy();
        setAppStep(AppStep.USER_SELECTION);
    }
  }, [currentUser, isAuthLoading, appStep, resetStudy]);

  // --- App Logic Handlers ---

  const handleAnalyzeMaterial = async (material: StudyMaterial, subject: string) => {
    const { success } = await analyzeMaterial(material, subject);
    if (success) {
      setAppStep(AppStep.VIEWING_AIDS);
    } else {
      setAppStep(AppStep.INPUT);
    }
  };

  const handleGenerateQuiz = async (type: QuizType, count: number) => {
    const { success } = await generateNewQuiz(type, count);
    if (success) {
      setAppStep(AppStep.TAKING_QUIZ);
    } else {
      setAppStep(AppStep.GENERATING_QUIZ);
    }
  };

  const handleQuizSubmit = (score: number, incorrects: Omit<IncorrectAnswer, 'id' | 'timestamp' | 'subject'>[]) => {
    submitQuiz(score, incorrects);
    addIncorrectNotesBatch(incorrects, subject);
    setAppStep(AppStep.QUIZ_RESULTS);
  };

  const handleRestart = () => {
    resetStudy();
    setAppStep(AppStep.INPUT);
  };
  
  const handleLogout = async () => {
    try {
        await signOut(auth);
        // onAuthStateChanged in useAuth hook will handle state reset and navigation
    } catch (error) {
        console.error("Logout Error:", error);
        setError(userSettings.language === 'ko' ? '로그아웃에 실패했습니다.' : 'Logout failed.');
    }
  };
  
  const handleDeleteCurrentUser = async () => {
    if (!currentUser) return;

    const performDeletion = async () => {
        // Delete all associated Firestore data first
        const notesCollectionRef = collection(db, 'users', currentUser.uid, 'incorrectAnswers');
        const notesSnapshot = await getDocs(notesCollectionRef);
        const deletePromises = notesSnapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);

        const userDocRef = doc(db, 'users', currentUser.uid);
        await deleteDoc(userDocRef);
        
        // Finally, delete the user from Authentication
        await deleteUser(currentUser);
    };

    try {
        await performDeletion();
    } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
            const providerId = currentUser.providerData[0]?.providerId;
            
            if (providerId === GoogleAuthProvider.PROVIDER_ID) {
                try {
                    await reauthenticateWithPopup(currentUser, googleProvider);
                    await performDeletion(); // Retry deletion
                } catch (reauthError: any) {
                    console.error("Google re-authentication failed:", reauthError);
                    const message = userSettings.language === 'ko' ? '재인증에 실패했습니다. 다시 로그인 후 시도해주세요.' : 'Re-authentication failed. Please log in again and retry.';
                    setError(message);
                }
            } else {
                const message = userSettings.language === 'ko' ? '보안을 위해 다시 로그인한 후 계정을 삭제해주세요.' : 'For security, please log in again before deleting your account.';
                setError(message);
            }
        } else {
            console.error("Error deleting account:", error);
            const message = userSettings.language === 'ko' ? '계정 삭제에 실패했습니다.' : 'Failed to delete account.';
            setError(message);
        }
    }
  };

  const handleChangePassword = (currentPassword: string, newPassword: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        try {
            await changePassword(currentPassword, newPassword);
            resolve();
        } catch (error: any) {
            console.error("Password change error:", error);
            if (error.code === 'auth/wrong-password') {
                reject(new Error(userSettings.language === 'ko' ? '현재 비밀번호가 일치하지 않습니다.' : 'Current password does not match.'));
            } else if (error.code === 'auth/no-user') {
                reject(new Error(userSettings.language === 'ko' ? '사용자 정보를 찾을 수 없습니다.' : 'User not found.'));
            } else {
                 reject(new Error(userSettings.language === 'ko' ? '비밀번호 변경에 실패했습니다.' : 'Failed to change password.'));
            }
        }
    });
  };
  
  const handleBack = () => {
     switch (appStep) {
        case AppStep.SIGN_UP:
        case AppStep.FORGOT_PASSWORD:
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
        case AppStep.FORGOT_PASSWORD_CONFIRMATION:
            setAppStep(AppStep.USER_SELECTION);
            break;
        case AppStep.CHANGE_PASSWORD:
            setAppStep(AppStep.MY_PAGE);
            break;
        default:
             setAppStep(AppStep.INPUT);
            break;
     }
  }

  const handleShare = async () => {
    const title = userSettings.language === 'ko' 
      ? `[${subject}] 스터디메이트 AI 요약` 
      : `[${subject}] StudyMate AI Summary`;
    const textToShare = userSettings.language === 'ko' 
      ? `[AI 요약 - ${subject}]\n${summary}`
      : `[AI Summary - ${subject}]\n${summary}`;
      
    const shareData = { title, text: textToShare };

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
    if (isAuthLoading || appStep === AppStep.SPLASH) {
        return <SplashScreen language={userSettings.language} />;
    }
    
    if (isLoading) {
      return <div className="pt-16"><LoadingSpinner message={loadingMessage} language={userSettings.language} /></div>;
    }
    
    // Unauthenticated user flow
    if (!currentUser) {
         switch (appStep) {
            case AppStep.SIGN_UP:
                return <SignUp onBack={handleBack} language={userSettings.language} />;
            case AppStep.FORGOT_PASSWORD:
                return <ForgotPasswordView onEmailSent={() => setAppStep(AppStep.FORGOT_PASSWORD_CONFIRMATION)} onBack={handleBack} language={userSettings.language} />;
            case AppStep.FORGOT_PASSWORD_CONFIRMATION:
                return <ForgotPasswordConfirmationView onBackToLogin={() => setAppStep(AppStep.USER_SELECTION)} onResend={() => setAppStep(AppStep.FORGOT_PASSWORD)} language={userSettings.language} />;
            default:
                return <UserSelection onGoToSignUp={() => setAppStep(AppStep.SIGN_UP)} onGoToForgotPassword={() => setAppStep(AppStep.FORGOT_PASSWORD)} language={userSettings.language}/>;
        }
    }

    // Authenticated user flow
    switch (appStep) {
      case AppStep.INPUT:
        return <MaterialInput onAnalyze={handleAnalyzeMaterial} language={userSettings.language} />;
      case AppStep.VIEWING_AIDS:
        return <StudyAidsView summary={summary} keywords={keywords} onGoToQuizSettings={() => setAppStep(AppStep.GENERATING_QUIZ)} language={userSettings.language} studyMaterial={studyMaterial} />;
      case AppStep.GENERATING_QUIZ:
        return <QuizSettingsView onGenerateQuiz={handleGenerateQuiz} language={userSettings.language} />;
      case AppStep.TAKING_QUIZ:
        return <QuizView questions={quiz} onSubmit={handleQuizSubmit} language={userSettings.language} studyMaterial={studyMaterial} />;
      case AppStep.QUIZ_RESULTS:
        return <QuizResults score={quizScore} total={quiz.length} onRestart={handleRestart} onReviewNotes={() => setAppStep(AppStep.REVIEWING_NOTES)} language={userSettings.language} />;
      case AppStep.REVIEWING_NOTES:
        return <IncorrectNotesView notes={incorrectAnswers} onRestart={handleRestart} onDeleteNote={deleteNote} language={userSettings.language} studyMaterial={studyMaterial} />;
      case AppStep.MY_PAGE:
        return <MyPage currentUser={currentUser} settings={userSettings} onUpdateSettings={updateSettings} onLogout={handleLogout} onGoToDeleteAccount={() => setAppStep(AppStep.ACCOUNT_DELETION)} onGoToChangePassword={() => setAppStep(AppStep.CHANGE_PASSWORD)} onBack={handleBack} />;
      case AppStep.CHANGE_PASSWORD:
        return <ChangePasswordView onChangePassword={handleChangePassword} onBack={handleBack} language={userSettings.language} />;
      case AppStep.ACCOUNT_DELETION:
        return <AccountDeletionView onDelete={handleDeleteCurrentUser} onBack={handleBack} language={userSettings.language} />;
      default:
        return <MaterialInput onAnalyze={handleAnalyzeMaterial} language={userSettings.language} />;
    }
  };
  
  const showBackButton = ![AppStep.INPUT, AppStep.SPLASH, AppStep.USER_SELECTION].includes(appStep) && !!currentUser;
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
  
  const showHeader = !nonHeaderSteps.includes(appStep) && !!currentUser;
  const useContainer = !nonHeaderSteps.includes(appStep);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      {showHeader && <Header 
        step={appStep} 
        currentUser={currentUser}
        userSettings={userSettings}
        language={userSettings.language}
        onBack={showBackButton ? handleBack : undefined} 
        onGoToNotes={showNotesButton ? () => setAppStep(AppStep.REVIEWING_NOTES) : undefined} 
        onShare={showShareButton ? handleShare : undefined} 
        onGoToMyPage={currentUser ? () => setAppStep(AppStep.MY_PAGE) : undefined}
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