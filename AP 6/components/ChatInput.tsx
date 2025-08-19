import React, { useState, useEffect, useRef } from 'react';
import { useAegisStore } from '../store/aegisStore';
import { SendIcon, RefreshIcon } from './icons';
import { AnimatePresence, motion } from 'framer-motion';

const ChatInput: React.FC = () => {
  const [text, setText] = useState('');
  const { generateStrategy, reset, state } = useAegisStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = state === 'generating_strategy' || state === 'generating_blueprint';
  const isIdle = state === 'idle';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      generateStrategy(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleReset = () => {
    setText('');
    reset();
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {!isIdle && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleReset}
              className="absolute -top-14 right-0 flex items-center gap-2 text-sm bg-aegis-dark-secondary px-3 py-1.5 rounded-lg border border-gray-600/50 hover:bg-gray-700 active:bg-gray-800 transition-colors"
              aria-label="Start Over"
            >
              <RefreshIcon />
              Start Over
            </motion.button>
        )}
      </AnimatePresence>
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-end bg-aegis-dark-secondary rounded-xl p-2 border border-gray-600/50 focus-within:border-aegis-blue transition-all`}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isIdle ? "Type your objective here..." : "Aegis is generating..."}
          className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none max-h-48 p-2 leading-tight"
          rows={1}
          disabled={!isIdle || isLoading}
          aria-disabled={!isIdle || isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim() || !isIdle}
          className="ml-2 flex-shrink-0 p-2 rounded-full bg-aegis-blue disabled:bg-gray-600 disabled:cursor-not-allowed text-white hover:bg-blue-500 active:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-aegis-dark-secondary focus:ring-blue-400"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
