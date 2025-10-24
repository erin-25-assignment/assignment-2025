import React from 'react';

type IconProps = {
  className?: string;
};

const MaterialIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`}>{iconName}</span>
);

export const SchoolIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="school" className={className} />;
export const UploadIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="upload_file" className={className} />;
export const AutoAwesomeIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="auto_awesome" className={className} />;
export const ArrowBackIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="arrow_back" className={className} />;
export const ArrowForwardIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="arrow_forward" className={className} />;
export const ExpandMoreIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="expand_more" className={className} />;
export const ShareIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="share" className={className} />;
export const DownloadIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="download" className={className} />;
export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="check_circle" className={className} />;
export const CancelIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="cancel" className={className} />;
export const ThumbUpIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="thumb_up" className={className} />;
export const ThumbDownIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="thumb_down" className={className} />;
export const MenuBookIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="menu_book" className={className} />;
export const TaskAltIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="task_alt" className={className} />;
export const ArrowDropDownIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="arrow_drop_down" className={className} />;
export const SwapVertIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="swap_vert" className={className} />;
export const ImageIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="image" className={className} />;
export const MicIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="mic" className={className} />;
export const DeleteIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="delete" className={className} />;
export const PersonIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="person" className={className} />;
export const AddIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="add" className={className} />;
export const LogoutIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="logout" className={className} />;
export const LockIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="lock" className={className} />;
export const VisibilityIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="visibility" className={className} />;
export const VisibilityOffIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="visibility_off" className={className} />;
export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="chevron_right" className={className} />;
export const PersonRemoveIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="person_remove" className={className} />;
export const ContrastIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="contrast" className={className} />;
export const LanguageIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="language" className={className} />;
export const GavelIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="gavel" className={className} />;
export const PrivacyTipIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="privacy_tip" className={className} />;
export const InfoIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="info" className={className} />;
export const CloseIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="close" className={className} />;
export const CheckIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="check" className={className} />;
export const EditIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="edit" className={className} />;
export const WarningIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="warning" className={className} />;
export const MarkEmailReadIcon: React.FC<IconProps> = ({ className }) => <MaterialIcon iconName="mark_email_read" className={className} />;

export const GoogleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.578 12.28c0-.777-.07-1.537-.205-2.28h-9.87v4.28h5.622c-.244 1.385-.973 2.57-2.04 3.385v2.78h3.57c2.088-1.92 3.288-4.73 3.288-8.165z" fill="#4285F4"></path>
        <path d="M12.503 23c2.733 0 5.02-.903 6.692-2.458l-3.57-2.78c-.903.608-2.07.973-3.412.973-2.615 0-4.83-1.76-5.622-4.135H3.19v2.873c1.652 3.288 4.88 5.53 8.313 5.53z" fill="#34A853"></path>
        <path d="M6.88 14.363c-.16-.48-.254-.99-.254-1.513s.093-1.033.254-1.513V8.465H3.19c-.64 1.27-1.023 2.7-1.023 4.235s.383 2.965 1.023 4.235l3.69-2.872z" fill="#FBBC05"></path>
        <path d="M12.503 6.133c1.488 0 2.82.513 3.863 1.513l3.15-3.15C17.52.99 15.233 0 12.503 0 9.07 0 5.84 2.242 4.19 5.53l3.69 2.873c.792-2.375 2.965-4.136 5.623-4.136z" fill="#EA4335"></path>
    </svg>
);
export const AppleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={`h-6 w-6 text-slate-900 dark:text-white ${className}`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.228 6.949c.878.01 1.761-.422 2.508-1.093-1.033-.005-2.01.48-2.585 1.093zm1.185-2.615c.825-.972 1.21-2.27 1.09-3.565-1.08.08-2.29.625-3.12 1.59-.69.835-1.25 2.04-1.12 3.245 1.15.11 2.27-.47 3.15-1.27zM12.015 24c-1.39 0-2.48-.75-3.39-1.46-1-.79-1.95-2.2-1.95-3.87 0-1.87 1.25-3.53 3.4-3.53 1.12 0 2.23.63 3.12 1.35.91.73 1.87 2.14 1.87 3.6 0 2.38-1.7 4.91-3.05 4.91zm4.49-8.08c-1.02 0-2.2.66-3.23.66-1.03 0-2.03-.64-3.18-.64-2.17 0-4.15 1.34-4.15 4.14 0 2.89 2.14 5.92 4.41 5.92 1.45 0 2.58-.85 3.53-.85.94 0 2.05.85 3.52.85 2.37 0 4.49-3.05 4.49-6.19 0-2.85-1.8-4.24-3.34-4.24z"></path>
    </svg>
);