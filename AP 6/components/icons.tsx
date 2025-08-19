import { BrainCircuit, User, Volume2, Square, SendHorizontal, AlertTriangle, Settings, Sparkles, Clipboard, RefreshCw, X, Download, VolumeX, KeyRound } from 'lucide-react';

interface IconProps {
    className?: string;
    size?: number;
}

export const BotIcon = ({ className, size = 20 }: IconProps) => <BrainCircuit className={className} size={size} />;
export const UserIcon = ({ className, size = 20 }: IconProps) => <User className={className} size={size} />;
export const SpeakIcon = ({ className, size = 20 }: IconProps) => <Volume2 className={className} size={size} />;
export const StopIcon = ({ className, size = 20 }: IconProps) => <Square className={className} size={size} />;
export const SendIcon = ({ className, size = 20 }: IconProps) => <SendHorizontal className={className} size={size} />;
export const ErrorIcon = ({ className, size = 20 }: IconProps) => <AlertTriangle className={className} size={size} />;
export const SettingsIcon = ({ className, size = 20 }: IconProps) => <Settings className={className} size={size} />;
export const SparklesIcon = ({ className, size = 20 }: IconProps) => <Sparkles className={className} size={size} />;
export const ClipboardIcon = ({ className, size = 20 }: IconProps) => <Clipboard className={className} size={size} />;
export const RefreshIcon = ({ className, size = 20 }: IconProps) => <RefreshCw className={className} size={size} />;
export const CloseIcon = ({ className, size = 20 }: IconProps) => <X className={className} size={size} />;
export const DownloadIcon = ({ className, size = 20 }: IconProps) => <Download className={className} size={size} />;
export const SoundOnIcon = ({ className, size = 20 }: IconProps) => <Volume2 className={className} size={size} />;
export const SoundOffIcon = ({ className, size = 20 }: IconProps) => <VolumeX className={className} size={size} />;
export const ApiKeyIcon = ({ className, size = 20 }: IconProps) => <KeyRound className={className} size={size} />;
