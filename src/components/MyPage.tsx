import React, { useState, useRef } from 'react';
import { UserSettings, Language, Theme } from '../types';
import { User } from 'firebase/auth';
import { 
    ArrowBackIcon, 
    LockIcon,
    ChevronRightIcon, 
    PersonRemoveIcon,
    ContrastIcon,
    LanguageIcon,
    GavelIcon,
    PrivacyTipIcon,
    InfoIcon,
    LogoutIcon,
    CheckIcon,
    CloseIcon,
    EditIcon,
    ImageIcon
} from './icons';
import Modal from './Modal';

interface MyPageProps {
  currentUser: User | null;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onLogout: () => void;
  onGoToDeleteAccount: () => void;
  onGoToChangePassword: () => void;
  onBack: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

const MyPage: React.FC<MyPageProps> = ({ 
    currentUser, 
    settings, 
    onUpdateSettings, 
    onLogout, 
    onGoToDeleteAccount,
    onGoToChangePassword,
    onBack 
}) => {
    const { language } = settings;
    const [modal, setModal] = useState<
      'editProfile' | 'theme' | 'language' | 'terms' | 'privacy' | null
    >(null);

    // Edit Profile Modal State
    const [displayName, setDisplayName] = useState(settings.displayName);
    const [avatar, setAvatar] = useState(settings.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isPasswordProvider = currentUser?.providerData.some(
        (provider) => provider.providerId === 'password'
    );
    
    const textData = {
        ko: {
            title: "마이페이지",
            editProfile: "프로필 편집",
            accountSettings: "계정 설정",
            changePassword: "비밀번호 변경",
            logout: "로그아웃",
            deleteAccount: "계정 탈퇴",
            appSettings: "앱 설정",
            screenMode: "화면 모드",
            language: "언어 설정",
            information: "정보",
            terms: "서비스 이용약관",
            privacy: "개인정보 처리방침",
            appVersion: "앱 버전 정보",
            save: "저장",
            cancel: "취소",
            name: "이름",
            uploadImage: "이미지 업로드",
            system: "시스템 설정",
            light: "라이트 모드",
            dark: "다크 모드",
            korean: "한국어",
            english: "English",
        },
        en: {
            title: "My Page",
            editProfile: "Edit Profile",
            accountSettings: "Account Settings",
            changePassword: "Change Password",
            logout: "Logout",
            deleteAccount: "Delete Account",
            appSettings: "App Settings",
            screenMode: "Screen Mode",
            language: "Language",
            information: "Information",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            appVersion: "App Version Info",
            save: "Save",
            cancel: "Cancel",
            name: "Name",
            uploadImage: "Upload Image",
            system: "System Setting",
            light: "Light Mode",
            dark: "Dark Mode",
            korean: "한국어",
            english: "English",
        }
    };

    const text = textData[language];
    
    const handleProfileSave = () => {
        onUpdateSettings({ displayName, avatar });
        setModal(null);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setAvatar(base64);
        }
    };
    
    const renderModalContent = () => {
        switch (modal) {
            case 'editProfile':
                return (
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-center">{text.editProfile}</h3>
                        <div className="flex flex-col items-center gap-4">
                            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="relative group">
                                <div 
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 shrink-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center" 
                                    style={avatar ? {backgroundImage: `url(${avatar})`} : {}}
                                >
                                    {!avatar && <span className="text-4xl font-bold text-slate-500">{displayName.charAt(0)}</span>}
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditIcon />
                                </div>
                            </button>
                             <input 
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder={text.name}
                                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setModal(null)} className="flex-1 w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold h-12 rounded-xl text-base transition-colors">{text.cancel}</button>
                            <button onClick={handleProfileSave} className="flex-1 w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl text-base transition-colors">{text.save}</button>
                        </div>
                    </div>
                );
            case 'theme':
                return (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold text-center pb-4">{text.screenMode}</h3>
                        {(['system', 'light', 'dark'] as Theme[]).map(theme => (
                            <button key={theme} onClick={() => { onUpdateSettings({ theme }); setModal(null); }} className="flex justify-between items-center w-full p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <span>{text[theme as keyof typeof text]}</span>
                                {settings.theme === theme && <CheckIcon className="text-primary" />}
                            </button>
                        ))}
                    </div>
                );
            case 'language':
                 return (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold text-center pb-4">{text.language}</h3>
                        {(['ko', 'en'] as Language[]).map(lang => (
                            <button key={lang} onClick={() => { onUpdateSettings({ language: lang }); setModal(null); }} className="flex justify-between items-center w-full p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <span>{lang === 'ko' ? text.korean : text.english}</span>
                                {settings.language === lang && <CheckIcon className="text-primary" />}
                            </button>
                        ))}
                    </div>
                );
            case 'terms':
            case 'privacy':
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
                            <button onClick={() => setModal(null)} className="w-full bg-primary text-white font-bold h-12 rounded-xl text-base">{language === 'ko' ? "확인" : "Confirm"}</button>
                        </footer>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const getSettingValue = (type: 'theme' | 'language') => {
        if (type === 'theme') {
             return text[settings.theme as keyof typeof text] || settings.theme;
        }
        if (type === 'language') {
            return settings.language === 'ko' ? text.korean : text.english;
        }
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 group/design-root overflow-x-hidden">
            <Modal isOpen={!!modal} onClose={() => setModal(null)}>
                {renderModalContent()}
            </Modal>
            
            <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={onBack} className="text-slate-900 dark:text-slate-50 flex size-10 shrink-0 items-center justify-center">
                    <ArrowBackIcon className="text-2xl" />
                </button>
                <h2 className="text-slate-900 dark:text-slate-50 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{text.title}</h2>
                <div className="flex size-10 shrink-0"></div>
            </header>

            <main className="flex-1">
                {/* Profile Section */}
                <section className="flex items-center gap-4 p-4">
                    <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 shrink-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center" 
                        style={settings.avatar ? {backgroundImage: `url(${settings.avatar})`} : {}}
                    >
                         {!settings.avatar && <span className="text-3xl font-bold text-slate-500">{settings.displayName.charAt(0)}</span>}
                    </div>
                    <div className="flex-1">
                        <p className="text-xl font-bold">{settings.displayName}</p>
                        <p className="text-sm text-slate-500">{currentUser?.email}</p>
                    </div>
                    <button onClick={() => setModal('editProfile')} className="flex items-center justify-center h-10 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium">{text.editProfile}</button>
                </section>
                
                <div className="h-2 bg-slate-100 dark:bg-slate-800/50 my-4"></div>

                {/* Settings Sections */}
                <div className="px-4 space-y-4">
                    {/* Account Settings */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 py-2">{text.accountSettings}</h3>
                        <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                            {isPasswordProvider && (
                                <>
                                    <button onClick={onGoToChangePassword} className="flex justify-between items-center w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <div className="flex items-center gap-4">
                                            <LockIcon />
                                            <span>{text.changePassword}</span>
                                        </div>
                                        <ChevronRightIcon className="text-slate-400" />
                                    </button>
                                    <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                                </>
                            )}
                            <button onClick={onLogout} className="flex justify-between items-center w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-4 text-primary">
                                    <LogoutIcon />
                                    <span>{text.logout}</span>
                                </div>
                                <ChevronRightIcon className="text-slate-400" />
                            </button>
                             <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                            <button onClick={onGoToDeleteAccount} className="flex justify-between items-center w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-4 text-error">
                                    <PersonRemoveIcon />
                                    <span>{text.deleteAccount}</span>
                                </div>
                                <ChevronRightIcon className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                    
                    {/* App Settings */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 py-2">{text.appSettings}</h3>
                        <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                             <button onClick={() => setModal('theme')} className="flex justify-between items-center w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <ContrastIcon />
                                    <span>{text.screenMode}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500">{getSettingValue('theme')}</span>
                                    <ChevronRightIcon className="text-slate-400" />
                                </div>
                            </button>
                             <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                            <button onClick={() => setModal('language')} className="flex justify-between items-center w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <LanguageIcon />
                                    <span>{text.language}</span>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <span className="text-slate-500">{getSettingValue('language')}</span>
                                    <ChevronRightIcon className="text-slate-400" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Information */}
                     <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 py-2">{text.information}</h3>
                        <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                             <button onClick={() => setModal('terms')} className="flex justify-between items-center w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <GavelIcon />
                                    <span>{text.terms}</span>
                                </div>
                                <ChevronRightIcon className="text-slate-400" />
                            </button>
                             <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                            <button onClick={() => setModal('privacy')} className="flex justify-between items-center w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <PrivacyTipIcon />
                                    <span>{text.privacy}</span>
                                </div>
                                <ChevronRightIcon className="text-slate-400" />
                            </button>
                             <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                             <div className="flex justify-between items-center w-full p-4">
                                <div className="flex items-center gap-4">
                                    <InfoIcon />
                                    <span>{text.appVersion}</span>
                                </div>
                                <span className="text-slate-500 text-sm">v1.0.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyPage;