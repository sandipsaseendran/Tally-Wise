import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../store/useStore'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const setAIAssistantOpen = useStore((state) => state.setAIAssistantOpen)

  const links = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/contracts', label: 'Contracts', icon: '📄' },
    { path: '/documents', label: 'Documents', icon: '📑' },
    { path: '/invoices', label: 'Invoices', icon: '🧾' },
    { path: '/card', label: 'Card', icon: '💳' },
    { path: '/transactions', label: 'Transactions', icon: '🔄' },
    { path: '/withdrawal', label: 'Withdrawal', icon: '💸' },
  ]

  return (
    <div className="min-h-screen flex bg-[#f8f9fa] dark:bg-tally-bg-dark">
      {/* Mobile Sidebar Overlay */}
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-tally-surface-dark rounded-full shadow-md">
          <Menu className="w-5 h-5 text-tally-text-primary dark:text-white" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`fixed md:static top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-[280px]' : 'w-0 md:w-0'} bg-white dark:bg-[#1a1b1e] border-r border-gray-100 dark:border-tally-border-dark overflow-hidden shrink-0`}>
        {/* Logo */}
        <div className="p-8 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Tally Wise Logo" className="w-9 h-9 rounded-full object-cover object-center shadow-sm" />
              <span className="text-xl font-bold font-display tracking-tight text-tally-text-primary dark:text-white">Tally Wise</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button className="p-2 text-tally-text-secondary hover:text-tally-text-primary dark:hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-tally-text-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {links.map(link => {
            const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#f4f5f7] dark:bg-tally-surface-darkHover text-tally-text-primary dark:text-white font-semibold' 
                    : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:bg-gray-50 dark:hover:bg-tally-surface-dark/50'
                }`}
              >
                <span className="text-xl grayscale opacity-70">{link.icon}</span>
                {sidebarOpen && <span className="tracking-wide text-[15px]">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Upgrade Card */}
        {sidebarOpen && (
          <div className="p-6">
            <div className="bg-[#f8f9fa] dark:bg-tally-surface-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-tally-border-dark">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-tally-bg-dark flex items-center justify-center mb-4 shadow-sm">
                ✨
              </div>
              <h4 className="font-semibold text-tally-text-primary dark:text-white mb-2">AI Assistant</h4>
              <p className="text-sm text-tally-text-secondary dark:text-tally-text-secondaryDark mb-6 leading-relaxed">
                Chat with Tally Wise AI for personalized insights.
              </p>
              <button 
                type="button"
                onClick={() => setAIAssistantOpen(true)}
                className="w-full py-3 bg-[#1c2127] dark:bg-tally-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Try AI Sphere
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#ffffff] dark:bg-tally-bg-dark rounded-tl-[40px] shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] border-l border-gray-100 dark:border-tally-border-dark">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
