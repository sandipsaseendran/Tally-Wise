import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../i18n';

export function Analytics() {
  const { transactions, settings } = useStore();
  const { t } = useI18n();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

  const thisMonthTx = transactions.filter(t => t.date.startsWith(currentMonth));
  const lastMonthTx = transactions.filter(t => t.date.startsWith(lastMonthStr));

  const income = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netSavings = income - expenses;

  const lastIncome = lastMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastExpenses = lastMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const incomeChange = lastIncome > 0 ? ((income - lastIncome) / lastIncome * 100).toFixed(1) : '0';
  const expenseChange = lastExpenses > 0 ? ((expenses - lastExpenses) / lastExpenses * 100).toFixed(1) : '0';

  // Category breakdown
  const expenseByCategory: Record<string, number> = {};
  thisMonthTx.filter(t => t.type === 'expense').forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  });
  const categoryData = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const totalExpenses = categoryData.reduce((s, [, v]) => s + v, 0) || 1;

  const COLORS = ['from-blue-500 to-blue-600', 'from-emerald-500 to-emerald-600', 'from-violet-500 to-violet-600', 'from-amber-500 to-amber-600', 'from-rose-500 to-rose-600', 'from-cyan-500 to-cyan-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600'];
  const BAR_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500'];

  // Monthly trend (last 6 months)
  const months: { label: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const mTx = transactions.filter(t => t.date.startsWith(key));
    months.push({
      label: d.toLocaleString('default', { month: 'short' }),
      income: mTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: mTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    });
  }
  const maxVal = Math.max(...months.map(m => Math.max(m.income, m.expense)), 1);

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">{t.analytics.title}</h1>
        <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">{t.analytics.subtitle}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: t.analytics.income, value: income, icon: TrendingUp, change: incomeChange, gradient: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-50 dark:bg-emerald-950/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: t.analytics.expenses, value: expenses, icon: TrendingDown, change: expenseChange, gradient: 'from-rose-500 to-red-600', iconBg: 'bg-rose-50 dark:bg-rose-950/30', iconColor: 'text-rose-600 dark:text-rose-400' },
          { label: t.analytics.netSavings, value: netSavings, icon: DollarSign, change: null, gradient: 'from-blue-500 to-indigo-600', iconBg: 'bg-blue-50 dark:bg-blue-950/30', iconColor: 'text-blue-600 dark:text-blue-400' },
        ].map(card => (
          <div key={card.label} className="p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              {card.change !== null && (
                <span className={`flex items-center gap-0.5 text-xs font-bold ${Number(card.change) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {Number(card.change) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(Number(card.change))}% {t.analytics.vsLastMonth}
                </span>
              )}
            </div>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase font-bold tracking-wide">{card.label}</p>
            <p className="text-2xl font-display font-bold text-tally-text-primary dark:text-white mt-1">
              {settings.currency}{Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="p-6 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <h3 className="font-display font-bold text-tally-text-primary dark:text-white mb-6">{t.analytics.monthlyTrend}</h3>
          <div className="flex items-end gap-3 h-48">
            {months.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end h-40">
                  <div className="flex-1 bg-emerald-400 dark:bg-emerald-500 rounded-t-md transition-all" style={{ height: `${(m.income / maxVal) * 100}%`, minHeight: m.income ? '4px' : '0' }} />
                  <div className="flex-1 bg-rose-400 dark:bg-rose-500 rounded-t-md transition-all" style={{ height: `${(m.expense / maxVal) * 100}%`, minHeight: m.expense ? '4px' : '0' }} />
                </div>
                <span className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark font-bold">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-tally-text-secondary"><span className="w-3 h-3 rounded-sm bg-emerald-400" /> {t.analytics.income}</span>
            <span className="flex items-center gap-1.5 text-xs text-tally-text-secondary"><span className="w-3 h-3 rounded-sm bg-rose-400" /> {t.analytics.expenses}</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <h3 className="font-display font-bold text-tally-text-primary dark:text-white mb-6">{t.analytics.categoryBreakdown}</h3>
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-tally-text-secondary dark:text-tally-text-secondaryDark">
              <PieChart className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t.common.noData}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryData.slice(0, 6).map(([cat, val], i) => {
                const pct = Math.round((val / totalExpenses) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-tally-text-primary dark:text-white">{cat}</span>
                      <span className="text-sm font-bold text-tally-text-primary dark:text-white">{settings.currency}{val.toLocaleString()} <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-tally-bg-light dark:bg-tally-bg-dark rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
