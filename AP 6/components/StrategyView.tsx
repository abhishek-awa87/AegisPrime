import React from 'react';
import { useAegisStore } from '../store/aegisStore';
import { motion, useReducedMotion } from 'framer-motion';
import { SparklesIcon, SpeakIcon, StopIcon } from './icons';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface StrategyCardProps {
  title: string;
  content: string;
  index: number;
}

const StrategyCard: React.FC<StrategyCardProps> = React.memo(({ title, content, index }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }}
      className="bg-aegis-dark-secondary p-5 rounded-xl border border-gray-700/50"
    >
      <h3 className="font-semibold text-lg text-aegis-green mb-2">{title}</h3>
      <p className="text-gray-300">{content || '...'}</p>
    </motion.div>
  );
});

const StrategyView: React.FC = () => {
  const { strategy, generateBlueprint, state } = useAegisStore();

  const ttsText = React.useMemo(() => {
    if (!strategy) return '';
    return `Strategy Generated. Persona: ${strategy.persona}. Audience: ${strategy.audience}. Format: ${strategy.format}. Tone: ${strategy.tone}.`;
  }, [strategy]);

  const { speak, cancel, isSpeaking } = useTextToSpeech(ttsText);

  if (!strategy) return null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-200">Your Generated Strategy</h2>
        <button
          onClick={isSpeaking ? cancel : speak}
          className="flex items-center gap-1.5 mx-auto text-sm text-gray-400 hover:text-white transition-colors"
          aria-label={isSpeaking ? 'Stop speaking' : 'Read strategy aloud'}
        >
          {isSpeaking ? <StopIcon size={14} /> : <SpeakIcon size={14} />}
          {isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StrategyCard title="Persona" content={strategy.persona} index={0} />
        <StrategyCard title="Audience" content={strategy.audience} index={1} />
        <StrategyCard title="Format" content={strategy.format} index={2} />
        <StrategyCard title="Tone" content={strategy.tone} index={3} />
      </div>
      <div className="flex justify-center pt-4">
        <button
          onClick={generateBlueprint}
          disabled={state === 'generating_blueprint'}
          className="flex items-center gap-2 bg-aegis-green text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 active:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <SparklesIcon />
          {state === 'generating_blueprint' ? 'Generating...' : 'Generate Blueprint'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(StrategyView);
