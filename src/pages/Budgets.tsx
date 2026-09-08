
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { formatCurrency, generateId, getTodayDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const Budgets = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const initialForm = { category: '', amount: 0, period: 'monthly', startDate: getTodayDate(), alertThreshold: 80, rollover: false }
  const [formData, setFormData] = useState<Partial<any>>(initialForm)

  const openAdd = () => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true) }
  const openEdit = (id: string) => { const b = budgets.find(x => x.id === id); if (!b) return; setEditingId(id); setFormData({ ...b }); setIsModalOpen(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { id: editingId || generateId(), category: String(formData.category || ''), amount: Number(formData.amount) || 0, spent: Number((formData as any).spent) || 0, period: String(formData.period || 'monthly'), startDate: String(formData.startDate || getTodayDate()), alertThreshold: Number(formData.alertThreshold) || 80, rollover: Boolean(formData.rollover) }
    if (editingId) { updateBudget(editingId, payload as any); toast.success('✅ Budget updated') }
    else { addBudget(payload as any); toast.success('✅ Budget added') }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => { if (!confirm('Delete this budget?')) return; deleteBudget(id); toast.success('✅ Deleted') }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400">Plan and track spending by category</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={20} /> Add Budget</button>
      </div>

      <Card>
        {budgets.length === 0 ? (
          <div className="text-center py-12">No budgets yet</div>
        ) : (
          <div className="space-y-3">
            {budgets.map((b: any) => {
              const percent = Math.min(100, Math.round(((b.spent || 0) / (b.amount || 1)) * 100))
              return (
                <div key={b.id} className="transaction-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{b.category}</div>
                      <div className="text-sm text-gray-500">{b.startDate} • {b.period}</div>
                    </div>
                    <div className="w-1/3">
                      <div className="progress-bar mb-2"><div className="progress-fill bg-green-500" style={{ width: `${percent}%` }} /></div>
                      <div className="text-sm text-gray-600">{formatCurrency(b.spent || 0)} / {formatCurrency(b.amount)} • {percent}%</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(b.id)} className="btn btn-secondary">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Budget' : 'Add Budget'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category</label>
            <input className="input" value={formData.category as string} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} />
          </div>
          <div>
            <label className="label">Amount</label>
            <input type="number" step="0.01" className="input" value={String(formData.amount ?? '')} onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="label">Alert Threshold (%)</label>
            <input type="number" className="input" value={String(formData.alertThreshold ?? '')} onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: Number(e.target.value) }))} />
          </div>
          <div className="flex items-center gap-3">
            <label className="label">Rollover</label>
            <input type="checkbox" checked={Boolean(formData.rollover)} onChange={(e) => setFormData(prev => ({ ...prev, rollover: e.target.checked }))} />
          </div>
          <div className="flex items-center gap-3 justify-end">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Budgets
