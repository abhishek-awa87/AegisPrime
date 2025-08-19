import React from 'react';
import { VideoAnalysis as VideoAnalysisData } from '../../../types';
import AnalysisCard from './AnalysisCard';

interface VideoAnalysisProps {
    analysis: VideoAnalysisData;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ analysis }) => {
    return (
        <AnalysisCard title="Video Analysis" summary={analysis.summary}>
             <div>
                <h4 className="font-semibold mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                    {analysis.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 text-xs rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold mb-1">Detected Scenes</h4>
                <ul className="list-disc list-inside space-y-1">
                    {analysis.scenes.map(scene => (
                        <li key={scene.timestamp}>
                           <span className="font-mono text-accent dark:text-accent/80">[{scene.timestamp}]</span> {scene.description}
                        </li>
                    ))}
                </ul>
            </div>
        </AnalysisCard>
    );
};

export default VideoAnalysis;