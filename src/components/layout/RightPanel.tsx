import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Loader2, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, subMonths, isSameMonth } from 'date-fns';
import { cn } from '../../utils/cn';
import { AISphere } from '../shared/AISphere';
import { StatusPill } from '../shared/StatusPill';
import Modal from '../Modal';
import { useStore } from '../../../store/useStore';
import { getFinancialInsights, chatWithAIAgent } from '../../utils/geminiClient';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const CHART_MODES = ['Bar', 'Pie', 'AI Sphere'];

const CATEGORY_COLORS: Record<string, string> = {
  Shopping: '#ec4899',       // Vibrant Pink
  Food: '#f59e0b',           // Warm Amber
  Utilities: '#06b6d4',      // Crisp Cyan
  Entertainment: '#8b5cf6',  // Vivid Violet
  Transport: '#3b82f6',      // Royal Blue
  Health: '#ef4444',         // Bright Red
  Education: '#10b981',      // Emerald Green
  Salary: '#10b981',
};

const DEFAULT_PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#ef4444', '#f97316'];

const getBrandColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('entertain') || cat.includes('movie')) return 'bg-red-500';
  if (cat.includes('cloud') || cat.includes('infra')) return 'bg-orange-500';
  if (cat.includes('software') || cat.includes('design')) return 'bg-pink-500';
  return 'bg-blue-500';
};

