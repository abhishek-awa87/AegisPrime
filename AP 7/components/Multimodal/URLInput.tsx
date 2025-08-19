import React, { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useAppStore } from '../../store/appStore';
import { isValidUrl } from '../../utils/urlProcessing';

const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
);

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-zinc-600 dark:text-zinc-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const URLInput: React.FC = () => {
    const { url, setUrl, fetchUrl, isFetchingUrl, urlContent } = useSessionStore();
    const { isLoading: isGenerating } = useAppStore();
    const [isUrlValid, setIsUrlValid] = useState(true);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        setIsUrlValid(isValidUrl(newUrl) || newUrl === '');
    };
    
    const handleFetch = () => {
        if (isValidUrl(url)) {
            fetchUrl();
        } else {
            setIsUrlValid(false);
        }
    };

    const isDisabled = isFetchingUrl || isGenerating || !!urlContent;
    const canFetch = !isDisabled && isValidUrl(url) && url.length > 0;

    return (
        <div className="flex flex-col gap-1">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                    type="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Analyze a URL..."
                    disabled={isDisabled}
                    className={`w-full pl-10 pr-24 py-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg border text-text-light dark:text-text-dark placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60 transition-colors ${isUrlValid ? 'border-zinc-300 dark:border-zinc-700' : 'border-red-500 ring-1 ring-red-500'}`}
                    aria-label="URL Input"
                    aria-invalid={!isUrlValid}
                />
                <button
                    onClick={handleFetch}
                    disabled={!canFetch}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-20 m-1.5 rounded-md bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                >
                    {isFetchingUrl ? <LoadingSpinner /> : 'Fetch'}
                </button>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 pl-2">
                <span className="font-semibold">Note:</span> This is a simulation. Try: https://en.wikipedia.org/wiki/React_(software)
            </p>
        </div>
    );
};

export default URLInput;
