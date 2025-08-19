import React from 'react';
import { useAppStore } from '../../store/appStore';
import { useSessionStore } from '../../store/sessionStore';

const RefinementControls: React.FC = () => {
  const { generateBlueprint, isLoading } = useAppStore();
  const { history } = useSessionStore();

  const handleRefine = (refinementInstruction: string) => {
    const lastItem = history.length > 0 ? history[history.length - 1] : null;
    if (!lastItem) return;

    // The new instruction is the prompt, and the context of the previous turn is in the history.
    generateBlueprint(refinementInstruction, [], null);
  };

  const controls = [
    { label: 'Improve', instruction: 'Improve the previous response, focusing on clarity and detail.' },
    { label: 'More Formal', instruction: 'Rewrite the previous response in a more formal and professional tone.' },
    { label: 'Simpler', instruction: 'Explain the previous response using simpler language.' },
  ];

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Refine:</p>
      <div className="flex flex-wrap gap-2">
        {controls.map(({ label, instruction }) => (
          <button
            key={label}
            onClick={() => handleRefine(instruction)}
            disabled={isLoading || history.length === 0}
            className="px-3 py-1 text-sm rounded-md bg-zinc-200 dark:bg-zinc-700 text-text-light dark:text-text-dark hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RefinementControls;