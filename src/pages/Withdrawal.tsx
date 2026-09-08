import React from 'react';
import EmptyState from '../components/EmptyState';
import { Wallet, ArrowUpRight, Building2, Calendar } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { StatusPill } from '../components/shared/StatusPill';

export function Withdrawal() {
  const transactions = useStore((state) => state.transactions);
  const accounts = useStore((state) => state.accounts);
  const settings = useStore((state) => state.settings);

  const withdrawals = transactions.filter(t => t.category === 'Withdrawal');

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
          Withdrawals
        </h1>
        <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2">
          View all your withdrawal requests and their statuses.
        </p>
      </div>

      {withdrawals.length === 0 ? (
        <EmptyState 
          icon={<Wallet size={32} />}
          title="No Withdrawals"
          description="You have no recent withdrawal requests."
        />
      ) : (
        <div className="space-y-4">
          {withdrawals.slice().reverse().map(withdrawal => {
            const account = accounts.find(a => a.id === withdrawal.account);
            return (
              <div key={withdrawal.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-darkHover border border-tally-border-light dark:border-tally-border-dark shadow-sm">
                
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shrink-0">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-semibold text-tally-text-primary dark:text-white text-base">
                      {withdrawal.description || 'Withdrawal'}
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {withdrawal.date}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-tally-border-light dark:bg-tally-border-dark"></span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        From: {account ? account.name : 'Unknown Account'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 pl-16 md:pl-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-tally-text-primary dark:text-white">
                      {settings.currency}{Math.abs(withdrawal.amount).toFixed(2)}
                    </span>
                  </div>
                  <StatusPill status="SUCCESS" size="sm" />
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
