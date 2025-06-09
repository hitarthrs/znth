// src/components/AddGoalForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddGoalFormProps {
  level: string;
  parentId?: string | null;
}

export default function AddGoalForm({ level, parentId }: AddGoalFormProps) {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, level, parentId }),
      });
      setTitle('');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error creating goal');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={`Add a new ${level} goal...`}
        className="w-full bg-background p-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {/* A visible submit button can be added here if desired */}
    </form>
  );
}