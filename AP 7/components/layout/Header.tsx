import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { useSessionStore } from '../../store/sessionStore';

const Header: React.FC = () => {
  const { sessionName, setSessionName } = useSessionStore();
  
  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-200 dark:border-zinc-800 bg-primary-light/80 dark:bg-primary-dark/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent flex-shrink-0">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
            <h1 className="text-xl font-semibold text-text-light dark:text-text-dark hidden sm:block">Aegis Prime</h1>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:block">|</span>
            <input 
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="bg-transparent text-lg font-medium text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent rounded-md px-2 py-1 w-48"
              aria-label="Session Name"
              placeholder="Untitled Session"
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;