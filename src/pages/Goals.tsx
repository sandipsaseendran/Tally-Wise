import { useState } from 'react';
import { Plus, Target, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../i18n';
import { generateId, getTodayDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const PRIORITY_COLORS = { low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' };

export function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal, settings } = useStore();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState(0);
  const initialForm = { name: '', targetAmount: 1000, currentAmount: 0, deadline: getTodayDate(), priority: 'medium' as string, category: '', description: '', completed: false };
  const [formData, setFormData] = useState<typeof initialForm>(initialForm);

  const openAdd = () => { setEditingId(null); setContributeId(null); setFormData(initialForm); setIsModalOpen(true); };
  const openEdit = (id: string) => { const g = goals.find(x => x.id === id); if (!g) return; setEditingId(id); setContributeId(null); setFormData({ name: g.name, targetAmount: g.targetAmount, currentAmount: g.currentAmount, deadline: g.deadline, priority: g.priority, category: g.category, description: g.description, completed: g.completed }); setIsModalOpen(true); };
  const openContribute = (id: string) => { setContributeId(id); setEditingId(null); setContributeAmount(0); setIsModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Name is required'); return; }
    const payload = { id: editingId || generateId(), name: formData.name, targetAmount: Number(formData.targetAmount) || 0, currentAmount: Number(formData.currentAmount) || 0, deadline: formData.deadline, priority: formData.priority as any, category: formData.category, description: formData.description, completed: formData.completed, createdAt: getTodayDate() };
    if (editingId) { updateGoal(editingId, payload as any); toast.success('✅ Goal updated'); }
    else { addGoal(payload as any); toast.success('✅ Goal added'); }
    setIsModalOpen(false);
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeId) return;
    const g = goals.find(x => x.id === contributeId);
    if (!g) return;
    const newAmount = (g.currentAmount || 0) + (contributeAmount || 0);
    updateGoal(contributeId, { ...g, currentAmount: newAmount } as any);
    toast.success('✅ Contribution added');
    setIsModalOpen(false); setContributeId(null);
  };

  const handleDelete = (id: string) => { if (!confirm('Delete this goal?')) return; deleteGoal(id); toast.success('✅ Deleted'); };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">{t.goals.title}</h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">{t.goals.subtitle}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold text-sm hover:opacity-90 transition-opacity shadow-md">
          <Plus className="w-4 h-4" /> {t.goals.addGoal}
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-4">
            <Target className="w-8 h-8 text-violet-500 dark:text-violet-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-tally-text-primary dark:text-white">{t.goals.noGoals}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(g => {
            const percent = Math.min(100, Math.round(((g.currentAmount || 0) / (g.targetAmount || 1)) * 100));
            return (
              <div key={g.id} className="group p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-tally-text-primary dark:text-white">{g.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${PRIORITY_COLORS[g.priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium}`}>{g.priority}</span>
                        <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">{g.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(g.id)} className="p-1.5 rounded-lg hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover text-tally-text-secondary"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(g.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-tally-text-secondary dark:text-tally-text-secondaryDark">{settings.currency}{(g.currentAmount || 0).toLocaleString()}</span>
                    <span className="font-bold text-tally-text-primary dark:text-white">{settings.currency}{(g.targetAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2.5 bg-tally-bg-light dark:bg-tally-bg-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className={`text-xs font-bold ${percent >= 100 ? 'text-emerald-500' : 'text-violet-500'}`}>{percent}%</span>
                    {g.completed && <span className="text-xs font-bold text-emerald-500">✓ {t.goals.completed}</span>}
                  </div>
                </div>

                <button onClick={() => openContribute(g.id)} className="w-full py-2 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-bold hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors flex items-center justify-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {t.goals.contribute}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => { setIsModalOpen(false); setContributeId(null); }}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-display font-bold text-tally-text-primary dark:text-white mb-5">
              {contributeId ? t.goals.contribute : editingId ? t.goals.editGoal : t.goals.addGoal}
            </h2>
            {contributeId ? (
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.common.amount}</label>
                  <input type="number" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-violet-500" value={String(contributeAmount)} onChange={e => setContributeAmount(Number(e.target.value))} />
                </div>
                <div className="flex items-center gap-3 justify-end pt-2">
                  <button type="button" onClick={() => { setIsModalOpen(false); setContributeId(null); }} className="px-4 py-2 rounded-xl border border-tally-border-light dark:border-tally-border-dark text-tally-text-secondary text-sm font-semibold">{t.common.cancel}</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary text-sm font-bold hover:opacity-90 shadow-sm">{t.common.add}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.common.name}</label>
                  <input className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-violet-500" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.goals.targetAmount}</label>
                    <input type="number" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-violet-500" value={String(formData.targetAmount)} onChange={e => setFormData(p => ({ ...p, targetAmount: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.goals.deadline}</label>
                    <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-violet-500" value={formData.deadline} onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.goals.priority}</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm" value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value }))}>
                    <option value="low">{t.goals.low}</option>
                    <option value="medium">{t.goals.medium}</option>
                    <option value="high">{t.goals.high}</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-tally-border-light dark:border-tally-border-dark text-tally-text-secondary text-sm font-semibold">{t.common.cancel}</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary text-sm font-bold hover:opacity-90 shadow-sm">{editingId ? t.common.save : t.common.add}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
