// src/components/GoalColumn.tsx
'use client';

import { useState } from 'react';
import { Goal } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import AddGoalForm from './AddGoalForm';

// Define the props our component accepts
interface GoalColumnProps {
  level: string;
  title: string;
  goals: Goal[];
  parentId?: string | null;
  allGoals: Goal[];
}

export default function GoalColumn({ level, title, goals, parentId = null, allGoals }: GoalColumnProps) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(selectedGoal?.id === goal.id ? null : goal);
  };
  
  const childGoals = selectedGoal
    ? allGoals.filter((g) => g.parentId === selectedGoal.id)
    : [];
  
  const getChildLevel = (currentLevel: string) => {
    const levels = ['LIFE', 'DECADE', 'YEAR', 'MONTH', 'DAY'];
    const currentIndex = levels.indexOf(currentLevel);
    return levels[currentIndex + 1] || 'TASK';
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-shrink-0 w-full md:w-1/3 h-full border-r border-border p-6 flex flex-col"
      >
        <h2 className="text-2xl font-bold tracking-tight mb-4">{title}</h2>
        
        <div className="flex-grow overflow-y-auto space-y-2">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * goals.indexOf(goal) }}
              onClick={() => handleSelectGoal(goal)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedGoal?.id === goal.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-border'
              }`}
            >
              <h3 className="font-semibold">{goal.title}</h3>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4">
          <AddGoalForm level={level} parentId={parentId} />
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedGoal && (
          <GoalColumn
            key={selectedGoal.id} // Important for re-rendering
            level={getChildLevel(level)}
            title={`${getChildLevel(level)} Goals`}
            goals={childGoals}
            parentId={selectedGoal.id}
            allGoals={allGoals}
          />
        )}
      </AnimatePresence>
    </>
  );
}