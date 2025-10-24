import React, { useState } from 'react';
import { Language } from '../types';
import { ArrowBackIcon, WarningIcon } from './icons';

interface AccountDeletionViewProps {
  onDelete: () => void;
  onBack: () => void;
  language: Language;
}

const AccountDeletionView: React.FC<AccountDeletionViewProps> = ({ onDelete, onBack, language }) => {
  const [confirmed, setConfirmed] = useState(false);

  const textData = {
    ko: {
      title: "계정 탈퇴",
      warning: "계정을 삭제하면 모든 데이터가 영구적으로 사라져요.",
      body: "모든 학습 데이터 (강의 노트, AI 요약, 자동 생성 문제 등)가 영구적으로 삭제됩니다.\n이 작업은 절대로 되돌릴 수 없습니다.\n구독 중인 서비스가 있다면 관련 정책에 따라 처리됩니다.",
      reasonLabel: "떠나시는 이유가 궁금해요 (선택)",
      reasonPlaceholder: "탈퇴 사유를 선택해주세요",
      reasons: {
        not_using: "앱을 더 이상 사용하지 않아서",
        errors: "오류가 많아서",
        missing_feature: "원하는 기능이 없어서",
        other: "기타",
      },
      confirmation: "안내 사항을 모두 확인했으며, 계정 영구 삭제에 동의합니다.",
      deleteButton: "계정 영구 삭제",
    },
    en: {
      title: "Account Deletion",
      warning: "Deleting your account will permanently remove all your data.",
      body: "All learning data (lecture notes, AI summaries, generated questions, etc.) will be permanently deleted.\nThis action cannot be undone.\nIf you have any active subscriptions, they will be handled according to the relevant policies.",
      reasonLabel: "We'd like to know why you're leaving (optional)",
      reasonPlaceholder: "Please select a reason",
      reasons: {
        not_using: "I'm not using the app anymore",
        errors: "There are too many errors",
        missing_feature: "It's missing a feature I want",
        other: "Other",
      },
      confirmation: "I have read the information and agree to the permanent deletion of my account.",
      deleteButton: "Permanently Delete Account",
    }
  };

  const text = textData[language];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="flex size-10 shrink-0 items-center justify-center">
          <ArrowBackIcon className="text-slate-800 dark:text-slate-200" />
        </button>
        <h2 className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{text.title}</h2>
        <div className="size-10"></div>
      </header>
      <main className="flex flex-col w-full flex-grow p-4">
        <div className="flex justify-center pt-8 pb-4">
          <WarningIcon className="text-5xl text-[#E63946]" />
        </div>
        <h1 className="text-slate-900 dark:text-slate-50 tracking-tight text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-2">{text.warning}</h1>
        <div className="px-4 py-2">
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed text-center whitespace-pre-line">{text.body}</p>
        </div>
        <div className="py-6"></div>
        <div className="flex w-full flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-slate-800 dark:text-slate-200 text-base font-medium leading-normal pb-2">{text.reasonLabel}</p>
            <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-slate-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary/50 dark:focus:border-primary/50 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal">
              <option value="default">{text.reasonPlaceholder}</option>
              <option value="not_using">{text.reasons.not_using}</option>
              <option value="errors">{text.reasons.errors}</option>
              <option value="missing_feature">{text.reasons.missing_feature}</option>
              <option value="other">{text.reasons.other}</option>
            </select>
          </label>
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-start gap-3 p-4 mt-8">
          <input
            className="form-checkbox h-5 w-5 shrink-0 mt-0.5 rounded border-slate-400 dark:border-slate-600 text-primary focus:ring-primary/50 bg-background-light dark:bg-slate-800 dark:checked:bg-primary"
            id="confirmation-checkbox"
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <label className="text-slate-700 dark:text-slate-300 text-sm font-normal leading-normal" htmlFor="confirmation-checkbox">{text.confirmation}</label>
        </div>
        <div className="w-full p-4 pt-2 pb-6">
          <button
            onClick={onDelete}
            disabled={!confirmed}
            className="flex w-full items-center justify-center rounded-xl bg-[#E63946] px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-red-700 h-14 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {text.deleteButton}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AccountDeletionView;