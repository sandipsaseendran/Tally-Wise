import { useState } from 'react';
import { Plus, PiggyBank, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../i18n';
import { generateId, getTodayDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget, settings } = useStore();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialForm = { category: '', amount: 0, period: 'monthly' as string, startDate: getTodayDate(), alertThreshold: 80, rollover: false };
  const [formData, setFormData] = useState<typeof initialForm>(initialForm);

  const openAdd = () => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true); };
  const openEdit = (id: string) => { const b = budgets.find(x => x.id === id); if (!b) return; setEditingId(id); setFormData({ category: b.category, amount: b.amount, period: b.period, startDate: b.startDate, alertThreshold: b.alertThreshold, rollover: b.rollover }); setIsModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category.trim()) { toast.error('Category is required'); return; }
    const payload = { id: editingId || generateId(), category: formData.category, amount: Number(formData.amount) || 0, spent: 0, period: formData.period as any, startDate: formData.startDate, alertThreshold: Number(formData.alertThreshold) || 80, rollover: formData.rollover };
    if (editingId) {
      const existing = budgets.find(b => b.id === editingId);
      payload.spent = existing?.spent || 0;
      updateBudget(editingId, payload as any); toast.success('✅ Budget updated');
    } else { addBudget(payload as any); toast.success('✅ Budget added'); }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => { if (!confirm('Delete this budget?')) return; deleteBudget(id); toast.success('✅ Deleted'); };

  const getBarColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">{t.budgets.title}</h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">{t.budgets.subtitle}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold text-sm hover:opacity-90 transition-opacity shadow-md">
          <Plus className="w-4 h-4" /> {t.budgets.addBudget}
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 mb-4">
            <PiggyBank className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-tally-text-primary dark:text-white">{t.budgets.noBudgets}</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map(b => {
            const percent = Math.min(100, Math.round(((b.spent || 0) / (b.amount || 1)) * 100));
            const remaining = Math.max(0, b.amount - (b.spent || 0));
            return (
              <div key={b.id} className="group p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-tally-text-primary dark:text-white">{b.category}</h3>
                      <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark capitalize">{b.period} • {b.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-tally-text-primary dark:text-white">{settings.currency}{(b.amount || 0).toLocaleString()}</p>
                      <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">{t.budgets.remaining}: {settings.currency}{remaining.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(b.id)} className="p-1.5 rounded-lg hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover text-tally-text-secondary"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
                <div className="w-full h-2 bg-tally-bg-light dark:bg-tally-bg-dark rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${getBarColor(percent)}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark">{t.budgets.spent}: {settings.currency}{(b.spent || 0).toLocaleString()}</span>
                  <span className={`text-xs font-bold ${percent >= 90 ? 'text-red-500' : percent >= 70 ? 'text-amber-500' : 'text-emerald-500'}`}>{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-display font-bold text-tally-text-primary dark:text-white mb-5">{editingId ? t.budgets.editBudget : t.budgets.addBudget}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.common.category}</label>
                <input className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Food, Transport, Entertainment" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.common.amount}</label>
                <input type="number" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={String(formData.amount)} onChange={e => setFormData(p => ({ ...p, amount: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.budgets.alertThreshold} (%)</label>
                <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-emerald-500" value={String(formData.alertThreshold)} onChange={e => setFormData(p => ({ ...p, alertThreshold: Number(e.target.value) }))} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="rollover" checked={formData.rollover} onChange={e => setFormData(p => ({ ...p, rollover: e.target.checked }))} className="w-4 h-4 rounded accent-emerald-500" />
                <label htmlFor="rollover" className="text-sm text-tally-text-primary dark:text-white">{t.budgets.rollover}</label>
              </div>
              <div className="flex items-center gap-3 justify-end pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-tally-border-light dark:border-tally-border-dark text-tally-text-secondary dark:text-tally-text-secondaryDark text-sm font-semibold hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover">{t.common.cancel}</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary text-sm font-bold hover:opacity-90 shadow-sm">{editingId ? t.common.save : t.common.add}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
