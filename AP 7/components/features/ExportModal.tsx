import React, { useEffect, useCallback } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { jsPDF } from 'jspdf';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const FileJsonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 12.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .5-.5z"></path><path d="M14 12.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .5-.5z"></path><path d="M10 15.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .5-.5z"></path><path d="M14 15.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0 0 1h1a.5.5 0 0 0 .5-.5z"></path></svg>
);
const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
);
const FilePdfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 12h1"></path><path d="M13 12h1"></path><path d="M10 18h4"></path><path d="M10 15h4"></path><path d="M12 12v6"></path></svg>
);


interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const sessionState = useSessionStore.getState();
    const { response, history, sessionName } = sessionState;

    const downloadFile = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const getSafeFilename = useCallback(() => {
        return sessionName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'aegis_prime_export';
    }, [sessionName]);

    const handleExportJson = () => {
        const jsonString = JSON.stringify(sessionState, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        downloadFile(blob, `${getSafeFilename()}.json`);
        onClose();
    };

    const handleExportMarkdown = () => {
        const lastItem = history[history.length - 1];
        const content = `# ${sessionName}\n\n## Prompt\n\n${lastItem?.prompt || 'No prompt found.'}\n\n## Response\n\n${response || 'No response found.'}`;
        const blob = new Blob([content], { type: 'text/markdown' });
        downloadFile(blob, `${getSafeFilename()}.md`);
        onClose();
    };

    const handleExportPdf = () => {
        const lastItem = history[history.length - 1];
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text('Aegis Prime', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text(sessionName, 105, 30, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(14);
        doc.text('Prompt', 20, 45);
        doc.setFontSize(11);
        const promptLines = doc.splitTextToSize(lastItem?.prompt || 'No prompt found.', 170);
        doc.text(promptLines, 20, 52);

        const promptHeight = doc.getTextDimensions(promptLines).h;
        const responseY = 52 + promptHeight + 10;

        doc.setFontSize(14);
        doc.text('Response', 20, responseY);
        doc.setFontSize(11);
        const responseLines = doc.splitTextToSize(response || 'No response found.', 170);
        doc.text(responseLines, 20, responseY + 7);

        doc.save(`${getSafeFilename()}.pdf`);
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    
    const lastItem = history[history.length - 1];
    const canExport = response && lastItem;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-title"
        >
            <div 
                className="bg-primary-light dark:bg-primary-dark rounded-xl shadow-2xl p-6 w-full max-w-md m-4 border border-zinc-200 dark:border-zinc-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                         <h2 id="export-title" className="text-lg font-bold">Export Session</h2>
                         <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose a format to download your session.</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700" aria-label="Close">
                        <XIcon className="w-5 h-5"/>
                    </button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ExportButton icon={<FileJsonIcon />} label="JSON" onClick={handleExportJson} description="Full session data" />
                    <ExportButton icon={<FileTextIcon />} label="Markdown" onClick={handleExportMarkdown} description="Prompt & response" disabled={!canExport}/>
                    <ExportButton icon={<FilePdfIcon />} label="PDF" onClick={handleExportPdf} description="Formatted document" disabled={!canExport}/>
                </div>
            </div>
        </div>
    );
};

interface ExportButtonProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}
const ExportButton: React.FC<ExportButtonProps> = ({ icon, label, description, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-100 dark:disabled:hover:bg-zinc-800/80 transition-colors"
    >
        <div className="text-accent">{icon}</div>
        <div className="text-center">
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
    </button>
)

export default ExportModal;