import React, { useState, useMemo } from 'react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { StatusPill } from '../components/shared/StatusPill';
import { 
  Plus, 
  Info, 
  Trash2, 
  Power, 
  Search, 
  Calendar, 
  Sparkles, 
  Clock, 
  AlertCircle,
  TrendingDown
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AddContractModal } from '../components/forms/AddContractModal';
import { Subscription } from '../types';
import toast from 'react-hot-toast';

const getBrandColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('entertain') || cat.includes('movie') || cat.includes('stream')) return 'bg-red-500';
  if (cat.includes('cloud') || cat.includes('infra') || cat.includes('server')) return 'bg-orange-500';
  if (cat.includes('software') || cat.includes('design') || cat.includes('saas')) return 'bg-pink-500';
  if (cat.includes('util') || cat.includes('internet') || cat.includes('phone')) return 'bg-cyan-500';
  if (cat.includes('music') || cat.includes('audio')) return 'bg-emerald-500';
  return 'bg-blue-500';
};

export function Contracts() {
  const subscriptions = useStore((state) => state.subscriptions);
  const updateSubscription = useStore((state) => state.updateSubscription);
  const deleteSubscription = useStore((state) => state.deleteSubscription);
  const settings = useStore((state) => state.settings);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  // Dynamic calculations
  const totalMonthly = useMemo(() => {
    return subscriptions
      .filter((c) => c.isActive)
      .reduce((sum, c) => {
        if (c.billingCycle === 'yearly') return sum + c.amount / 12;
        if (c.billingCycle === 'weekly') return sum + c.amount * 4.33;
        return sum + c.amount;
      }, 0);
  }, [subscriptions]);

  const activeCount = useMemo(() => {
    return subscriptions.filter((c) => c.isActive).length;
  }, [subscriptions]);

  // Compute upcoming renewals within 7 days
  const upcomingCount = useMemo(() => {
    const today = new Date();
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);
    const todayStr = today.toISOString().split('T')[0];
    const targetStr = in7Days.toISOString().split('T')[0];

    return subscriptions.filter((c) => {
      if (!c.isActive || !c.nextBillingDate) return false;
      return c.nextBillingDate >= todayStr && c.nextBillingDate <= targetStr;
    }).length;
  }, [subscriptions]);

  // Filtered subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = c.isActive;
      if (statusFilter === 'paused') matchesStatus = !c.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  const handleToggleStatus = (contract: Subscription) => {
    const nextStatus = !contract.isActive;
    updateSubscription(contract.id, {
      ...contract,
      isActive: nextStatus,
    });
    toast.success(nextStatus ? `Resumed ${contract.name}` : `Paused ${contract.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete subscription "${name}"?`)) {
      deleteSubscription(id);
      toast.success(`Deleted ${name}`);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8 md:p-10">
      {/* Top Header Row */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
            Contracts & <span className="font-bold">Subscriptions</span>
          </h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2">
            Track and optimize recurring SaaS, software licenses, and utility services.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold hover:opacity-90 transition-opacity shadow-lg self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          New Contract
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            Monthly Recurring Spend
          </span>
          <div className="text-3xl font-display font-bold text-tally-text-primary dark:text-white mt-2">
            {settings.currency}{totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1 block">
            ~{settings.currency}{(totalMonthly * 12).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year normalized
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            Active Subscriptions
          </span>
          <div className="text-3xl font-display font-bold text-tally-text-primary dark:text-white mt-2">
            {activeCount} <span className="text-base font-normal text-tally-text-secondary dark:text-tally-text-secondaryDark">/ {subscriptions.length} total</span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block font-medium">
            {subscriptions.length - activeCount} currently paused
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            Upcoming Renewals (7 Days)
          </span>
          <div className={`text-3xl font-display font-bold mt-2 ${upcomingCount > 0 ? 'text-amber-500' : 'text-tally-text-primary dark:text-white'}`}>
            {upcomingCount}
          </div>
          <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1 block">
            {upcomingCount > 0 ? 'Charge window approaching' : 'No charges in next 7 days'}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
          <input
            type="text"
            placeholder="Search contracts by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-sm font-medium text-tally-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-tally-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white dark:bg-tally-surface-dark p-1 rounded-xl border border-gray-200 dark:border-tally-border-dark">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary shadow-sm'
                : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary'
            }`}
          >
            All ({subscriptions.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'active'
                ? 'bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary shadow-sm'
                : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('paused')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === 'paused'
                ? 'bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary shadow-sm'
                : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary'
            }`}
          >
            Paused ({subscriptions.length - activeCount})
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-tally-surface-dark rounded-3xl border border-gray-100 dark:border-tally-border-dark shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-5 border-b border-gray-100 dark:border-tally-border-dark text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
          <div className="col-span-5 md:col-span-4">Service & Provider</div>
          <div className="col-span-3 md:col-span-3">Billing Amount</div>
          <div className="col-span-4 md:col-span-3">Renewal Date</div>
          <div className="hidden md:block md:col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-tally-border-dark">
          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((contract) => (
              <div
                key={contract.id}
                className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-50/80 dark:hover:bg-tally-surface-darkHover transition-colors group"
              >
                {/* Service Name & Category */}
                <div className="col-span-5 md:col-span-4 flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0 ${getBrandColor(
                      contract.category
                    )}`}
                  >
                    {contract.name[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-tally-text-primary dark:text-white truncate">
                      {contract.name}
                    </span>
                    <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark truncate">
                      {contract.category}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-3 md:col-span-3 flex flex-col justify-center">
                  <span className="font-bold text-tally-text-primary dark:text-white text-base">
                    {contract.currency || settings.currency}
                    {contract.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase">
                    {contract.billingCycle}
                  </span>
                </div>

                {/* Renewal Date */}
                <div className="col-span-4 md:col-span-3 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-tally-text-primary dark:text-white">
                    <Calendar className="w-3.5 h-3.5 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
                    <span>{contract.nextBillingDate || 'Auto-renews'}</span>
                  </div>
                  <div className="mt-1">
                    <StatusPill status={contract.isActive ? 'ACTIVE' : 'FAILED'} size="sm" />
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-tally-border-dark">
                  <button
                    onClick={() => handleToggleStatus(contract)}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                      contract.isActive
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                    }`}
                    title={contract.isActive ? 'Pause subscription' : 'Activate subscription'}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{contract.isActive ? 'Pause' : 'Resume'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(contract.id, contract.name)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    title="Delete contract"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-tally-text-secondary dark:text-tally-text-secondaryDark text-center">
              <Info className="w-8 h-8 opacity-40" />
              <p className="font-semibold text-base">
                {searchQuery || statusFilter !== 'all' ? 'No matching subscriptions' : 'No subscriptions added yet'}
              </p>
              <p className="text-xs max-w-sm">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try clearing your filters or search terms.'
                  : 'Add your recurring software, streaming, and utility subscriptions to automatically track renewal charges.'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 px-5 py-2 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Add Your First Subscription
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AddContractModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Contracts;
