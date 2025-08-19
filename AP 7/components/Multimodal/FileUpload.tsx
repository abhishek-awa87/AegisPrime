import React, { useCallback, useState, useRef } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useAppStore } from '../../store/appStore';
import { ALL_ACCEPTED_MIME_TYPES, MAX_FILE_SIZE_MB } from '../../utils/fileProcessing';

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);


const FileUpload: React.FC = () => {
    const { addFile, isUploadingFile } = useSessionStore();
    const { isLoading: isGenerating } = useAppStore();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files) {
            Array.from(files).forEach(file => {
                // Validation is now handled inside the addFile action in the store
                addFile(file);
            });
        }
    };
    
    const isDisabled = isUploadingFile || isGenerating;
    
    const onDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(!isDisabled) setIsDragging(true);
    }, [isDisabled]);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if(!isDisabled) handleFileChange(e.dataTransfer.files);
    }, [isDisabled]);

    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 flex flex-col items-center justify-center
                ${isDisabled ? 'cursor-not-allowed bg-zinc-50 dark:bg-zinc-800/50 opacity-70' : ''}
                ${isDragging ? 'border-accent bg-accent/10' : 'border-zinc-300 dark:border-zinc-700 hover:border-accent/70'}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALL_ACCEPTED_MIME_TYPES.join(',')}
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
                disabled={isDisabled}
            />
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
                <UploadIcon className="w-8 h-8"/>
                <p className="font-medium">
                    {isUploadingFile ? 'Processing files...' : (
                        <>
                        Drag & drop files, or <button type="button" onClick={onButtonClick} disabled={isDisabled} className="text-accent font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded disabled:cursor-not-allowed disabled:text-zinc-400 disabled:no-underline">browse</button>
                        </>
                    )}
                </p>
                <p className="text-xs">Image, Audio, Video, PDF (Max {MAX_FILE_SIZE_MB}MB)</p>
            </div>
        </div>
    );
};

export default FileUpload;