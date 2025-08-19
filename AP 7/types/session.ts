import { UploadedFile } from "./multimodal";
import { PAFTState } from "./paft";
import { ResponseItem } from ".";
import { UrlContent } from './url';

export interface SessionState extends PAFTState {
  sessionName: string;
  setSessionName: (name: string) => void;

  objective: string;
  setObjective: (objective: string) => void;

  targetAI: string;
  setTargetAI: (targetAI: string) => void;

  prompt: string;
  setPrompt: (prompt: string) => void;

  files: UploadedFile[];
  isUploadingFile: boolean;
  addFile: (file: File) => Promise<void>;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  
  // URL State
  url: string;
  isFetchingUrl: boolean;
  urlContent: UrlContent | null;
  setUrl: (url: string) => void;
  fetchUrl: () => Promise<void>;
  removeUrl: () => void;
  
  history: ResponseItem[];
  response: string | null;
  confidenceScore: number | null;
  
  setResponse: (item: ResponseItem) => void;
  clearSession: () => void;
}