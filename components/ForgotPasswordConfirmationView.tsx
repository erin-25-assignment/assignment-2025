import React from 'react';
import { Language } from '../types';
import { MarkEmailReadIcon } from './icons';

interface ForgotPasswordConfirmationViewProps {
  onBackToLogin: () => void;
  onResend: () => void;
  language: Language;
}

const ForgotPasswordConfirmationView: React.FC<ForgotPasswordConfirmationViewProps> = ({ onBackToLogin, onResend, language }) => {
  const text = {
    ko: {
      title: "이메일을 확인해주세요",
      description: "비밀번호 재설정 링크를 보내드렸습니다. 이메일을 확인하고 안내에 따라주세요.",
      openEmailApp: "이메일 앱 열기",
      backToLogin: "로그인으로 돌아가기",
      didNotReceive: "이메일을 받지 못하셨나요?",
      resend: "다시 보내기",
    },
    en: {
      title: "Check your email",
      description: "We've sent you a password reset link. Please check your email and follow the instructions.",
      openEmailApp: "Open Email App",
      backToLogin: "Back to Login",
      didNotReceive: "Didn't receive the email?",
      resend: "Resend",
    }
  }[language];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <MarkEmailReadIcon className="text-4xl text-green-500 dark:text-green-400" />
            </div>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-slate-50 tracking-tight text-[28px] font-bold leading-tight">{text.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pt-2">{text.description}</p>
          </div>
          <div className="space-y-4">
            <button className="w-full h-14 flex items-center justify-center rounded-lg bg-primary text-white text-base font-bold transition-colors hover:bg-primary/90">
              {text.openEmailApp}
            </button>
            <button onClick={onBackToLogin} className="w-full h-14 flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">
              {text.backToLogin}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {text.didNotReceive}
              <button onClick={onResend} className="font-medium text-primary hover:underline ml-1">{text.resend}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordConfirmationView;
