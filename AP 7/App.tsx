
import React, { useState, useEffect, ReactNode } from 'react';
import Header from './components/layout/Header';
import Main from './components/layout/Main';
import { useSettingsStore } from './store/settingsStore';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-4">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p>Please refresh the page and try again.</p>
          <pre className="mt-4 p-2 bg-red-100 rounded text-sm w-full max-w-2xl overflow-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}


function App() {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300">
        <Header />
        <Main />
      </div>
    </ErrorBoundary>
  );
}

export default App;
