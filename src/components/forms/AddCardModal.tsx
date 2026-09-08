import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { useStore } from '../../../store/useStore';
import { generateId, getTodayDate } from '../../utils/helpers';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const accounts = useStore((state) => state.accounts);
  const settings = useStore((state) => state.settings);
  const addAccount = useStore((state) => state.addAccount);
  
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<'checking' | 'credit' | 'savings'>('credit');
  const [institution, setInstitution] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addAccount({
      id: generateId(),
      name,
      type,
      balance: Number(balance) || 0,
      currency: settings.currency || 'USD',
      isActive: true,
      institution: institution || 'Personal',
      lastUpdated: getTodayDate(),
      cardNumber: cardNumber || undefined,
      themeIndex: accounts.length % 6,
    });
    
    setName('');
    setBalance('');
    setInstitution('');
    setCardNumber('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Card">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Card Name</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
            placeholder="e.g. Tallywise Premium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors appearance-none"
          >
            <option value="credit">Credit Card</option>
            <option value="checking">Debit / Checking</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Starting Balance</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tally-text-primary dark:text-white font-bold">{settings.currency}</span>
            <input 
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Institution (Optional)</label>
          <input 
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
            placeholder="e.g. Chase"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Last 4 Digits (Optional)</label>
          <input 
            type="text"
            maxLength={4}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-3 rounded-xl bg-tally-surface-hover dark:bg-tally-surface-darkHover border border-transparent focus:border-tally-primary focus:outline-none text-tally-text-primary dark:text-white font-semibold transition-colors"
            placeholder="e.g. 1234"
          />
        </div>

        <button 
          type="submit"
          className="mt-4 w-full py-3 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-bold hover:opacity-90 transition-opacity"
        >
          Add Card
        </button>
      </form>
    </Modal>
  );
}
