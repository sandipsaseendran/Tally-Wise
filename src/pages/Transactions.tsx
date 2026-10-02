import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ShoppingBag, 
  Car, 
  Coffee, 
  DollarSign, 
  ArrowUpRight, 
  Edit2, 
  Trash2, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  SlidersHorizontal,
  Wallet
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import Modal from '../components/Modal';
import { generateId, getTodayDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { StatusPill } from '../components/shared/StatusPill';

const getCategoryIconAndColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('grocer') || cat.includes('food') || cat.includes('market'))
    return { icon: ShoppingBag, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  if (cat.includes('transport') || cat.includes('uber') || cat.includes('gas'))
    return { icon: Car, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
  if (cat.includes('din') || cat.includes('coffee') || cat.includes('restaurant'))
    return { icon: Coffee, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  if (cat.includes('deposit') || cat.includes('income') || cat.includes('salary') || cat.includes('withdrawal'))
    return { icon: DollarSign, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
  return { icon: ArrowUpRight, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
};

const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Salary',
  'Investments',
  'Freelance',
  'Healthcare',
  'Withdrawal',
  'Other',
];

const Transactions = () => {
  const { transactions, settings, accounts, categories, addTransaction, updateTransaction, deleteTransaction } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const defaultAccountName = accounts[0]?.name || 'Primary Checking';

  const initialForm = {
    date: getTodayDate(),
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    account: defaultAccountName,
    description: '',
  };

  const [formData, setFormData] = useState<any>(initialForm);

  // Financial statistics
  const totalIncome = useMemo(() => {
    return transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  const netCashflow = totalIncome - totalExpense;

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.account || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;

        return matchesSearch && matchesType && matchesCat;
      })
      .slice()
      .reverse();
  }, [transactions, searchQuery, typeFilter, selectedCategory]);

  const openAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (id: string) => {
    const t = transactions.find((x) => x.id === id);
    if (!t) return;
    setEditingId(id);
    setFormData({
      date: t.date,
      amount: String(Math.abs(t.amount)),
      type: t.type,
      category: t.category,
      account: t.account,
      description: t.description,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const payload = {
      id: editingId || generateId(),
      date: String(formData.date || getTodayDate()),
      amount: parsedAmount,
      type: (formData.type as 'income' | 'expense') || 'expense',
      category: String(formData.category || 'Other'),
      account: String(formData.account || defaultAccountName),
      paymentMethod: 'digital' as const,
      description: String(formData.description || ''),
      recurring: false,
    };

    if (editingId) {
      updateTransaction(editingId, payload as any);
      toast.success('Transaction updated');
    } else {
      addTransaction(payload as any);
      toast.success('Transaction added');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8 md:p-10 w-full">
      {/* Top Header Row */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
            Transactions & <span className="font-bold">Ledger</span>
          </h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2">
            Complete synchronized financial activity across all your payment methods.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold hover:opacity-90 transition-opacity shadow-md self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            <span>Total Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            +{settings.currency}{totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            <span>Total Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-display font-bold text-rose-600 dark:text-rose-400 mt-2">
            -{settings.currency}{totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wider uppercase">
            <span>Net Cashflow</span>
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <div className={`text-2xl font-display font-bold mt-2 ${netCashflow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {netCashflow >= 0 ? '+' : '-'}{settings.currency}{Math.abs(netCashflow).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
          <input
            type="text"
            placeholder="Search by description, account, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-sm font-medium text-tally-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-tally-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Type Filter */}
          <div className="flex items-center bg-white dark:bg-tally-surface-dark p-1 rounded-xl border border-gray-200 dark:border-tally-border-dark">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                typeFilter === 'all'
                  ? 'bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary'
                  : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-emerald-500'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                typeFilter === 'expense'
                  ? 'bg-rose-600 text-white'
                  : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-rose-500'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-xs font-semibold text-tally-text-primary dark:text-white focus:outline-none focus:border-tally-primary transition-colors"
          >
            <option value="all">All Categories</option>
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-2.5 max-w-5xl">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-tally-surface-dark rounded-3xl border border-gray-100 dark:border-tally-border-dark p-8">
            <p className="font-semibold text-lg text-tally-text-primary dark:text-white">No transactions found</p>
            <p className="text-sm text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
              {searchQuery || typeFilter !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Click "Add Transaction" above to log your first record.'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((t: any) => {
            const { icon: Icon, color } = getCategoryIconAndColor(t.category);
            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-4.5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-gray-100 dark:border-tally-border-dark hover:border-gray-200 dark:hover:border-tally-border-dark/80 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-tally-text-primary dark:text-white text-base truncate">
                      {t.description || t.category}
                    </span>
                    <span className="text-xs font-medium text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">
                      {t.date} • <span className="font-semibold">{t.category}</span> • {t.account}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`font-display font-bold text-base ${
                        t.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-tally-text-primary dark:text-white'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {settings.currency}
                      {Math.abs(t.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <StatusPill status={'SUCCESS'} size="sm" />
                  </div>

                  {/* Action Buttons - Visible on Hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(t.id)}
                      className="p-2 rounded-xl bg-gray-50 dark:bg-tally-surface-darkHover text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-primary dark:hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Transaction' : 'Add Transaction'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Date
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-darkHover border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors"
              value={formData.date as string}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Amount ({settings.currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-darkHover border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors"
              value={formData.amount}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
                Type
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-darkHover border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors"
                value={formData.type as string}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, type: e.target.value }))}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-darkHover border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors"
                value={formData.category}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
              >
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Account / Card
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-darkHover border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors"
              value={formData.account}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, account: e.target.value }))}
            >
              {accounts.length > 0 ? (
                accounts.map((acc) => (
                  <option key={acc.id} value={acc.name}>
                    {acc.name} ({settings.currency}{(acc.balance || 0).toLocaleString()})
                  </option>
                ))
              ) : (
                <option value="Primary Checking">Primary Checking</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
              Description / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery store, Coffee with client"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-darkHover border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors"
              value={formData.description as string}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-3.5 rounded-xl bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            {editingId ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
