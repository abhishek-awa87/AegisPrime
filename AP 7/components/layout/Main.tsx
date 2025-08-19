import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import ObjectiveStep from '../workflow/ObjectiveStep';
import PaftStep from '../workflow/PaftStep';
import BlueprintStep from '../workflow/BlueprintStep';

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Main: React.FC = () => {
  const { currentStep } = useAppStore();

  return (
    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {currentStep === 'objectiveInput' && <ObjectiveStep />}
            {currentStep === 'paftSelection' && <PaftStep />}
            {currentStep === 'refinementLoop' && <BlueprintStep />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Main;