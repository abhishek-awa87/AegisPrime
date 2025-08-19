import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useSessionStore } from '../../store/sessionStore';
import CopyButton from '../ui/CopyButton';
import RefinementControls from './RefinementControls';
import ExportModal from './ExportModal';
import { GroundingSource } from '../../types';

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full"></div>
    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
  </div>
);

const SourcesDisplay: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => (
    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <h3 className="text-sm font-semibold mb-2 text-zinc-600 dark:text-zinc-400">Sources</h3>
        <ul className="space-y-2">
            {sources.map((source, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                   <span className="text-zinc-400 dark:text-zinc-500">{index + 1}.</span>
                   <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                       {source.title || source.uri}
                   </a>
                </li>
            ))}
        </ul>
    </div>
);


const ConfidenceBar: React.FC<{ score: number | null }> = ({ score }) => {
    if (score === null) return null;
    const percentage = score * 100;
    const barColor =
      percentage >= 80
        ? 'bg-green-500'
        : percentage >= 50
        ? 'bg-yellow-500'
        : 'bg-red-500';
  
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Confidence Score</span>
          <span className="font-semibold">{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
          <div
            className={`${barColor} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
};

const ExportIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);


const ResponseDisplay: React.FC = () => {
  const { isLoading, error } = useAppStore();
  const { response, confidenceScore, history } = useSessionStore();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const latestResponse = history.length > 0 ? history[history.length - 1] : null;

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="font-semibold">An error occurred:</p>
          <p>{error}</p>
        </div>
      );
    }

    if (response) {
      return (
        <>
            <div className="relative">
            <CopyButton textToCopy={response} />
            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
            </div>
            <ConfidenceBar score={confidenceScore} />
            {latestResponse?.sources && latestResponse.sources.length > 0 && (
                <SourcesDisplay sources={latestResponse.sources} />
            )}
            <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between gap-4">
                    <RefinementControls />
                    <button 
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-zinc-200 dark:bg-zinc-700 text-text-light dark:text-text-dark hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Export session"
                    >
                        <ExportIcon className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>
            </div>
            <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </>
      );
    }

    return (
      <div className="text-center text-zinc-500 dark:text-zinc-400">
        <p>Your AI-generated response will appear here.</p>
        <p className="text-sm">Enter a prompt above and click "Generate".</p>
      </div>
    );
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 min-h-[150px] flex items-center justify-center transition-colors">
      <div className="w-full text-text-light dark:text-text-dark">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResponseDisplay;