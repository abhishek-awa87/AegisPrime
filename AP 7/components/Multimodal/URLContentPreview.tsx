import React from 'react';
import { UrlContent } from '../../types';
import ExpandableSection from '../ui/ExpandableSection';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const ContentAnalysis: React.FC<{ analysis: UrlContent['analysis'] }> = ({ analysis }) => {
    return (
        <div className="space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Content Type:</span>
                <span className="font-medium">{analysis.contentType}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Est. Reading Time:</span>
                <span className="font-medium">{analysis.readingTimeMinutes} min</span>
            </div>
             <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Relevance Score:</span>
                <span className="font-medium">{(analysis.relevanceScore * 100).toFixed(0)}%</span>
            </div>
            <div>
                 <span className="text-zinc-500 dark:text-zinc-400">Key Points:</span>
                 <ul className="list-disc list-inside mt-1 space-y-1">
                    {analysis.keyPoints.map(point => <li key={point}>{point}</li>)}
                 </ul>
            </div>
        </div>
    );
};

const URLContentPreview: React.FC<{ content: UrlContent, onRemove: () => void }> = ({ content, onRemove }) => {
    
    const handleRemove = () => {
        if (window.confirm('Are you sure you want to remove this URL and its content from the context?')) {
            onRemove();
        }
    };

    return (
        <div className="relative group bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-4">
             <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Remove ${content.title}`}
            >
                <XIcon />
            </button>
            
            <div>
                <h3 className="font-bold text-lg text-accent">{content.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Source: {content.source.name} (Credibility: {content.source.credibility})</p>
                <p className="mt-2 text-sm text-text-light dark:text-text-dark">{content.description}</p>
            </div>

            <div className="text-sm">
                <h4 className="font-semibold mb-1">Summary</h4>
                <p className="italic text-zinc-600 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700/50 p-3 rounded-md">{content.summary}</p>
            </div>
            
            <ExpandableSection title="Simulated Content Analysis">
                <ContentAnalysis analysis={content.analysis} />
            </ExpandableSection>
        </div>
    )
};

export default URLContentPreview;
