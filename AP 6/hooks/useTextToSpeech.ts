import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useKeyPress } from './useKeyPress';

export const useTextToSpeech = (text: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speechRate, selectedVoiceURI } = useSettingsStore();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isSpeaking || !text) return;
    
    cancel(); // Cancel any previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);

    utterance.voice = selectedVoice || null;
    utterance.rate = speechRate;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        console.error('SpeechSynthesis Error:', e);
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, speechRate, selectedVoiceURI, isSpeaking, cancel]);

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      cancel();
    } else {
      speak();
    }
  }, [isSpeaking, cancel, speak]);

  useKeyPress('t', toggleSpeech);

  // Cleanup on unmount or when text changes
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel, text]);

  return { speak, cancel, isSpeaking, isAvailable: typeof window !== 'undefined' && 'speechSynthesis' in window };
};