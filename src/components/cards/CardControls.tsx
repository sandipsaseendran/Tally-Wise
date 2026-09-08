import React, { useState } from 'react';
import {
  Snowflake,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  Trash2,
  PlusCircle,
  ShieldCheck,
  Palette,
  Sliders,
  DollarSign
} from 'lucide-react';
import { Account } from '../../types';
import { CARD_THEMES } from './InteractiveCard3D';

interface CardControlsProps {
  card: Account;
  currency: string;
  isFrozen: boolean;
  onToggleFreeze: () => void;
  onDeleteCard: () => void;
  onTopUp: (amount: number) => void;
  currentThemeIndex: number;
  onChangeThemeIndex: (index: number) => void;
}

export function CardControls({
  card,
  currency,
  isFrozen,
  onToggleFreeze,
  onDeleteCard,
  onTopUp,
  currentThemeIndex,
  onChangeThemeIndex,
}: CardControlsProps) {
  const [onlinePayments, setOnlinePayments] = useState(true);
  const [nfcPayments, setNfcPayments] = useState(true);
  const [atmWithdrawals, setAtmWithdrawals] = useState(true);
  const [internationalUsage, setInternationalUsage] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('100');

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(topUpAmount);
    if (val > 0) {
      onTopUp(val);
      setShowTopUpModal(false);
      setTopUpAmount('100');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setShowTopUpModal(true)}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-tally-text-primary dark:text-white group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Add Funds</span>
        </button>

        <button
          type="button"
          onClick={onToggleFreeze}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all group ${
            isFrozen
              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500'
              : 'bg-tally-surface-light dark:bg-tally-surface-dark border-tally-border-light dark:border-tally-border-dark hover:border-cyan-500/50 hover:bg-cyan-500/5 text-tally-text-primary dark:text-white'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isFrozen
                ? 'bg-cyan-500 text-white'
                : 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
            }`}
          >
            <Snowflake className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">{isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeThemeIndex((currentThemeIndex + 1) % CARD_THEMES.length)}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-tally-text-primary dark:text-white group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Theme Style</span>
        </button>

        <button
          type="button"
          onClick={onDeleteCard}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-red-500/50 hover:bg-red-500/5 transition-all text-tally-text-primary dark:text-white group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trash2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-red-500">Remove Card</span>
        </button>
      </div>

      {/* Card Theme Picker Pill Options */}
      <div className="bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-tally-primary dark:text-tally-accent" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark">
              Card Skin / Theme
            </h4>
          </div>
          <span className="text-xs font-semibold text-tally-text-primary dark:text-white">
            {CARD_THEMES[currentThemeIndex % CARD_THEMES.length].name}
          </span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {CARD_THEMES.map((theme, idx) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => onChangeThemeIndex(idx)}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap ${
                idx === currentThemeIndex % CARD_THEMES.length
                  ? 'border-tally-primary dark:border-tally-accent bg-tally-primary/10 dark:bg-tally-accent/10 text-tally-text-primary dark:text-white scale-105 shadow-sm'
                  : 'border-tally-border-light dark:border-tally-border-dark hover:border-gray-400 text-tally-text-secondary dark:text-tally-text-secondaryDark'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full ${theme.bg} border border-white/20`} />
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Security & Controls Panel */}
      <div className="bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-tally-border-light dark:border-tally-border-dark pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-display font-bold text-sm text-tally-text-primary dark:text-white">
              Card Controls & Security
            </h3>
          </div>
          <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark font-medium">
            Active Security Policies
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-tally-text-primary dark:text-white">Online Transactions</p>
                <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">E-commerce & Web</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOnlinePayments(!onlinePayments)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                onlinePayments ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-tally-text-primary dark:text-white">Contactless (NFC)</p>
                <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">Apple Pay / Tap & Go</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNfcPayments(!nfcPayments)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                nfcPayments ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-tally-text-primary dark:text-white">ATM Cash Withdrawal</p>
                <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">Physical ATM Access</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAtmWithdrawals(!atmWithdrawals)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                atmWithdrawals ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-tally-text-primary dark:text-white">International Spending</p>
                <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">Cross-border Payments</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInternationalUsage(!internationalUsage)}
              className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                internationalUsage ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <h3 className="font-display font-bold text-lg text-tally-text-primary dark:text-white">Add Funds</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="text-tally-text-secondary hover:text-tally-text-primary dark:text-tally-text-secondaryDark dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase mb-2">
                  Amount to Deposit ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:outline-none focus:border-tally-primary font-bold text-xl text-tally-text-primary dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                {['50', '100', '250', '500'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className="flex-1 py-1.5 rounded-lg border border-tally-border-light dark:border-tally-border-dark text-xs font-bold hover:bg-tally-primary/10 text-tally-text-primary dark:text-white"
                  >
                    +{currency}{amt}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-lg shadow-emerald-500/20"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
