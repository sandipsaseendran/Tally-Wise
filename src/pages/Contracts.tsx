import React, { useState } from 'react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { StatusPill } from '../components/shared/StatusPill';
import { Plus, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AddContractModal } from '../components/forms/AddContractModal';

const getBrandColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('entertain') || cat.includes('movie')) return 'bg-red-500';
  if (cat.includes('cloud') || cat.includes('infra')) return 'bg-orange-500';
  if (cat.includes('software') || cat.includes('design')) return 'bg-pink-500';
  return 'bg-blue-500';
};

export function Contracts() {
  const subscriptions = useStore((state) => state.subscriptions);
  const settings = useStore((state) => state.settings);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalMonthly = subscriptions.filter(c => c.billingCycle === 'monthly').reduce((sum, c) => sum + c.amount, 0);
  const activeCount = subscriptions.filter(c => c.isActive).length;

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      {/* Top Header Row */}
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
            Contracts & <span className="font-bold">Subscriptions</span>
          </h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2">Manage your recurring payments and active services.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Contract
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark">
          <span className="text-sm font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wide uppercase">Monthly Spend</span>
          <div className="text-4xl font-display font-bold text-tally-text-primary dark:text-white mt-2">
            {settings.currency}{totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark">
          <span className="text-sm font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wide uppercase">Active Contracts</span>
          <div className="text-4xl font-display font-bold text-tally-text-primary dark:text-white mt-2">{activeCount}</div>
        </div>
        <div className="p-6 rounded-3xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark">
          <span className="text-sm font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wide uppercase">Upcoming (7 days)</span>
          <div className="text-4xl font-display font-bold text-tally-text-primary dark:text-white mt-2">0</div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-tally-surface-light dark:bg-tally-surface-dark rounded-3xl border border-tally-border-light dark:border-tally-border-dark overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-6 border-b border-tally-border-light dark:border-tally-border-dark text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
          <div className="col-span-2">Service</div>
          <div>Amount</div>
          <div>Next Billing</div>
          <div className="text-right">Status</div>
        </div>
        
        <div className="flex flex-col">
          {subscriptions.length > 0 ? subscriptions.map((contract) => (
            <div key={contract.id} className="grid grid-cols-5 gap-4 p-6 items-center border-b border-tally-border-light dark:border-tally-border-dark last:border-0 hover:bg-tally-bg-light dark:hover:bg-tally-surface-darkHover transition-colors cursor-pointer group">
              <div className="col-span-2 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${getBrandColor(contract.category)}`}>
                  {contract.name[0]?.toUpperCase() || 'S'}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-tally-text-primary dark:text-white">{contract.name}</span>
                  <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">{contract.category}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-bold text-tally-text-primary dark:text-white">
                  {contract.currency || settings.currency}{contract.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">{contract.billingCycle.toUpperCase()}</span>
              </div>
              <div className="flex items-center text-sm font-medium text-tally-text-primary dark:text-white">
                {contract.nextBillingDate}
              </div>
              <div className="flex justify-end items-center">
                <StatusPill status={contract.isActive ? 'ACTIVE' : 'FAILED'} />
              </div>
            </div>
          )) : (
            <div className="p-8 flex items-center justify-center gap-2 text-tally-text-secondary dark:text-tally-text-secondaryDark">
              <Info className="w-5 h-5" />
              <span>No contracts added yet. Create one to get started!</span>
            </div>
          )}
        </div>
      </div>
      
      <AddContractModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
