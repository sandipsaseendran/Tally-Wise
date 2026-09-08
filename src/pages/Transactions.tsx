import { useState } from 'react'
import { Plus, ShoppingBag, Car, Coffee, DollarSign, ArrowUpRight, Edit2, Trash2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Modal from '../components/Modal'
import { generateId, getTodayDate } from '../utils/helpers'
import toast from 'react-hot-toast'
import { ThemeToggle } from '../components/shared/ThemeToggle'
import { StatusPill } from '../components/shared/StatusPill'

const getCategoryIconAndColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('grocer') || cat.includes('food') || cat.includes('market')) return { icon: ShoppingBag, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  if (cat.includes('transport') || cat.includes('uber') || cat.includes('gas')) return { icon: Car, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
  if (cat.includes('din') || cat.includes('coffee') || cat.includes('restaurant')) return { icon: Coffee, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  if (cat.includes('deposit') || cat.includes('income') || cat.includes('salary') || cat.includes('withdrawal')) return { icon: DollarSign, color: 'bg-tally-status-success/20 text-tally-status-successText dark:text-tally-status-successTextDark' };
  return { icon: ArrowUpRight, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
};

const Transactions = () => {
  const { transactions, settings, addTransaction, updateTransaction, deleteTransaction } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const initialForm = { date: getTodayDate(), amount: 0, type: 'expense', category: '', account: 'Cash', description: '' }
  const [formData, setFormData] = useState<Partial<any>>(initialForm)

  const openAdd = () => {
    setEditingId(null)
    setFormData(initialForm)
    setIsModalOpen(true)
  }

  const openEdit = (id: string) => {
    const t = transactions.find(x => x.id === id)
    if (!t) return
    setEditingId(id)
    setFormData({ ...t })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      id: editingId || generateId(),
      date: String(formData.date || getTodayDate()),
      amount: Number(formData.amount) || 0,
      type: (formData.type as any) || 'expense',
      category: String(formData.category || ''),
      account: String(formData.account || 'Cash'),
      description: String(formData.description || ''),
    }

    if (editingId) {
      updateTransaction(editingId, payload as any)
      toast.success('Transaction updated')
    } else {
      addTransaction(payload as any)
      toast.success('Transaction added')
    }

    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    deleteTransaction(id)
    toast.success('Transaction deleted')
  }

  // Reverse to show newest first
  const displayTransactions = [...transactions].reverse()

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-10 pr-12 w-full">
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>

      <div className="flex items-end justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] font-display font-medium text-tally-text-primary dark:text-white tracking-tight">
            Transactions
          </h1>
          <p className="text-sm font-medium text-tally-text-secondary dark:text-tally-text-secondaryDark tracking-wide">
            Track your income and expenses across all accounts.
          </p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c2127] dark:bg-white text-white dark:text-tally-text-primary font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      <div className="flex flex-col gap-2 max-w-4xl">
        {displayTransactions.length === 0 ? (
          <div className="text-center py-20 text-tally-text-secondary dark:text-tally-text-secondaryDark">
            <p className="font-medium">No transactions found.</p>
            <p className="text-sm mt-1">Add a transaction to get started.</p>
          </div>
        ) : (
          displayTransactions.map((t: any) => {
            const { icon: Icon, color } = getCategoryIconAndColor(t.category);
            return (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-tally-surface-darkHover border border-transparent hover:border-gray-200 dark:hover:border-tally-border-dark hover:shadow-sm transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-tally-text-primary dark:text-white text-base">{t.description || t.category}</span>
                    <span className="text-xs font-semibold text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">{t.date} • {t.category} • {t.account}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-end gap-2">
                    <span className={`font-bold text-lg ${t.type === 'income' ? 'text-tally-status-successText dark:text-tally-status-successTextDark' : 'text-tally-text-primary dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{settings.currency}{Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <StatusPill status={'SUCCESS'} size="sm" />
                  </div>
                  
                  {/* Action Buttons - Visible on Hover */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEdit(t.id)} 
                      className="p-2 rounded-xl bg-gray-50 dark:bg-tally-surface-dark text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-primary dark:hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id)} 
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Transaction' : 'Add Transaction'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors" 
              value={formData.date as string} 
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Amount</label>
            <input 
              type="number" 
              step="0.01" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors" 
              value={String(formData.amount ?? '')} 
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Type</label>
            <select 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors" 
              value={formData.type as string} 
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Category</label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors" 
              value={formData.category as string} 
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Account</label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors" 
              value={formData.account as string} 
              onChange={(e) => setFormData(prev => ({ ...prev, account: e.target.value }))} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-2">Description</label>
            <input 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-tally-surface-dark border border-gray-200 dark:border-tally-border-dark text-tally-text-primary dark:text-white font-semibold outline-none focus:border-tally-primary transition-colors" 
              value={formData.description as string} 
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
            />
          </div>
          
          <button 
            type="submit"
            className="mt-4 w-full py-3 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-bold hover:opacity-90 transition-opacity"
          >
            {editingId ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default Transactions
