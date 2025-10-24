import React, { useState } from 'react';
import { PersonIcon, LockIcon, VisibilityIcon, VisibilityOffIcon, GoogleIcon } from './icons';
import { Language } from '../types';

interface UserSelectionProps {
  onUserSelect: (username: string) => void;
  onGoToSignUp: () => void;
  onSocialLogin: (email: string, displayName: string) => void;
  onGoToForgotPassword: () => void;
  existingUsers: string[];
  language: Language;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onUserSelect, onGoToSignUp, onSocialLogin, onGoToForgotPassword, existingUsers, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const text = {
    title: { ko: "스터디메이트 AI", en: "StudyMate AI" },
    welcome: { ko: "다시 만나서 반가워요!", en: "Welcome back!" },
    description: { ko: "로그인하고 학습을 계속하세요", en: "Login and continue your learning" },
    emailLabel: { ko: "이메일 또는 사용자 이름", en: "Email or Username" },
    emailPlaceholder: { ko: "이메일 또는 사용자 이름 입력", en: "Enter email or username" },
    passwordLabel: { ko: "비밀번호", en: "Password" },
    passwordPlaceholder: { ko: "비밀번호 입력", en: "Enter password" },
    forgotPassword: { ko: "비밀번호를 잊으셨나요?", en: "Forgot your password?" },
    login: { ko: "로그인", en: "Login" },
    socialLogin: { ko: "또는 다음으로 로그인", en: "Or login with" },
    noAccount: { ko: "아직 계정이 없으신가요?", en: "Don't have an account yet?" },
    signUp: { ko: "회원가입", en: "Sign up" },
    errorNotFound: { ko: "프로필을 찾을 수 없습니다. 이메일을 확인하거나 새로 가입해주세요.", en: "Profile not found. Please check the email or sign up." },
    errorRequired: { ko: "이메일을 입력해주세요.", en: "Please enter your email." },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(text.errorRequired[language]);
      return;
    }
    if (existingUsers.includes(trimmedEmail)) {
      onUserSelect(trimmedEmail);
    } else {
      setError(text.errorNotFound[language]);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900 dark:text-white">{text.title[language]}</h1>
          </div>
          <div className="text-center">
            <h2 className="text-slate-900 dark:text-slate-50 tracking-tight text-[28px] font-bold leading-tight">{text.welcome[language]}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pt-2">{text.description[language]}</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">{text.emailLabel[language]}</p>
                <div className="relative flex w-full items-center">
                  <PersonIcon className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    className="form-input w-full resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-3 pr-4 pl-12 text-base font-normal leading-normal"
                    placeholder={text.emailPlaceholder[language]}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">{text.passwordLabel[language]}</p>
                <div className="relative flex w-full items-center">
                  <LockIcon className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    className="form-input w-full resize-none overflow-hidden rounded-lg text-slate-900 dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-3 px-12 text-base font-normal leading-normal"
                    placeholder={text.passwordPlaceholder[language]}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="absolute right-0 flex h-full items-center justify-center px-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </label>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={onGoToForgotPassword} className="text-sm font-medium text-primary hover:underline">{text.forgotPassword[language]}</button>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button className="w-full h-14 flex items-center justify-center rounded-lg bg-primary text-white text-base font-bold transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark" type="submit">
              {text.login[language]}
            </button>
          </form>
          <div className="relative my-2 flex items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="mx-4 flex-shrink text-sm text-slate-500 dark:text-slate-400">{text.socialLogin[language]}</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => onSocialLogin('google@example.com', 'Google User')} className="w-full h-14 flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-background-dark">
              <GoogleIcon />
              <span>Google</span>
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {text.noAccount[language]}
              <button onClick={onGoToSignUp} className="font-bold text-primary hover:underline ml-1">{text.signUp[language]}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;