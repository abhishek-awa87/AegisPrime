/**
 * AEGIS PRIME - README
 * 
 * Aegis Prime is an ADHD-friendly, accessibility-focused React application designed to help users engineer high-quality prompts for generative AI.
 * This version uses a hardcoded Google Gemini API key for immediate, out-of-the-box functionality.
 * 
 * --- HOW IT WORKS ---
 * 1.  Define Objective: The user provides a high-level goal (e.g., "Create a social media campaign for a new coffee brand").
 * 2.  Generate Strategy: The app calls the Gemini API to generate a structured 4-pillar "Strategy" (Persona, Audience, Format, Tone).
 * 3.  Generate Blueprint: Using the strategy, the app streams a final, detailed prompt blueprint from the Gemini API.
 * 
 * --- ACCESSIBILITY FEATURES ---
 * -   Focus Mode: Hides UI distractions.
 * -   Text-to-Speech (TTS): Reads AI-generated content aloud. Shortcut: 'T'.
 * -   Keyboard Navigation: Fully navigable using a keyboard.
 * -   ARIA Live Announcer: Provides screen reader announcements for important state changes.
 * -   Reduced Motion Compliance: All animations respect OS-level settings.
 */

import React from 'react';
import { useAegisStore } from './store/aegisStore';
import { useSettingsStore } from './store/settingsStore';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { BotIcon } from './components/icons';
import AriaLiveAnnouncer from './components/AriaLiveAnnouncer';
import SettingsPanel from './components/SettingsPanel';
import StrategySkeleton from './components/StrategySkeleton';
import StrategyView from './components/StrategyView';
import BlueprintView from './components/BlueprintView';
import FTUETutorial from './components/FTUETutorial';

const App: React.FC = () => {
  const { state, error, clearError, objective, startWithExample } = useAegisStore();
  const { isFocusMode, isSettingsOpen } = useSettingsStore();
  
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    document.body.classList.toggle('focus-mode', isFocusMode);
  }, [isFocusMode]);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const exampleObjectives = [
    "Draft a marketing email for a new productivity app.",
    "Create a social media campaign for a local coffee brand.",
    "Explain the concept of blockchain to a 10-year-old.",
  ];

  const renderContent = () => {
    switch (state) {
      case 'generating_strategy':
        return <StrategySkeleton />;
      case 'strategy_generated':
        return <StrategyView />;
      case 'generating_blueprint':
      case 'blueprint_generated':
        return <BlueprintView />;
      case 'idle':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center px-4"
          >
            <div className="flex-shrink-0 h-12 w-12 mb-4 rounded-full bg-aegis-green flex items-center justify-center">
              <BotIcon size={28} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-200">Welcome to Aegis Prime</h2>
            <p className="max-w-md mt-2 text-gray-400">
              Start by defining your objective below, or try an example.
            </p>
            <div className="mt-6 w-full max-w-md space-y-2">
                {exampleObjectives.map((example, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        onClick={() => startWithExample(example)}
                        className="w-full text-left text-sm p-3 bg-aegis-dark-secondary rounded-lg border border-gray-700/50 hover:bg-gray-700/70 hover:border-aegis-blue/50 transition-all duration-200"
                    >
                        {example}
                    </motion.button>
                ))}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-aegis-dark text-gray-100 font-sans transition-all duration-300 ${isFocusMode ? 'focus-mode' : ''}`}>
      <AriaLiveAnnouncer />
      
      {isSettingsOpen && <SettingsPanel />}
      <FTUETutorial />
      
      <Header />

      <main className="flex-1 overflow-y-auto flex flex-col p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto my-auto">
           <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="px-4 pb-2 max-w-4xl w-full mx-auto space-y-2">
        {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center text-center bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 rounded-lg p-2 text-sm"
            >
              <WifiOff className="h-4 w-4 mr-2" />
              You are offline. Please check your connection.
            </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg p-3"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </div>

      <div className="p-4 pt-0 max-w-4xl w-full mx-auto">
        {(state === 'idle' || objective) && <ChatInput />}
      </div>
       <footer className="text-center p-4 text-xs text-gray-500">
        <p>Powered by Google Gemini. Built for clarity and focus.</p>
      </footer>
    </div>
  );
};

export default React.memo(App);