import React, { ReactNode } from 'react';
import ExpandableSection from '../../ui/ExpandableSection';

interface AnalysisCardProps {
    title: string;
    summary: string;
    children: ReactNode;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, summary, children }) => {
    return (
        <div className="mt-2 text-xs border-t border-zinc-200 dark:border-zinc-700 pt-2">
            <p className="px-1 text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold">Analysis:</span> {summary}
            </p>
            <div className="mt-1">
                <ExpandableSection title="View Details">
                    <div className="space-y-2">
                        {children}
                    </div>
                </ExpandableSection>
            </div>
        </div>
    );
};

export default AnalysisCard;