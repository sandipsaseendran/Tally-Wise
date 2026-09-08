import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { formatCurrency, generateId, getTodayDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const Accounts = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const initialForm = { name: '', type: 'checking', balance: 0, currency: 'USD', isActive: true, institution: '', lastUpdated: getTodayDate() }
  const [formData, setFormData] = useState<Partial<any>>(initialForm)

  const openAdd = () => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true) }
  const openEdit = (id: string) => { const a = accounts.find(x => x.id === id); if (!a) return; setEditingId(id); setFormData({ ...a }); setIsModalOpen(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { id: editingId || generateId(), name: String(formData.name || ''), type: String(formData.type || 'checking'), balance: Number(formData.balance) || 0, currency: String(formData.currency || 'USD'), isActive: Boolean(formData.isActive), institution: String(formData.institution || ''), lastUpdated: getTodayDate() }
    if (editingId) { updateAccount(editingId, payload as any); toast.success('✅ Account updated') }
    else { addAccount(payload as any); toast.success('✅ Account added') }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => { if (!confirm('Delete this account?')) return; deleteAccount(id); toast.success('✅ Deleted') }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Accounts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your accounts and balances</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={20} /> Add Account</button>
      </div>

      <Card>
        {accounts.length === 0 ? (
          <div className="text-center py-12">No accounts yet</div>
        ) : (
          <div className="space-y-3">
            {accounts.map((a: any) => (
              <div key={a.id} className="transaction-card flex items-center justify-between">
                <div>
                  <div className="font-semibold">{a.name} <span className="text-xs text-gray-500">({a.type})</span></div>
                  <div className="text-sm text-gray-500">{a.institution} • Last: {a.lastUpdated}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-bold">{formatCurrency(a.balance || 0)}</div>
                  <button onClick={() => openEdit(a.id)} className="btn btn-secondary">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Account' : 'Add Account'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={formData.name as string} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Balance</label>
            <input type="number" className="input" value={String(formData.balance ?? '')} onChange={(e) => setFormData(prev => ({ ...prev, balance: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="label">Institution</label>
            <input className="input" value={formData.institution as string} onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))} />
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

export default Accounts
