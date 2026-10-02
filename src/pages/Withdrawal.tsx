import React, { useState, useMemo } from 'react';
import EmptyState from '../components/EmptyState';
import { 
  Wallet, 
  ArrowUpRight, 
  Building2, 
  Calendar, 
  Plus, 
  Search, 
  Zap, 
  CheckCircle2, 
  CreditCard,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { StatusPill } from '../components/shared/StatusPill';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { WithdrawFundsModal } from '../components/forms/WithdrawFundsModal';

export function Withdrawal() {
  const transactions = useStore((state) => state.transactions);
  const accounts = useStore((state) => state.accounts);
  const settings = useStore((state) => state.settings);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const withdrawals = useMemo(() => {
    return transactions.filter((t) => t.category === 'Withdrawal');
  }, [transactions]);

  // Financial aggregates
  const totalWithdrawn = useMemo(() => {
    return withdrawals.reduce((sum, w) => sum + Math.abs(w.amount), 0);
  }, [withdrawals]);

  const totalAvailableLiquidity = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  }, [accounts]);

  // Filtered withdrawals
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => {
      const matchesSearch =
        (w.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAccount = selectedAccount === 'all' || w.account === selectedAccount;
      return matchesSearch && matchesAccount;
    });
  }, [withdrawals, searchQuery, selectedAccount]);

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8 md:p-10">
      {/* Top Header Row */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      {/* Page Title & Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
            Payouts & <span className="font-bold">Withdrawals</span>
          </h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2">
            Disburse funds securely to connected bank accounts and external cards.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold hover:opacity-90 transition-opacity shadow-lg self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Request Withdrawal
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            <span>Total Disbursed</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-display font-bold text-tally-text-primary dark:text-white mt-2">
            {settings.currency}{totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
            Lifetime outgoing transfers
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            <span>Available Balance</span>
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-display font-bold text-tally-text-primary dark:text-white mt-2">
            {settings.currency}{totalAvailableLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
            Ready for instant payout
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            <span>Total Requests</span>
            <CheckCircle2 className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-display font-bold text-tally-text-primary dark:text-white mt-2">
            {withdrawals.length}
          </div>
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
            Settled transactions
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            <span>Settlement Speed</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-display font-bold text-emerald-500 mt-2">
            Instant — 24h
          </div>
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
            Encrypted RTP rail active
          </p>
        </div>
      </div>

      {/* Supported Payout Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-tally-surface-dark/60 border border-slate-200/60 dark:border-tally-border-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-tally-text-primary dark:text-white flex items-center gap-1.5">
              <span>Direct Bank Wire</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">ACH/FedNow</span>
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">
              Zero fees for domestic bank deposits
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-tally-surface-dark/60 border border-slate-200/60 dark:border-tally-border-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-tally-text-primary dark:text-white flex items-center gap-1.5">
              <span>Debit Card Push</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Instant</span>
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">
              Funds arrive in under 30 minutes
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-tally-surface-dark/60 border border-slate-200/60 dark:border-tally-border-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-tally-text-primary dark:text-white flex items-center gap-1.5">
              <span>Enterprise Compliance</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">SOC-2</span>
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">
              256-bit TLS bank-grade encryption
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
          <input
            type="text"
            placeholder="Search withdrawals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-sm font-medium text-tally-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-tally-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-sm font-semibold text-tally-text-primary dark:text-white focus:outline-none focus:border-tally-primary transition-colors"
          >
            <option value="all">All Accounts ({accounts.length})</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Withdrawals List */}
      {filteredWithdrawals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <EmptyState
            icon={<Wallet size={36} className="text-tally-text-secondary dark:text-tally-text-secondaryDark" />}
            title={searchQuery || selectedAccount !== 'all' ? 'No Matching Withdrawals' : 'No Withdrawals Yet'}
            description={
              searchQuery || selectedAccount !== 'all'
                ? 'Try adjusting your search query or account filter.'
                : 'You have not made any withdrawal requests yet. Click below to start your first withdrawal.'
            }
          />
          {!searchQuery && selectedAccount === 'all' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              <Plus className="w-4 h-4" />
              Make First Withdrawal
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWithdrawals
            .slice()
            .reverse()
            .map((withdrawal) => {
              const account = accounts.find((a) => a.id === withdrawal.account);
              return (
                <div
                  key={withdrawal.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark hover:border-gray-200 dark:hover:border-tally-border-dark/80 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shrink-0">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-tally-text-primary dark:text-white text-base">
                        {withdrawal.description || 'Withdrawal'}
                      </span>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {withdrawal.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          Source: {account ? account.name : 'Primary Account'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <Clock className="w-3 h-3" /> Settled
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-5 pl-16 md:pl-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-tally-border-dark">
                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-tally-text-primary dark:text-white block">
                        -{settings.currency}{Math.abs(withdrawal.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark">
                        via Electronic Rail
                      </span>
                    </div>
                    <StatusPill status="SUCCESS" size="sm" />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Withdrawal Form Modal */}
      <WithdrawFundsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Withdrawal;
