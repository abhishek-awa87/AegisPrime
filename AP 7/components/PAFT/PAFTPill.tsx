import React from 'react';

interface PAFTPillProps {
  label: string;
  isSelected: boolean;
  isSuggested?: boolean;
  onClick: () => void;
}

const PAFTPill: React.FC<PAFTPillProps> = ({ label, isSelected, isSuggested, onClick }) => {
  const suggestionClasses = isSuggested && !isSelected
    ? 'ring-2 ring-accent/70 ring-offset-2 ring-offset-primary-light dark:ring-offset-primary-dark'
    : '';

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      className={`relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-zinc-800
        ${
          isSelected
            ? 'bg-accent text-white'
            : 'bg-zinc-200/80 dark:bg-zinc-700/80 text-text-light dark:text-text-dark hover:bg-zinc-300/80 dark:hover:bg-zinc-600/80'
        }
        ${suggestionClasses}
      `}
    >
      {label}
      {isSuggested && !isSelected && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent/80"></span>
        </span>
      )}
    </button>
  );
};

export default React.memo(PAFTPill);