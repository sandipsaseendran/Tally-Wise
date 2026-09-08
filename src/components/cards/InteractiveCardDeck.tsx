import React, { useState } from 'react';
import {
  Wifi,
  Copy,
  Check,
  Eye,
  EyeOff,
  Snowflake,
  RotateCw,
  CreditCard as CardIcon,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Account } from '../../types';
import { getCardDigits, getCardFullNumber } from '../../utils/helpers';

export interface CardTheme {
  id: string;
  name: string;
  gradient: string;
  border: string;
  text: string;
  muted: string;
  badge: string;
  accent: string;
}

export const LUXURY_THEMES: CardTheme[] = [
  {
    id: 'obsidian',
    name: 'Midnight Obsidian',
    gradient: 'from-[#0B0F19] via-[#111827] to-[#1E293B]',
    border: 'border-slate-700/60',
    text: 'text-white',
    muted: 'text-slate-400',
    badge: 'bg-slate-800/90 text-slate-200 border-slate-600/50',
    accent: '#38BDF8',
  },
  {
    id: 'violet',
    name: 'Royal Amethyst',
    gradient: 'from-[#1E1035] via-[#311A54] to-[#170E2B]',
    border: 'border-purple-500/40',
    text: 'text-white',
    muted: 'text-purple-300/70',
    badge: 'bg-purple-900/80 text-purple-200 border-purple-500/40',
    accent: '#C084FC',
  },
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    gradient: 'from-[#062419] via-[#0D402B] to-[#041710]',
    border: 'border-emerald-500/40',
    text: 'text-white',
    muted: 'text-emerald-300/70',
    badge: 'bg-emerald-900/80 text-emerald-200 border-emerald-500/40',
    accent: '#34D399',
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    gradient: 'from-[#2B101D] via-[#4A1931] to-[#1F0C15]',
    border: 'border-pink-500/40',
    text: 'text-white',
    muted: 'text-pink-300/70',
    badge: 'bg-pink-900/80 text-pink-200 border-pink-500/40',
    accent: '#FB7185',
  },
  {
    id: 'amber',
    name: 'Sunset Gold',
    gradient: 'from-[#2E1805] via-[#4D2808] to-[#1F1003]',
    border: 'border-amber-500/40',
    text: 'text-white',
    muted: 'text-amber-300/70',
    badge: 'bg-amber-900/80 text-amber-200 border-amber-500/40',
    accent: '#FBBF24',
  },
  {
    id: 'ocean',
    name: 'Deep Pacific',
    gradient: 'from-[#081C30] via-[#0E2E4F] to-[#051321]',
    border: 'border-cyan-500/40',
    text: 'text-white',
    muted: 'text-cyan-300/70',
    badge: 'bg-cyan-900/80 text-cyan-200 border-cyan-500/40',
    accent: '#22D3EE',
  },
];

