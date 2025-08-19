import React from 'react';
import { PDFFile } from '../../types';
import { XIcon, PDFIcon } from './SharedIcons';
import PDFAnalysis from './analysis/PDFAnalysis';

interface PDFPreviewProps {
  file: PDFFile;
  onRemove: (fileId: string) => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ file, onRemove }) => {
    return (
        <div className="relative group bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg flex flex-col gap-2 text-sm border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded flex-shrink-0">
                    <PDFIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div className="flex-grow truncate">
                    <p className="font-medium text-text-light dark:text-text-dark truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{file.pageCount} page{file.pageCount > 1 ? 's' : ''}</p>
                </div>
            </div>

            {file.isAnalyzing && (
                <div className="text-xs text-center text-zinc-500 dark:text-zinc-400 animate-pulse py-1">Analyzing...</div>
            )}
            
            {file.analysis && <PDFAnalysis analysis={file.analysis} />}
            
            <button
                onClick={() => onRemove(file.id)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Remove ${file.name}`}
            >
                <XIcon />
            </button>
        </div>
    );
};

export default PDFPreview;