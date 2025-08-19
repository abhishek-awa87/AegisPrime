import React from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BotIcon, SparklesIcon } from './icons';

const FTUETutorial: React.FC = () => {
  const { hasSeenTutorial, setHasSeenTutorial } = useSettingsStore();
  const shouldReduceMotion = useReducedMotion();

  const handleClose = () => {
    setHasSeenTutorial(true);
  };

  if (hasSeenTutorial) {
    return null;
  }

  return (
    <AnimatePresence>
      {!hasSeenTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ ease: 'easeInOut', duration: shouldReduceMotion ? 0 : 0.2 }}
            className="bg-aegis-dark-secondary w-full max-w-lg rounded-xl border border-gray-700/50 shadow-2xl p-8 m-4 text-center"
            role="dialog"
            aria-labelledby="ftue-title"
          >
            <div className="flex justify-center mb-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-aegis-green flex items-center justify-center">
                    <BotIcon size={32} />
                </div>
            </div>
            <h2 id="ftue-title" className="text-2xl font-bold text-gray-100 mb-3">Welcome to Aegis Prime!</h2>
            <p className="text-gray-400 mb-6">
              This isn't a normal chatbot. It's a two-step tool to help you craft the perfect prompt.
            </p>
            <div className="space-y-4 text-left">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 mt-1 rounded-full bg-aegis-blue/20 text-aegis-blue flex items-center justify-center font-bold">1</div>
                    <div>
                        <h3 className="font-semibold text-gray-200">Define Your Objective</h3>
                        <p className="text-gray-400 text-sm">Start by telling me what you want to achieve. I'll analyze it and generate a 4-pillar prompt <span className="text-aegis-green font-medium">Strategy</span>.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 mt-1 rounded-full bg-aegis-green/20 text-aegis-green flex items-center justify-center font-bold">2</div>
                    <div>
                        <h3 className="font-semibold text-gray-200">Generate Your Blueprint</h3>
                        <p className="text-gray-400 text-sm">With the strategy in place, I'll construct a final, detailed prompt <span className="text-aegis-blue font-medium">Blueprint</span>, ready for you to use.</p>
                    </div>
                </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-aegis-green text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors"
            >
              <SparklesIcon />
              Let's Get Started
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FTUETutorial;
