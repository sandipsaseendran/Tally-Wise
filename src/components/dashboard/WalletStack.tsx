import React, { useState } from 'react';
import { Wifi, Trash2 } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { getCardDigits } from '../../utils/helpers';
import { LUXURY_THEMES } from '../cards/InteractiveCardDeck';

export function WalletStack() {
  const accounts = useStore((state) => state.accounts);
  const settings = useStore((state) => state.settings);
  const deleteAccount = useStore((state) => state.deleteAccount);
  
  // Include all card-compatible accounts or fallback to accounts
  const filteredCards = accounts.filter(
    (acc) => acc.type === 'credit' || acc.type === 'checking' || acc.type === 'cash' || acc.type === 'savings'
  );
  const cards = filteredCards.length > 0 ? filteredCards : accounts;
  const [activeIndex, setActiveIndex] = useState(0);

  if (cards.length === 0) {
    return (
      <div className="relative h-48 w-full max-w-sm mb-8 mt-4 rounded-2xl border border-dashed border-tally-border-light dark:border-tally-border-dark flex items-center justify-center text-tally-text-secondary dark:text-tally-text-secondaryDark text-sm font-semibold">
        No cards added yet
      </div>
    );
  }

  // Reorder cards so the active one is at the front
  const displayCards = [
    ...cards.slice(activeIndex),
    ...cards.slice(0, activeIndex)
  ];
  
  const handleCycle = () => {
    if (cards.length > 1) {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }
  };

  const POSITION_CLASSES = [
    "z-30 translate-y-0 translate-x-0 rotate-0 scale-100 group-hover:translate-y-1 shadow-floating",
    "z-20 -translate-y-3 translate-x-2 rotate-2 scale-[0.96] group-hover:-translate-y-4 group-hover:rotate-4 shadow-soft",
    "z-10 -translate-y-6 translate-x-4 rotate-4 scale-[0.92] group-hover:-translate-y-7 group-hover:rotate-8 shadow-sm",
  ];

  return (
    <div 
      className={`relative h-48 w-full max-w-sm mb-8 mt-4 group perspective-1000 ${cards.length > 1 ? 'cursor-pointer' : ''}`}
      onClick={handleCycle}
      title={cards.length > 1 ? "Click to cycle through your cards" : ""}
    >
      {displayCards.slice(0, 3).map((card, i) => {
        const originalIndex = cards.indexOf(card);
        const themeIndex = card.themeIndex !== undefined ? card.themeIndex : originalIndex;
        const theme = LUXURY_THEMES[themeIndex % LUXURY_THEMES.length];
        
        return (
          <div 
            key={card.id} 
            className={`absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-500 border border-black/5 dark:border-white/10 bg-gradient-to-br ${theme.gradient} ${theme.text} ${POSITION_CLASSES[i]}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 dark:bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10" />
            
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col gap-1">
                <span className={`text-xs font-semibold uppercase tracking-wider ${theme.muted}`}>{card.name}</span>
                <Wifi className={`w-5 h-5 rotate-90 ${theme.muted}`} />
              </div>
              <div className="flex items-center gap-2">
                {i === 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAccount(card.id);
                      setActiveIndex(0);
                    }}
                    className="p-1.5 opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg backdrop-blur-sm transition-all"
                    title="Remove Card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="w-10 h-6 bg-black/5 dark:bg-white/20 rounded-md backdrop-blur-sm border border-black/10 dark:border-white/20 shadow-sm" />
              </div>
            </div>
            
            <div className="z-10 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-lg tracking-widest font-semibold opacity-90">
                  **** **** **** {getCardDigits(card.id, card.cardNumber)}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className={`text-[9px] uppercase tracking-wider font-bold ${theme.muted}`}>Balance</span>
                  <span className="text-sm font-bold tracking-wide">
                    {settings.currency}{(card.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className={`text-[9px] uppercase tracking-wider font-bold ${theme.muted}`}>Institution</span>
                  <span className="text-sm font-bold tracking-wide">{card.institution || 'Personal'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
