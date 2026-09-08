import { ReactNode } from 'react'
const Card = ({ title, children, className = '', action }: { title?: string; children: ReactNode; className?: string; action?: ReactNode }) => (
  <div className={`glass rounded-2xl p-6 shadow-xl ${className}`}>
    {(title || action) && <div className="flex items-center justify-between mb-4">{title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}{action}</div>}
    {children}
  </div>
)
export default Card