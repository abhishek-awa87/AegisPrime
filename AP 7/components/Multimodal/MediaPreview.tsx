import React from 'react';
import { UploadedFile, AudioFile, VideoFile, PDFFile, ImageFile } from '../../types';
import { getFileType } from '../../utils/fileProcessing';
import ImagePreview from './ImagePreview';
import AudioPreview from './AudioPreview';
import VideoPreview from './VideoPreview';
import PDFPreview from './PDFPreview';

interface MediaPreviewProps {
  file: UploadedFile;
  onRemove: (fileId: string) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ file, onRemove }) => {
    const fileType = getFileType(file.mimeType);

    switch (fileType) {
        case 'image':
            return <ImagePreview file={file as ImageFile} onRemove={onRemove} />;
        case 'audio':
            return <AudioPreview file={file as AudioFile} onRemove={onRemove} />;
        case 'video':
            return <VideoPreview file={file as VideoFile} onRemove={onRemove} />;
        case 'pdf':
            return <PDFPreview file={file as PDFFile} onRemove={onRemove} />;
        default:
            // Fallback for any unsupported type that might slip through
            return (
                <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-lg flex items-center gap-3 text-sm border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
                    <p className="font-medium truncate">Unsupported file: {file.name}</p>
                </div>
            );
    }
};

export default MediaPreview;
