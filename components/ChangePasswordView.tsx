import React, { useState } from 'react';
import { Language } from '../types';
import { ArrowBackIcon, LockIcon, VisibilityIcon, VisibilityOffIcon } from './icons';

interface ChangePasswordViewProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onBack: () => void;
  language: Language;
}

const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({ onChangePassword, onBack, language }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const text = {
    ko: {
      title: "비밀번호 변경",
      currentPasswordLabel: "현재 비밀번호",
      newPasswordLabel: "새 비밀번호",
      confirmPasswordLabel: "새 비밀번호 확인",
      passwordHint: "8자 이상, 영문, 숫자, 특수문자 포함",
      changePasswordButton: "비밀번호 변경",
      errorMatch: "새 비밀번호가 일치하지 않습니다.",
      errorLength: "새 비밀번호는 8자 이상이어야 합니다.",
      success: "비밀번호가 성공적으로 변경되었습니다.",
    },
    en: {
      title: "Change Password",
      currentPasswordLabel: "Current Password",
      newPasswordLabel: "New Password",
      confirmPasswordLabel: "Confirm New Password",
      passwordHint: "At least 8 characters, with letters, numbers, and special characters",
      changePasswordButton: "Change Password",
      errorMatch: "New passwords do not match.",
      errorLength: "New password must be at least 8 characters long.",
      success: "Password changed successfully.",
    }
  }[language];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
        setError(text.errorLength);
        return;
    }
    if (newPassword !== confirmPassword) {
        setError(text.errorMatch);
        return;
    }

    setLoading(true);
    try {
        await onChangePassword(currentPassword, newPassword);
        setSuccess(text.success);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
            onBack();
        }, 2000);
    } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
    } finally {
        setLoading(false);
    }
  };

  return (
     <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 group/design-root overflow-x-hidden">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="flex size-10 shrink-0 items-center justify-center">
          <ArrowBackIcon />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">{text.title}</h2>
        <div className="size-10"></div>
      </header>
      <main className="flex-1 p-4">
        <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
            {/* Current Password */}
            <label className="flex flex-col">
                <p className="text-base font-medium pb-2">{text.currentPasswordLabel}</p>
                <div className="relative flex w-full items-center">
                  <LockIcon className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input className="form-input w-full rounded-lg h-14 pl-12 pr-12 border-slate-300 dark:border-slate-700 focus:ring-primary/50" type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-0 flex h-full items-center justify-center px-4 text-slate-500">
                    {showCurrent ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
            </label>
            {/* New Password */}
            <label className="flex flex-col">
                <p className="text-base font-medium pb-2">{text.newPasswordLabel}</p>
                <div className="relative flex w-full items-center">
                  <LockIcon className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input className="form-input w-full rounded-lg h-14 pl-12 pr-12 border-slate-300 dark:border-slate-700 focus:ring-primary/50" type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-0 flex h-full items-center justify-center px-4 text-slate-500">
                    {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">{text.passwordHint}</p>
            </label>
            {/* Confirm New Password */}
            <label className="flex flex-col">
                <p className="text-base font-medium pb-2">{text.confirmPasswordLabel}</p>
                <div className="relative flex w-full items-center">
                  <LockIcon className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input className="form-input w-full rounded-lg h-14 pl-12 pr-12 border-slate-300 dark:border-slate-700 focus:ring-primary/50" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 flex h-full items-center justify-center px-4 text-slate-500">
                    {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
            </label>
             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
             {success && <p className="text-green-500 text-sm text-center">{success}</p>}
             <div className="pt-4">
                 <button className="w-full h-14 flex items-center justify-center rounded-lg bg-primary text-white text-base font-bold transition-colors hover:bg-primary/90 disabled:bg-slate-400" type="submit" disabled={loading}>
                    {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : text.changePasswordButton}
                </button>
             </div>
        </form>
      </main>
    </div>
  );
};

export default ChangePasswordView;