interface InteractiveCardDeckProps {
  cards: Account[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  currency: string;
  isFrozen: boolean;
  themeIndex: number;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onToggleFreeze: () => void;
}

export function InteractiveCardDeck({
  cards,
  activeIndex,
  onSelectIndex,
  currency,
  isFrozen,
  themeIndex,
  isFlipped,
  onToggleFlip,
  onToggleFreeze,
}: InteractiveCardDeckProps) {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeCard = cards[activeIndex] || cards[0];
  const effectiveThemeIndex = activeCard.themeIndex !== undefined ? activeCard.themeIndex : themeIndex;
  const theme = LUXURY_THEMES[effectiveThemeIndex % LUXURY_THEMES.length];
  const last4 = getCardDigits(activeCard.id, activeCard.cardNumber);
  const fullCardNumber = getCardFullNumber(activeCard.id, last4);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullCardNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCycle = () => {
    if (cards.length > 1) {
      onSelectIndex((activeIndex + 1) % cards.length);
    }
  };

  // Reorder cards so active card is in front, next cards stacked behind
  const displayCards = [
    ...cards.slice(activeIndex),
    ...cards.slice(0, activeIndex),
  ];

  // Visual stack classes like home screen but larger and smoother
  const STACK_STYLES = [
    {
      zIndex: 30,
      transform: 'translateY(0px) translateX(0px) rotate(0deg) scale(1)',
      opacity: 1,
      pointerEvents: 'auto' as const,
    },
    {
      zIndex: 20,
      transform: 'translateY(-14px) translateX(14px) rotate(3deg) scale(0.95)',
      opacity: 0.85,
      pointerEvents: 'auto' as const,
    },
    {
      zIndex: 10,
      transform: 'translateY(-28px) translateX(28px) rotate(6deg) scale(0.90)',
      opacity: 0.7,
      pointerEvents: 'auto' as const,
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Stack Container */}
      <div className="relative w-full max-w-[420px] h-64 sm:h-72 my-4 flex items-center justify-center">
        {/* Background Stack Cards (visible behind when multiple cards exist) */}
        {cards.length > 1 &&
          displayCards.slice(1, 3).map((bgCard, i) => {
            const originalIndex = cards.indexOf(bgCard);
            const bgTheme = LUXURY_THEMES[originalIndex % LUXURY_THEMES.length];
            const style = STACK_STYLES[i + 1];

            return (
              <div
                key={bgCard.id}
                onClick={() => onSelectIndex(originalIndex)}
                style={{
                  zIndex: style.zIndex,
                  transform: style.transform,
                  opacity: style.opacity,
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className={`absolute inset-x-0 mx-auto w-full max-w-[400px] h-56 sm:h-60 rounded-3xl p-5 cursor-pointer shadow-xl border ${bgTheme.border} bg-gradient-to-br ${bgTheme.gradient} ${bgTheme.text} flex flex-col justify-between overflow-hidden hover:scale-[0.98] transition-transform`}
              >
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-xs font-bold uppercase tracking-wider">{bgCard.name}</span>
                  <span className="text-xs font-mono">•••• {getCardDigits(bgCard.id, bgCard.cardNumber)}</span>
                </div>
                <div className="flex justify-between items-end opacity-60">
                  <span className="text-xs font-bold">{bgCard.institution || 'TallyWise'}</span>
                  <span className="text-sm font-bold">{currency}{(bgCard.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            );
          })}

        {/* ACTIVE FRONT CARD WITH FLAWLESS 3D FLIP */}
        <div
          style={{
            zIndex: 40,
            perspective: '1200px',
          }}
          className="relative w-full max-w-[410px] h-56 sm:h-64 cursor-pointer"
          onClick={handleCycle}
          title={cards.length > 1 ? 'Click card deck to cycle cards' : ''}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT FACE */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                visibility: isFlipped ? 'hidden' : 'visible',
              }}
              className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl border ${theme.border} bg-gradient-to-br ${theme.gradient} ${theme.text}`}
            >
              {/* Subtle metallic texture & glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-black/20 rounded-full blur-2xl pointer-events-none" />

              {/* FROZEN OVERLAY */}
              {isFrozen && (
                <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-cyan-300 rounded-3xl border border-cyan-500/40">
                  <Snowflake className="w-10 h-10 animate-pulse text-cyan-400" />
                  <span className="font-display font-bold text-sm tracking-wider uppercase">Card Frozen</span>
                  <span className="text-xs text-cyan-200/70">Click Unfreeze to reactivate</span>
                </div>
              )}

              {/* Front Top Row */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-3">
                  {/* EMV Metallic Chip */}
                  <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 p-0.5 shadow-md flex items-center justify-center border border-amber-400/50">
                    <div className="w-full h-full border border-amber-900/30 rounded flex flex-col justify-around p-0.5">
                      <div className="h-0.5 bg-amber-900/30 w-full" />
                      <div className="h-0.5 bg-amber-900/30 w-full" />
                    </div>
                  </div>
                  <Wifi className="w-5 h-5 rotate-90 opacity-75" />
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${theme.badge}`}>
                    {activeCard.type === 'credit' ? 'Credit' : activeCard.type === 'checking' ? 'Debit' : 'Cash'}
                  </span>
                  <span className="text-xs font-display font-bold tracking-wide opacity-90">
                    {activeCard.institution || 'TallyWise'}
                  </span>
                </div>
              </div>

              {/* Card Number Row */}
              <div className="z-10 my-auto">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg sm:text-xl font-bold tracking-widest text-shadow">
                    {showFullNumber ? fullCardNumber : `•••• •••• •••• ${last4}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullNumber(!showFullNumber);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80"
                      title={showFullNumber ? 'Hide full number' : 'Show full number'}
                    >
                      {showFullNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80"
                      title="Copy card number"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Front Bottom Row */}
              <div className="flex justify-between items-end z-10 gap-3">
                <div className="flex items-end gap-3 min-w-0 flex-1">
                  <div className="min-w-0">
                    <span className={`block text-[9px] uppercase font-bold tracking-wider ${theme.muted}`}>
                      Cardholder
                    </span>
                    <span className="font-display font-semibold text-xs sm:text-sm tracking-wide truncate max-w-[125px] block">
                      {activeCard.name}
                    </span>
                  </div>

                  <div className="shrink-0">
                    <span className={`block text-[9px] uppercase font-bold tracking-wider ${theme.muted}`}>
                      Expires
                    </span>
                    <span className="font-mono font-semibold text-xs sm:text-sm block">
                      {showFullNumber ? '09/28' : '••/••'}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`block text-[9px] uppercase font-bold tracking-wider ${theme.muted}`}>
                    Balance
                  </span>
                  <span className="font-display font-bold text-xs sm:text-sm text-emerald-300 block whitespace-nowrap">
                    {currency}{(activeCard.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                visibility: isFlipped ? 'visible' : 'hidden',
              }}
              className={`rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl border ${theme.border} bg-gradient-to-br ${theme.gradient} ${theme.text}`}
            >
              {/* Magnetic Strip */}
              <div className="absolute top-6 left-0 right-0 h-10 bg-slate-950/90 border-y border-white/10" />

              {/* CVV & Signature Area */}
              <div className="mt-14 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-9 bg-slate-200 rounded p-2 flex items-center justify-end font-mono text-slate-800 text-xs tracking-widest font-bold border border-slate-300">
                    <span className="italic opacity-60 mr-4 font-sans text-[10px]">AUTHORIZED SIGNATURE</span>
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-mono">
                      {showFullNumber ? '849' : '•••'}
                    </span>
                  </div>
                </div>
                <span className={`block text-[9px] uppercase tracking-wider font-semibold mt-1 text-right ${theme.muted}`}>
                  CVV / Security Code
                </span>
              </div>

              {/* Back Info */}
              <div className="z-10 flex items-end justify-between">
                <div className="text-[9px] text-white/70 space-y-0.5">
                  <p className="font-bold uppercase tracking-wider">{activeCard.institution || 'TallyWise Financial'}</p>
                  <p>Customer Support: 1-800-TALLY-WISE</p>
                  <p className="opacity-50">Issued pursuant to license by TallyWise International</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/80 -mr-3 shadow-sm" />
                  <div className="w-8 h-8 rounded-full bg-amber-500/80 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Under-Card Switcher Controls Bar */}
      <div className="flex items-center justify-between w-full max-w-[410px] mt-2 px-2">
        {/* Prev / Next controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectIndex((activeIndex - 1 + cards.length) % cards.length)}
            disabled={cards.length <= 1}
            className="p-2 rounded-xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-tally-primary dark:hover:border-tally-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Previous card"
          >
            <ChevronLeft className="w-4 h-4 text-tally-text-primary dark:text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark">
            {cards.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? 'w-5 bg-tally-primary dark:bg-white'
                    : 'w-2 bg-gray-300 dark:bg-slate-700 hover:bg-gray-400'
                }`}
                title={c.name}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectIndex((activeIndex + 1) % cards.length)}
            disabled={cards.length <= 1}
            className="p-2 rounded-xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-tally-primary dark:hover:border-tally-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next card"
          >
            <ChevronRight className="w-4 h-4 text-tally-text-primary dark:text-white" />
          </button>
        </div>

        {/* Clean Flip Toggle Button */}
        <button
          type="button"
          onClick={onToggleFlip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-tally-primary dark:hover:border-tally-accent text-xs font-bold text-tally-text-primary dark:text-white transition-all shadow-sm"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Show Front' : 'View Back (CVV)'}</span>
        </button>
      </div>

      {cards.length > 1 && (
        <p className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2">
          Click the card deck or use arrows to cycle through cards
        </p>
      )}
    </div>
  );
}
