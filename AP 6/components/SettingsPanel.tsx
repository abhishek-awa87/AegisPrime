import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CloseIcon, SoundOnIcon, SoundOffIcon } from './icons';
import { useFocusTrap } from '../hooks/useFocusTrap';

const SettingsPanel: React.FC = () => {
  const {
    isSettingsOpen,
    toggleSettings,
    isFocusMode,
    toggleFocusMode,
    speechRate,
    setSpeechRate,
    selectedVoiceURI,
    setSelectedVoiceURI,
    availableVoices,
    loadVoices,
    isSoundEnabled,
    toggleSound
  } = useSettingsStore();
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, isSettingsOpen);

  useEffect(() => {
    if (isSettingsOpen) {
        loadVoices();
        if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }
  }, [isSettingsOpen, loadVoices]);

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center"
          onClick={toggleSettings}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={panelRef}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ ease: 'easeInOut', duration: shouldReduceMotion ? 0 : 0.2 }}
            className="bg-aegis-dark-secondary w-full max-w-md rounded-xl border border-gray-700/50 shadow-2xl p-6 m-4"
            onClick={(e) => e.stopPropagation()}
            aria-labelledby="settings-title"
          >
            <div className="flex items-center justify-between mb-6">
                <h2 id="settings-title" className="text-xl font-semibold">Settings</h2>
                <button
                    onClick={toggleSettings}
                    className="p-1.5 rounded-full text-gray-400 hover:bg-gray-600/50 hover:text-white transition-colors"
                    aria-label="Close settings"
                >
                    <CloseIcon />
                </button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="focus-mode" className="font-medium text-gray-200">Focus Mode</label>
                        <p className="text-sm text-gray-400">Hides header for fewer distractions.</p>
                    </div>
                    <button
                        id="focus-mode"
                        role="switch"
                        aria-checked={isFocusMode}
                        onClick={toggleFocusMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFocusMode ? 'bg-aegis-green' : 'bg-gray-600'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFocusMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="sound-effects" className="font-medium text-gray-200">Sound Effects</label>
                        <p className="text-sm text-gray-400">Enable/disable UI sounds.</p>
                    </div>
                     <button
                        id="sound-effects"
                        role="switch"
                        aria-checked={isSoundEnabled}
                        onClick={toggleSound}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSoundEnabled ? 'bg-aegis-green' : 'bg-gray-600'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center ${isSoundEnabled ? 'translate-x-6' : 'translate-x-1'}`}>
                            {isSoundEnabled ? <SoundOnIcon size={12} className="text-gray-800" /> : <SoundOffIcon size={12} className="text-gray-800" />}
                        </span>
                    </button>
                </div>
                
                <hr className="border-gray-700/50" />

                {/* TTS Voice Setting */}
                <div>
                    <label htmlFor="tts-voice" className="block text-sm font-medium text-gray-300 mb-2">Text-to-Speech Voice</label>
                    <select
                        id="tts-voice"
                        value={selectedVoiceURI || ''}
                        onChange={(e) => setSelectedVoiceURI(e.target.value)}
                        className="w-full bg-aegis-dark border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-aegis-blue focus:border-aegis-blue"
                    >
                        {availableVoices.length > 0 ? availableVoices.map(voice => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>
                                {voice.name} ({voice.lang})
                            </option>
                        )) : <option disabled>No voices available</option>}
                    </select>
                </div>

                {/* TTS Rate Setting */}
                <div>
                    <label htmlFor="tts-rate" className="block text-sm font-medium text-gray-300 mb-2">Speech Rate: {speechRate.toFixed(1)}x</label>
                    <input
                        id="tts-rate"
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-aegis-green"
                    />
                </div>

                {/* Keyboard Shortcuts */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Keyboard Shortcuts</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <p>Toggle Text-to-Speech</p>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-300 bg-aegis-dark border border-gray-600 rounded-md">T</kbd>
                  </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;