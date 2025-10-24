import React, { useState } from 'react';
import { Language } from '../types';
import { ArrowBackIcon, CloseIcon, GoogleIcon, VisibilityIcon, VisibilityOffIcon } from './icons';
import Modal from './Modal';
import { auth, googleProvider } from '../services/firebaseService';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

interface SignUpProps {
  onBack: () => void;
  language: Language;
}

const SignUp: React.FC<SignUpProps> = ({ onBack, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'terms' | 'privacy' | null>(null);

  const textData = {
    ko: {
      title: "회원가입",
      welcome: "스터디메이트 AI에\n오신 것을 환영합니다!",
      startWithGoogle: "Google로 시작하기",
      orEmail: "또는 이메일로 가입",
      emailLabel: "이메일",
      emailPlaceholder: "example@email.com",
      passwordLabel: "비밀번호",
      passwordPlaceholder: "비밀번호를 입력하세요",
      passwordHint: "8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.",
      confirmPasswordLabel: "비밀번호 확인",
      confirmPasswordPlaceholder: "비밀번호를 다시 한번 입력하세요",
      agreement: "[필수] {terms} 및 {privacy}에 모두 동의합니다.",
      terms: "서비스 이용약관",
      privacy: "개인정보 처리방침",
      cta: "스터디메이트 AI 시작하기",
      alreadyHaveAccount: "이미 계정이 있으신가요?",
      login: "로그인",
      errorEmail: "유효한 이메일 주소를 입력해주세요.",
      errorEmailExists: "이미 사용 중인 이메일입니다.",
      errorPasswordLength: "비밀번호는 8자 이상이어야 합니다.",
      errorPasswordMatch: "비밀번호가 일치하지 않습니다.",
      errorAgreement: "약관에 동의해야 합니다.",
      errorGeneric: "가입 중 오류가 발생했습니다. 다시 시도해주세요.",
    },
    en: {
      title: "Sign Up",
      welcome: "Welcome to\nStudyMate AI!",
      startWithGoogle: "Start with Google",
      orEmail: "Or sign up with email",
      emailLabel: "Email",
      emailPlaceholder: "example@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      passwordHint: "Must be at least 8 characters, including letters, numbers, and special characters.",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Enter your password again",
      agreement: "[Required] I agree to both the {terms} and {privacy}.",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      cta: "Start StudyMate AI",
      alreadyHaveAccount: "Already have an account?",
      login: "Login",
      errorEmail: "Please enter a valid email address.",
      errorEmailExists: "This email is already in use.",
      errorPasswordLength: "Password must be at least 8 characters.",
      errorPasswordMatch: "Passwords do not match.",
      errorAgreement: "You must agree to the terms.",
      errorGeneric: "An error occurred during sign up. Please try again.",
    }
  };

  const text = textData[language];

  const validate = () => {
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(text.errorEmail);
      return false;
    }
    if (password.length < 8) {
      setError(text.errorPasswordLength);
      return false;
    }
    if (password !== confirmPassword) {
      setError(text.errorPasswordMatch);
      return false;
    }
    if (!agreedToTerms) {
      setError(text.errorAgreement);
      return false;
    }
    return true;
  };
  
  const isCtaDisabled = !email || password.length < 8 || password !== confirmPassword || !agreedToTerms || loading;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = email.split('@')[0];
        await updateProfile(userCredential.user, { displayName });
        // onAuthStateChanged in App.tsx will handle the rest
      } catch (error: any) {
        console.error("Sign up error:", error);
        if (error.code === 'auth/email-already-in-use') {
          setError(text.errorEmailExists);
        } else {
          setError(text.errorGeneric);
        }
        setLoading(false);
      }
    }
  };

   const handleSocialLogin = async () => {
    setError(null);
    setLoading(true);
    try {
        await signInWithPopup(auth, googleProvider);
        // onAuthStateChanged will handle navigation
    } catch (error: any) {
        console.error("Google sign up error:", error);
        setError(text.errorGeneric[language]);
    } finally {
        setLoading(false);
    }
  };
  
  const renderAgreementText = () => {
    const parts = text.agreement.split(/({terms}|{privacy})/);
    return parts.map((part, index) => {
      if (part === '{terms}') {
        return <button key={index} type="button" onClick={() => setModal('terms')} className="font-semibold text-primary underline">{text.terms}</button>;
      }
      if (part === '{privacy}') {
        return <button key={index} type="button" onClick={() => setModal('privacy')} className="font-semibold text-primary underline">{text.privacy}</button>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderModalContent = () => {
     const content = modal === 'terms' ? {
        title: text.terms,
        body: language === 'ko' ? "제 1조 (목적) 이 약관은 스터디메이트 AI가 제공하는 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다..." : "Article 1 (Purpose) These terms and conditions are intended to define the rights, obligations, and responsibilities between the company and its members in connection with the use of the services provided by StudyMate AI..."
    } : {
        title: text.privacy,
        body: language === 'ko' ? "스터디메이트 AI는 귀하의 개인정보를 소중하게 생각하며, 개인정보보호 관련 법규를 준수하고 있습니다..." : "StudyMate AI values your personal information and complies with all relevant privacy laws and regulations..."
    };
    return (
        <div className="flex flex-col gap-3 h-[80vh] bg-background-light dark:bg-background-dark">
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold">{content.title}</h2>
                <button onClick={() => setModal(null)}><CloseIcon/></button>
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{content.body}</p>
            </main>
            <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={() => setModal(null)} className="w-full bg-primary text-white font-bold h-12 rounded-xl text-base">{language === 'ko' ? "동의" : "Agree"}</button>
            </footer>
        </div>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <Modal isOpen={!!modal} onClose={() => setModal(null)}>
        <div className="w-full max-w-lg mx-auto">{renderModalContent()}</div>
      </Modal>

      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <button onClick={onBack} className="text-slate-900 dark:text-slate-50 flex size-10 shrink-0 items-center justify-center">
          <ArrowBackIcon className="text-2xl" />
        </button>
        <h2 className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{text.title}</h2>
        <div className="flex size-10 shrink-0"></div>
      </div>
      <main className="flex-1 px-4 py-2">
        <h2 className="text-slate-900 dark:text-slate-50 tracking-tight text-[28px] font-bold leading-tight text-left pb-3 pt-5 whitespace-pre-wrap">{text.welcome}</h2>
        
        <div className="flex flex-col gap-4 py-4">
            <button onClick={handleSocialLogin} disabled={loading} className="w-full h-14 flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
                <GoogleIcon />
                <span>{text.startWithGoogle}</span>
            </button>
        </div>

        <div className="relative my-2 flex items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="mx-4 flex-shrink text-sm text-slate-500 dark:text-slate-400">{text.orEmail}</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        
        <form onSubmit={handleSignUp}>
          <div className="flex flex-col gap-2 pt-2">
            <label className="flex flex-col">
              <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">{text.emailLabel}</p>
              <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal" placeholder={text.emailPlaceholder} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="flex flex-col">
              <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">{text.passwordLabel}</p>
              <div className="relative flex w-full items-center">
                <input className="form-input w-full rounded-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-3 pr-12 pl-4 text-base" placeholder={text.passwordPlaceholder} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 flex h-full items-center justify-center px-4 text-slate-500 dark:text-slate-400">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{text.passwordHint}</p>
            </label>
            <label className="flex flex-col mt-2">
              <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">{text.confirmPasswordLabel}</p>
               <div className="relative flex w-full items-center">
                <input className="form-input w-full rounded-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-3 pr-12 pl-4 text-base" placeholder={text.confirmPasswordPlaceholder} type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 flex h-full items-center justify-center px-4 text-slate-500 dark:text-slate-400">
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </label>
          </div>
          <div className="flex items-start gap-3 pt-6">
            <input className="form-checkbox mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-white dark:bg-slate-800 dark:checked:bg-primary" id="terms-checkbox" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
            <label className="text-sm text-slate-700 dark:text-slate-300" htmlFor="terms-checkbox">
              {renderAgreementText()}
            </label>
          </div>
            {error && <p className="text-red-500 text-sm text-center pt-4">{error}</p>}
        </form>
      </main>
      <div className="sticky bottom-0 bg-background-light dark:bg-background-dark p-4 pt-2 space-y-4">
        <button onClick={handleSignUp} disabled={isCtaDisabled} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl text-lg transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400">
          {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : text.cta}
        </button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          {text.alreadyHaveAccount}
          <button onClick={onBack} className="font-bold text-primary hover:underline ml-1">{text.login}</button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;