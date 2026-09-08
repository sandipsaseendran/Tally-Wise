import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Palette,
  Clock,
  Snowflake,
  Trash2,
  Lock,
  Smartphone,
  Globe,
  PlusCircle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AddCardModal } from '../components/forms/AddCardModal';
import { AddFundsModal } from '../components/forms/AddFundsModal';
import { InteractiveCardDeck, LUXURY_THEMES } from '../components/cards/InteractiveCardDeck';
import { getCardDigits } from '../utils/helpers';
import EmptyState from '../components/EmptyState';

export function Card() {
  const loadFromStorage = useStore((state) => state.loadFromStorage);
  const accounts = useStore((state) => state.accounts);
  const transactions = useStore((state) => state.transactions);
  const settings = useStore((state) => state.settings);
  const deleteAccount = useStore((state) => state.deleteAccount);
  const updateAccount = useStore((state) => state.updateAccount);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'security' | 'theme' | 'activity'>('security');
  const [isFlipped, setIsFlipped] = useState(false);
  const [frozenCards, setFrozenCards] = useState<Record<string, boolean>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Card security policies state per card
  const [cardSettings, setCardSettings] = useState<Record<string, { online: boolean; nfc: boolean; atm: boolean; intl: boolean }>>({});

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Synchronized card list with Home page WalletStack
  const filteredCards = accounts.filter(
    (acc) => acc.type === 'credit' || acc.type === 'checking' || acc.type === 'cash' || acc.type === 'savings'
  );
  const cards = filteredCards.length > 0 ? filteredCards : accounts;

  // Ensure activeCardIndex is valid
  const safeActiveIndex = Math.min(activeCardIndex, Math.max(0, cards.length - 1));
  const activeCard = cards[safeActiveIndex] || cards[0];

  // Default security settings for active card
  const currentCardSettings = (activeCard && cardSettings[activeCard.id]) || {
    online: true,
    nfc: true,
    atm: true,
    intl: false,
  };

  const handleToggleSetting = (key: 'online' | 'nfc' | 'atm' | 'intl') => {
    if (!activeCard) return;
    setCardSettings((prev) => ({
      ...prev,
      [activeCard.id]: {
        ...currentCardSettings,
        [key]: !currentCardSettings[key],
      },
    }));
  };

  const handleToggleFreeze = () => {
    if (!activeCard) return;
    setFrozenCards((prev) => ({
      ...prev,
      [activeCard.id]: !prev[activeCard.id],
    }));
  };

  const handleChangeTheme = (themeIdx: number) => {
    if (!activeCard) return;
    updateAccount(activeCard.id, {
      ...activeCard,
      themeIndex: themeIdx,
    });
  };

  const handleDeleteCard = (cardId: string) => {
    deleteAccount(cardId);
    setDeleteConfirmId(null);
    if (safeActiveIndex >= cards.length - 1) {
      setActiveCardIndex(Math.max(0, cards.length - 2));
    }
  };

  // Filter transactions for active card
  const cardTransactions = activeCard
    ? transactions.filter(
        (t) => t.account === activeCard.name || t.account === activeCard.id
      )
    : [];

  // Total balance across all accounts matching Dashboard's Total Balance
  const totalAllBalance = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  const isCardFrozen = activeCard ? Boolean(frozenCards[activeCard.id]) : false;
  const currentThemeIdx = activeCard?.themeIndex !== undefined ? activeCard.themeIndex : safeActiveIndex;

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-tally-border-light dark:border-tally-border-dark">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
              Cards
            </h1>
            {cards.length > 0 && (
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                {cards.length} {cards.length === 1 ? 'Card' : 'Cards'} Linked
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
            Linked directly to your wallet cards on the home page.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right mr-2 hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark block">
              Total Home Balance
            </span>
            <span className="text-lg font-bold font-mono text-tally-text-primary dark:text-white">
              {settings.currency}{totalAllBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddCardOpen(true)}
            className="flex items-center justify-center gap-2 bg-tally-primary dark:bg-white text-tally-text-primary dark:text-tally-bg-dark px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm hover:shadow text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Card</span>
          </button>
        </div>
      </div>

      {cards.length === 0 ? (
        /* Empty State */
        <div className="border-2 border-dashed border-tally-border-light dark:border-tally-border-dark rounded-3xl p-12 bg-tally-surface-light dark:bg-tally-surface-dark flex flex-col items-center justify-center text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-tally-primary/10 dark:bg-tally-accent/10 flex items-center justify-center text-tally-primary dark:text-tally-accent mb-4">
            <CreditCard size={32} />
          </div>
          <h2 className="text-xl font-display font-bold text-tally-text-primary dark:text-white mb-2">
            No Cards in Wallet
          </h2>
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mb-6 leading-relaxed">
            Add your physical or virtual debit or credit card to switch cards seamlessly, customize security rules, and view card balances.
          </p>
          <button
            type="button"
            onClick={() => setIsAddCardOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tally-primary dark:bg-white text-tally-text-primary dark:text-tally-bg-dark font-bold text-sm hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Card</span>
          </button>
        </div>
      ) : (
        /* Main Layout: 2 Clean Balanced Columns */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive 3D Card Stack */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            <div className="w-full bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  Card {safeActiveIndex + 1} of {cards.length}
                </span>
                <span className="text-[11px] font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  Total Wallet: <strong className="text-tally-text-primary dark:text-white font-mono">{settings.currency}{totalAllBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </span>
              </div>

              {/* 3D Stacked Deck */}
              <InteractiveCardDeck
                cards={cards}
                activeIndex={safeActiveIndex}
                onSelectIndex={(idx) => {
                  setActiveCardIndex(idx);
                  setIsFlipped(false);
                }}
                currency={settings.currency}
                isFrozen={isCardFrozen}
                themeIndex={currentThemeIdx}
                isFlipped={isFlipped}
                onToggleFlip={() => setIsFlipped(!isFlipped)}
                onToggleFreeze={handleToggleFreeze}
              />
            </div>

            {/* Quick Cards Selector List */}
            {cards.length > 1 && (
              <div className="w-full bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark mb-3">
                  Quick Select Card
                </h3>
                <div className="space-y-2">
                  {cards.map((card, idx) => {
                    const cardThemeIndex = card.themeIndex !== undefined ? card.themeIndex : idx;
                    const theme = LUXURY_THEMES[cardThemeIndex % LUXURY_THEMES.length];
                    const isActive = idx === safeActiveIndex;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => {
                          setActiveCardIndex(idx);
                          setIsFlipped(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isActive
                            ? 'border-tally-primary dark:border-tally-accent bg-tally-primary/10 dark:bg-tally-accent/10 shadow-sm'
                            : 'border-tally-border-light dark:border-tally-border-dark hover:border-gray-400 bg-tally-bg-light dark:bg-tally-bg-dark/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-6 rounded-lg bg-gradient-to-br ${theme.gradient} border border-white/20 flex items-center justify-center text-[9px] font-bold text-white shadow-sm`}>
                            {card.type === 'credit' ? 'CR' : card.type === 'checking' ? 'DB' : 'CS'}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-tally-text-primary dark:text-white block truncate max-w-[140px]">
                              {card.name}
                            </span>
                            <span className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark font-mono">
                              •••• {getCardDigits(card.id, card.cardNumber)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-tally-text-primary dark:text-white block font-mono">
                            {settings.currency}{(card.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {frozenCards[card.id] && (
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                              Frozen
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Unified Card Management Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card Overview Card */}
            <div className="bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 shadow-sm space-y-5">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-display font-bold text-tally-text-primary dark:text-white">
                      {activeCard.name}
                    </h2>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isCardFrozen
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    }`}>
                      {isCardFrozen ? 'Frozen' : 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                    {activeCard.institution || 'TallyWise Financial'} • {activeCard.type === 'credit' ? 'Credit Card' : activeCard.type === 'checking' ? 'Debit Card' : 'Cash Account'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark block">
                    Card Balance
                  </span>
                  <span className="text-2xl sm:text-3xl font-display font-bold text-emerald-500 dark:text-emerald-400 font-mono">
                    {settings.currency}{(activeCard.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-1 border-t border-tally-border-light dark:border-tally-border-dark">
                <button
                  type="button"
                  onClick={() => setIsAddFundsOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Funds to {activeCard.name}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleFreeze}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs border transition-colors ${
                    isCardFrozen
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/20'
                      : 'bg-tally-bg-light dark:bg-tally-bg-dark border-tally-border-light dark:border-tally-border-dark text-tally-text-primary dark:text-white hover:border-cyan-500/40'
                  }`}
                >
                  <Snowflake className="w-4 h-4" />
                  <span>{isCardFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(activeCard.id)}
                  className="p-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  title="Remove card from wallet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clean Segmented Tab Bar */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'security'
                    ? 'bg-tally-primary dark:bg-white text-tally-text-primary dark:text-tally-bg-dark shadow-sm'
                    : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Security & Limits</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'theme'
                    ? 'bg-tally-primary dark:bg-white text-tally-text-primary dark:text-tally-bg-dark shadow-sm'
                    : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Card Appearance</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activity')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'activity'
                    ? 'bg-tally-primary dark:bg-white text-tally-text-primary dark:text-tally-bg-dark shadow-sm'
                    : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Card Activity ({cardTransactions.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 shadow-sm">
              {/* TAB 1: SECURITY & CONTROLS */}
              {activeTab === 'security' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-display font-bold text-tally-text-primary dark:text-white">
                      Card Usage Policies
                    </h3>
                    <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                      Enable or disable payment channels instantly for this card.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Online Payments */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-tally-text-primary dark:text-white">Online Purchases</p>
                          <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">Web & App Checkouts</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSetting('online')}
                        className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                          currentCardSettings.online ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    {/* Contactless */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-tally-text-primary dark:text-white">Contactless (NFC)</p>
                          <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">Tap to pay & Apple Pay</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSetting('nfc')}
                        className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                          currentCardSettings.nfc ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    {/* ATM Withdrawal */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-tally-text-primary dark:text-white">ATM Cash Access</p>
                          <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">Physical ATM cash-out</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSetting('atm')}
                        className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                          currentCardSettings.atm ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    {/* International */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-tally-text-primary dark:text-white">Cross-Border</p>
                          <p className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">International spending</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSetting('intl')}
                        className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                          currentCardSettings.intl ? 'bg-emerald-500 justify-end' : 'bg-gray-400 dark:bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Monthly Limit Bar */}
                  <div className="p-4 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-tally-text-primary dark:text-white">Monthly Spending Limit</span>
                      <span className="font-mono text-tally-text-secondary dark:text-tally-text-secondaryDark">
                        {settings.currency}0 / {settings.currency}5,000.00
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[15%]" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: THEMES & APPEARANCE */}
              {activeTab === 'theme' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-display font-bold text-tally-text-primary dark:text-white">
                      Card Skin & Luxury Gradients
                    </h3>
                    <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                      Changes synchronize across both the Cards tab and the Home page card deck.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {LUXURY_THEMES.map((theme, idx) => {
                      const isSelected = idx === currentThemeIdx;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleChangeTheme(idx)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-tally-primary dark:border-tally-accent bg-tally-primary/10 dark:bg-tally-accent/10 ring-2 ring-tally-primary/40 shadow-sm'
                              : 'border-tally-border-light dark:border-tally-border-dark hover:border-gray-400 bg-tally-bg-light dark:bg-tally-bg-dark/50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${theme.gradient} border border-white/20 shadow-sm shrink-0`} />
                          <div className="truncate">
                            <span className="text-xs font-bold text-tally-text-primary dark:text-white block truncate">
                              {theme.name}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: RECENT ACTIVITY */}
              {activeTab === 'activity' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-display font-bold text-tally-text-primary dark:text-white">
                        Card Transactions
                      </h3>
                      <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                        Activity specifically made using {activeCard.name}
                      </p>
                    </div>
                  </div>

                  {cardTransactions.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-tally-border-light dark:border-tally-border-dark rounded-2xl">
                      <Clock className="w-8 h-8 text-tally-text-secondary dark:text-tally-text-secondaryDark mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark">
                        No transactions recorded for this card yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                      {cardTransactions.map((t) => {
                        const isIncome = t.type === 'income';
                        return (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-3 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark/50 border border-tally-border-light dark:border-tally-border-dark"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                                  isIncome
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-rose-500/10 text-rose-500'
                                }`}
                              >
                                {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-tally-text-primary dark:text-white block">
                                  {t.category || t.description || 'Transaction'}
                                </span>
                                <span className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">
                                  {t.date}
                                </span>
                              </div>
                            </div>

                            <span
                              className={`text-xs font-bold font-mono ${
                                isIncome ? 'text-emerald-500' : 'text-tally-text-primary dark:text-white'
                              }`}
                            >
                              {isIncome ? '+' : '-'}{settings.currency}
                              {Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-tally-text-primary dark:text-white">
              Remove Card?
            </h3>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
              Are you sure you want to remove this card from your wallet? It will also be removed from the home screen card deck.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark font-bold text-xs text-tally-text-primary dark:text-white hover:bg-tally-bg-light dark:hover:bg-tally-bg-dark"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCard(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      <AddCardModal isOpen={isAddCardOpen} onClose={() => setIsAddCardOpen(false)} />

      {/* Add Funds Modal with preselected active card */}
      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        defaultAccountId={activeCard?.id}
      />
    </div>
  );
}
