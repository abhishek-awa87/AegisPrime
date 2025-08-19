import { VideoFile, VideoAnalysis } from '../types';

export const analyzeVideo = (file: VideoFile): Promise<VideoAnalysis> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const summary = `The video showcases a modern software development workflow, highlighting collaboration and deployment.`;
            const analysis: VideoAnalysis = {
                scenes: [
                    { timestamp: '00:03', description: 'A developer writing code on a laptop in a bright office.' },
                    { timestamp: '00:12', description: 'Close-up on a screen showing code being pushed to a repository.' },
                    { timestamp: '00:21', description: 'Team collaboration meeting around a whiteboard.' },
                ],
                summary: summary,
                tags: ['software development', 'teamwork', 'tech', 'coding', 'deployment'],
            };
            resolve(analysis);
        }, 2000 + Math.random() * 1000); // Simulate network and processing delay
    });
};
