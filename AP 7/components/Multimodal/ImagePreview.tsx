import React from 'react';
import { ImageFile } from '../../types';
import { XIcon } from './SharedIcons';

interface ImagePreviewProps {
  file: ImageFile;
  onRemove: (fileId: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove }) => {
    return (
        <div className="relative group bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg flex items-center gap-3 text-sm border border-zinc-200 dark:border-zinc-700">
            <img src={`data:${file.mimeType};base64,${file.data}`} alt={file.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
            <div className="flex-grow truncate">
                <p className="font-medium text-text-light dark:text-text-dark truncate">{file.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{Math.round(file.size / 1024)} KB</p>
            </div>
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

export default ImagePreview;
