import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { PageSkeleton } from './components/shared/PageSkeleton';
import { useStore } from '../store/useStore';

// Lazy-loaded route components for optimal initial bundle size and Vercel performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Contracts = lazy(() => import('./pages/Contracts').then(m => ({ default: m.Contracts })));
const Documents = lazy(() => import('./pages/Documents').then(m => ({ default: m.Documents })));
const Invoices = lazy(() => import('./pages/Invoices').then(m => ({ default: m.Invoices })));
const Card = lazy(() => import('./pages/Card').then(m => ({ default: m.Card })));
const Transactions = lazy(() => import('./pages/Transactions'));
const Withdrawal = lazy(() => import('./pages/Withdrawal').then(m => ({ default: m.Withdrawal })));
const Accounts = lazy(() => import('./pages/Accounts').then(m => ({ default: m.Accounts })));
const Budgets = lazy(() => import('./pages/Budgets').then(m => ({ default: m.Budgets })));
const Goals = lazy(() => import('./pages/Goals').then(m => ({ default: m.Goals })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Referrals = lazy(() => import('./pages/Referrals').then(m => ({ default: m.Referrals })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login'));

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
        <Suspense fallback={<PageSkeleton />}>
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
        </Suspense>
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
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Login />
    </Suspense>
  );
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