import React from 'react';
import { SparklesIcon } from './icons';

const SkeletonCard: React.FC = () => (
  <div className="bg-aegis-dark-secondary p-4 rounded-lg animate-pulse">
    <div className="h-4 bg-gray-600 rounded w-1/3 mb-3"></div>
    <div className="h-3 bg-gray-700 rounded w-full"></div>
    <div className="h-3 bg-gray-700 rounded w-5/6 mt-2"></div>
  </div>
);

const StrategySkeleton: React.FC = () => {
  return (
    <div>
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-aegis-dark-secondary text-aegis-green border border-aegis-green/30 rounded-full px-4 py-1.5 text-sm">
            <SparklesIcon size={16} />
            <span>Crafting your 4-pillar strategy...</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

export default StrategySkeleton;
