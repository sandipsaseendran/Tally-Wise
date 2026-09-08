
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { formatCurrency, generateId, getTodayDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [contributeId, setContributeId] = useState<string | null>(null)
  const initialForm = { name: '', targetAmount: 1000, currentAmount: 0, deadline: getTodayDate(), priority: 'medium', category: '', description: '', completed: false, createdAt: getTodayDate() }
  const [formData, setFormData] = useState<Partial<any>>(initialForm)

  const openAdd = () => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true) }
  const openEdit = (id: string) => { const g = goals.find(x => x.id === id); if (!g) return; setEditingId(id); setFormData({ ...g }); setIsModalOpen(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { id: editingId || generateId(), name: String(formData.name || ''), targetAmount: Number(formData.targetAmount) || 0, currentAmount: Number(formData.currentAmount) || 0, deadline: String(formData.deadline || getTodayDate()), priority: String(formData.priority || 'medium'), category: String(formData.category || ''), description: String(formData.description || ''), completed: Boolean(formData.completed), createdAt: String(formData.createdAt || getTodayDate()) }
    if (editingId) { updateGoal(editingId, payload as any); toast.success('✅ Goal updated') }
    else { addGoal(payload as any); toast.success('✅ Goal added') }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => { if (!confirm('Delete this goal?')) return; deleteGoal(id); toast.success('✅ Deleted') }

  const openContribute = (id: string) => { setContributeId(id); setIsModalOpen(true); setFormData({ amount: 0 }) }
  const handleContribute = (e: React.FormEvent) => { e.preventDefault(); if (!contributeId) return; const g = goals.find(x => x.id === contributeId); if (!g) return; const newAmount = (g.currentAmount || 0) + Number((formData as any).amount || 0); updateGoal(contributeId, { ...g, currentAmount: newAmount } as any); toast.success('✅ Contribution added'); setIsModalOpen(false); setContributeId(null) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Create savings goals and track progress</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={20} /> Add Goal</button>
      </div>

      <Card>
        {goals.length === 0 ? (
          <div className="text-center py-12">No goals yet</div>
        ) : (
          <div className="space-y-3">
            {goals.map((g: any) => {
              const percent = Math.min(100, Math.round(((g.currentAmount || 0) / (g.targetAmount || 1)) * 100))
              return (
                <div key={g.id} className="transaction-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{g.name}</div>
                      <div className="text-sm text-gray-500">{g.deadline} • {g.priority}</div>
                    </div>
                    <div className="w-1/3">
                      <div className="progress-bar mb-2"><div className="progress-fill bg-indigo-500" style={{ width: `${percent}%` }} /></div>
                      <div className="text-sm text-gray-600">{formatCurrency(g.currentAmount || 0)} / {formatCurrency(g.targetAmount)} • {percent}%</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(g.id)} className="btn btn-secondary">Edit</button>
                      <button onClick={() => openContribute(g.id)} className="btn btn-primary">Contribute</button>
                      <button onClick={() => handleDelete(g.id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setContributeId(null) }} title={contributeId ? 'Contribute to Goal' : (editingId ? 'Edit Goal' : 'Add Goal')}>
        {contributeId ? (
          <form onSubmit={handleContribute} className="space-y-4">
            <div>
              <label className="label">Amount</label>
              <input type="number" step="0.01" className="input" value={String((formData as any).amount ?? '')} onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button type="button" onClick={() => { setIsModalOpen(false); setContributeId(null) }} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Add</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="input" value={formData.name as string} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Target Amount</label>
              <input type="number" step="0.01" className="input" value={String(formData.targetAmount ?? '')} onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="label">Deadline</label>
              <input type="date" className="input" value={formData.deadline as string} onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? 'Save' : 'Add'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default Goals
