import { useState } from 'react';
import { Plus, Landmark, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../i18n';
import { formatCurrency, generateId, getTodayDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const ACCOUNT_TYPES = ['checking', 'savings', 'credit', 'cash', 'investment'] as const;
const TYPE_COLORS: Record<string, string> = {
  checking: 'from-blue-500 to-blue-600',
  savings: 'from-emerald-500 to-emerald-600',
  credit: 'from-rose-500 to-rose-600',
  cash: 'from-amber-500 to-amber-600',
  investment: 'from-violet-500 to-violet-600',
};

export function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount, settings } = useStore();
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialForm = { name: '', type: 'checking' as string, balance: 0, currency: 'USD', isActive: true, institution: '', lastUpdated: getTodayDate() };
  const [formData, setFormData] = useState<typeof initialForm>(initialForm);

  const openAdd = () => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true); };
  const openEdit = (id: string) => { const a = accounts.find(x => x.id === id); if (!a) return; setEditingId(id); setFormData({ name: a.name, type: a.type, balance: a.balance, currency: a.currency, isActive: a.isActive, institution: a.institution || '', lastUpdated: a.lastUpdated }); setIsModalOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Name is required'); return; }
    const payload = { id: editingId || generateId(), name: formData.name, type: formData.type as any, balance: Number(formData.balance) || 0, currency: formData.currency || 'USD', isActive: formData.isActive, institution: formData.institution, lastUpdated: getTodayDate() };
    if (editingId) { updateAccount(editingId, payload as any); toast.success('✅ Account updated'); }
    else { addAccount(payload as any); toast.success('✅ Account added'); }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => { if (!confirm('Delete this account?')) return; deleteAccount(id); toast.success('✅ Deleted'); };
  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">{t.accounts.title}</h1>
          <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">{t.accounts.subtitle}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold text-sm hover:opacity-90 transition-opacity shadow-md">
          <Plus className="w-4 h-4" /> {t.accounts.addAccount}
        </button>
      </div>

      {/* Summary Card */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <p className="text-sm font-medium text-blue-200 uppercase tracking-wide">{t.dashboard.totalBalance}</p>
        <p className="text-3xl font-display font-bold mt-1">{settings.currency}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        <p className="text-sm text-blue-200 mt-2">{accounts.length} {t.accounts.title.toLowerCase()}</p>
      </div>

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-4">
            <Landmark className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-tally-text-primary dark:text-white">{t.accounts.noAccounts}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map(a => (
            <div key={a.id} className="group p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark hover:shadow-floating dark:hover:shadow-floating-dark transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TYPE_COLORS[a.type] || TYPE_COLORS.checking} flex items-center justify-center text-white shadow-sm`}>
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-tally-text-primary dark:text-white">{a.name}</h3>
                    <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark capitalize">{a.type} {a.institution ? `• ${a.institution}` : ''}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(a.id)} className="p-1.5 rounded-lg hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover text-tally-text-secondary"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase font-bold tracking-wide">{t.accounts.balance}</p>
                  <p className="text-2xl font-display font-bold text-tally-text-primary dark:text-white">{settings.currency}{(a.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${a.isActive ? 'bg-tally-status-success text-tally-status-successText dark:bg-tally-status-successDark dark:text-tally-status-successTextDark' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {a.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-display font-bold text-tally-text-primary dark:text-white mb-5">{editingId ? t.accounts.editAccount : t.accounts.addAccount}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.common.name}</label>
                <input className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.accounts.accountType}</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}>
                  {ACCOUNT_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.accounts.balance}</label>
                <input type="number" step="0.01" className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" value={String(formData.balance)} onChange={e => setFormData(p => ({ ...p, balance: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1.5">{t.accounts.institution}</label>
                <input className="w-full px-4 py-2.5 rounded-xl border border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white text-sm focus:outline-none focus:border-blue-500" value={formData.institution} onChange={e => setFormData(p => ({ ...p, institution: e.target.value }))} />
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
