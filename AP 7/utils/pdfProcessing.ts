import { PDFFile, PDFAnalysis } from '../types';

export const analyzePDF = (file: PDFFile): Promise<PDFAnalysis> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const summary = `This document is a formal project proposal outlining the scope, objectives, and timeline for the 'Aegis Prime' initiative.`;
            const analysis: PDFAnalysis = {
                summary: summary,
                keyPoints: [
                    'Develop a new AI-powered user interface.',
                    'Integrate with existing backend services.',
                    'Target launch date is Q4 2024.',
                    'Budget allocated is $250,000.',
                ],
                structure: [
                    { heading: '1. Introduction', level: 1 },
                    { heading: '2. Project Scope', level: 1 },
                    { heading: '2.1 Objectives', level: 2 },
                    { heading: '3. Timeline', level: 1 },
                ]
            };
            resolve(analysis);
        }, 1200 + Math.random() * 800); // Simulate network and processing delay
    });
};
