interface BaseFile {
    id: string;
    name: string;
    mimeType: string;
    data: string; // base64 encoded data
    size: number; // in bytes
    isAnalyzing?: boolean;
}

export type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp';
export type AudioMimeType = 'audio/mpeg' | 'audio/wav' | 'audio/mp4' | 'audio/ogg';
export type VideoMimeType = 'video/mp4' | 'video/quicktime' | 'video/webm' | 'video/x-msvideo';
export type PDFMimeType = 'application/pdf';

// Analysis Data Structures
export interface AudioAnalysis {
    transcription: string;
    speakers: string[];
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    summary: string;
}

export interface VideoAnalysis {
    scenes: { timestamp: string; description: string }[];
    summary: string;
    tags: string[];
}

export interface PDFAnalysis {
    summary: string;
    keyPoints: string[];
    structure: { heading: string; level: number }[];
}


// File Type Interfaces
export interface ImageFile extends BaseFile {
    mimeType: ImageMimeType;
}

export interface AudioFile extends BaseFile {
    mimeType: AudioMimeType;
    duration: number; // in seconds
    analysis?: AudioAnalysis;
}

export interface VideoFile extends BaseFile {
    mimeType: VideoMimeType;
    duration: number; // in seconds
    analysis?: VideoAnalysis;
}

export interface PDFFile extends BaseFile {
    mimeType: PDFMimeType;
    pageCount: number;
    analysis?: PDFAnalysis;
}

export type UploadedFile = ImageFile | AudioFile | VideoFile | PDFFile;