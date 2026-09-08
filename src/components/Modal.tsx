import { X } from 'lucide-react'
import { ReactNode } from 'react'
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-tally-bg-dark w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-xl border border-tally-border-light dark:border-tally-border-dark overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-tally-surface-dark border-b border-tally-border-light dark:border-tally-border-dark flex items-center justify-between p-6 z-10 shrink-0">
          <h2 className="text-xl font-bold text-tally-text-primary dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-tally-text-secondary hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
export default Modal