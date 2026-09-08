import { ReactNode } from 'react'
const EmptyState = ({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) => (
  <div className="text-center py-16">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
      <div className="text-gray-500 dark:text-gray-400">{icon}</div>
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
    {action}
  </div>
)
export default EmptyState