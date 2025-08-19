import React from 'react';
import { PDFAnalysis as PDFAnalysisData } from '../../../types';
import AnalysisCard from './AnalysisCard';

interface PDFAnalysisProps {
    analysis: PDFAnalysisData;
}

const PDFAnalysis: React.FC<PDFAnalysisProps> = ({ analysis }) => {
    return (
        <AnalysisCard title="PDF Analysis" summary={analysis.summary}>
            <div>
                <h4 className="font-semibold mb-1">Key Points</h4>
                <ul className="list-disc list-inside space-y-1">
                    {analysis.keyPoints.map(point => <li key={point}>{point}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-1">Document Structure</h4>
                 <ul className="space-y-1">
                    {analysis.structure.map(item => (
                        <li key={item.heading} style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}>
                           - {item.heading}
                        </li>
                    ))}
                </ul>
            </div>
        </AnalysisCard>
    );
};

export default PDFAnalysis;