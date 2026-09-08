import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { useStore } from '../../../store/useStore';
import { generateId, getTodayDate } from '../../utils/helpers';

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAccountId?: string;
}

export function WithdrawFundsModal({ isOpen, onClose, defaultAccountId }: WithdrawFundsModalProps) {
  const accounts = useStore((state) => state.accounts);
  const settings = useStore((state) => state.settings);
  const addTransaction = useStore((state) => state.addTransaction);

  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(defaultAccountId || accounts[0]?.id || '');
  const [source, setSource] = useState('Bank Account');

  useEffect(() => {
    if (defaultAccountId) {
      setAccountId(defaultAccountId);
    } else if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [defaultAccountId, isOpen, accounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    addTransaction({
      id: generateId(),
      date: getTodayDate(),
      amount: Number(amount),
      type: 'expense',
      category: 'Withdrawal',
      account: accountId,
      paymentMethod: 'digital',
      description: `Withdrawn to ${source}`,
      recurring: false,
    });

    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Funds">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
            From Account / Card
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors appearance-none"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({settings.currency}{(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
            Withdrawal Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tally-text-primary dark:text-white font-bold">
              {settings.currency}
            </span>
            <input
              type="number"
              step="0.01"
              required
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">
            Destination / Note (Optional)
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
            placeholder="e.g. External Checking, Wire Transfer"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-3 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-bold hover:opacity-90 transition-opacity shadow-md"
        >
          Confirm Withdrawal
        </button>
      </form>
    </Modal>
  );
}
