import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { SettingsIcon } from './icons';
import { motion, useReducedMotion } from 'framer-motion';

const Header: React.FC = () => {
  const { toggleSettings, isFocusMode } = useSettingsStore();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header 
        animate={{ y: isFocusMode ? '-100%' : '0%' }}
        transition={{ ease: 'easeInOut', duration: shouldReduceMotion ? 0 : 0.3 }}
        className="sticky top-0 z-10 p-4 border-b border-gray-700/50 flex items-center justify-between bg-aegis-dark/80 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-3">
        <BrainCircuit className="h-7 w-7 text-aegis-green" />
        <h1 className="text-xl font-semibold text-gray-200">Aegis Prime</h1>
      </div>
      <button 
        onClick={toggleSettings}
        className="p-2 rounded-full hover:bg-aegis-dark-secondary text-gray-400 hover:text-white transition-colors"
        aria-label="Open settings"
    >
        <SettingsIcon />
      </button>
    </motion.header>
  );
};

export default React.memo(Header);