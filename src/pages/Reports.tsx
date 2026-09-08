
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Card from '../components/Card'
import { formatCurrency, generateId, getTodayDate } from '../utils/helpers'
import toast from 'react-hot-toast'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getCurrentMonth } from '../utils/helpers'

const Reports = () => {
  const { transactions } = useStore()
  const month = getCurrentMonth()
  const expenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(month))
  const grouped: Record<string, number> = {}
  expenses.forEach(e => { grouped[e.category] = (grouped[e.category] || 0) + e.amount })
  const data = Object.keys(grouped).map(k => ({ name: k, value: grouped[k] }))
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualize spending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title={`Expenses by Category — ${month}`}>
          {data.length === 0 ? <div className="text-center py-8">No expense data for this month</div> : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="value" data={data} outerRadius={100} label>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="Summary">
          <div className="p-4">
            <p className="text-sm text-gray-600">Expense categories: {data.length}</p>
            <p className="text-sm text-gray-600 mt-2">Total expense: {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports
