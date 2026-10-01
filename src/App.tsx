import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { Dashboard } from './pages/Dashboard';
import { Contracts } from './pages/Contracts';
import { Documents } from './pages/Documents';
import { Invoices } from './pages/Invoices';
import { Card } from './pages/Card';
import Transactions from './pages/Transactions';
import { Withdrawal } from './pages/Withdrawal';
import { Referrals } from './pages/Referrals';
import { Settings } from './pages/Settings';
import { Accounts } from './pages/Accounts';
import { Budgets } from './pages/Budgets';
import { Goals } from './pages/Goals';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import Login from './pages/Login';

import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { useStore } from '../store/useStore';

// Protected App Layout Wrapper
function ProtectedLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-tally-text-primaryDark overflow-hidden font-sans transition-colors selection:bg-tally-primary selection:text-tally-primary-dark">
      {/* Left Zone: Sidebar */}
      <Sidebar />

      {/* Center Zone: Main Content */}
      <main className="flex-1 flex relative h-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/card" element={<Card />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Right Zone: Insights Panel */}
      <RightPanel />

      {/* Global AI Assistant Modal */}
      <AIAssistantModal />
    </div>
  );
}

function LoginRoute() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
}

function App() {
  const loadFromStorage = useStore((state) => state.loadFromStorage);
  const handleAuthCallback = useStore((state) => state.handleAuthCallback);

  React.useEffect(() => {
    loadFromStorage();

    // Handle email confirmation redirect — when the user clicks the confirmation
    // link in their email, Supabase redirects back with auth tokens in the URL hash.
    // This detects that and auto-signs the user in.
    handleAuthCallback();
  }, [loadFromStorage, handleAuthCallback]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;