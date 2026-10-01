import { FileBarChart, Download, PieChart as PieChartIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../i18n';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

export function Reports() {
  const { transactions, settings } = useStore();
  const { t } = useI18n();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthExpenses = transactions.filter(tx => tx.type === 'expense' && tx.date.startsWith(currentMonth));

  const grouped: Record<string, number> = {};
  monthExpenses.forEach(e => { grouped[e.category] = (grouped[e.category] || 0) + e.amount; });
  const pieData = Object.keys(grouped).map(k => ({ name: k, value: grouped[k] }));
  const totalExpense = monthExpenses.reduce((s, e) => s + e.amount, 0);

  // Monthly data for bar chart
  const barData: { month: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const mTx = transactions.filter(tx => tx.date.startsWith(key));
    barData.push({
      month: d.toLocaleString('default', { month: 'short' }),
      income: mTx.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0),
      expense: mTx.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0),
    });
  }

  const totalIncome = transactions.filter(tx => tx.type === 'income' && tx.date.startsWith(currentMonth)).reduce((s, tx) => s + tx.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  const handleDownload = () => {
    const csvRows = ['Date,Type,Category,Amount,Description'];
    transactions.forEach(tx => csvRows.push(`${tx.date},${tx.type},${tx.category},${tx.amount},"${tx.description}"`));
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `tallywise-report-${currentMonth}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">{t.reports.title}</h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">{t.reports.subtitle}</p>
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold text-sm hover:opacity-90 transition-opacity shadow-md">
          <Download className="w-4 h-4" /> {t.reports.downloadReport}
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase font-bold tracking-wide">{t.reports.expenseCategories}</p>
          <p className="text-3xl font-display font-bold text-tally-text-primary dark:text-white mt-1">{pieData.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase font-bold tracking-wide">{t.reports.totalExpense}</p>
          <p className="text-3xl font-display font-bold text-tally-text-primary dark:text-white mt-1">{settings.currency}{totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase font-bold tracking-wide">{t.reports.savingsRate}</p>
          <p className={`text-3xl font-display font-bold mt-1 ${savingsRate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{savingsRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="p-6 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <h3 className="font-display font-bold text-tally-text-primary dark:text-white mb-4">{t.reports.expensesByCategory} — {currentMonth}</h3>
          {pieData.length === 0 ? (
            <div className="text-center py-12 text-tally-text-secondary dark:text-tally-text-secondaryDark">
              <PieChartIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t.common.noData}</p>
            </div>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="value" data={pieData} outerRadius={100} innerRadius={50} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val: number) => `${settings.currency}${val.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="p-6 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <h3 className="font-display font-bold text-tally-text-primary dark:text-white mb-4">{t.reports.incomeVsExpense}</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: number) => `${settings.currency}${val.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name={t.analytics.income} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name={t.analytics.expenses} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
