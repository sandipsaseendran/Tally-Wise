import { create } from 'zustand'
import { Transaction, Budget, Goal, Account, Bill, Debt, Investment, Subscription, Category, AppSettings, AppDocument, User, Invoice, InvoiceStatus } from '../src/types'
import localforage from 'localforage'
import { generateId, getTodayDate } from '../src/utils/helpers'
import { isSupabaseConfigured, getSupabase } from '../src/lib/supabase'
import { 
  fetchSupabaseUserData,
  dbInsertTransaction,
  dbUpdateTransaction,
  dbDeleteTransaction,
  dbInsertAccount,
  dbUpdateAccount,
  dbDeleteAccount,
  dbInsertBudget,
  dbUpdateBudget,
  dbDeleteBudget,
  dbInsertGoal,
  dbUpdateGoal,
  dbDeleteGoal,
  dbInsertBill,
  dbUpdateBill,
  dbDeleteBill,
  dbInsertDebt,
  dbUpdateDebt,
  dbDeleteDebt,
  dbInsertInvestment,
  dbUpdateInvestment,
  dbDeleteInvestment,
  dbInsertSubscription,
  dbUpdateSubscription,
  dbDeleteSubscription,
  dbInsertDocument,
  dbDeleteDocument,
  dbSaveSettings,
} from '../src/services/supabaseService'

interface Store {
  currentUser: User | null
  isAuthenticated: boolean
  isCloudConnected: boolean
  syncFromSupabase: (userId?: string) => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string; needsConfirmation?: boolean }>
  validateLoginCredentials: (email: string, password: string) => { success: boolean; message?: string; user?: User }
  checkEmailAvailable: (email: string) => { available: boolean; message?: string }
  loginWithUser: (user: User) => void
  sendEmailOtp: (email: string, name?: string) => Promise<{ success: boolean; message?: string; isRateLimited?: boolean; isEmailError?: boolean }>
  verifyEmailOtp: (email: string, token: string) => Promise<{ success: boolean; message?: string; user?: User }>
  handleAuthCallback: () => Promise<void>
  logout: () => void
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  accounts: Account[]
  bills: Bill[]
  debts: Debt[]
  investments: Investment[]
  subscriptions: Subscription[]
  categories: Category[]
  settings: AppSettings
  documents: AppDocument[]
  invoices: Invoice[]
  addInvoice: (inv: Invoice) => void
  updateInvoice: (id: string, inv: Invoice) => void
  deleteInvoice: (id: string) => void
  markInvoiceStatus: (id: string, status: InvoiceStatus) => void
  addDocument: (d: AppDocument) => void
  deleteDocument: (id: string) => void
  addTransaction: (t: Transaction) => void
  updateTransaction: (id: string, t: Transaction) => void
  deleteTransaction: (id: string) => void
  clearTransactions: () => void
  addBudget: (b: Budget) => void
  updateBudget: (id: string, b: Budget) => void
  deleteBudget: (id: string) => void
  addGoal: (g: Goal) => void
  updateGoal: (id: string, g: Goal) => void
  deleteGoal: (id: string) => void
  addAccount: (a: Account) => void
  updateAccount: (id: string, a: Account) => void
  deleteAccount: (id: string) => void
  addBill: (b: Bill) => void
  updateBill: (id: string, b: Bill) => void
  deleteBill: (id: string) => void
  addDebt: (d: Debt) => void
  updateDebt: (id: string, d: Debt) => void
  deleteDebt: (id: string) => void
  addInvestment: (i: Investment) => void
  updateInvestment: (id: string, i: Investment) => void
  deleteInvestment: (id: string) => void
  addSubscription: (s: Subscription) => void
  updateSubscription: (id: string, s: Subscription) => void
  deleteSubscription: (id: string) => void
  updateSettings: (s: Partial<AppSettings>) => void
  loadFromStorage: () => void
  isAIAssistantOpen: boolean
  setAIAssistantOpen: (open: boolean) => void
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', icon: '💰', color: '#10b981', type: 'income' },
  { id: '2', name: 'Bonus', icon: '🎁', color: '#06b6d4', type: 'income' },
  { id: '3', name: 'Freelance', icon: '💻', color: '#3b82f6', type: 'income' },
  { id: '4', name: 'Food', icon: '🍔', color: '#f59e0b', type: 'expense' },
  { id: '5', name: 'Transport', icon: '🚗', color: '#ec4899', type: 'expense' },
  { id: '6', name: 'Utilities', icon: '💡', color: '#f97316', type: 'expense' },
  { id: '7', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense' },
  { id: '8', name: 'Shopping', icon: '🛍️', color: '#06b6d4', type: 'expense' },
  { id: '9', name: 'Health', icon: '🏥', color: '#ef4444', type: 'expense' },
]

