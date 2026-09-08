import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Card from '../components/Card'
import { formatCurrency, generateId, getTodayDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const PageName = () => {
  const { transactions: items, addTransaction: addItem, updateTransaction: updateItem, deleteTransaction: deleteItem } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ /* form fields */ })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const item = { id: generateId(), ...formData }
    addItem(item as any)
    toast.success('✅ Added!')
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Page Title</h1>
          <p className="text-gray-600 dark:text-gray-400">Page description</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={20} /> Add Item
        </button>
      </div>

      <Card>
        {items.length === 0 ? (
          <div className="text-center py-12">No items yet</div>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="transaction-card">
                {/* Item display */}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default PageName
