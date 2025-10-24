import React, { useState } from 'react';
import { Language } from '../types';
import { ArrowBackIcon, PersonIcon } from './icons';

interface ForgotPasswordViewProps {
  onEmailSent: () => void;
  onBack: () => void;
  language: Language;
  allUsers: string[];
}

const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onEmailSent, onBack, language, allUsers }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const text = {
    ko: {
      title: "비밀번호 찾기",
      description: "가입 시 사용한 이메일 주소를 입력해주세요.\n비밀번호 재설정 링크를 보내드립니다.",
      emailLabel: "이메일 주소",
      emailPlaceholder: "이메일 주소 입력",
      sendLink: "재설정 링크 받기",
      errorNotFound: "가입되지 않은 이메일입니다.",
      errorInvalid: "유효한 이메일 주소를 입력해주세요.",
    },
    en: {
      title: "Forgot Password",
      description: "Enter the email address you used to sign up.\nWe'll send you a password reset link.",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter email address",
      sendLink: "Get Reset Link",
      errorNotFound: "This email is not registered.",
      errorInvalid: "Please enter a valid email address.",
    }
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(text.errorInvalid);
      return;
    }
    if (!allUsers.includes(email)) {
      setError(text.errorNotFound);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onEmailSent();
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <header className="flex items-center p-4 pb-2 sticky top-0 z-10">
        <button onClick={onBack} className="flex size-10 items-center justify-center">
          <ArrowBackIcon />
        </button>
      </header>
      <main className="flex flex-1 flex-col p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tighter whitespace-pre-wrap">{text.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap">{text.description}</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="flex flex-col">
                <p className="text-base font-medium pb-2">{text.emailLabel}</p>
                <div className="relative flex w-full items-center">
                  <PersonIcon className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    className="form-input w-full rounded-lg h-14 pl-12 border-slate-300 dark:border-slate-700 bg-white dark:bg-background-dark focus:ring-primary/50"
                    placeholder={text.emailPlaceholder}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </label>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              className="w-full h-14 flex items-center justify-center rounded-lg bg-primary text-white text-base font-bold transition-colors hover:bg-primary/90 disabled:bg-slate-400"
              type="submit"
              disabled={loading}
            >
              {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : text.sendLink}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordView;
