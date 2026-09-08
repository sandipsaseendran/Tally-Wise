import React, { useState } from 'react';
import { Wifi, Copy, Check, Eye, EyeOff, Snowflake, RotateCw } from 'lucide-react';
import { Account } from '../../types';

interface InteractiveCard3DProps {
  card: Account;
  currency: string;
  isFrontActive?: boolean;
  isFrozen: boolean;
  onToggleFreeze: () => void;
  onDelete: () => void;
  themeIndex: number;
}

const getCardDigits = (id: string, customLast4?: string) => {
  if (customLast4 && customLast4.length === 4) return customLast4;
  if (id === '1') return '8842';
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash).toString().substring(0, 4).padStart(4, '0');
};

const getCardFullNumber = (id: string, last4: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (id.charCodeAt(i) * 17 + i * 31) % 9000;
  }
  const prefix = (4000 + (hash % 1000)).toString().padStart(4, '4024');
  const mid1 = (1000 + ((hash * 3) % 9000)).toString().padStart(4, '8192');
  const mid2 = (1000 + ((hash * 7) % 9000)).toString().padStart(4, '3301');
  return `${prefix} ${mid1} ${mid2} ${last4}`;
};

export const CARD_THEMES = [
  {
    name: 'Midnight Obsidian',
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950',
    border: 'border-slate-700/50',
    text: 'text-white',
    muted: 'text-slate-400',
    badge: 'bg-slate-800/80 text-slate-200',
    accentGlow: 'from-blue-500/20 via-indigo-500/10 to-transparent',
  },
  {
    name: 'Neon Violet',
    bg: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950',
    border: 'border-purple-500/30',
    text: 'text-white',
    muted: 'text-purple-200/70',
    badge: 'bg-purple-900/60 text-purple-200',
    accentGlow: 'from-purple-500/30 via-pink-500/15 to-transparent',
  },
  {
    name: 'Emerald Cyber',
    bg: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950',
    border: 'border-emerald-500/30',
    text: 'text-white',
    muted: 'text-emerald-200/70',
    badge: 'bg-emerald-900/60 text-emerald-200',
    accentGlow: 'from-emerald-500/30 via-teal-500/15 to-transparent',
  },
  {
    name: 'Rose Gold',
    bg: 'bg-gradient-to-br from-rose-950 via-pink-900 to-slate-950',
    border: 'border-pink-500/30',
    text: 'text-white',
    muted: 'text-rose-200/70',
    badge: 'bg-pink-900/60 text-pink-200',
    accentGlow: 'from-rose-500/30 via-pink-500/15 to-transparent',
  },
  {
    name: 'Solar Amber',
    bg: 'bg-gradient-to-br from-amber-950 via-orange-900 to-slate-950',
    border: 'border-amber-500/30',
    text: 'text-white',
    muted: 'text-amber-200/70',
    badge: 'bg-amber-900/60 text-amber-200',
    accentGlow: 'from-amber-500/30 via-orange-500/15 to-transparent',
  },
];

export function InteractiveCard3D({
  card,
  currency,
  isFrozen,
  themeIndex,
}: InteractiveCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const theme = CARD_THEMES[themeIndex % CARD_THEMES.length];
  const last4 = getCardDigits(card.id, card.cardNumber);
  const fullCardNumber = getCardFullNumber(card.id, last4);
  const expiryDate = '09/28';
  const cvv = '849';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullCardNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div
        className={`relative w-full h-56 sm:h-64 rounded-3xl transition-transform duration-700 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT OF CARD */}
        <div
          className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl border ${theme.border} ${theme.bg} ${theme.text} backface-hidden`}
        >
          {/* Glass & Mesh Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${theme.accentGlow} pointer-events-none`} />
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />

          {/* Frozen Overlay */}
          {isFrozen && (
            <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-cyan-300 animate-fade-in rounded-3xl border border-cyan-500/30">
              <Snowflake className="w-10 h-10 animate-pulse text-cyan-400" />
              <span className="font-display font-bold text-sm tracking-wider uppercase">Card Frozen</span>
              <span className="text-xs text-cyan-200/70">Tap Freeze button in controls to unfreeze</span>
            </div>
          )}

          {/* Card Top Row */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 p-0.5 shadow-md flex items-center justify-center border border-amber-300/40">
                <div className="w-full h-full border border-amber-900/30 rounded flex flex-col justify-around p-0.5">
                  <div className="h-0.5 bg-amber-900/40 w-full" />
                  <div className="h-0.5 bg-amber-900/40 w-full" />
                </div>
              </div>
              <Wifi className="w-5 h-5 rotate-90 opacity-75" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 ${theme.badge}`}>
                {card.type === 'credit' ? 'Credit' : card.type === 'checking' ? 'Debit' : 'Cash'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                title="Flip to back"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Number Row */}
          <div className="z-10 my-auto">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg sm:text-xl font-bold tracking-widest text-shadow">
                {showDetails ? fullCardNumber : `•••• •••• •••• ${last4}`}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80"
                  title={showDetails ? 'Hide card details' : 'Show full card number'}
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80"
                  title="Copy Card Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Card Bottom Row */}
          <div className="flex justify-between items-end z-10">
            <div>
              <span className={`block text-[10px] uppercase font-bold tracking-wider ${theme.muted}`}>
                Cardholder / Account
              </span>
              <span className="font-display font-semibold text-sm sm:text-base tracking-wide truncate max-w-[180px] block">
                {card.name}
              </span>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className={`block text-[10px] uppercase font-bold tracking-wider ${theme.muted}`}>
                  Expires
                </span>
                <span className="font-mono font-semibold text-xs sm:text-sm">
                  {showDetails ? expiryDate : '••/••'}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`block text-[10px] uppercase font-bold tracking-wider ${theme.muted}`}>
                  Balance
                </span>
                <span className="font-display font-bold text-sm sm:text-base text-emerald-300">
                  {currency}{(card.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div
          className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl border ${theme.border} ${theme.bg} ${theme.text} rotate-y-180 backface-hidden`}
        >
          {/* Magnetic Strip */}
          <div className="absolute top-6 left-0 right-0 h-11 bg-slate-950 border-y border-white/10" />

          <div className="mt-14 z-10">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-9 bg-slate-200/90 rounded p-2 flex items-center justify-end font-mono text-slate-800 text-xs tracking-widest font-bold border border-slate-300">
                <span className="italic opacity-60 mr-4 font-sans text-[10px]">AUTHORIZED SIGNATURE</span>
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-mono">
                  {showDetails ? cvv : '•••'}
                </span>
              </div>
            </div>
            <span className={`block text-[9px] uppercase tracking-wider font-semibold mt-1 text-right ${theme.muted}`}>
              CVV / Security Code
            </span>
          </div>

          {/* Back Info */}
          <div className="z-10 flex items-end justify-between">
            <div className="text-[10px] text-white/60 space-y-0.5">
              <p className="font-bold uppercase tracking-wider">{card.institution || 'TallyWise Financial'}</p>
              <p>For Customer Support call 1-800-TALLY-WISE</p>
              <p className="text-[9px] opacity-40">Issued pursuant to license by TallyWise Inc.</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-sm transition-colors"
            >
              Flip Front
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
