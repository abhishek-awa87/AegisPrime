import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useSessionStore } from '../../store/sessionStore';
import MediaPreview from '../Multimodal/MediaPreview';
import URLContentPreview from '../Multimodal/URLContentPreview';
import { ALL_ACCEPTED_MIME_TYPES } from '../../utils/fileProcessing';
import { isValidUrl } from '../../utils/urlProcessing';

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PaperclipIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
);

const ObjectiveStep: React.FC = () => {
    const { isLoadingSuggestions, generatePaftSuggestions, error } = useAppStore();
    const { 
        objective, setObjective,
        targetAI, setTargetAI,
        files, removeFile, addFile,
        urlContent, removeUrl, fetchUrl, setUrl,
    } = useSessionStore();
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleContinue = () => {
        generatePaftSuggestions(objective, targetAI, files, urlContent);
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${Math.min(scrollHeight, 320)}px`; // max-h-80
        }
    }, [objective]);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pastedText = e.clipboardData.getData('text');
        if (isValidUrl(pastedText) && !urlContent) {
            e.preventDefault();
            setUrl(pastedText);
            fetchUrl();
        }
    }, [urlContent, setUrl, fetchUrl]);

    const handleFileChange = (fileList: FileList | null) => {
        if (fileList) Array.from(fileList).forEach(file => addFile(file));
    };
    
    const onDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    }, []);

    const showPreviews = files.length > 0 || !!urlContent;
    const canContinue = !isLoadingSuggestions && (!!objective.trim() || showPreviews);

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">What's your core objective and target AI?</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">This is how the app works: based on these inputs, we'll suggest a strategy to get the best response.</p>
            </div>
            
            {error && <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">{error}</div>}

            <div 
                onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
                className={`bg-white dark:bg-zinc-900/50 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-accent transition-all duration-300 ${isDragging ? 'ring-2 ring-accent border-accent' : ''}`}
            >
                <textarea
                    ref={textareaRef}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    onPaste={handlePaste}
                    placeholder="Core Objective (e.g., Create a marketing plan for a new tech startup)"
                    className="w-full p-4 bg-transparent resize-none text-text-light dark:text-text-dark placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none min-h-[120px] max-h-80 text-lg"
                    aria-label="Core Objective"
                    disabled={isLoadingSuggestions}
                />
                <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-700">
                    <input
                        type="text"
                        value={targetAI}
                        onChange={(e) => setTargetAI(e.target.value)}
                        placeholder="Target AI & Instructions (e.g., Use Gemini 2.5 Pro for deep research)"
                        className="w-full bg-transparent focus:outline-none text-md text-text-light dark:text-text-dark placeholder-zinc-400 dark:placeholder-zinc-500"
                        aria-label="Target AI and Instructions"
                        disabled={isLoadingSuggestions}
                    />
                </div>
                 {showPreviews && (
                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                        <div className="flex flex-col gap-4">
                            {urlContent && <URLContentPreview content={urlContent} onRemove={removeUrl} />}
                            {files.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {files.map(file => <MediaPreview key={file.id} file={file} onRemove={removeFile} />)}
                                </div>
                            )}
                        </div>
                    </div>
                 )}
                 <div className="flex items-center justify-start p-2 border-t border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-2">
                         <input
                            ref={fileInputRef} type="file" multiple
                            accept={ALL_ACCEPTED_MIME_TYPES.join(',')}
                            onChange={(e) => handleFileChange(e.target.files)}
                            className="hidden" disabled={isLoadingSuggestions}
                        />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-zinc-500 hover:text-accent rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Attach files">
                            <PaperclipIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={handleContinue}
                disabled={!canContinue}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-white text-lg font-semibold hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-zinc-900 disabled:bg-zinc-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
                aria-label="Continue to PAFT Strategy"
            >
                {isLoadingSuggestions ? <><LoadingSpinner /><span>Analyzing...</span></> : 'Continue'}
            </button>
        </div>
    );
};

export default ObjectiveStep;