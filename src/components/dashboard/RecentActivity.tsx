import React from 'react';
import { ShoppingBag, Coffee, Car, ArrowUpRight, Info, DollarSign } from 'lucide-react';
import { StatusPill } from '../shared/StatusPill';
import { useStore } from '../../../store/useStore';

import { Link } from 'react-router-dom';

const getCategoryIconAndColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('grocer') || cat.includes('food') || cat.includes('market')) return { icon: ShoppingBag, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  if (cat.includes('transport') || cat.includes('uber') || cat.includes('gas')) return { icon: Car, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
  if (cat.includes('din') || cat.includes('coffee') || cat.includes('restaurant')) return { icon: Coffee, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  if (cat.includes('deposit') || cat.includes('income') || cat.includes('salary')) return { icon: DollarSign, color: 'bg-tally-status-success/20 text-tally-status-successText dark:text-tally-status-successTextDark' };
  return { icon: ArrowUpRight, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
};

export function RecentActivity() {
  const transactions = useStore((state) => state.transactions);
  const settings = useStore((state) => state.settings);
  
  // Get recent 5 transactions, sorted by date (assuming id or date sort)
  const recent = [...transactions].reverse().slice(0, 5);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-tally-text-primary dark:text-white">Recent Activity</h3>
        <div className="flex items-center gap-2">
          {transactions.length > 0 && (
            <button 
              onClick={() => useStore.getState().clearTransactions()}
              className="px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
            >
              Clear all
            </button>
          )}
          <Link to="/transactions" className="px-4 py-1.5 rounded-full bg-tally-surface-light dark:bg-tally-surface-darkHover border border-tally-border-light dark:border-tally-border-dark text-xs font-semibold text-tally-text-primary dark:text-white hover:bg-tally-surface-hover transition-colors shadow-sm">
            View all
          </Link>
        </div>
      </div>
      
      {recent.length > 0 ? (
        <div className="flex flex-col gap-2 mb-6">
          {recent.map(item => {
            const { icon: Icon, color } = getCategoryIconAndColor(item.category);
            return (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-darkHover border border-transparent hover:border-tally-border-light dark:hover:border-tally-border-dark hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-tally-text-primary dark:text-white text-sm">{item.description || item.category}</span>
                    <span className="text-[11px] font-medium text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">{item.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => useStore.getState().deleteTransaction(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all"
                      title="Delete transaction"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                    <span className={`font-semibold text-sm ${item.type === 'income' ? 'text-tally-status-successText dark:text-tally-status-successTextDark' : 'text-tally-text-primary dark:text-white'}`}>
                      {item.type === 'income' ? '+' : '-'}{settings.currency}{Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                  <StatusPill status={'SUCCESS'} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-tally-bg-light dark:bg-tally-surface-dark text-tally-text-secondary dark:text-tally-text-secondaryDark mb-6">
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">No recent transactions</span>
        </div>
      )}
    </div>
  );
}
