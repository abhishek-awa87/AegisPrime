import React from 'react';
import { useAppStore } from '../../store/appStore';
import { useSessionStore } from '../../store/sessionStore';
import PAFTSelector from '../PAFT/PAFTSelector';

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PaftStep: React.FC = () => {
  const { isLoading, generateBlueprint, error } = useAppStore();
  const { objective, files, urlContent } = useSessionStore();

  const handleGenerate = () => {
    generateBlueprint(objective, files, urlContent);
  };

  return (
    <div className="flex flex-col gap-6">
        <div className="text-center">
            <h2 className="text-2xl font-bold">Step 2: Choose Your Strategy</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">The AI has suggested the following strategies. Select one from each category.</p>
        </div>
      
        {error && <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">{error}</div>}

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-xl p-4">
            <PAFTSelector />
        </div>

        <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-white text-lg font-semibold hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-zinc-900 disabled:bg-zinc-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
            aria-label="Generate Blueprint"
        >
            {isLoading ? <><LoadingSpinner /><span>Generating...</span></> : 'Generate Blueprint'}
        </button>
    </div>
  );
};

export default PaftStep;