// src/app/page.tsx
import prisma from '@/lib/prisma';
import GoalColumn from '@/components/GoalColumn';
import { Goal } from '@prisma/client';

export default async function HomePage() {
  // Fetch ALL goals at once and we'll structure them on the client
  const allGoals = await prisma.goal.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  const lifeGoals = allGoals.filter((g) => g.level === 'LIFE');

  // We are passing the raw data to the client component, which will handle the state.
  return (
    <div className="flex h-screen font-sans">
      {/* Life Goals Column */}
      <GoalColumn
        level="LIFE"
        title="Life Goals"
        goals={lifeGoals}
        allGoals={allGoals} // Pass all goals for context
      />
    </div>
  );
}