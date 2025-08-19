import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SessionState } from '../types/session';
import { Persona, Audience, Format, Tone, ResponseItem } from '../types';
import { 
    convertFileToBase64,
    getFileType,
    getAudioVideoMetadata,
    getPDFMetadata,
    MAX_FILE_SIZE_BYTES
} from '../utils/fileProcessing';
import { UploadedFile, AudioMimeType, VideoMimeType, PDFMimeType, ImageMimeType } from '../types/multimodal';
import { processUrl } from '../utils/urlProcessing';
import { useAppStore } from './appStore';
import { analyzeAudio } from '../utils/audioProcessing';
import { analyzeVideo } from '../utils/videoProcessing';
import { analyzePDF } from '../utils/pdfProcessing';

const initialState = {
  // PAFT State
  persona: 'Expert Advisor' as Persona,
  audience: ['General Public'] as Audience[],
  format: 'Bullet Points' as Format,
  tone: 'Friendly' as Tone,
  // Session State
  sessionName: 'Untitled Session',
  objective: '',
  targetAI: '',
  prompt: '',
  files: [] as UploadedFile[],
  isUploadingFile: false,
  url: '',
  isFetchingUrl: false,
  urlContent: null,
  history: [],
  response: null,
  confidenceScore: null,
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setSessionName: (name: string) => set({ sessionName: name }),
      setPersona: (persona: Persona) => set({ persona }),
      toggleAudience: (audience: Audience) => set((state) => {
        const currentAudience = state.audience;
        const newAudience = currentAudience.includes(audience)
          ? currentAudience.filter(a => a !== audience)
          : [...currentAudience, audience];
        return { audience: newAudience.length > 0 ? newAudience : currentAudience };
      }),
      setFormat: (format: Format) => set({ format }),
      setTone: (tone: Tone) => set({ tone }),
      setObjective: (objective: string) => set({ objective }),
      setTargetAI: (targetAI: string) => set({ targetAI }),
      setPrompt: (prompt: string) => set({ prompt }),
      addFile: async (file: File) => {
        set({ isUploadingFile: true });
        const { setError } = useAppStore.getState();
        setError(null);

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(`File "${file.name}" is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
            set({ isUploadingFile: false });
            return;
        }

        const fileType = getFileType(file.type);

        if (fileType === 'unsupported') {
            setError(`File type for "${file.name}" is not supported.`);
            set({ isUploadingFile: false });
            return;
        }

        let tempFile: UploadedFile | null = null;

        try {
            const base64Data = await convertFileToBase64(file);
            const baseFile = {
                id: `${file.name}-${Date.now()}`,
                name: file.name,
                mimeType: file.type,
                data: base64Data,
                size: file.size,
                isAnalyzing: true,
            };

            switch (fileType) {
                case 'audio':
                    const audioMeta = await getAudioVideoMetadata(file);
                    tempFile = { ...baseFile, mimeType: file.type as AudioMimeType, duration: audioMeta.duration };
                    break;
                case 'video':
                    const videoMeta = await getAudioVideoMetadata(file);
                    tempFile = { ...baseFile, mimeType: file.type as VideoMimeType, duration: videoMeta.duration };
                    break;
                case 'pdf':
                    const pdfMeta = await getPDFMetadata(file);
                    tempFile = { ...baseFile, mimeType: file.type as PDFMimeType, pageCount: pdfMeta.pageCount };
                    break;
                case 'image':
                    tempFile = { ...baseFile, mimeType: file.type as ImageMimeType, isAnalyzing: false }; // No analysis for images
                    break;
            }
            
            if (tempFile) {
                set((state) => ({ files: [...state.files, tempFile!] }));

                // Start analysis in the background
                if (tempFile.isAnalyzing) {
                    let analysisResult;
                    const createdFile = tempFile; // closure capture

                    if (getFileType(createdFile.mimeType) === 'audio') {
                        analysisResult = await analyzeAudio(createdFile as any);
                    } else if (getFileType(createdFile.mimeType) === 'video') {
                        analysisResult = await analyzeVideo(createdFile as any);
                    } else if (getFileType(createdFile.mimeType) === 'pdf') {
                        analysisResult = await analyzePDF(createdFile as any);
                    }

                    // Update the specific file with analysis data
                    set(state => ({
                        files: state.files.map(f => f.id === createdFile.id 
                            ? { ...f, isAnalyzing: false, analysis: analysisResult }
                            : f
                        )
                    }));
                }
            }
        } catch (error) {
            console.error("Error adding file:", error);
            const message = error instanceof Error ? error.message : "Failed to process file.";
            setError(message);
        } finally {
            set({ isUploadingFile: false });
        }
      },
      removeFile: (fileId: string) => {
        set((state) => ({ files: state.files.filter((f) => f.id !== fileId) }));
      },
      clearFiles: () => set({ files: [] }),
      
      // URL Actions
      setUrl: (url: string) => set({ url }),
      fetchUrl: async () => {
        const url = get().url;
        if (!url) return;
        set({ isFetchingUrl: true });
        useAppStore.getState().setError(null);
        try {
          const content = await processUrl(url);
          set({ urlContent: content, url: '', isFetchingUrl: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred.';
          useAppStore.getState().setError(message);
          set({ urlContent: null, isFetchingUrl: false });
        }
      },
      removeUrl: () => set({ url: '', urlContent: null }),
      
      setResponse: (item: ResponseItem) => {
          set(state => ({
              response: item.response,
              confidenceScore: item.confidenceScore,
              history: [...state.history, item],
          }));
      },
      clearSession: () => set({ ...initialState }),
    }),
    {
      name: 'aegis-session-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);