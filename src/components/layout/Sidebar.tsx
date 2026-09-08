import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Bell, 
  Home, 
  FileSignature, 
  Files, 
  FileText, 
  CreditCard, 
  ArrowRightLeft, 
  Wallet, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useStore } from '../../../store/useStore';
import toast from 'react-hot-toast';

const PRIMARY_NAV = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Contracts', icon: FileSignature, path: '/contracts' },
  { name: 'Documents', icon: Files, path: '/documents' },
  { name: 'Invoices', icon: FileText, path: '/invoices' },
  { name: 'Card', icon: CreditCard, path: '/card' },
  { name: 'Transactions', icon: ArrowRightLeft, path: '/transactions' },
  { name: 'Withdrawal', icon: Wallet, path: '/withdrawal' },
];

export function Sidebar() {
  const setAIAssistantOpen = useStore((state) => state.setAIAssistantOpen);
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  return (
    <aside className="w-64 h-full flex flex-col bg-tally-bg-light dark:bg-tally-bg-dark border-r border-tally-border-light dark:border-tally-border-dark p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Tally Wise Logo" className="w-9 h-9 rounded-full object-cover object-center shadow-sm" />
          <span className="text-xl font-display font-bold text-tally-text-primary dark:text-tally-text-primaryDark tracking-tight">Tally Wise</span>
        </div>
        <button className="relative p-2 rounded-full hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors">
          <Bell className="w-5 h-5 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-tally-status-error rounded-full ring-2 ring-tally-bg-light dark:ring-tally-bg-dark" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 no-scrollbar overflow-y-auto">
        <div className="flex flex-col gap-1 mb-6">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                  isActive 
                    ? "bg-tally-primary/50 dark:bg-tally-primary-dark text-tally-primary-text dark:text-white" 
                    : "text-tally-text-secondary dark:text-tally-text-secondaryDark hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover hover:text-tally-text-primary dark:hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5 stroke-[1.5]" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Promo Card */}
      <div className="mt-auto pt-6">
        <div 
          onClick={() => setAIAssistantOpen(true)}
          className="p-4 rounded-2xl bg-gradient-to-br from-tally-primary/40 to-tally-primary/10 dark:from-tally-primary-dark dark:to-tally-surface-dark border border-tally-primary/20 dark:border-tally-border-dark relative overflow-hidden cursor-pointer hover:border-tally-primary/50 transition-all group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-tally-primary/30 dark:bg-tally-primary/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-tally-surface-darkHover flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-tally-primary-text dark:text-white" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-tally-text-primary dark:text-white text-sm">AI Assistant</h4>
              <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">Chat with Tally Wise AI.</p>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAIAssistantOpen(true);
              }}
              className="w-full py-2 bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary text-xs font-semibold rounded-full hover:opacity-90 transition-opacity shadow-sm"
            >
              Try AI Sphere
            </button>
          </div>
        </div>

        {/* User Profile & Sign Out Widget */}
        <div className="pt-3.5 border-t border-tally-border-light dark:border-tally-border-dark/60 flex items-center justify-between mt-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-tally-text-primary dark:text-white truncate">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark truncate">
                {currentUser?.email || 'user@tallywise.com'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              toast.success('Signed out');
            }}
            title="Sign Out"
            className="p-1.5 rounded-lg text-tally-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
