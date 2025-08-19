import React, { useState } from 'react';
import { useAegisStore } from '../store/aegisStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { ClipboardIcon, SpeakIcon, StopIcon, DownloadIcon, SparklesIcon } from './icons';
import { useNotificationStore } from '../store/notificationStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlueprintView: React.FC = () => {
  const { blueprint, state } = useAegisStore();
  const [hasCopied, setHasCopied] = useState(false);
  const { speak, cancel, isSpeaking } = useTextToSpeech(blueprint);
  const announce = useNotificationStore(s => s.addNotification);

  const handleCopy = () => {
    navigator.clipboard.writeText(blueprint);
    setHasCopied(true);
    announce("Copied to clipboard.");
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleExport = () => {
    try {
      const blob = new Blob([blueprint], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `aegis-blueprint-${date}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      announce("Blueprint exported.");
    } catch (error) {
      console.error("Export failed:", error);
      announce("Error exporting blueprint.");
    }
  };
  
  const isGenerating = state === 'generating_blueprint';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-200">Your Prompt Blueprint</h2>
      <div className="relative bg-aegis-dark-secondary p-5 rounded-xl border border-gray-700/50 min-h-[200px]">
        <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
                onClick={isSpeaking ? cancel : speak}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-600/50 hover:text-white active:bg-gray-700/50 transition-colors"
                aria-label={isSpeaking ? 'Stop speaking (T)' : 'Read text aloud (T)'}
            >
                {isSpeaking ? <StopIcon /> : <SpeakIcon />}
            </button>
            <button
                onClick={handleCopy}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-600/50 hover:text-white active:bg-gray-700/50 transition-colors"
                aria-label="Copy to clipboard"
            >
                <ClipboardIcon />
            </button>
            <button
                onClick={handleExport}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-600/50 hover:text-white active:bg-gray-700/50 transition-colors"
                aria-label="Export as Markdown"
            >
                <DownloadIcon />
            </button>
        </div>
        <div 
          className="prose prose-invert max-w-none text-gray-200"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blueprint}</ReactMarkdown>
        </div>
        {isGenerating && !blueprint && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-aegis-blue">
                <SparklesIcon size={16} />
                <span>Assembling your blueprint...</span>
            </div>
          </div>
        )}
      </div>
       {hasCopied && <p className="text-center text-sm text-aegis-green">Copied to clipboard!</p>}
    </div>
  );
};

export default React.memo(BlueprintView);