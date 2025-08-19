import React from 'react';
import { AudioAnalysis as AudioAnalysisData } from '../../../types';
import AnalysisCard from './AnalysisCard';

interface AudioAnalysisProps {
    analysis: AudioAnalysisData;
}

const AudioAnalysis: React.FC<AudioAnalysisProps> = ({ analysis }) => {
    const sentimentColor = analysis.sentiment === 'Positive' ? 'text-green-500' : analysis.sentiment === 'Negative' ? 'text-red-500' : 'text-zinc-500';

    return (
        <AnalysisCard title="Audio Analysis" summary={analysis.summary}>
             <div className="flex justify-between">
                <span className="font-semibold">Sentiment:</span>
                <span className={sentimentColor}>{analysis.sentiment}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-semibold">Speakers:</span>
                <span>{analysis.speakers.join(', ')}</span>
            </div>
            <div>
                <h4 className="font-semibold mb-1">Transcription</h4>
                <div className="p-2 bg-zinc-200 dark:bg-zinc-700/50 rounded max-h-24 overflow-y-auto">
                    <p className="whitespace-pre-wrap font-mono text-xs">{analysis.transcription}</p>
                </div>
            </div>
        </AnalysisCard>
    );
};

export default AudioAnalysis;