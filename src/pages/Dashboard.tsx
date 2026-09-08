import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { WalletStack } from '../components/dashboard/WalletStack';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { useStore } from '../../store/useStore';
import { AddFundsModal } from '../components/forms/AddFundsModal';
import { WithdrawFundsModal } from '../components/forms/WithdrawFundsModal';
import { AddCardModal } from '../components/forms/AddCardModal';

const CURRENCIES = [
  { label: 'US USD', symbol: '$' },
  { label: 'EU EUR', symbol: '€' },
  { label: 'UK GBP', symbol: '£' },
  { label: 'JP JPY', symbol: '¥' },
  { label: 'IN INR', symbol: '₹' },
];

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
};

export function Dashboard() {
  const loadFromStorage = useStore((state) => state.loadFromStorage);
  const accounts = useStore((state) => state.accounts);
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const currentUser = useStore((state) => state.currentUser);
  const [isFundsModalOpen, setIsFundsModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [greeting, setGreeting] = useState(getTimeGreeting);
  
  const currentCurrency = CURRENCIES.find(c => c.symbol === settings.currency) || CURRENCIES[0];

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    setGreeting(getTimeGreeting());
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalBalance = accounts.reduce((acc, account) => acc + (account.balance || 0), 0);

  return (
    <div className="flex w-full h-full">
      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto no-scrollbar p-10 pr-12">
        {/* Top Header Row (Theme Toggle) */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>

        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-[40px] font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
            {greeting}{currentUser?.name ? `, ${currentUser.name}` : ''}!
          </h1>
        </div>

        {/* Balance Row */}
        <div className="flex items-end justify-between mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wide uppercase">TOTAL BALANCE</span>
            <div className="flex items-center gap-4">
              <span className="text-[56px] font-display font-bold text-tally-text-primary dark:text-white tracking-tighter leading-none">
                {settings.currency}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="relative">
                <button 
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-tally-border-dark bg-white dark:bg-tally-surface-dark shadow-sm hover:bg-gray-50 dark:hover:bg-tally-surface-darkHover transition-colors"
                >
                  <span className="text-sm font-bold text-tally-text-primary dark:text-white">{currentCurrency.label}</span>
                  <ChevronDown className="w-4 h-4 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
                </button>
                
                {isCurrencyDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 w-36 bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark rounded-xl shadow-lg overflow-hidden z-50">
                    {CURRENCIES.map(curr => (
                      <button
                        key={curr.label}
                        onClick={() => {
                          updateSettings({ currency: curr.symbol });
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-semibold text-tally-text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-tally-surface-darkHover transition-colors flex items-center justify-between"
                      >
                        <span>{curr.label}</span>
                        <span className="text-tally-text-secondary dark:text-tally-text-secondaryDark">{curr.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-tally-surface-darkHover transition-colors shadow-sm"
            >
              Withdraw funds
            </button>
            <button 
              onClick={() => setIsFundsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add funds
            </button>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex gap-12">
          {/* Left Side: Wallet */}
          <div className="w-[420px] shrink-0">
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-xl font-display font-bold text-tally-text-primary dark:text-white">Your Cards</h3>
              <button 
                onClick={() => setIsCardModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-tally-text-primary dark:text-white bg-white dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-tally-surface-darkHover transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Card
              </button>
            </div>
            <WalletStack />
          </div>

          {/* Right Side: Activity */}
          <div className="flex-1 max-w-xl">

            <RecentActivity />
          </div>
        </div>

        <AddFundsModal isOpen={isFundsModalOpen} onClose={() => setIsFundsModalOpen(false)} />
        <WithdrawFundsModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
        <AddCardModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} />
      </div>
    </div>
  );
}

