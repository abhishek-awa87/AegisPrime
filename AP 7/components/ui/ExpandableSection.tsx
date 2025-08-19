import React, { useState, ReactNode } from 'react';

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
}

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-xl transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 font-medium text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandableSection;
