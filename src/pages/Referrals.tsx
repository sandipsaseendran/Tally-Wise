import React from 'react';
import EmptyState from '../components/EmptyState';
import { Users } from 'lucide-react';

export function Referrals() {
  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
          Referrals
        </h1>
      </div>
      <EmptyState 
        icon={<Users size={32} />}
        title="No Referrals"
        description="Invite your friends and earn rewards. You haven't referred anyone yet."
      />
    </div>
  );
}
