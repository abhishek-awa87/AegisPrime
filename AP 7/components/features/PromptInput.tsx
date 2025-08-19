import React, { useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useSessionStore } from '../../store/sessionStore';
import FileUpload from '../Multimodal/FileUpload';
import MediaPreview from '../Multimodal/MediaPreview';
import URLInput from '../Multimodal/URLInput';
import URLContentPreview from '../Multimodal/URLContentPreview';

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PromptInput: React.FC = () => {
  const { isLoading, generateBlueprint, error } = useAppStore();
  const { 
    prompt, setPrompt, 
    files, removeFile,
    urlContent, removeUrl,
  } = useSessionStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = useCallback(() => {
    generateBlueprint(prompt, files, urlContent);
  }, [generateBlueprint, prompt, files, urlContent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }, [handleGenerate]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Cap height at max-h-60 (15rem or 240px)
      textarea.style.height = `${Math.min(scrollHeight, 240)}px`;
    }
  }, [prompt]);

  const canGenerate = !isLoading && (!!prompt.trim() || files.length > 0 || !!urlContent);
  const showPreviews = files.length > 0 || !!urlContent;

  return (
    <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUpload />
            <URLInput />
        </div>

        {error && !urlContent && ( // Show fetch errors here, but hide if a URL was successfully fetched
             <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                <p><span className="font-semibold">URL Fetch Error:</span> {error}</p>
             </div>
        )}
        
        {showPreviews && (
            <div className="flex flex-col gap-4">
                {urlContent && (
                    <URLContentPreview content={urlContent} onRemove={removeUrl} />
                )}
                {files.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-zinc-600 dark:text-zinc-400">Attached Files</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {files.map(file => (
                                <MediaPreview key={file.id} file={file} onRemove={removeFile} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        <div className="bg-white dark:bg-zinc-900/50 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 p-1.5 focus-within:ring-2 focus-within:ring-accent transition-shadow">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={showPreviews ? "Add a message or ask about the content above..." : "Enter your prompt here..."}
              rows={1}
              className="w-full pl-4 pr-28 py-3 bg-transparent resize-none text-text-light dark:text-text-dark placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none max-h-60"
              aria-label="Prompt input"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-zinc-900 disabled:bg-zinc-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
                aria-label="Generate response"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span>Generating...</span>
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PromptInput;