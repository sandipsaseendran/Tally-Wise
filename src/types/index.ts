export interface Transaction { id: string; date: string; amount: number; type: 'income' | 'expense'; category: string; account: string; paymentMethod: 'cash' | 'credit' | 'debit' | 'digital'; description: string; recurring: boolean }
export interface Budget { id: string; category: string; amount: number; spent: number; period: 'monthly' | 'yearly'; startDate: string; alertThreshold: number; rollover: boolean }
export interface Goal { id: string; name: string; targetAmount: number; currentAmount: number; deadline: string; priority: 'low' | 'medium' | 'high'; category: string; description: string; completed: boolean; createdAt: string }
export interface Account { id: string; name: string; type: 'checking' | 'savings' | 'credit' | 'cash' | 'investment'; balance: number; currency: string; isActive: boolean; institution: string; lastUpdated: string; cardNumber?: string; themeIndex?: number }
export interface Bill { id: string; name: string; amount: number; dueDate: string; frequency: 'once' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'; category: string; account: string; isPaid: boolean; notes: string }
export interface Debt { id: string; name: string; type: 'credit_card' | 'loan' | 'mortgage' | 'student_loan' | 'other'; balance: number; originalAmount: number; interestRate: number; minimumPayment: number; dueDate: string; startDate: string }
export interface Investment { id: string; name: string; type: 'stock' | 'crypto' | 'mutual_fund' | 'etf' | 'bond' | 'other'; quantity: number; purchasePrice: number; currentPrice: number; purchaseDate: string; symbol: string }
export interface Subscription { id: string; name: string; amount: number; billingCycle: 'monthly' | 'yearly' | 'weekly'; nextBillingDate: string; category: string; isActive: boolean; website: string; currency?: string }
export interface Category { id: string; name: string; icon: string; color: string; type: 'income' | 'expense' }
export interface AppSettings { currency: string; darkMode: boolean; notifications: boolean; budgetAlerts: boolean; billReminders: boolean; showBalances: boolean }
export interface AppDocument { id: string; name: string; size: number; type: string; uploadDate: string; dataUrl: string; }
export interface User { id: string; name: string; email: string; avatarUrl?: string; createdAt: string; }

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  taxRate?: number;
  discount?: number;
  createdAt?: string;
}