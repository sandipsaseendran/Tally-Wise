import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bell,
  X,
  FileText,
  CreditCard,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tallywise-dismissed-notifs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const panelRef = useRef<HTMLDivElement>(null);

  const invoices = useStore((s) => s.invoices);
  const bills = useStore((s) => s.bills);
  const budgets = useStore((s) => s.budgets);
  const goals = useStore((s) => s.goals);
  const subscriptions = useStore((s) => s.subscriptions);
  const transactions = useStore((s) => s.transactions);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Save dismissed notifications
  useEffect(() => {
    localStorage.setItem('tallywise-dismissed-notifs', JSON.stringify([...dismissedIds]));
  }, [dismissedIds]);

  // Generate smart notifications from real data
  const notifications = useMemo<Notification[]>(() => {
    const notifs: Notification[] = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // 1. Overdue invoices
    invoices
      .filter((inv) => inv.status === 'overdue' || (inv.status === 'pending' && inv.dueDate < today))
      .forEach((inv) => {
        notifs.push({
          id: `inv-overdue-${inv.id}`,
          type: 'urgent',
          icon: <FileText className="w-4 h-4" />,
          title: 'Invoice Overdue',
          message: `Invoice #${inv.invoiceNumber} for ${inv.clientName} ($${inv.total.toLocaleString()}) is past due.`,
          time: inv.dueDate,
          read: false,
        });
      });

    // 2. Invoices due soon (within 3 days)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0];
    invoices
      .filter((inv) => inv.status === 'pending' && inv.dueDate >= today && inv.dueDate <= threeDaysFromNow)
      .forEach((inv) => {
        notifs.push({
          id: `inv-soon-${inv.id}`,
          type: 'warning',
          icon: <Clock className="w-4 h-4" />,
          title: 'Invoice Due Soon',
          message: `Invoice #${inv.invoiceNumber} for ${inv.clientName} is due on ${new Date(inv.dueDate).toLocaleDateString()}.`,
          time: inv.dueDate,
          read: false,
        });
      });

    // 3. Unpaid bills
    bills
      .filter((bill) => !bill.isPaid && bill.dueDate <= threeDaysFromNow)
      .forEach((bill) => {
        const isOverdue = bill.dueDate < today;
        notifs.push({
          id: `bill-${bill.id}`,
          type: isOverdue ? 'urgent' : 'warning',
          icon: <DollarSign className="w-4 h-4" />,
          title: isOverdue ? 'Bill Overdue' : 'Bill Due Soon',
          message: `${bill.name} — $${bill.amount.toLocaleString()} ${isOverdue ? 'was due' : 'is due'} on ${new Date(bill.dueDate).toLocaleDateString()}.`,
          time: bill.dueDate,
          read: false,
        });
      });

    // 4. Budget alerts (>80% spent)
    budgets
      .filter((b) => b.amount > 0 && (b.spent / b.amount) >= 0.8)
      .forEach((b) => {
        const pct = Math.round((b.spent / b.amount) * 100);
        const isOver = pct >= 100;
        notifs.push({
          id: `budget-${b.id}`,
          type: isOver ? 'urgent' : 'warning',
          icon: <AlertTriangle className="w-4 h-4" />,
          title: isOver ? 'Budget Exceeded' : 'Budget Alert',
          message: `${b.category} budget is at ${pct}% — $${b.spent.toLocaleString()} of $${b.amount.toLocaleString()} spent.`,
          time: today,
          read: false,
        });
      });

    // 5. Goals close to completion (>90%) or completed
    goals.forEach((g) => {
      if (g.completed) {
        notifs.push({
          id: `goal-done-${g.id}`,
          type: 'success',
          icon: <Target className="w-4 h-4" />,
          title: 'Goal Achieved! 🎉',
          message: `"${g.name}" has been completed. $${g.targetAmount.toLocaleString()} target reached!`,
          time: g.deadline,
          read: false,
        });
      } else if (g.targetAmount > 0 && (g.currentAmount / g.targetAmount) >= 0.9) {
        notifs.push({
          id: `goal-close-${g.id}`,
          type: 'info',
          icon: <TrendingUp className="w-4 h-4" />,
          title: 'Almost There!',
          message: `"${g.name}" is ${Math.round((g.currentAmount / g.targetAmount) * 100)}% complete. Just $${(g.targetAmount - g.currentAmount).toLocaleString()} to go.`,
          time: today,
          read: false,
        });
      }
    });

    // 6. Subscription renewals in next 3 days
    subscriptions
      .filter((s) => s.isActive && s.nextBillingDate >= today && s.nextBillingDate <= threeDaysFromNow)
      .forEach((s) => {
        notifs.push({
          id: `sub-${s.id}`,
          type: 'info',
          icon: <CreditCard className="w-4 h-4" />,
          title: 'Subscription Renewal',
          message: `${s.name} ($${s.amount}/${s.billingCycle}) renews on ${new Date(s.nextBillingDate).toLocaleDateString()}.`,
          time: s.nextBillingDate,
          read: false,
        });
      });

    // 7. Welcome/tip if no other notifications
    if (notifs.length === 0) {
      notifs.push({
        id: 'tip-welcome',
        type: 'info',
        icon: <Sparkles className="w-4 h-4" />,
        title: 'All Clear!',
        message: 'No pending alerts. Add invoices, bills, or budgets to get smart notifications here.',
        time: today,
        read: true,
      });
    }

    // Sort: urgent first, then by date (newest first)
    const typeOrder: Record<string, number> = { urgent: 0, warning: 1, info: 2, success: 3 };
    notifs.sort((a, b) => (typeOrder[a.type] ?? 4) - (typeOrder[b.type] ?? 4));

    return notifs;
  }, [invoices, bills, budgets, goals, subscriptions, transactions]);

  const visibleNotifications = notifications.filter((n) => !dismissedIds.has(n.id));
  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  const dismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const dismissAll = () => {
    setDismissedIds((prev) => new Set([...prev, ...notifications.map((n) => n.id)]));
  };

  const typeStyles: Record<string, { bg: string; border: string; dot: string; iconBg: string }> = {
    urgent: {
      bg: 'bg-red-50/80 dark:bg-red-950/30',
      border: 'border-red-200/60 dark:border-red-800/40',
      dot: 'bg-red-500',
      iconBg: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
    },
    warning: {
      bg: 'bg-amber-50/80 dark:bg-amber-950/30',
      border: 'border-amber-200/60 dark:border-amber-800/40',
      dot: 'bg-amber-500',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
    },
    info: {
      bg: 'bg-blue-50/80 dark:bg-blue-950/30',
      border: 'border-blue-200/60 dark:border-blue-800/40',
      dot: 'bg-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    },
    success: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/30',
      border: 'border-emerald-200/60 dark:border-emerald-800/40',
      dot: 'bg-emerald-500',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
    },
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-red-500 rounded-full ring-2 ring-tally-bg-light dark:ring-tally-bg-dark animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-tally-border-light dark:border-tally-border-dark/60">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-display font-bold text-tally-text-primary dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {visibleNotifications.length > 0 && (
                <button
                  onClick={dismissAll}
                  className="text-[10px] font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white px-2 py-1 rounded-lg hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-tally-text-secondary hover:text-tally-text-primary dark:text-tally-text-secondaryDark dark:hover:text-white hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {visibleNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-tally-text-primary dark:text-white mb-1">
                  You're all caught up!
                </p>
                <p className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark">
                  No notifications right now. We'll alert you about invoices, bills, budgets, and goals.
                </p>
              </div>
            ) : (
              <div className="py-1">
                {visibleNotifications.map((notif, idx) => {
                  const style = typeStyles[notif.type] || typeStyles.info;
                  return (
                    <div
                      key={notif.id}
                      className={`group relative flex items-start gap-3 px-4 py-3 hover:bg-tally-surface-hover/50 dark:hover:bg-tally-surface-darkHover/50 transition-colors ${
                        idx < visibleNotifications.length - 1 ? 'border-b border-tally-border-light/50 dark:border-tally-border-dark/30' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${style.iconBg}`}>
                        {notif.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                          <p className="text-xs font-bold text-tally-text-primary dark:text-white truncate">
                            {notif.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={() => dismiss(notif.id)}
                        className="shrink-0 p-1 rounded-lg text-tally-text-secondary/40 hover:text-tally-text-secondary dark:text-tally-text-secondaryDark/40 dark:hover:text-tally-text-secondaryDark opacity-0 group-hover:opacity-100 transition-all hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
