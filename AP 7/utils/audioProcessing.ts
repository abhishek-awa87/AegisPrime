import { AudioFile, AudioAnalysis } from '../types';

export const analyzeAudio = (file: AudioFile): Promise<AudioAnalysis> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const summary = `The audio is a brief discussion between two speakers, Alex and Sarah, regarding project timelines. The overall sentiment is positive.`;
            const analysis: AudioAnalysis = {
                transcription: `Alex: "So, how are we looking on the Q3 project deadline?"
Sarah: "Looking good! I think we're actually ahead of schedule."
Alex: "That's fantastic news. Great work, Sarah."
Sarah: "Thanks, Alex! The whole team has been pushing hard."`,
                speakers: ['Alex', 'Sarah'],
                sentiment: 'Positive',
                summary: summary
            };
            resolve(analysis);
        }, 1500 + Math.random() * 1000); // Simulate network and processing delay
    });
};