// Rich custom tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const hasData = d.spend > 0 || d.income > 0;
    return (
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[145px] z-50">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1">
          <span className="font-bold text-white text-[12px]">{d.fullDate || d.name}</span>
          {d.isCurrent && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Active
            </span>
          )}
        </div>
        {hasData ? (
          <>
            <div className="flex items-center justify-between text-slate-300 pt-0.5">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Expenses:
              </span>
              <span className="font-mono font-bold text-white">
                {currency}{d.spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {d.income > 0 && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Income:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  +{currency}{d.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-slate-400 text-[11px] py-0.5">
            No transactions logged ({currency}0.00)
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Rich custom tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1 min-w-[145px] z-50">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="font-bold text-white">{d.name}</span>
          </div>
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded",
            d.isDeposit ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          )}>
            {d.isDeposit ? 'Deposit' : 'Withdrawal'}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 text-slate-300">
          <span className="text-slate-400">Amount:</span>
          <span className="font-mono font-bold text-white">
            {d.isDeposit ? '+' : '-'}{currency}{d.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Share:</span>
          <span className="font-bold text-emerald-400 font-mono">{d.pct.toFixed(1)}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function RightPanel() {
  const [activeChart, setActiveChart] = useState('Bar');
  const [pieFilter, setPieFilter] = useState<'all' | 'deposits' | 'withdrawals'>('all');
  const [showAIModal, setShowAIModal] = useState(false);
  
  const [aiInsights, setAiInsights] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const accounts = useStore((state) => state.accounts);
  const subscriptions = useStore((state) => state.subscriptions);
  const transactions = useStore((state) => state.transactions);
  const settings = useStore((state) => state.settings);
  const setAIAssistantOpen = useStore((state) => state.setAIAssistantOpen);
  
  const totalBalance = accounts.reduce((acc, account) => acc + (account.balance || 0), 0);
  const recentContracts = [...subscriptions].slice(0, 3);

  // Dynamic calculations
  const now = new Date();
  const thisMonthTxs = transactions.filter(t => isSameMonth(new Date(t.date), now) && t.type === 'expense');
  const lastMonthTxs = transactions.filter(t => isSameMonth(new Date(t.date), subMonths(now, 1)) && t.type === 'expense');
  
  const thisMonthSpend = thisMonthTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const lastMonthSpend = lastMonthTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const pctChange = lastMonthSpend === 0 ? 0 : ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
  const isPositiveChange = pctChange > 0;

  // Bar chart logic: 6-month historical trajectory
  const last6Months = Array.from({ length: 6 }).map((_, i) => subMonths(now, 5 - i));
  const rechartsBarData = last6Months.map(month => {
    const spend = transactions
      .filter(t => isSameMonth(new Date(t.date), month) && t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const income = transactions
      .filter(t => isSameMonth(new Date(t.date), month) && t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { 
      name: format(month, 'MMM'), 
      fullDate: format(month, 'MMMM yyyy'),
      spend, 
      income,
      isCurrent: isSameMonth(month, now)
    };
  });

  const hasAnySpend = rechartsBarData.some(m => m.spend > 0);
  const activeSpendMonths = rechartsBarData.filter(m => m.spend > 0);
  const avgMonthlySpend = activeSpendMonths.length > 0 
    ? rechartsBarData.reduce((acc, m) => acc + m.spend, 0) / activeSpendMonths.length 
    : 0;
  const peakMonth = hasAnySpend 
    ? rechartsBarData.reduce((max, m) => (m.spend > max.spend ? m : max), rechartsBarData[0]) 
    : { name: 'None', spend: 0 };

  // Pie chart logic (Includes both deposits/inflow and withdrawals/expenses for current month)
  const thisMonthAllTxs = transactions.filter(t => isSameMonth(new Date(t.date), now));
  const pieTxs = thisMonthAllTxs.filter(t => {
    if (pieFilter === 'deposits') return t.type === 'income' || t.category.toLowerCase().includes('deposit');
    if (pieFilter === 'withdrawals') return t.type === 'expense' || t.category.toLowerCase().includes('withdraw');
    return true; // 'all' shows both deposits and withdrawals
  });
  const activeSpendTotal = pieTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const pieDataMap = pieTxs.reduce((acc, t) => {
    const cat = t.category || (t.type === 'income' ? 'Deposit' : 'Withdrawal');
    acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const sortedPieData = Object.entries(pieDataMap)
    .map(([name, value], idx) => {
      const isDeposit = pieTxs.some(t => (t.category === name || (t.type === 'income' && name === 'Deposit')) && t.type === 'income');
      const color = isDeposit 
        ? '#10b981' 
        : (CATEGORY_COLORS[name] || DEFAULT_PIE_COLORS[idx % DEFAULT_PIE_COLORS.length]);
      const pct = activeSpendTotal > 0 ? (value / activeSpendTotal) * 100 : 0;
      return { name, value, color, pct, isDeposit };
    })
    .sort((a, b) => b.value - a.value);

  // Sparkline logic
  const last3Months = Array.from({ length: 3 }).map((_, i) => subMonths(now, 2 - i));
  const sparkData = last3Months.map(month => {
    const spend = transactions
      .filter(t => isSameMonth(new Date(t.date), month) && t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { label: format(month, 'MMM').toUpperCase(), spend };
  });
  const maxSparkSpend = Math.max(...sparkData.map(d => d.spend), 1);

  useEffect(() => {
    if (showAIModal && !aiInsights && !aiLoading) {
      const fetchInsights = async () => {
        setAiLoading(true);
        const insights = await getFinancialInsights(transactions, accounts, settings.currency);
        setAiInsights(insights);
        setAiLoading(false);
      };
      fetchInsights();
    }
  }, [showAIModal, aiInsights, aiLoading, transactions, accounts, settings.currency]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    
    const response = await chatWithAIAgent(userMsg, { transactions, accounts, currency: settings.currency });
    setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    setChatLoading(false);
  };

  return (
    <aside className="w-80 h-full flex flex-col bg-tally-surface-light dark:bg-tally-bg-dark border-l border-tally-border-light dark:border-tally-border-dark p-6 overflow-y-auto no-scrollbar">
      {/* Statistics Header */}
      <div className="mb-6">
        <h2 className="text-lg font-display font-semibold text-tally-text-primary dark:text-white mb-4">Statistics</h2>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-display font-bold text-tally-text-primary dark:text-white tracking-tight">
            {settings.currency}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full mb-1",
            isPositiveChange ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : pctChange === 0 ? "bg-tally-surface-hover dark:bg-tally-surface-darkHover text-tally-text-secondary" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          )}>
            {pctChange !== 0 && (
              isPositiveChange ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />
            )}
            <span className="text-xs font-bold">{pctChange > 0 ? '+' : ''}{pctChange.toFixed(1)}%</span>
          </div>
        </div>
        <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">This month vs last month</p>
      </div>

      {/* Chart Switcher */}
      <div className="flex bg-tally-bg-light dark:bg-tally-surface-dark rounded-xl p-1 mb-4">
        {CHART_MODES.map(mode => (
          <button
            key={mode}
            onClick={() => setActiveChart(mode)}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all",
              activeChart === mode 
                ? "bg-white dark:bg-tally-surface-darkHover text-tally-text-primary dark:text-white shadow-sm" 
                : "text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white"
            )}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className={cn(
        "rounded-2xl bg-tally-bg-light dark:bg-tally-surface-dark mb-6 relative overflow-hidden transition-all duration-300",
        activeChart === 'Pie' ? "p-4 min-h-[300px]" : activeChart === 'Bar' ? "p-4 min-h-[255px]" : "h-64 flex items-center justify-center"
      )}>
        {activeChart === 'AI Sphere' ? (
          <div className="w-full h-full relative cursor-pointer group" onClick={() => setAIAssistantOpen(true)}>
            <AISphere />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 dark:bg-white/5 backdrop-blur-[2px]">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-tally-surface-dark shadow-lg">
                <Sparkles className="w-4 h-4 text-tally-primary dark:text-white" />
                <span className="text-sm font-bold text-tally-primary dark:text-white">Ask AI</span>
              </div>
            </div>
          </div>
        ) : activeChart === 'Bar' ? (
          <div className="w-full flex flex-col justify-between h-full">
            {/* Bar chart meta header */}
            <div className="flex items-center justify-between mb-2 text-[11px] font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark">
              <span>Avg: <strong className="text-tally-text-primary dark:text-white">{settings.currency}{avgMonthlySpend.toFixed(0)}</strong>/mo</span>
              <span>Peak: <strong className="text-tally-text-primary dark:text-white">{peakMonth.name} ({settings.currency}{peakMonth.spend.toFixed(0)})</strong></span>
            </div>

            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rechartsBarData} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="stroke-black/5 dark:stroke-white/10" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickFormatter={(v) => v >= 1000 ? `${settings.currency}${(v/1000).toFixed(1)}k` : `${settings.currency}${v}`}
                  />
                  <Tooltip content={<CustomBarTooltip currency={settings.currency} />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="spend" radius={[5, 5, 0, 0]}>
                    {rechartsBarData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isCurrent ? '#3b82f6' : '#64748b'} 
                        className="transition-all duration-300 hover:opacity-100"
                        opacity={entry.isCurrent ? 1 : 0.65}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-tally-text-secondary dark:text-tally-text-secondaryDark mt-2 pt-2 border-t border-tally-border-light dark:border-tally-border-dark/60">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Current Month
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Past Months
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col h-full">
            {/* Filter Pills for All / Deposits / Withdrawals */}
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-tally-border-light dark:border-tally-border-dark/60">
              <span className="text-[10px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider">
                Funds Flow
              </span>
              <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded-lg text-[10px] font-bold">
                {(['all', 'deposits', 'withdrawals'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPieFilter(filter)}
                    className={cn(
                      "px-2 py-0.5 rounded-md capitalize transition-all",
                      pieFilter === filter
                        ? "bg-white dark:bg-tally-surface-dark text-tally-text-primary dark:text-white shadow-sm"
                        : "text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white"
                    )}
                  >
                    {filter === 'all' ? 'All' : filter === 'deposits' ? 'Deposits' : 'Withdrawals'}
                  </button>
                ))}
              </div>
            </div>

            {/* Donut Chart with Center Metric */}
            <div className="relative w-full h-36 flex items-center justify-center">
              {sortedPieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomPieTooltip currency={settings.currency} />} />
                      <Pie
                        data={sortedPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={64}
                        paddingAngle={sortedPieData.length > 1 ? 3 : 0}
                        dataKey="value"
                        stroke="none"
                      >
                        {sortedPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Metric */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark">
                      {pieFilter === 'deposits' ? 'Deposits' : pieFilter === 'withdrawals' ? 'Withdrawals' : 'Net Flow'}
                    </span>
                    <span className="text-xs font-display font-bold text-tally-text-primary dark:text-white">
                      {settings.currency}{activeSpendTotal >= 1000 ? `${(activeSpendTotal / 1000).toFixed(1)}k` : activeSpendTotal.toFixed(0)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center px-4">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-tally-border-light dark:border-tally-border-dark flex items-center justify-center mb-3">
                    <span className="text-[11px] font-mono font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark">0%</span>
                  </div>
                  <span className="text-xs font-bold text-tally-text-primary dark:text-white mb-1">
                    No {pieFilter === 'deposits' ? 'Deposits' : pieFilter === 'withdrawals' ? 'Withdrawals' : 'Funds Flow'} This Month
                  </span>
                  <p className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark leading-relaxed">
                    Deposits and withdrawals will automatically categorize here.
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Category Breakdown List */}
            {sortedPieData.length > 0 && (
              <div className="w-full space-y-2.5 mt-2 pt-2 border-t border-tally-border-light dark:border-tally-border-dark/60 max-h-36 overflow-y-auto no-scrollbar pr-0.5">
                {sortedPieData.map((item) => (
                  <div key={item.name} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-tally-text-primary dark:text-white truncate max-w-[95px]">
                          {item.name}
                        </span>
                        <span className={cn(
                          "text-[9px] font-bold px-1 py-0.2 rounded",
                          item.isDeposit ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-400"
                        )}>
                          {item.isDeposit ? 'IN' : 'OUT'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark font-mono">
                          {item.pct.toFixed(0)}%
                        </span>
                        <span className="font-mono font-bold text-tally-text-primary dark:text-white text-[11px]">
                          {item.isDeposit ? '+' : '-'}{settings.currency}{item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    {/* Visual proportion bar */}
                    <div className="w-full h-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(4, item.pct)}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mini Sparkline / Totals */}
      <div className="flex justify-between items-end mb-8 px-2">
        {sparkData.map((data, idx) => {
          const isLatest = idx === sparkData.length - 1;
          const h1 = Math.max(10, (data.spend / maxSparkSpend) * 80);
          const h2 = Math.max(15, (data.spend / maxSparkSpend) * 90);
          const h3 = Math.max(20, (data.spend / maxSparkSpend) * 100);
          return (
            <div key={data.label} className="flex flex-col gap-1 items-center">
              <div className="flex items-end gap-1 h-8">
                <div className={cn("w-1 rounded-full", isLatest ? "bg-tally-border-light dark:bg-tally-border-dark" : "bg-tally-border-light dark:bg-tally-border-dark")} style={{ height: `${h1}%` }} />
                <div className={cn("w-1 rounded-full", isLatest ? "bg-tally-border-light dark:bg-tally-border-dark" : "bg-tally-border-light dark:bg-tally-border-dark")} style={{ height: `${h2}%` }} />
                <div className={cn("w-1 rounded-full", isLatest ? "bg-tally-status-success" : "bg-tally-text-primary dark:bg-white")} style={{ height: `${h3}%` }} />
              </div>
              <span className={cn("text-[10px] font-bold", isLatest ? "text-tally-text-primary dark:text-white" : "text-tally-text-secondary dark:text-tally-text-secondaryDark")}>
                {data.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contracts Module Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-tally-text-primary dark:text-white text-sm">Contracts ({subscriptions.length})</h3>
        </div>
        <div className="flex flex-col gap-3 mb-4">
          {recentContracts.length > 0 ? recentContracts.map(contract => (
            <div key={contract.id} className="flex items-center gap-3 p-3 rounded-xl bg-tally-bg-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-tally-primary/30 transition-colors">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm", getBrandColor(contract.category))}>
                {contract.name[0]?.toUpperCase() || 'S'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-tally-text-primary dark:text-white text-sm">{contract.name}</h4>
                  <span className="font-mono font-bold text-xs text-tally-text-primary dark:text-white">
                    {contract.currency || settings.currency}{contract.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold bg-tally-surface-light dark:bg-tally-bg-dark text-tally-text-secondary dark:text-tally-text-secondaryDark px-1.5 py-0.5 rounded uppercase">
                    {contract.billingCycle}
                  </span>
                  <StatusPill status={contract.isActive ? 'ACTIVE' : 'FAILED'} size="sm" />
                </div>
              </div>
            </div>
          )) : (
            <div className="p-4 flex items-center gap-2 text-xs font-medium text-tally-text-secondary dark:text-tally-text-secondaryDark bg-tally-bg-light dark:bg-tally-surface-dark rounded-xl border border-dashed border-tally-border-light dark:border-tally-border-dark">
              <Info className="w-4 h-4" />
              No contracts found
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Modal */}
      <Modal isOpen={showAIModal} onClose={() => setShowAIModal(false)} title="AI Financial Insights">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-16">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-tally-primary/10 to-transparent dark:bg-tally-surface-dark border border-tally-primary/20">
            <div className="w-10 h-10 shrink-0 rounded-full bg-tally-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-tally-primary dark:text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-tally-text-primary dark:text-white mb-2">General Insights</h4>
              {aiLoading ? (
                <div className="flex items-center gap-2 text-tally-text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing your finances...</span>
                </div>
              ) : (
                <div className="text-sm text-tally-text-secondary dark:text-tally-text-secondaryDark leading-relaxed whitespace-pre-line">
                  {aiInsights || "No insights available."}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark">Chat with Tally Wise AI</h4>
            
            <div className="space-y-3">
              {chatHistory.map((msg, i) => (
                <div key={i} className={cn("p-3 rounded-lg text-sm max-w-[85%]", msg.role === 'user' ? "bg-tally-primary text-white ml-auto rounded-tr-none" : "bg-gray-100 dark:bg-gray-800 text-tally-text-primary dark:text-white mr-auto rounded-tl-none")}>
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="p-3 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-tally-text-primary dark:text-white mr-auto rounded-tl-none flex items-center gap-2 max-w-[85%]">
                  <Loader2 className="w-3 h-3 animate-spin" /> AI is typing...
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Input Pinned at Bottom of Modal */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-tally-surface-dark border-t border-tally-border-light dark:border-tally-border-dark rounded-b-2xl">
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your finances..." 
              className="flex-1 bg-gray-50 dark:bg-black/20 border border-tally-border-light dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-tally-primary dark:text-white"
              disabled={chatLoading}
            />
            <button 
              type="submit" 
              disabled={!chatInput.trim() || chatLoading}
              className="p-2.5 bg-tally-primary text-white rounded-xl hover:bg-tally-primary/90 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </Modal>
    </aside>
  );
}
