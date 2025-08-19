
import React, { useState, useEffect } from 'react';
import { AegisLogo } from './Icons';

interface LoadingViewProps {
    messages: string[];
}

export const LoadingView: React.FC<LoadingViewProps> = ({ messages }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.length]);

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
            <AegisLogo className="w-24 h-24 text-blue-400 animate-pulse" />
            <p className="mt-6 text-lg text-gray-300 transition-opacity duration-500">
                {messages[currentMessageIndex]}
            </p>
        </div>
    );
};