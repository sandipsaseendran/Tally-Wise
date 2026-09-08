import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { useStore } from '../../../store/useStore';
import { generateId } from '../../utils/helpers';
import { addDays, addMonths, addYears, format } from 'date-fns';
import { ChevronDown } from 'lucide-react';

export const SUPPORTED_CURRENCIES = [
  { symbol: '$', code: 'USD', label: '$ (USD)' },
  { symbol: '₹', code: 'INR', label: '₹ (INR)' },
  { symbol: '€', code: 'EUR', label: '€ (EUR)' },
  { symbol: '£', code: 'GBP', label: '£ (GBP)' },
  { symbol: '¥', code: 'JPY', label: '¥ (JPY)' },
  { symbol: 'C$', code: 'CAD', label: 'C$ (CAD)' },
  { symbol: 'A$', code: 'AUD', label: 'A$ (AUD)' },
  { symbol: 'CHF', code: 'CHF', label: 'CHF' },
  { symbol: 'AED', code: 'AED', label: 'AED' },
];

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddContractModal({ isOpen, onClose }: AddContractModalProps) {
  const addSubscription = useStore((state) => state.addSubscription);
  const settings = useStore((state) => state.settings);
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(settings.currency || '$');
  const [cadence, setCadence] = useState<'monthly' | 'yearly' | 'weekly'>('monthly');
  const [category, setCategory] = useState('Software');

  useEffect(() => {
    if (settings.currency) {
      setCurrency(settings.currency);
    }
  }, [settings.currency, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    let nextDate = new Date();
    if (cadence === 'monthly') nextDate = addMonths(nextDate, 1);
    if (cadence === 'yearly') nextDate = addYears(nextDate, 1);
    if (cadence === 'weekly') nextDate = addDays(nextDate, 7);

    addSubscription({
      id: generateId(),
      name,
      amount: Number(amount),
      currency: currency,
      billingCycle: cadence,
      nextBillingDate: format(nextDate, 'MMM d, yyyy'),
      category: category,
      isActive: true,
      website: '',
    });
    
    setName('');
    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Contract">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
            Service Name
          </label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
            placeholder="e.g. Netflix, AWS, Spotify"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
              Cost
            </label>
            <span className="text-[11px] font-medium text-tally-text-secondary dark:text-tally-text-secondaryDark">
              Selected: <strong className="text-tally-text-primary dark:text-white font-bold">{currency}</strong>
            </span>
          </div>
          
          <div className="relative flex items-center">
            {/* Integrated Currency Selector */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-tally-text-primary dark:text-white font-bold text-xs py-1.5 pl-2.5 pr-6 rounded-lg border border-black/10 dark:border-white/10 focus:outline-none cursor-pointer appearance-none transition-all shadow-sm"
                title="Choose Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option 
                    key={c.code} 
                    value={c.symbol}
                    className="bg-white dark:bg-tally-surface-dark text-tally-text-primary dark:text-white"
                  >
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-tally-text-secondary dark:text-tally-text-secondaryDark absolute right-1.5 pointer-events-none" />
            </div>

            <input 
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-28 pr-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
            Billing Cycle
          </label>
          <select
            value={cadence}
            onChange={(e) => setCadence(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors appearance-none"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
            Category
          </label>
          <input 
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
            placeholder="e.g. Entertainment, Cloud, Software"
          />
        </div>

        <button 
          type="submit"
          className="mt-4 w-full py-3 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-bold hover:opacity-90 transition-opacity shadow-md"
        >
          Create Contract
        </button>
      </form>
    </Modal>
  );
}