export const defaultAccounts: Account[] = [];

export const isMockAccount = (acc: any): boolean => {
  if (!acc) return false;
  return (
    acc.id === 'card-1' ||
    acc.id === 'card-2' ||
    acc.id === 'card-3' ||
    acc.id === '1' ||
    acc.name === 'Chase Sapphire Reserve' ||
    acc.name === 'Amex Platinum Card' ||
    acc.name === 'Silicon Premier Checking' ||
    acc.name === 'Cash Reserve'
  );
};

export const defaultTransactions: Transaction[] = [];

const sanitizeTransactions = (txs: any): Transaction[] => {
  if (!Array.isArray(txs)) return [];
  return txs.filter((t) => typeof t.id === 'string' && !t.id.startsWith('tx-'));
};

export const defaultUsers: any[] = [];

const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('tallywise-current-user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return null;
};

const getInitialData = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('tallywise-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.accounts)) {
          parsed.accounts = parsed.accounts.filter((a: any) => !isMockAccount(a));
        }
        return parsed;
      }
    } catch (e) {}
  }
  return null;
};

const initialUser = getInitialUser();
const initialData = getInitialData();

export const useStore = create<Store>((set, get) => ({
  currentUser: initialUser,
  isAuthenticated: !!initialUser,
  isCloudConnected: isSupabaseConfigured(),

  syncFromSupabase: async (userId?: string) => {
    const targetId = userId || get().currentUser?.id;
    if (!targetId || !isSupabaseConfigured()) return;
    try {
      const data = await fetchSupabaseUserData(targetId);
      if (data) {
        // Real database data is the single source of truth - no mock fallbacks
        set({
          accounts: data.accounts,
          transactions: data.transactions,
          budgets: data.budgets,
          goals: data.goals,
          bills: data.bills,
          debts: data.debts,
          investments: data.investments,
          subscriptions: data.subscriptions,
          documents: data.documents,
          settings: data.settings || get().settings,
          isCloudConnected: true,
        });

        // If this browser had local accounts previously created, push them to Supabase
        const localRaw = localStorage.getItem('tallywise-data');
        if (localRaw) {
          try {
            const local = JSON.parse(localRaw);
            const pendingAccounts = (local.accounts || []).filter(
              (la: any) => !isMockAccount(la) && !data.accounts.some((da) => da.id === la.id || da.name === la.name)
            );
            if (pendingAccounts.length > 0) {
              for (const pa of pendingAccounts) {
                await dbInsertAccount(pa, targetId);
              }
              const refreshed = await fetchSupabaseUserData(targetId);
              if (refreshed) {
                set({ accounts: refreshed.accounts, transactions: refreshed.transactions });
              }
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }
  },

  login: async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          return { success: false, message: error.message };
        }

        if (data?.user) {
          const user: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || cleanEmail.split('@')[0],
            email: data.user.email || cleanEmail,
            avatarUrl: data.user.user_metadata?.avatar_url,
            createdAt: data.user.created_at,
          };
          localStorage.setItem('tallywise-current-user', JSON.stringify(user));
          set({ currentUser: user, isAuthenticated: true, isCloudConnected: true });
          await get().syncFromSupabase(user.id);
          return { success: true };
        }
      }
    }

    // 2. Fallback: Local offline mock users
    const usersRaw = localStorage.getItem('tallywise-users');
    let usersList = usersRaw ? JSON.parse(usersRaw) : defaultUsers;
    if (!usersRaw) {
      localStorage.setItem('tallywise-users', JSON.stringify(defaultUsers));
    }
    const matched = usersList.find((u: any) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, message: 'No account found with this email address.' };
    }
    if (matched.password !== password) {
      return { success: false, message: 'Incorrect password. Please check your credentials.' };
    }
    const user: User = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      createdAt: matched.createdAt || new Date().toISOString(),
    };
    localStorage.setItem('tallywise-current-user', JSON.stringify(user));
    set({ currentUser: user, isAuthenticated: true, isCloudConnected: false });
    return { success: true };
  },

  register: async (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase SignUp if configured
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
              name: name.trim(),
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          // Detect email delivery failures and provide a clear message
          const msg = error.message.toLowerCase();
          if (msg.includes('error sending') || msg.includes('magic link') || msg.includes('confirmation') || (error as any).status === 500) {
            return { success: false, message: 'Email service unavailable. Please check your Supabase SMTP settings, or sign in with Google.' };
          }
          return { success: false, message: error.message };
        }

        if (data?.user) {
          // Check if Supabase requires email confirmation (user exists but isn't confirmed)
          const isConfirmed = data.user.confirmed_at || data.session;
          if (!isConfirmed) {
            // Email confirmation required — don't auto-login
            return { success: true, needsConfirmation: true };
          }

          // User is already confirmed (e.g. email confirmation disabled in Supabase dashboard)
          const user: User = {
            id: data.user.id,
            name: name.trim(),
            email: data.user.email || cleanEmail,
            createdAt: data.user.created_at,
          };
          localStorage.setItem('tallywise-current-user', JSON.stringify(user));
          set({ currentUser: user, isAuthenticated: true, isCloudConnected: true });
          await get().syncFromSupabase(user.id);
          return { success: true };
        }
      }
    }

    // 2. Fallback: Local offline registration
    const usersRaw = localStorage.getItem('tallywise-users');
    let usersList = usersRaw ? JSON.parse(usersRaw) : [...defaultUsers];
    const exists = usersList.some((u: any) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: cleanEmail,
      password,
      createdAt: new Date().toISOString(),
    };
    usersList.push(newUser);
    localStorage.setItem('tallywise-users', JSON.stringify(usersList));
    
    const user: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
    localStorage.setItem('tallywise-current-user', JSON.stringify(user));
    set({ currentUser: user, isAuthenticated: true, isCloudConnected: false });
    return { success: true };
  },

  validateLoginCredentials: (email, password) => {
    const usersRaw = localStorage.getItem('tallywise-users');
    let usersList = usersRaw ? JSON.parse(usersRaw) : defaultUsers;
    if (!usersRaw) {
      localStorage.setItem('tallywise-users', JSON.stringify(defaultUsers));
    }
    const cleanEmail = email.trim().toLowerCase();
    const matched = usersList.find((u: any) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, message: 'No account found with this email address.' };
    }
    if (matched.password !== password) {
      return { success: false, message: 'Incorrect password. Please check your credentials.' };
    }
    const user: User = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      createdAt: matched.createdAt || new Date().toISOString(),
    };
    return { success: true, user };
  },

  checkEmailAvailable: (email) => {
    const usersRaw = localStorage.getItem('tallywise-users');
    let usersList = usersRaw ? JSON.parse(usersRaw) : [...defaultUsers];
    const cleanEmail = email.trim().toLowerCase();
    const exists = usersList.some((u: any) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { available: false, message: 'An account with this email already exists.' };
    }
    return { available: true };
  },

  loginWithUser: (user) => {
    localStorage.setItem('tallywise-current-user', JSON.stringify(user));
    set({ currentUser: user, isAuthenticated: true, isCloudConnected: isSupabaseConfigured() });
    if (isSupabaseConfigured() && user.id) {
      get().syncFromSupabase(user.id);
    }
  },

  handleAuthCallback: async () => {
    if (!isSupabaseConfigured()) return;
    const client = getSupabase();
    if (!client) return;

    try {
      // This picks up the auth tokens from the URL hash after email confirmation redirect
      const { data: { session }, error } = await client.auth.getSession();
      if (error || !session?.user) return;

      const supaUser = session.user;
      const user: User = {
        id: supaUser.id,
        name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
        email: supaUser.email || '',
        avatarUrl: supaUser.user_metadata?.avatar_url,
        createdAt: supaUser.created_at,
      };
      localStorage.setItem('tallywise-current-user', JSON.stringify(user));
      set({ currentUser: user, isAuthenticated: true, isCloudConnected: true });
      await get().syncFromSupabase(user.id);
    } catch (err) {
      console.error('Auth callback error:', err);
    }
  },

  sendEmailOtp: async (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase is not configured. Please check your environment variables.' };
    }

    const client = getSupabase();
    if (!client) {
      return { success: false, message: 'Supabase client could not be initialized.' };
    }

    try {
      const { error } = await client.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
          data: name?.trim() ? { full_name: name.trim(), name: name.trim() } : undefined,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        const isRateLimit = error.message.toLowerCase().includes('rate limit') || (error as any).status === 429;
        const isTimeout = error.message.toLowerCase().includes('504') || error.message.toLowerCase().includes('timeout') || (error as any).status === 504;
        const isEmailError = error.message.toLowerCase().includes('confirmation email') || error.message.toLowerCase().includes('error sending') || error.message.toLowerCase().includes('magic link') || (error as any).status === 500 || isTimeout;
        return { 
          success: false, 
          isRateLimited: isRateLimit || isEmailError,
          isEmailError,
          message: isTimeout
            ? 'SMTP Timeout (HTTP 504): Supabase timed out connecting to the mail server. For Gmail, change Port to 587, or switch to Resend.'
            : isEmailError
            ? 'Supabase email service error: Could not dispatch confirmation email. Check SMTP settings or use Dev Code / Google Sign-In.'
            : isRateLimit
            ? 'Supabase email rate limit exceeded (free projects allow ~3-4 emails/hr). Use Google, Password login, or the dev bypass code.'
            : error.message 
        };
      }

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || '';
      const isRateLimit = msg.toLowerCase().includes('rate limit');
      const isTimeout = msg.toLowerCase().includes('504') || msg.toLowerCase().includes('timeout');
      const isEmailError = msg.toLowerCase().includes('confirmation email') || msg.toLowerCase().includes('error sending') || isTimeout;
      return { 
        success: false, 
        isRateLimited: isRateLimit || isEmailError,
        isEmailError,
        message: isTimeout
          ? 'SMTP Timeout (HTTP 504): Mail server connection timed out. Change port to 587 or use Resend.'
          : isEmailError
          ? 'Supabase email service error: Could not send email. Use Dev Code or Google Sign-In.'
          : isRateLimit 
          ? 'Supabase email rate limit exceeded (free projects allow ~3-4 emails/hr).'
          : msg || 'Failed to send verification code.' 
      };
    }
  },

  verifyEmailOtp: async (email: string, token: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    if (!cleanEmail || !cleanToken) {
      return { success: false, message: 'Please enter a valid 6-digit verification code.' };
    }

    // Dev bypass / fallback code (123456) for local testing when Supabase rate limit is hit
    if (cleanToken === '123456') {
      const user: User = {
        id: `usr_${Date.now()}`,
        name: cleanEmail.split('@')[0] || 'User',
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('tallywise-current-user', JSON.stringify(user));
      set({ currentUser: user, isAuthenticated: true, isCloudConnected: isSupabaseConfigured() });
      if (isSupabaseConfigured()) {
        get().syncFromSupabase(user.id);
      }
      return { success: true, user };
    }

    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase is not configured.' };
    }

    const client = getSupabase();
    if (!client) {
      return { success: false, message: 'Supabase client could not be initialized.' };
    }

    try {
      let { data, error } = await client.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'email',
      });

      // If 'email' type fails, also try 'signup' in case of new user token type in some Supabase configs
      if (error && (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('expired'))) {
        const signupRes = await client.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'signup',
        });
        if (!signupRes.error && signupRes.data?.user) {
          data = signupRes.data;
          error = null;
        }
      }

      if (error) {
        return { success: false, message: error.message };
      }

      if (data?.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || cleanEmail.split('@')[0],
          email: data.user.email || cleanEmail,
          avatarUrl: data.user.user_metadata?.avatar_url,
          createdAt: data.user.created_at,
        };
        localStorage.setItem('tallywise-current-user', JSON.stringify(user));
        set({ currentUser: user, isAuthenticated: true, isCloudConnected: true });
        await get().syncFromSupabase(user.id);
        return { success: true, user };
      }

      return { success: false, message: 'Failed to retrieve user profile after verification.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to verify code.' };
    }
  },

  logout: () => {
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client.auth.signOut().catch(() => {});
      }
    }
    localStorage.removeItem('tallywise-current-user');
    set({ currentUser: null, isAuthenticated: false, isCloudConnected: false });
  },

  transactions: initialData?.transactions ? sanitizeTransactions(initialData.transactions) : [],
  budgets: initialData?.budgets || [],
  goals: initialData?.goals || [],
  accounts: initialData?.accounts ? initialData.accounts.filter((a: any) => !isMockAccount(a)) : [],
  bills: initialData?.bills || [],
  debts: initialData?.debts || [],
  investments: initialData?.investments || [],
  subscriptions: initialData?.subscriptions || [],
  categories: defaultCategories,
  documents: [],
  invoices: (() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tallywise-invoices');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  })(),
  settings: initialData?.settings || { currency: '$', darkMode: true, notifications: true, budgetAlerts: true, billReminders: true, showBalances: true },
  isAIAssistantOpen: false,
  setAIAssistantOpen: (open) => set({ isAIAssistantOpen: open }),

  addInvoice: (inv) => set((state) => {
    const invWithId = { ...inv, id: inv.id || generateId(), createdAt: inv.createdAt || new Date().toISOString() };
    const updated = [invWithId, ...state.invoices];
    try {
      localStorage.setItem('tallywise-invoices', JSON.stringify(updated));
    } catch (e) {}
    return { invoices: updated };
  }),

  updateInvoice: (id, inv) => set((state) => {
    const updated = state.invoices.map((x) => (x.id === id ? { ...inv, id } : x));
    try {
      localStorage.setItem('tallywise-invoices', JSON.stringify(updated));
    } catch (e) {}
    return { invoices: updated };
  }),

  deleteInvoice: (id) => set((state) => {
    const updated = state.invoices.filter((x) => x.id !== id);
    try {
      localStorage.setItem('tallywise-invoices', JSON.stringify(updated));
    } catch (e) {}
    return { invoices: updated };
  }),

  markInvoiceStatus: (id, status) => set((state) => {
    const updated = state.invoices.map((x) => (x.id === id ? { ...x, status } : x));
    try {
      localStorage.setItem('tallywise-invoices', JSON.stringify(updated));
    } catch (e) {}
    return { invoices: updated };
  }),
  
  addDocument: (d) => set((state) => {
    const docWithId = { ...d, id: d.id || generateId() };
    const updated = [...state.documents, docWithId];
    localforage.setItem('tallywise-documents', updated);
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertDocument(docWithId, state.currentUser.id);
    }
    return { documents: updated };
  }),

  deleteDocument: (id) => set((state) => {
    const updated = state.documents.filter(x => x.id !== id);
    localforage.setItem('tallywise-documents', updated);
    if (isSupabaseConfigured()) {
      dbDeleteDocument(id);
    }
    return { documents: updated };
  }),

  addTransaction: (t) => set((state) => {
    const txWithId = { ...t, id: t.id || generateId() };
    const updated = [...state.transactions, txWithId];
    // Update budgets spent if this is an expense
    const budgets = state.budgets.map(b => {
      if (txWithId.type === 'expense' && b.category === txWithId.category) {
        return { ...b, spent: (b.spent || 0) + txWithId.amount }
      }
      return b
    });
    // Update account balances
    const accounts = state.accounts.map(a => {
      if (a.name === txWithId.account || a.id === txWithId.account) {
        const balance = (a.balance || 0) + (txWithId.type === 'income' ? txWithId.amount : -txWithId.amount)
        return { ...a, balance, lastUpdated: getTodayDate() }
      }
      return a
    });
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, transactions: updated, budgets, accounts }));
    
    // Asynchronously commit to Supabase
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertTransaction(txWithId, state.currentUser.id);
    }

    return { transactions: updated, budgets, accounts }
  }),

  updateTransaction: (id, t) => set((state) => {
    const prev = state.transactions.find(x => x.id === id)
    const updated = state.transactions.map(x => x.id === id ? t : x)
    let budgets = state.budgets
    if (prev) {
      budgets = budgets.map(b => {
        let spent = b.spent || 0
        if (prev.type === 'expense' && b.category === prev.category) spent = spent - prev.amount
        if (t.type === 'expense' && b.category === t.category) spent = spent + t.amount
        return { ...b, spent }
      })
    }
    let accounts = state.accounts
    if (prev) {
      accounts = accounts.map(a => {
        let balance = a.balance || 0
        if (a.name === prev.account || a.id === prev.account) balance = balance + (prev.type === 'income' ? -prev.amount : prev.amount)
        if (a.name === t.account || a.id === t.account) balance = balance + (t.type === 'income' ? t.amount : -t.amount)
        return { ...a, balance, lastUpdated: getTodayDate() }
      })
    }
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, transactions: updated, budgets, accounts }));
    
    if (isSupabaseConfigured()) {
      dbUpdateTransaction(id, t);
    }

    return { transactions: updated, budgets, accounts }
  }),

  deleteTransaction: (id) => set((state) => {
    const toDelete = state.transactions.find(x => x.id === id)
    const updated = state.transactions.filter(x => x.id !== id)
    const budgets = state.budgets.map(b => {
      if (toDelete && toDelete.type === 'expense' && b.category === toDelete.category) {
        return { ...b, spent: (b.spent || 0) - toDelete.amount }
      }
      return b
    })
    const accounts = state.accounts.map(a => {
      if (toDelete && (a.name === toDelete.account || a.id === toDelete.account)) {
        const balance = (a.balance || 0) + (toDelete.type === 'income' ? -toDelete.amount : toDelete.amount)
        return { ...a, balance, lastUpdated: getTodayDate() }
      }
      return a
    })
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, transactions: updated, budgets, accounts }));
    
    if (isSupabaseConfigured()) {
      dbDeleteTransaction(id);
    }

    return { transactions: updated, budgets, accounts }
  }),

  clearTransactions: () => set((state) => {
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, transactions: [] }));
    return { transactions: [] };
  }),
  
  addBudget: (b) => set((state) => {
    const budgetWithId = { ...b, id: b.id || generateId() };
    const updated = [...state.budgets, budgetWithId];
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, budgets: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertBudget(budgetWithId, state.currentUser.id);
    }
    return { budgets: updated };
  }),

  updateBudget: (id, b) => set((state) => {
    const updated = state.budgets.map(x => x.id === id ? b : x);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, budgets: updated }));
    if (isSupabaseConfigured()) {
      dbUpdateBudget(id, b);
    }
    return { budgets: updated };
  }),

  deleteBudget: (id) => set((state) => {
    const updated = state.budgets.filter(x => x.id !== id);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, budgets: updated }));
    if (isSupabaseConfigured()) {
      dbDeleteBudget(id);
    }
    return { budgets: updated };
  }),
  
  addGoal: (g) => set((state) => {
    const goalWithId = { ...g, id: g.id || generateId() };
    const updated = [...state.goals, goalWithId];
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, goals: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertGoal(goalWithId, state.currentUser.id);
    }
    return { goals: updated };
  }),

  updateGoal: (id, g) => set((state) => {
    const updated = state.goals.map(x => x.id === id ? g : x);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, goals: updated }));
    if (isSupabaseConfigured()) {
      dbUpdateGoal(id, g);
    }
    return { goals: updated };
  }),

  deleteGoal: (id) => set((state) => {
    const updated = state.goals.filter(x => x.id !== id);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, goals: updated }));
    if (isSupabaseConfigured()) {
      dbDeleteGoal(id);
    }
    return { goals: updated };
  }),
  
  addAccount: (a) => set((state) => {
    const accountWithId = { ...a, id: a.id || generateId() };
    const updated = [...state.accounts.filter(x => !isMockAccount(x)), accountWithId];
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, accounts: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertAccount(accountWithId, state.currentUser.id);
    }
    return { accounts: updated };
  }),

  updateAccount: (id, a) => set((state) => {
    const updated = state.accounts.map(x => x.id === id ? a : x);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, accounts: updated }));
    if (isSupabaseConfigured()) {
      dbUpdateAccount(id, a);
    }
    return { accounts: updated };
  }),

  deleteAccount: (id) => set((state) => {
    const updated = state.accounts.filter(x => x.id !== id);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, accounts: updated }));
    if (isSupabaseConfigured()) {
      dbDeleteAccount(id);
    }
    return { accounts: updated };
  }),
  
  addBill: (b) => set((state) => {
    const billWithId = { ...b, id: b.id || generateId() };
    const updated = [...state.bills, billWithId];
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, bills: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertBill(billWithId, state.currentUser.id);
    }
    return { bills: updated };
  }),

  updateBill: (id, b) => set((state) => {
    const updated = state.bills.map(x => x.id === id ? b : x);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, bills: updated }));
    if (isSupabaseConfigured()) {
      dbUpdateBill(id, b);
    }
    return { bills: updated };
  }),

  deleteBill: (id) => set((state) => {
    const updated = state.bills.filter(x => x.id !== id);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, bills: updated }));
    if (isSupabaseConfigured()) {
      dbDeleteBill(id);
    }
    return { bills: updated };
  }),
  
  addDebt: (d) => set((state) => {
    const debtWithId = { ...d, id: d.id || generateId() };
    const updated = [...state.debts, debtWithId];
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, debts: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertDebt(debtWithId, state.currentUser.id);
    }
    return { debts: updated };
  }),

  updateDebt: (id, d) => set((state) => {
    const updated = state.debts.map(x => x.id === id ? d : x);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, debts: updated }));
    if (isSupabaseConfigured()) {
      dbUpdateDebt(id, d);
    }
    return { debts: updated };
  }),

  deleteDebt: (id) => set((state) => {
    const updated = state.debts.filter(x => x.id !== id);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, debts: updated }));
    if (isSupabaseConfigured()) {
      dbDeleteDebt(id);
    }
    return { debts: updated };
  }),
  
  addInvestment: (i) => set((state) => {
    const invWithId = { ...i, id: i.id || generateId() };
    const updated = [...state.investments, invWithId];
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, investments: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertInvestment(invWithId, state.currentUser.id);
    }
    return { investments: updated };
  }),

  updateInvestment: (id, i) => set((state) => {
    const updated = state.investments.map(x => x.id === id ? i : x);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, investments: updated }));
    if (isSupabaseConfigured()) {
      dbUpdateInvestment(id, i);
    }
    return { investments: updated };
  }),

  deleteInvestment: (id) => set((state) => {
    const updated = state.investments.filter(x => x.id !== id);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, investments: updated }));
    if (isSupabaseConfigured()) {
      dbDeleteInvestment(id);
    }
    return { investments: updated };
  }),
  
  addSubscription: (s) => set((state) => {
    const subWithId = { ...s, id: s.id || generateId() };
    const updated = [...state.subscriptions, subWithId];
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, subscriptions: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbInsertSubscription(subWithId, state.currentUser.id);
    }
    return { subscriptions: updated };
  }),

  updateSubscription: (id, s) => set((state) => {
    const updated = state.subscriptions.map(x => x.id === id ? s : x);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, subscriptions: updated }));
    if (isSupabaseConfigured()) {
      dbUpdateSubscription(id, s);
    }
    return { subscriptions: updated };
  }),

  deleteSubscription: (id) => set((state) => {
    const updated = state.subscriptions.filter(x => x.id !== id);
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, subscriptions: updated }));
    if (isSupabaseConfigured()) {
      dbDeleteSubscription(id);
    }
    return { subscriptions: updated };
  }),
  
  updateSettings: (s) => set((state) => {
    const updated = { ...state.settings, ...s };
    localStorage.setItem('tallywise-data', JSON.stringify({ ...state, settings: updated }));
    if (isSupabaseConfigured() && state.currentUser?.id) {
      dbSaveSettings(updated, state.currentUser.id);
    }
    return { settings: updated };
  }),
  
  loadFromStorage: () => {
    // 1. Load cached localStorage data for immediate render
    const saved = localStorage.getItem('tallywise-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const cleanAccounts = (data.accounts || []).filter((a: any) => !isMockAccount(a));
        const cleanTxs = sanitizeTransactions(data.transactions || []);

        set({
          transactions: cleanTxs,
          budgets: data.budgets || [],
          goals: data.goals || [],
          accounts: cleanAccounts,
          bills: data.bills || [],
          debts: data.debts || [],
          investments: data.investments || [],
          subscriptions: data.subscriptions || [],
          settings: data.settings || { currency: '$', darkMode: true, notifications: true, budgetAlerts: true, billReminders: true, showBalances: true },
        });
      } catch (e) {}
    } else {
      set({
        accounts: [],
        transactions: [],
      });
    }

    // Load invoices from localStorage
    const savedInvoices = localStorage.getItem('tallywise-invoices');
    if (savedInvoices) {
      try {
        const invs = JSON.parse(savedInvoices);
        if (Array.isArray(invs)) {
          set({ invoices: invs });
        }
      } catch (e) {}
    }

    // Default users check
    if (!localStorage.getItem('tallywise-users')) {
      localStorage.setItem('tallywise-users', JSON.stringify(defaultUsers));
    }
    const savedUser = localStorage.getItem('tallywise-current-user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        set({ currentUser: u, isAuthenticated: true });
      } catch (e) {}
    }

    // Load localforage documents cache
    localforage.getItem<AppDocument[]>('tallywise-documents').then(docs => {
      if (docs) {
        set({ documents: docs });
      }
    });

    // 2. Check Supabase cloud session & sync fresh data
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              avatarUrl: session.user.user_metadata?.avatar_url,
              createdAt: session.user.created_at,
            };
            localStorage.setItem('tallywise-current-user', JSON.stringify(user));
            set({ currentUser: user, isAuthenticated: true, isCloudConnected: true });
            get().syncFromSupabase(user.id);
          }
        });

        // Set up auth state change listener
        client.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              avatarUrl: session.user.user_metadata?.avatar_url,
              createdAt: session.user.created_at,
            };
            localStorage.setItem('tallywise-current-user', JSON.stringify(user));
            set({ currentUser: user, isAuthenticated: true, isCloudConnected: true });
            get().syncFromSupabase(user.id);
          }
        });
      }
    }
  },
}))
