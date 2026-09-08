import { getSupabase } from '../lib/supabase';
import { isValidUuid, generateId } from '../utils/helpers';
import toast from 'react-hot-toast';
import { 
  Transaction, 
  Account, 
  Budget, 
  Goal, 
  Bill, 
  Debt, 
  Investment, 
  Subscription, 
  AppDocument, 
  AppSettings, 
  User 
} from '../types';

/**
 * Service Layer mapping between Tally Wise TypeScript models and Supabase PostgreSQL tables
 */

// ----------------------------------------------------------------------------
// Data Fetching: Parallel Hydration
// ----------------------------------------------------------------------------

export async function fetchSupabaseUserData(userId: string): Promise<{
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  bills: Bill[];
  debts: Debt[];
  investments: Investment[];
  subscriptions: Subscription[];
  documents: AppDocument[];
  settings?: AppSettings;
} | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const [
      accountsRes,
      transactionsRes,
      budgetsRes,
      goalsRes,
      billsRes,
      debtsRes,
      investmentsRes,
      subscriptionsRes,
      documentsRes,
      settingsRes,
    ] = await Promise.all([
      client.from('accounts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      client.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      client.from('budgets').select('*').eq('user_id', userId),
      client.from('goals').select('*').eq('user_id', userId),
      client.from('bills').select('*').eq('user_id', userId),
      client.from('debts').select('*').eq('user_id', userId),
      client.from('investments').select('*').eq('user_id', userId),
      client.from('subscriptions').select('*').eq('user_id', userId),
      client.from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      client.from('settings').select('*').eq('user_id', userId).maybeSingle(),
    ]);

    const accounts: Account[] = (accountsRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      balance: Number(r.balance),
      currency: r.currency || 'USD',
      isActive: r.is_active ?? true,
      institution: r.institution || '',
      cardNumber: r.card_number || '',
      themeIndex: r.theme_index ?? 0,
      lastUpdated: r.last_updated || new Date().toISOString().split('T')[0],
    }));

    const transactions: Transaction[] = (transactionsRes.data || []).map((r) => ({
      id: r.id,
      date: r.date,
      amount: Number(r.amount),
      type: r.type,
      category: r.category,
      account: r.account,
      paymentMethod: r.payment_method || 'digital',
      description: r.description || '',
      recurring: Boolean(r.recurring),
    }));

    const budgets: Budget[] = (budgetsRes.data || []).map((r) => ({
      id: r.id,
      category: r.category,
      amount: Number(r.amount),
      spent: Number(r.spent || 0),
      period: r.period || 'monthly',
      startDate: r.start_date || '',
      alertThreshold: Number(r.alert_threshold || 80),
      rollover: Boolean(r.rollover),
    }));

    const goals: Goal[] = (goalsRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      targetAmount: Number(r.target_amount),
      currentAmount: Number(r.current_amount || 0),
      deadline: r.deadline || '',
      priority: r.priority || 'medium',
      category: r.category || '',
      description: r.description || '',
      completed: Boolean(r.completed),
      createdAt: r.created_at || new Date().toISOString(),
    }));

    const bills: Bill[] = (billsRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      amount: Number(r.amount),
      dueDate: r.due_date,
      frequency: r.frequency || 'monthly',
      category: r.category || '',
      account: r.account || '',
      isPaid: Boolean(r.is_paid),
      notes: r.notes || '',
    }));

    const debts: Debt[] = (debtsRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type || 'loan',
      balance: Number(r.balance || 0),
      originalAmount: Number(r.original_amount || 0),
      interestRate: Number(r.interest_rate || 0),
      minimumPayment: Number(r.minimum_payment || 0),
      dueDate: r.due_date || '',
      startDate: r.start_date || '',
    }));

    const investments: Investment[] = (investmentsRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type || 'stock',
      quantity: Number(r.quantity || 0),
      purchasePrice: Number(r.purchase_price || 0),
      currentPrice: Number(r.current_price || 0),
      purchaseDate: r.purchase_date || '',
      symbol: r.symbol || '',
    }));

    const subscriptions: Subscription[] = (subscriptionsRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      amount: Number(r.amount),
      billingCycle: r.billing_cycle || 'monthly',
      nextBillingDate: r.next_billing_date || '',
      category: r.category || '',
      isActive: Boolean(r.is_active),
      website: r.website || '',
      currency: r.currency || 'USD',
    }));

    const documents: AppDocument[] = (documentsRes.data || []).map((r) => ({
      id: r.id,
      name: r.name,
      size: Number(r.size || 0),
      type: r.type || '',
      uploadDate: r.upload_date || '',
      dataUrl: r.data_url || '',
    }));

    let settings: AppSettings | undefined = undefined;
    if (settingsRes.data) {
      settings = {
        currency: settingsRes.data.currency || '$',
        darkMode: settingsRes.data.dark_mode ?? true,
        notifications: settingsRes.data.notifications ?? true,
        budgetAlerts: settingsRes.data.budget_alerts ?? true,
        billReminders: settingsRes.data.bill_reminders ?? true,
        showBalances: settingsRes.data.show_balances ?? true,
      };
    }

    return {
      accounts,
      transactions,
      budgets,
      goals,
      bills,
      debts,
      investments,
      subscriptions,
      documents,
      settings,
    };
  } catch (err) {
    console.error('Error fetching data from Supabase:', err);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Transactions CRUD
// ----------------------------------------------------------------------------

export async function dbInsertTransaction(t: Transaction, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(t.id) ? t.id : generateId();
  try {
    const { error } = await client.from('transactions').insert({
      id,
      user_id: userId,
      date: t.date,
      amount: t.amount,
      type: t.type,
      category: t.category,
      account: t.account,
      payment_method: t.paymentMethod,
      description: t.description || '',
      recurring: t.recurring || false,
    });
    if (error) {
      console.error('Supabase dbInsertTransaction error:', error);
      if (error.code === '42501') {
        toast.error('Cloud Sync: Please sign in with your Supabase account to sync across browsers.', { id: 'cloud-auth-warning' });
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase dbInsertTransaction exception:', err);
    return false;
  }
}

export async function dbUpdateTransaction(id: string, t: Transaction): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('transactions').update({
      date: t.date,
      amount: t.amount,
      type: t.type,
      category: t.category,
      account: t.account,
      payment_method: t.paymentMethod,
      description: t.description || '',
      recurring: t.recurring || false,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateTransaction error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateTransaction exception:', err);
    return false;
  }
}

export async function dbDeleteTransaction(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('transactions').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteTransaction error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteTransaction exception:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Accounts CRUD
// ----------------------------------------------------------------------------

export async function dbInsertAccount(a: Account, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(a.id) ? a.id : generateId();
  try {
    const { error } = await client.from('accounts').insert({
      id,
      user_id: userId,
      name: a.name,
      type: a.type,
      balance: a.balance,
      currency: a.currency || 'USD',
      is_active: a.isActive ?? true,
      institution: a.institution || '',
      card_number: a.cardNumber || '',
      theme_index: a.themeIndex ?? 0,
      last_updated: a.lastUpdated || new Date().toISOString().split('T')[0],
    });
    if (error) {
      console.error('Supabase dbInsertAccount error:', error);
      if (error.code === '42501') {
        toast.error('Cloud Sync: Please sign in with your Supabase account to sync across browsers.', { id: 'cloud-auth-warning' });
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase dbInsertAccount exception:', err);
    return false;
  }
}

export async function dbUpdateAccount(id: string, a: Account): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('accounts').update({
      name: a.name,
      type: a.type,
      balance: a.balance,
      currency: a.currency || 'USD',
      is_active: a.isActive ?? true,
      institution: a.institution || '',
      card_number: a.cardNumber || '',
      theme_index: a.themeIndex ?? 0,
      last_updated: a.lastUpdated,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateAccount error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateAccount exception:', err);
    return false;
  }
}

export async function dbDeleteAccount(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('accounts').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteAccount error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteAccount exception:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Budgets CRUD
// ----------------------------------------------------------------------------

export async function dbInsertBudget(b: Budget, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(b.id) ? b.id : generateId();
  try {
    const { error } = await client.from('budgets').insert({
      id,
      user_id: userId,
      category: b.category,
      amount: b.amount,
      spent: b.spent || 0,
      period: b.period,
      start_date: b.startDate,
      alert_threshold: b.alertThreshold,
      rollover: b.rollover,
    });
    if (error) console.error('Supabase dbInsertBudget error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbInsertBudget exception:', err);
    return false;
  }
}

export async function dbUpdateBudget(id: string, b: Budget): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('budgets').update({
      category: b.category,
      amount: b.amount,
      spent: b.spent || 0,
      period: b.period,
      start_date: b.startDate,
      alert_threshold: b.alertThreshold,
      rollover: b.rollover,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateBudget error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateBudget exception:', err);
    return false;
  }
}

export async function dbDeleteBudget(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('budgets').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteBudget error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteBudget exception:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Goals CRUD
// ----------------------------------------------------------------------------

export async function dbInsertGoal(g: Goal, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(g.id) ? g.id : generateId();
  try {
    const { error } = await client.from('goals').insert({
      id,
      user_id: userId,
      name: g.name,
      target_amount: g.targetAmount,
      current_amount: g.currentAmount || 0,
      deadline: g.deadline,
      priority: g.priority,
      category: g.category,
      description: g.description,
      completed: g.completed,
    });
    if (error) console.error('Supabase dbInsertGoal error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbInsertGoal exception:', err);
    return false;
  }
}

export async function dbUpdateGoal(id: string, g: Goal): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('goals').update({
      name: g.name,
      target_amount: g.targetAmount,
      current_amount: g.currentAmount,
      deadline: g.deadline,
      priority: g.priority,
      category: g.category,
      description: g.description,
      completed: g.completed,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateGoal error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateGoal exception:', err);
    return false;
  }
}

export async function dbDeleteGoal(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('goals').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteGoal error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteGoal exception:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Bills, Debts, Investments, Subscriptions
// ----------------------------------------------------------------------------

export async function dbInsertBill(b: Bill, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(b.id) ? b.id : generateId();
  try {
    const { error } = await client.from('bills').insert({
      id,
      user_id: userId,
      name: b.name,
      amount: b.amount,
      due_date: b.dueDate,
      frequency: b.frequency,
      category: b.category,
      account: b.account,
      is_paid: b.isPaid,
      notes: b.notes,
    });
    if (error) console.error('Supabase dbInsertBill error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbInsertBill exception:', err);
    return false;
  }
}

export async function dbUpdateBill(id: string, b: Bill): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('bills').update({
      name: b.name,
      amount: b.amount,
      due_date: b.dueDate,
      frequency: b.frequency,
      category: b.category,
      account: b.account,
      is_paid: b.isPaid,
      notes: b.notes,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateBill error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateBill exception:', err);
    return false;
  }
}

export async function dbDeleteBill(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('bills').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteBill error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteBill exception:', err);
    return false;
  }
}

export async function dbInsertDebt(d: Debt, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(d.id) ? d.id : generateId();
  try {
    const { error } = await client.from('debts').insert({
      id,
      user_id: userId,
      name: d.name,
      type: d.type,
      balance: d.balance,
      original_amount: d.originalAmount,
      interest_rate: d.interestRate,
      minimum_payment: d.minimumPayment,
      due_date: d.dueDate,
      start_date: d.startDate,
    });
    if (error) console.error('Supabase dbInsertDebt error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbInsertDebt exception:', err);
    return false;
  }
}

export async function dbUpdateDebt(id: string, d: Debt): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('debts').update({
      name: d.name,
      type: d.type,
      balance: d.balance,
      original_amount: d.originalAmount,
      interest_rate: d.interestRate,
      minimum_payment: d.minimumPayment,
      due_date: d.dueDate,
      start_date: d.startDate,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateDebt error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateDebt exception:', err);
    return false;
  }
}

export async function dbDeleteDebt(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('debts').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteDebt error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteDebt exception:', err);
    return false;
  }
}

export async function dbInsertInvestment(i: Investment, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(i.id) ? i.id : generateId();
  try {
    const { error } = await client.from('investments').insert({
      id,
      user_id: userId,
      name: i.name,
      type: i.type,
      quantity: i.quantity,
      purchase_price: i.purchasePrice,
      current_price: i.currentPrice,
      purchase_date: i.purchaseDate,
      symbol: i.symbol,
    });
    if (error) console.error('Supabase dbInsertInvestment error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbInsertInvestment exception:', err);
    return false;
  }
}

export async function dbUpdateInvestment(id: string, i: Investment): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('investments').update({
      name: i.name,
      type: i.type,
      quantity: i.quantity,
      purchase_price: i.purchasePrice,
      current_price: i.currentPrice,
      purchase_date: i.purchaseDate,
      symbol: i.symbol,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateInvestment error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateInvestment exception:', err);
    return false;
  }
}

export async function dbDeleteInvestment(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('investments').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteInvestment error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteInvestment exception:', err);
    return false;
  }
}

export async function dbInsertSubscription(s: Subscription, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(s.id) ? s.id : generateId();
  try {
    const { error } = await client.from('subscriptions').insert({
      id,
      user_id: userId,
      name: s.name,
      amount: s.amount,
      billing_cycle: s.billingCycle,
      next_billing_date: s.nextBillingDate,
      category: s.category,
      is_active: s.isActive,
      website: s.website,
      currency: s.currency,
    });
    if (error) console.error('Supabase dbInsertSubscription error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbInsertSubscription exception:', err);
    return false;
  }
}

export async function dbUpdateSubscription(id: string, s: Subscription): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('subscriptions').update({
      name: s.name,
      amount: s.amount,
      billing_cycle: s.billingCycle,
      next_billing_date: s.nextBillingDate,
      category: s.category,
      is_active: s.isActive,
      website: s.website,
      currency: s.currency,
    }).eq('id', id);
    if (error) console.error('Supabase dbUpdateSubscription error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbUpdateSubscription exception:', err);
    return false;
  }
}

export async function dbDeleteSubscription(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('subscriptions').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteSubscription error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteSubscription exception:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Documents: Upload to Storage & Record
// ----------------------------------------------------------------------------

export async function dbInsertDocument(doc: AppDocument, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const id = isValidUuid(doc.id) ? doc.id : generateId();
  try {
    const { error } = await client.from('documents').insert({
      id,
      user_id: userId,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      upload_date: doc.uploadDate,
      data_url: doc.dataUrl,
    });
    if (error) console.error('Supabase dbInsertDocument error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbInsertDocument exception:', err);
    return false;
  }
}

export async function dbDeleteDocument(id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('documents').delete().eq('id', id);
    if (error) console.error('Supabase dbDeleteDocument error:', error);
    return !error;
  } catch (err) {
    console.error('Supabase dbDeleteDocument exception:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------

export async function dbSaveSettings(s: AppSettings, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('settings').upsert({
      user_id: userId,
      currency: s.currency,
      dark_mode: s.darkMode,
      notifications: s.notifications,
      budget_alerts: s.budgetAlerts,
      bill_reminders: s.billReminders,
      show_balances: s.showBalances,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}
