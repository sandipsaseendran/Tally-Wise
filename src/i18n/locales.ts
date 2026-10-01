export type Locale = 'en' | 'hi' | 'ta' | 'es' | 'fr' | 'de' | 'ja' | 'ar';

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export type TranslationKeys = {
  // Navigation
  nav: {
    home: string;
    contracts: string;
    documents: string;
    invoices: string;
    card: string;
    transactions: string;
    withdrawal: string;
    accounts: string;
    budgets: string;
    goals: string;
    analytics: string;
    reports: string;
    referrals: string;
    settings: string;
  };
  // Common actions
  common: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    confirm: string;
    back: string;
    next: string;
    loading: string;
    noData: string;
    signOut: string;
    signIn: string;
    name: string;
    email: string;
    amount: string;
    date: string;
    category: string;
    description: string;
    status: string;
    type: string;
    total: string;
    actions: string;
  };
  // Dashboard
  dashboard: {
    greeting: {
      morning: string;
      afternoon: string;
      evening: string;
      night: string;
    };
    totalBalance: string;
    withdrawFunds: string;
    addFunds: string;
    yourCards: string;
    addCard: string;
    recentActivity: string;
  };
  // Accounts
  accounts: {
    title: string;
    subtitle: string;
    addAccount: string;
    editAccount: string;
    noAccounts: string;
    balance: string;
    institution: string;
    accountType: string;
    checking: string;
    savings: string;
    credit: string;
    cash: string;
    investment: string;
  };
  // Budgets
  budgets: {
    title: string;
    subtitle: string;
    addBudget: string;
    editBudget: string;
    noBudgets: string;
    spent: string;
    remaining: string;
    alertThreshold: string;
    rollover: string;
    period: string;
    monthly: string;
    yearly: string;
  };
  // Goals
  goals: {
    title: string;
    subtitle: string;
    addGoal: string;
    editGoal: string;
    noGoals: string;
    targetAmount: string;
    currentAmount: string;
    deadline: string;
    priority: string;
    contribute: string;
    low: string;
    medium: string;
    high: string;
    completed: string;
  };
  // Analytics
  analytics: {
    title: string;
    subtitle: string;
    income: string;
    expenses: string;
    netSavings: string;
    monthlyTrend: string;
    categoryBreakdown: string;
    topCategories: string;
    vsLastMonth: string;
    thisMonth: string;
  };
  // Reports
  reports: {
    title: string;
    subtitle: string;
    expensesByCategory: string;
    summary: string;
    expenseCategories: string;
    totalExpense: string;
    incomeVsExpense: string;
    savingsRate: string;
    monthlyOverview: string;
    downloadReport: string;
  };
  // Referrals
  referrals: {
    title: string;
    subtitle: string;
    noReferrals: string;
    inviteFriends: string;
    referralCode: string;
    copyCode: string;
    earned: string;
    totalReferred: string;
    shareLink: string;
    howItWorks: string;
    step1: string;
    step2: string;
    step3: string;
  };
  // Settings
  settings: {
    title: string;
    subtitle: string;
    preferences: string;
    currency: string;
    darkMode: string;
    notifications: string;
    budgetAlerts: string;
    billReminders: string;
    showBalances: string;
    language: string;
    selectLanguage: string;
    cloudSync: string;
    connected: string;
    disconnected: string;
    supabaseUrl: string;
    supabaseKey: string;
    testConnection: string;
    saveConfig: string;
    profile: string;
    security: string;
    dataManagement: string;
    exportData: string;
    importData: string;
    deleteAllData: string;
  };
  // Transactions
  transactions: {
    title: string;
    subtitle: string;
    addTransaction: string;
    noTransactions: string;
    income: string;
    expense: string;
    all: string;
    recurring: string;
  };
  // Withdrawal
  withdrawal: {
    title: string;
    subtitle: string;
    noWithdrawals: string;
    from: string;
  };
  // Contracts
  contracts: {
    title: string;
    subtitle: string;
    addContract: string;
    noContracts: string;
  };
  // Invoices
  invoices: {
    title: string;
    subtitle: string;
    createInvoice: string;
    noInvoices: string;
  };
  // AI
  ai: {
    title: string;
    subtitle: string;
    askAnything: string;
    placeholder: string;
  };
};

const en: TranslationKeys = {
  nav: {
    home: 'Home',
    contracts: 'Contracts',
    documents: 'Documents',
    invoices: 'Invoices',
    card: 'Card',
    transactions: 'Transactions',
    withdrawal: 'Withdrawal',
    accounts: 'Accounts',
    budgets: 'Budgets',
    goals: 'Goals',
    analytics: 'Analytics',
    reports: 'Reports',
    referrals: 'Referrals',
    settings: 'Settings',
  },
  common: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    noData: 'No data available',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    name: 'Name',
    email: 'Email',
    amount: 'Amount',
    date: 'Date',
    category: 'Category',
    description: 'Description',
    status: 'Status',
    type: 'Type',
    total: 'Total',
    actions: 'Actions',
  },
  dashboard: {
    greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', night: 'Good night' },
    totalBalance: 'TOTAL BALANCE',
    withdrawFunds: 'Withdraw funds',
    addFunds: 'Add funds',
    yourCards: 'Your Cards',
    addCard: 'Add Card',
    recentActivity: 'Recent Activity',
  },
  accounts: {
    title: 'Accounts',
    subtitle: 'Manage your accounts and balances',
    addAccount: 'Add Account',
    editAccount: 'Edit Account',
    noAccounts: 'No accounts yet. Add your first account to get started.',
    balance: 'Balance',
    institution: 'Institution',
    accountType: 'Account Type',
    checking: 'Checking',
    savings: 'Savings',
    credit: 'Credit',
    cash: 'Cash',
    investment: 'Investment',
  },
  budgets: {
    title: 'Budgets',
    subtitle: 'Plan and track spending by category',
    addBudget: 'Add Budget',
    editBudget: 'Edit Budget',
    noBudgets: 'No budgets yet. Create a budget to start tracking your spending.',
    spent: 'Spent',
    remaining: 'Remaining',
    alertThreshold: 'Alert Threshold',
    rollover: 'Rollover',
    period: 'Period',
    monthly: 'Monthly',
    yearly: 'Yearly',
  },
  goals: {
    title: 'Goals',
    subtitle: 'Create savings goals and track progress',
    addGoal: 'Add Goal',
    editGoal: 'Edit Goal',
    noGoals: 'No goals yet. Set a savings goal to start building your future.',
    targetAmount: 'Target Amount',
    currentAmount: 'Current Amount',
    deadline: 'Deadline',
    priority: 'Priority',
    contribute: 'Contribute',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    completed: 'Completed',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Understand your financial patterns',
    income: 'Income',
    expenses: 'Expenses',
    netSavings: 'Net Savings',
    monthlyTrend: 'Monthly Trend',
    categoryBreakdown: 'Category Breakdown',
    topCategories: 'Top Categories',
    vsLastMonth: 'vs last month',
    thisMonth: 'This Month',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Visualize your spending and income',
    expensesByCategory: 'Expenses by Category',
    summary: 'Summary',
    expenseCategories: 'Expense categories',
    totalExpense: 'Total expense',
    incomeVsExpense: 'Income vs Expense',
    savingsRate: 'Savings Rate',
    monthlyOverview: 'Monthly Overview',
    downloadReport: 'Download Report',
  },
  referrals: {
    title: 'Referrals',
    subtitle: 'Invite friends and earn rewards',
    noReferrals: 'No referrals yet',
    inviteFriends: 'Invite your friends and earn rewards',
    referralCode: 'Your Referral Code',
    copyCode: 'Copy Code',
    earned: 'Total Earned',
    totalReferred: 'Total Referred',
    shareLink: 'Share your referral link',
    howItWorks: 'How It Works',
    step1: 'Share your unique referral code with friends',
    step2: 'Friends sign up using your code',
    step3: 'Both of you earn rewards!',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your preferences and configuration',
    preferences: 'Preferences',
    currency: 'Currency',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    budgetAlerts: 'Budget Alerts',
    billReminders: 'Bill Reminders',
    showBalances: 'Show Balances',
    language: 'Language',
    selectLanguage: 'Select Language',
    cloudSync: 'Cloud Sync',
    connected: 'Connected',
    disconnected: 'Disconnected',
    supabaseUrl: 'Supabase Project URL',
    supabaseKey: 'Supabase Anon Key',
    testConnection: 'Test Connection',
    saveConfig: 'Save Configuration',
    profile: 'Profile',
    security: 'Security',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    importData: 'Import Data',
    deleteAllData: 'Delete All Data',
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'View and manage all your transactions',
    addTransaction: 'Add Transaction',
    noTransactions: 'No transactions yet. Add your first transaction to get started.',
    income: 'Income',
    expense: 'Expense',
    all: 'All',
    recurring: 'Recurring',
  },
  withdrawal: {
    title: 'Withdrawals',
    subtitle: 'View all your withdrawal requests and their statuses.',
    noWithdrawals: 'You have no recent withdrawal requests.',
    from: 'From',
  },
  contracts: {
    title: 'Contracts',
    subtitle: 'Manage your contracts and agreements',
    addContract: 'Add Contract',
    noContracts: 'No contracts yet.',
  },
  invoices: {
    title: 'Invoices',
    subtitle: 'Create and manage invoices',
    createInvoice: 'Create Invoice',
    noInvoices: 'No invoices yet.',
  },
  ai: {
    title: 'AI Assistant',
    subtitle: 'Chat with Tally Wise AI',
    askAnything: 'Ask anything about your finances',
    placeholder: 'Ask me anything...',
  },
};

const hi: TranslationKeys = {
  nav: {
    home: 'होम',
    contracts: 'अनुबंध',
    documents: 'दस्तावेज़',
    invoices: 'चालान',
    card: 'कार्ड',
    transactions: 'लेनदेन',
    withdrawal: 'निकासी',
    accounts: 'खाते',
    budgets: 'बजट',
    goals: 'लक्ष्य',
    analytics: 'विश्लेषण',
    reports: 'रिपोर्ट',
    referrals: 'रेफरल',
    settings: 'सेटिंग्स',
  },
  common: {
    add: 'जोड़ें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    export: 'निर्यात',
    import: 'आयात',
    confirm: 'पुष्टि करें',
    back: 'वापस',
    next: 'अगला',
    loading: 'लोड हो रहा है...',
    noData: 'कोई डेटा उपलब्ध नहीं',
    signOut: 'साइन आउट',
    signIn: 'साइन इन',
    name: 'नाम',
    email: 'ईमेल',
    amount: 'राशि',
    date: 'तारीख',
    category: 'श्रेणी',
    description: 'विवरण',
    status: 'स्थिति',
    type: 'प्रकार',
    total: 'कुल',
    actions: 'कार्रवाई',
  },
  dashboard: {
    greeting: { morning: 'सुप्रभात', afternoon: 'शुभ दोपहर', evening: 'शुभ संध्या', night: 'शुभ रात्रि' },
    totalBalance: 'कुल शेष',
    withdrawFunds: 'धन निकालें',
    addFunds: 'धन जोड़ें',
    yourCards: 'आपके कार्ड',
    addCard: 'कार्ड जोड़ें',
    recentActivity: 'हालिया गतिविधि',
  },
  accounts: {
    title: 'खाते',
    subtitle: 'अपने खातों और शेष राशि का प्रबंधन करें',
    addAccount: 'खाता जोड़ें',
    editAccount: 'खाता संपादित करें',
    noAccounts: 'अभी कोई खाता नहीं है। शुरू करने के लिए अपना पहला खाता जोड़ें।',
    balance: 'शेष',
    institution: 'संस्था',
    accountType: 'खाता प्रकार',
    checking: 'चेकिंग',
    savings: 'बचत',
    credit: 'क्रेडिट',
    cash: 'नकद',
    investment: 'निवेश',
  },
  budgets: {
    title: 'बजट',
    subtitle: 'श्रेणी के अनुसार खर्च की योजना बनाएं और ट्रैक करें',
    addBudget: 'बजट जोड़ें',
    editBudget: 'बजट संपादित करें',
    noBudgets: 'अभी कोई बजट नहीं है। अपने खर्च को ट्रैक करना शुरू करने के लिए बजट बनाएं।',
    spent: 'खर्च किया',
    remaining: 'शेष',
    alertThreshold: 'अलर्ट सीमा',
    rollover: 'रोलओवर',
    period: 'अवधि',
    monthly: 'मासिक',
    yearly: 'वार्षिक',
  },
  goals: {
    title: 'लक्ष्य',
    subtitle: 'बचत लक्ष्य बनाएं और प्रगति ट्रैक करें',
    addGoal: 'लक्ष्य जोड़ें',
    editGoal: 'लक्ष्य संपादित करें',
    noGoals: 'अभी कोई लक्ष्य नहीं है। अपना भविष्य बनाना शुरू करने के लिए बचत लक्ष्य निर्धारित करें।',
    targetAmount: 'लक्ष्य राशि',
    currentAmount: 'वर्तमान राशि',
    deadline: 'समय सीमा',
    priority: 'प्राथमिकता',
    contribute: 'योगदान',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    completed: 'पूर्ण',
  },
  analytics: {
    title: 'विश्लेषण',
    subtitle: 'अपने वित्तीय पैटर्न को समझें',
    income: 'आय',
    expenses: 'व्यय',
    netSavings: 'शुद्ध बचत',
    monthlyTrend: 'मासिक प्रवृत्ति',
    categoryBreakdown: 'श्रेणी विश्लेषण',
    topCategories: 'शीर्ष श्रेणियां',
    vsLastMonth: 'पिछले महीने की तुलना में',
    thisMonth: 'इस महीने',
  },
  reports: {
    title: 'रिपोर्ट',
    subtitle: 'अपने खर्च और आय को देखें',
    expensesByCategory: 'श्रेणी अनुसार व्यय',
    summary: 'सारांश',
    expenseCategories: 'व्यय श्रेणियां',
    totalExpense: 'कुल व्यय',
    incomeVsExpense: 'आय बनाम व्यय',
    savingsRate: 'बचत दर',
    monthlyOverview: 'मासिक अवलोकन',
    downloadReport: 'रिपोर्ट डाउनलोड करें',
  },
  referrals: {
    title: 'रेफरल',
    subtitle: 'दोस्तों को आमंत्रित करें और पुरस्कार अर्जित करें',
    noReferrals: 'अभी कोई रेफरल नहीं',
    inviteFriends: 'अपने दोस्तों को आमंत्रित करें और पुरस्कार अर्जित करें',
    referralCode: 'आपका रेफरल कोड',
    copyCode: 'कोड कॉपी करें',
    earned: 'कुल अर्जित',
    totalReferred: 'कुल रेफर किए गए',
    shareLink: 'अपना रेफरल लिंक साझा करें',
    howItWorks: 'यह कैसे काम करता है',
    step1: 'अपना विशिष्ट रेफरल कोड दोस्तों के साथ साझा करें',
    step2: 'दोस्त आपके कोड का उपयोग करके साइन अप करते हैं',
    step3: 'आप दोनों को पुरस्कार मिलता है!',
  },
  settings: {
    title: 'सेटिंग्स',
    subtitle: 'अपनी प्राथमिकताएं और कॉन्फ़िगरेशन प्रबंधित करें',
    preferences: 'प्राथमिकताएं',
    currency: 'मुद्रा',
    darkMode: 'डार्क मोड',
    notifications: 'सूचनाएं',
    budgetAlerts: 'बजट अलर्ट',
    billReminders: 'बिल रिमाइंडर',
    showBalances: 'शेष दिखाएं',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    cloudSync: 'क्लाउड सिंक',
    connected: 'जुड़ा हुआ',
    disconnected: 'डिस्कनेक्टेड',
    supabaseUrl: 'Supabase प्रोजेक्ट URL',
    supabaseKey: 'Supabase Anon कुंजी',
    testConnection: 'कनेक्शन टेस्ट करें',
    saveConfig: 'कॉन्फ़िगरेशन सहेजें',
    profile: 'प्रोफ़ाइल',
    security: 'सुरक्षा',
    dataManagement: 'डेटा प्रबंधन',
    exportData: 'डेटा निर्यात करें',
    importData: 'डेटा आयात करें',
    deleteAllData: 'सारा डेटा हटाएं',
  },
  transactions: {
    title: 'लेनदेन',
    subtitle: 'अपने सभी लेनदेन देखें और प्रबंधित करें',
    addTransaction: 'लेनदेन जोड़ें',
    noTransactions: 'अभी कोई लेनदेन नहीं है। शुरू करने के लिए अपना पहला लेनदेन जोड़ें।',
    income: 'आय',
    expense: 'व्यय',
    all: 'सभी',
    recurring: 'आवर्ती',
  },
  withdrawal: {
    title: 'निकासी',
    subtitle: 'अपने सभी निकासी अनुरोध और उनकी स्थिति देखें।',
    noWithdrawals: 'कोई हालिया निकासी अनुरोध नहीं है।',
    from: 'से',
  },
  contracts: {
    title: 'अनुबंध',
    subtitle: 'अपने अनुबंधों और समझौतों का प्रबंधन करें',
    addContract: 'अनुबंध जोड़ें',
    noContracts: 'अभी कोई अनुबंध नहीं है।',
  },
  invoices: {
    title: 'चालान',
    subtitle: 'चालान बनाएं और प्रबंधित करें',
    createInvoice: 'चालान बनाएं',
    noInvoices: 'अभी कोई चालान नहीं है।',
  },
  ai: {
    title: 'AI सहायक',
    subtitle: 'Tally Wise AI से बात करें',
    askAnything: 'अपने वित्त के बारे में कुछ भी पूछें',
    placeholder: 'मुझसे कुछ भी पूछें...',
  },
};

const ta: TranslationKeys = {
  nav: {
    home: 'முகப்பு',
    contracts: 'ஒப்பந்தங்கள்',
    documents: 'ஆவணங்கள்',
    invoices: 'விலைப்பட்டி',
    card: 'அட்டை',
    transactions: 'பரிவர்த்தனைகள்',
    withdrawal: 'திரும்பப்பெறுதல்',
    accounts: 'கணக்குகள்',
    budgets: 'வரவு செலவு',
    goals: 'இலக்குகள்',
    analytics: 'பகுப்பாய்வு',
    reports: 'அறிக்கைகள்',
    referrals: 'பரிந்துரைகள்',
    settings: 'அமைப்புகள்',
  },
  common: {
    add: 'சேர்',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    export: 'ஏற்றுமதி',
    import: 'இறக்குமதி',
    confirm: 'உறுதிப்படுத்து',
    back: 'பின்',
    next: 'அடுத்து',
    loading: 'ஏற்றுகிறது...',
    noData: 'தரவு இல்லை',
    signOut: 'வெளியேறு',
    signIn: 'உள்நுழைக',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    amount: 'தொகை',
    date: 'தேதி',
    category: 'வகை',
    description: 'விவரம்',
    status: 'நிலை',
    type: 'வகை',
    total: 'மொத்தம்',
    actions: 'செயல்கள்',
  },
  dashboard: {
    greeting: { morning: 'காலை வணக்கம்', afternoon: 'மதிய வணக்கம்', evening: 'மாலை வணக்கம்', night: 'இரவு வணக்கம்' },
    totalBalance: 'மொத்த இருப்பு',
    withdrawFunds: 'பணம் எடுக்க',
    addFunds: 'பணம் சேர்',
    yourCards: 'உங்கள் அட்டைகள்',
    addCard: 'அட்டை சேர்',
    recentActivity: 'சமீபத்திய செயல்பாடு',
  },
  accounts: {
    title: 'கணக்குகள்',
    subtitle: 'உங்கள் கணக்குகளையும் இருப்புகளையும் நிர்வகிக்கவும்',
    addAccount: 'கணக்கு சேர்',
    editAccount: 'கணக்கு திருத்து',
    noAccounts: 'இன்னும் கணக்குகள் இல்லை. தொடங்க உங்கள் முதல் கணக்கைச் சேர்க்கவும்.',
    balance: 'இருப்பு',
    institution: 'நிறுவனம்',
    accountType: 'கணக்கு வகை',
    checking: 'செக்கிங்',
    savings: 'சேமிப்பு',
    credit: 'கடன்',
    cash: 'பணம்',
    investment: 'முதலீடு',
  },
  budgets: {
    title: 'வரவு செலவு',
    subtitle: 'வகை வாரியாக செலவுகளைத் திட்டமிட்டு கண்காணிக்கவும்',
    addBudget: 'பட்ஜெட் சேர்',
    editBudget: 'பட்ஜெட் திருத்து',
    noBudgets: 'இன்னும் பட்ஜெட் இல்லை. உங்கள் செலவுகளைக் கண்காணிக்க ஒரு பட்ஜெட்டை உருவாக்கவும்.',
    spent: 'செலவழித்தது',
    remaining: 'மீதம்',
    alertThreshold: 'எச்சரிக்கை வரம்பு',
    rollover: 'ரோல்ஓவர்',
    period: 'காலம்',
    monthly: 'மாதாந்திர',
    yearly: 'வருடாந்திர',
  },
  goals: {
    title: 'இலக்குகள்',
    subtitle: 'சேமிப்பு இலக்குகளை உருவாக்கி முன்னேற்றத்தைக் கண்காணிக்கவும்',
    addGoal: 'இலக்கு சேர்',
    editGoal: 'இலக்கு திருத்து',
    noGoals: 'இன்னும் இலக்குகள் இல்லை. உங்கள் எதிர்காலத்தை உருவாக்க சேமிப்பு இலக்கை அமைக்கவும்.',
    targetAmount: 'இலக்கு தொகை',
    currentAmount: 'தற்போதைய தொகை',
    deadline: 'கெடு',
    priority: 'முன்னுரிமை',
    contribute: 'பங்களிப்பு',
    low: 'குறைவு',
    medium: 'நடுத்தரம்',
    high: 'உயர்',
    completed: 'நிறைவடைந்தது',
  },
  analytics: {
    title: 'பகுப்பாய்வு',
    subtitle: 'உங்கள் நிதி முறைகளைப் புரிந்து கொள்ளுங்கள்',
    income: 'வருமானம்',
    expenses: 'செலவுகள்',
    netSavings: 'நிகர சேமிப்பு',
    monthlyTrend: 'மாதாந்திர போக்கு',
    categoryBreakdown: 'வகை பகுப்பாய்வு',
    topCategories: 'முக்கிய வகைகள்',
    vsLastMonth: 'கடந்த மாதத்துடன் ஒப்பிடும்போது',
    thisMonth: 'இந்த மாதம்',
  },
  reports: {
    title: 'அறிக்கைகள்',
    subtitle: 'உங்கள் செலவு மற்றும் வருமானத்தைக் காட்சிப்படுத்துங்கள்',
    expensesByCategory: 'வகை வாரியான செலவுகள்',
    summary: 'சுருக்கம்',
    expenseCategories: 'செலவு வகைகள்',
    totalExpense: 'மொத்த செலவு',
    incomeVsExpense: 'வருமானம் எதிர் செலவு',
    savingsRate: 'சேமிப்பு விகிதம்',
    monthlyOverview: 'மாதாந்திர மேலோட்டம்',
    downloadReport: 'அறிக்கையை பதிவிறக்கம் செய்',
  },
  referrals: {
    title: 'பரிந்துரைகள்',
    subtitle: 'நண்பர்களை அழைத்து வெகுமதிகளைப் பெறுங்கள்',
    noReferrals: 'இன்னும் பரிந்துரைகள் இல்லை',
    inviteFriends: 'நண்பர்களை அழைத்து வெகுமதிகளைப் பெறுங்கள்',
    referralCode: 'உங்கள் பரிந்துரை குறியீடு',
    copyCode: 'குறியீட்டை நகலெடு',
    earned: 'மொத்தம் சம்பாதித்தது',
    totalReferred: 'மொத்தம் பரிந்துரைத்தது',
    shareLink: 'உங்கள் பரிந்துரை இணைப்பைப் பகிரவும்',
    howItWorks: 'இது எப்படி வேலை செய்கிறது',
    step1: 'உங்கள் தனித்துவமான பரிந்துரை குறியீட்டை நண்பர்களுடன் பகிரவும்',
    step2: 'நண்பர்கள் உங்கள் குறியீட்டைப் பயன்படுத்தி பதிவு செய்கிறார்கள்',
    step3: 'இருவரும் வெகுமதிகளைப் பெறுவீர்கள்!',
  },
  settings: {
    title: 'அமைப்புகள்',
    subtitle: 'உங்கள் விருப்பங்களையும் உள்ளமைவையும் நிர்வகிக்கவும்',
    preferences: 'விருப்பங்கள்',
    currency: 'நாணயம்',
    darkMode: 'டார்க் பயன்முறை',
    notifications: 'அறிவிப்புகள்',
    budgetAlerts: 'பட்ஜெட் எச்சரிக்கைகள்',
    billReminders: 'பில் நினைவூட்டல்கள்',
    showBalances: 'இருப்பைக் காட்டு',
    language: 'மொழி',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    cloudSync: 'கிளவுட் சின்க்',
    connected: 'இணைக்கப்பட்டது',
    disconnected: 'துண்டிக்கப்பட்டது',
    supabaseUrl: 'Supabase திட்ட URL',
    supabaseKey: 'Supabase Anon விசை',
    testConnection: 'இணைப்பைச் சோதிக்கவும்',
    saveConfig: 'உள்ளமைவைச் சேமிக்கவும்',
    profile: 'சுயவிவரம்',
    security: 'பாதுகாப்பு',
    dataManagement: 'தரவு மேலாண்மை',
    exportData: 'தரவை ஏற்றுமதி செய்',
    importData: 'தரவை இறக்குமதி செய்',
    deleteAllData: 'அனைத்து தரவையும் நீக்கு',
  },
  transactions: {
    title: 'பரிவர்த்தனைகள்',
    subtitle: 'உங்கள் அனைத்து பரிவர்த்தனைகளையும் பார்த்து நிர்வகிக்கவும்',
    addTransaction: 'பரிவர்த்தனை சேர்',
    noTransactions: 'இன்னும் பரிவர்த்தனைகள் இல்லை. தொடங்க உங்கள் முதல் பரிவர்த்தனையைச் சேர்க்கவும்.',
    income: 'வருமானம்',
    expense: 'செலவு',
    all: 'அனைத்தும்',
    recurring: 'மீண்டும் மீண்டும்',
  },
  withdrawal: {
    title: 'திரும்பப்பெறுதல்',
    subtitle: 'உங்கள் அனைத்து திரும்பப் பெறுதல் கோரிக்கைகளையும் அவற்றின் நிலையையும் பாருங்கள்.',
    noWithdrawals: 'சமீபத்திய திரும்பப் பெறுதல் கோரிக்கைகள் எதுவும் இல்லை.',
    from: 'இருந்து',
  },
  contracts: {
    title: 'ஒப்பந்தங்கள்',
    subtitle: 'உங்கள் ஒப்பந்தங்கள் மற்றும் உடன்படிக்கைகளை நிர்வகிக்கவும்',
    addContract: 'ஒப்பந்தம் சேர்',
    noContracts: 'இன்னும் ஒப்பந்தங்கள் இல்லை.',
  },
  invoices: {
    title: 'விலைப்பட்டி',
    subtitle: 'விலைப்பட்டிகளை உருவாக்கி நிர்வகிக்கவும்',
    createInvoice: 'விலைப்பட்டி உருவாக்கு',
    noInvoices: 'இன்னும் விலைப்பட்டிகள் இல்லை.',
  },
  ai: {
    title: 'AI உதவியாளர்',
    subtitle: 'Tally Wise AI உடன் பேசுங்கள்',
    askAnything: 'உங்கள் நிதி பற்றி எதையும் கேளுங்கள்',
    placeholder: 'என்னிடம் எதையும் கேளுங்கள்...',
  },
};

const es: TranslationKeys = {
  nav: {
    home: 'Inicio',
    contracts: 'Contratos',
    documents: 'Documentos',
    invoices: 'Facturas',
    card: 'Tarjeta',
    transactions: 'Transacciones',
    withdrawal: 'Retiro',
    accounts: 'Cuentas',
    budgets: 'Presupuestos',
    goals: 'Metas',
    analytics: 'Analítica',
    reports: 'Informes',
    referrals: 'Referidos',
    settings: 'Configuración',
  },
  common: {
    add: 'Agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    confirm: 'Confirmar',
    back: 'Atrás',
    next: 'Siguiente',
    loading: 'Cargando...',
    noData: 'Sin datos disponibles',
    signOut: 'Cerrar sesión',
    signIn: 'Iniciar sesión',
    name: 'Nombre',
    email: 'Correo',
    amount: 'Monto',
    date: 'Fecha',
    category: 'Categoría',
    description: 'Descripción',
    status: 'Estado',
    type: 'Tipo',
    total: 'Total',
    actions: 'Acciones',
  },
  dashboard: {
    greeting: { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas tardes', night: 'Buenas noches' },
    totalBalance: 'SALDO TOTAL',
    withdrawFunds: 'Retirar fondos',
    addFunds: 'Agregar fondos',
    yourCards: 'Tus Tarjetas',
    addCard: 'Agregar Tarjeta',
    recentActivity: 'Actividad Reciente',
  },
  accounts: {
    title: 'Cuentas',
    subtitle: 'Gestiona tus cuentas y saldos',
    addAccount: 'Agregar Cuenta',
    editAccount: 'Editar Cuenta',
    noAccounts: 'Aún no hay cuentas. Agrega tu primera cuenta para comenzar.',
    balance: 'Saldo',
    institution: 'Institución',
    accountType: 'Tipo de Cuenta',
    checking: 'Corriente',
    savings: 'Ahorro',
    credit: 'Crédito',
    cash: 'Efectivo',
    investment: 'Inversión',
  },
  budgets: {
    title: 'Presupuestos',
    subtitle: 'Planifica y rastrea gastos por categoría',
    addBudget: 'Agregar Presupuesto',
    editBudget: 'Editar Presupuesto',
    noBudgets: 'Aún no hay presupuestos. Crea un presupuesto para empezar a rastrear tus gastos.',
    spent: 'Gastado',
    remaining: 'Restante',
    alertThreshold: 'Umbral de Alerta',
    rollover: 'Acumulación',
    period: 'Período',
    monthly: 'Mensual',
    yearly: 'Anual',
  },
  goals: {
    title: 'Metas',
    subtitle: 'Crea metas de ahorro y rastrea tu progreso',
    addGoal: 'Agregar Meta',
    editGoal: 'Editar Meta',
    noGoals: 'Aún no hay metas. Establece una meta de ahorro para construir tu futuro.',
    targetAmount: 'Monto Objetivo',
    currentAmount: 'Monto Actual',
    deadline: 'Fecha Límite',
    priority: 'Prioridad',
    contribute: 'Contribuir',
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    completed: 'Completado',
  },
  analytics: {
    title: 'Analítica',
    subtitle: 'Comprende tus patrones financieros',
    income: 'Ingresos',
    expenses: 'Gastos',
    netSavings: 'Ahorro Neto',
    monthlyTrend: 'Tendencia Mensual',
    categoryBreakdown: 'Desglose por Categoría',
    topCategories: 'Categorías Principales',
    vsLastMonth: 'vs mes anterior',
    thisMonth: 'Este Mes',
  },
  reports: {
    title: 'Informes',
    subtitle: 'Visualiza tus gastos e ingresos',
    expensesByCategory: 'Gastos por Categoría',
    summary: 'Resumen',
    expenseCategories: 'Categorías de gastos',
    totalExpense: 'Gasto total',
    incomeVsExpense: 'Ingresos vs Gastos',
    savingsRate: 'Tasa de Ahorro',
    monthlyOverview: 'Resumen Mensual',
    downloadReport: 'Descargar Informe',
  },
  referrals: {
    title: 'Referidos',
    subtitle: 'Invita amigos y gana recompensas',
    noReferrals: 'Aún no hay referidos',
    inviteFriends: 'Invita a tus amigos y gana recompensas',
    referralCode: 'Tu Código de Referido',
    copyCode: 'Copiar Código',
    earned: 'Total Ganado',
    totalReferred: 'Total Referidos',
    shareLink: 'Comparte tu enlace de referido',
    howItWorks: 'Cómo Funciona',
    step1: 'Comparte tu código único de referido con amigos',
    step2: 'Los amigos se registran usando tu código',
    step3: '¡Ambos ganan recompensas!',
  },
  settings: {
    title: 'Configuración',
    subtitle: 'Gestiona tus preferencias y configuración',
    preferences: 'Preferencias',
    currency: 'Moneda',
    darkMode: 'Modo Oscuro',
    notifications: 'Notificaciones',
    budgetAlerts: 'Alertas de Presupuesto',
    billReminders: 'Recordatorios de Facturas',
    showBalances: 'Mostrar Saldos',
    language: 'Idioma',
    selectLanguage: 'Seleccionar Idioma',
    cloudSync: 'Sincronización en la Nube',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    supabaseUrl: 'URL del Proyecto Supabase',
    supabaseKey: 'Clave Anon de Supabase',
    testConnection: 'Probar Conexión',
    saveConfig: 'Guardar Configuración',
    profile: 'Perfil',
    security: 'Seguridad',
    dataManagement: 'Gestión de Datos',
    exportData: 'Exportar Datos',
    importData: 'Importar Datos',
    deleteAllData: 'Eliminar Todos los Datos',
  },
  transactions: {
    title: 'Transacciones',
    subtitle: 'Ver y gestionar todas tus transacciones',
    addTransaction: 'Agregar Transacción',
    noTransactions: 'Aún no hay transacciones. Agrega tu primera transacción para comenzar.',
    income: 'Ingresos',
    expense: 'Gastos',
    all: 'Todos',
    recurring: 'Recurrente',
  },
  withdrawal: {
    title: 'Retiros',
    subtitle: 'Ver todas tus solicitudes de retiro y sus estados.',
    noWithdrawals: 'No tienes solicitudes de retiro recientes.',
    from: 'De',
  },
  contracts: {
    title: 'Contratos',
    subtitle: 'Gestiona tus contratos y acuerdos',
    addContract: 'Agregar Contrato',
    noContracts: 'Aún no hay contratos.',
  },
  invoices: {
    title: 'Facturas',
    subtitle: 'Crea y gestiona facturas',
    createInvoice: 'Crear Factura',
    noInvoices: 'Aún no hay facturas.',
  },
  ai: {
    title: 'Asistente IA',
    subtitle: 'Chatea con Tally Wise IA',
    askAnything: 'Pregunta sobre tus finanzas',
    placeholder: 'Pregúntame lo que quieras...',
  },
};

const fr: TranslationKeys = {
  nav: {
    home: 'Accueil',
    contracts: 'Contrats',
    documents: 'Documents',
    invoices: 'Factures',
    card: 'Carte',
    transactions: 'Transactions',
    withdrawal: 'Retrait',
    accounts: 'Comptes',
    budgets: 'Budgets',
    goals: 'Objectifs',
    analytics: 'Analytique',
    reports: 'Rapports',
    referrals: 'Parrainages',
    settings: 'Paramètres',
  },
  common: {
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    confirm: 'Confirmer',
    back: 'Retour',
    next: 'Suivant',
    loading: 'Chargement...',
    noData: 'Aucune donnée disponible',
    signOut: 'Déconnexion',
    signIn: 'Connexion',
    name: 'Nom',
    email: 'E-mail',
    amount: 'Montant',
    date: 'Date',
    category: 'Catégorie',
    description: 'Description',
    status: 'Statut',
    type: 'Type',
    total: 'Total',
    actions: 'Actions',
  },
  dashboard: {
    greeting: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir', night: 'Bonne nuit' },
    totalBalance: 'SOLDE TOTAL',
    withdrawFunds: 'Retirer des fonds',
    addFunds: 'Ajouter des fonds',
    yourCards: 'Vos Cartes',
    addCard: 'Ajouter une Carte',
    recentActivity: 'Activité Récente',
  },
  accounts: {
    title: 'Comptes',
    subtitle: 'Gérez vos comptes et soldes',
    addAccount: 'Ajouter un Compte',
    editAccount: 'Modifier le Compte',
    noAccounts: 'Aucun compte pour le moment. Ajoutez votre premier compte.',
    balance: 'Solde',
    institution: 'Institution',
    accountType: 'Type de Compte',
    checking: 'Courant',
    savings: 'Épargne',
    credit: 'Crédit',
    cash: 'Espèces',
    investment: 'Investissement',
  },
  budgets: {
    title: 'Budgets',
    subtitle: 'Planifiez et suivez vos dépenses par catégorie',
    addBudget: 'Ajouter un Budget',
    editBudget: 'Modifier le Budget',
    noBudgets: 'Aucun budget. Créez un budget pour suivre vos dépenses.',
    spent: 'Dépensé',
    remaining: 'Restant',
    alertThreshold: 'Seuil d\'alerte',
    rollover: 'Report',
    period: 'Période',
    monthly: 'Mensuel',
    yearly: 'Annuel',
  },
  goals: {
    title: 'Objectifs',
    subtitle: 'Créez des objectifs d\'épargne et suivez vos progrès',
    addGoal: 'Ajouter un Objectif',
    editGoal: 'Modifier l\'Objectif',
    noGoals: 'Aucun objectif. Définissez un objectif d\'épargne.',
    targetAmount: 'Montant Cible',
    currentAmount: 'Montant Actuel',
    deadline: 'Échéance',
    priority: 'Priorité',
    contribute: 'Contribuer',
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
    completed: 'Terminé',
  },
  analytics: {
    title: 'Analytique',
    subtitle: 'Comprenez vos habitudes financières',
    income: 'Revenus',
    expenses: 'Dépenses',
    netSavings: 'Épargne Nette',
    monthlyTrend: 'Tendance Mensuelle',
    categoryBreakdown: 'Répartition par Catégorie',
    topCategories: 'Catégories Principales',
    vsLastMonth: 'vs mois dernier',
    thisMonth: 'Ce Mois',
  },
  reports: {
    title: 'Rapports',
    subtitle: 'Visualisez vos dépenses et revenus',
    expensesByCategory: 'Dépenses par Catégorie',
    summary: 'Résumé',
    expenseCategories: 'Catégories de dépenses',
    totalExpense: 'Dépense totale',
    incomeVsExpense: 'Revenus vs Dépenses',
    savingsRate: 'Taux d\'Épargne',
    monthlyOverview: 'Aperçu Mensuel',
    downloadReport: 'Télécharger le Rapport',
  },
  referrals: {
    title: 'Parrainages',
    subtitle: 'Invitez des amis et gagnez des récompenses',
    noReferrals: 'Pas encore de parrainages',
    inviteFriends: 'Invitez vos amis et gagnez des récompenses',
    referralCode: 'Votre Code de Parrainage',
    copyCode: 'Copier le Code',
    earned: 'Total Gagné',
    totalReferred: 'Total Parrainés',
    shareLink: 'Partagez votre lien de parrainage',
    howItWorks: 'Comment ça marche',
    step1: 'Partagez votre code de parrainage unique avec des amis',
    step2: 'Les amis s\'inscrivent avec votre code',
    step3: 'Vous gagnez tous les deux des récompenses!',
  },
  settings: {
    title: 'Paramètres',
    subtitle: 'Gérez vos préférences et configuration',
    preferences: 'Préférences',
    currency: 'Devise',
    darkMode: 'Mode Sombre',
    notifications: 'Notifications',
    budgetAlerts: 'Alertes Budget',
    billReminders: 'Rappels de Factures',
    showBalances: 'Afficher les Soldes',
    language: 'Langue',
    selectLanguage: 'Sélectionner la Langue',
    cloudSync: 'Synchronisation Cloud',
    connected: 'Connecté',
    disconnected: 'Déconnecté',
    supabaseUrl: 'URL du Projet Supabase',
    supabaseKey: 'Clé Anon Supabase',
    testConnection: 'Tester la Connexion',
    saveConfig: 'Enregistrer la Configuration',
    profile: 'Profil',
    security: 'Sécurité',
    dataManagement: 'Gestion des Données',
    exportData: 'Exporter les Données',
    importData: 'Importer les Données',
    deleteAllData: 'Supprimer Toutes les Données',
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'Voir et gérer toutes vos transactions',
    addTransaction: 'Ajouter une Transaction',
    noTransactions: 'Pas encore de transactions. Ajoutez votre première transaction.',
    income: 'Revenus',
    expense: 'Dépense',
    all: 'Tous',
    recurring: 'Récurrent',
  },
  withdrawal: {
    title: 'Retraits',
    subtitle: 'Voir toutes vos demandes de retrait et leurs statuts.',
    noWithdrawals: 'Aucune demande de retrait récente.',
    from: 'De',
  },
  contracts: {
    title: 'Contrats',
    subtitle: 'Gérez vos contrats et accords',
    addContract: 'Ajouter un Contrat',
    noContracts: 'Pas encore de contrats.',
  },
  invoices: {
    title: 'Factures',
    subtitle: 'Créez et gérez des factures',
    createInvoice: 'Créer une Facture',
    noInvoices: 'Pas encore de factures.',
  },
  ai: {
    title: 'Assistant IA',
    subtitle: 'Discutez avec Tally Wise IA',
    askAnything: 'Posez des questions sur vos finances',
    placeholder: 'Demandez-moi ce que vous voulez...',
  },
};

const de: TranslationKeys = {
  nav: {
    home: 'Startseite',
    contracts: 'Verträge',
    documents: 'Dokumente',
    invoices: 'Rechnungen',
    card: 'Karte',
    transactions: 'Transaktionen',
    withdrawal: 'Abhebung',
    accounts: 'Konten',
    budgets: 'Budgets',
    goals: 'Ziele',
    analytics: 'Analytik',
    reports: 'Berichte',
    referrals: 'Empfehlungen',
    settings: 'Einstellungen',
  },
  common: {
    add: 'Hinzufügen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    search: 'Suchen',
    filter: 'Filtern',
    export: 'Exportieren',
    import: 'Importieren',
    confirm: 'Bestätigen',
    back: 'Zurück',
    next: 'Weiter',
    loading: 'Laden...',
    noData: 'Keine Daten verfügbar',
    signOut: 'Abmelden',
    signIn: 'Anmelden',
    name: 'Name',
    email: 'E-Mail',
    amount: 'Betrag',
    date: 'Datum',
    category: 'Kategorie',
    description: 'Beschreibung',
    status: 'Status',
    type: 'Typ',
    total: 'Gesamt',
    actions: 'Aktionen',
  },
  dashboard: {
    greeting: { morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend', night: 'Gute Nacht' },
    totalBalance: 'GESAMTGUTHABEN',
    withdrawFunds: 'Geld abheben',
    addFunds: 'Geld einzahlen',
    yourCards: 'Ihre Karten',
    addCard: 'Karte hinzufügen',
    recentActivity: 'Letzte Aktivität',
  },
  accounts: {
    title: 'Konten',
    subtitle: 'Verwalten Sie Ihre Konten und Salden',
    addAccount: 'Konto hinzufügen',
    editAccount: 'Konto bearbeiten',
    noAccounts: 'Noch keine Konten. Fügen Sie Ihr erstes Konto hinzu.',
    balance: 'Saldo',
    institution: 'Institut',
    accountType: 'Kontotyp',
    checking: 'Girokonto',
    savings: 'Sparkonto',
    credit: 'Kredit',
    cash: 'Bargeld',
    investment: 'Investition',
  },
  budgets: {
    title: 'Budgets',
    subtitle: 'Planen und verfolgen Sie Ausgaben nach Kategorie',
    addBudget: 'Budget hinzufügen',
    editBudget: 'Budget bearbeiten',
    noBudgets: 'Noch keine Budgets. Erstellen Sie ein Budget.',
    spent: 'Ausgegeben',
    remaining: 'Verbleibend',
    alertThreshold: 'Alarmschwelle',
    rollover: 'Übertrag',
    period: 'Zeitraum',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
  },
  goals: {
    title: 'Ziele',
    subtitle: 'Erstellen Sie Sparziele und verfolgen Sie den Fortschritt',
    addGoal: 'Ziel hinzufügen',
    editGoal: 'Ziel bearbeiten',
    noGoals: 'Noch keine Ziele. Setzen Sie ein Sparziel.',
    targetAmount: 'Zielbetrag',
    currentAmount: 'Aktueller Betrag',
    deadline: 'Frist',
    priority: 'Priorität',
    contribute: 'Beitragen',
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
    completed: 'Abgeschlossen',
  },
  analytics: {
    title: 'Analytik',
    subtitle: 'Verstehen Sie Ihre Finanzmuster',
    income: 'Einnahmen',
    expenses: 'Ausgaben',
    netSavings: 'Netto-Ersparnis',
    monthlyTrend: 'Monatlicher Trend',
    categoryBreakdown: 'Kategorieaufschlüsselung',
    topCategories: 'Top-Kategorien',
    vsLastMonth: 'vs letzten Monat',
    thisMonth: 'Diesen Monat',
  },
  reports: {
    title: 'Berichte',
    subtitle: 'Visualisieren Sie Ihre Ausgaben und Einnahmen',
    expensesByCategory: 'Ausgaben nach Kategorie',
    summary: 'Zusammenfassung',
    expenseCategories: 'Ausgabenkategorien',
    totalExpense: 'Gesamtausgaben',
    incomeVsExpense: 'Einnahmen vs Ausgaben',
    savingsRate: 'Sparquote',
    monthlyOverview: 'Monatsübersicht',
    downloadReport: 'Bericht herunterladen',
  },
  referrals: {
    title: 'Empfehlungen',
    subtitle: 'Laden Sie Freunde ein und verdienen Sie Belohnungen',
    noReferrals: 'Noch keine Empfehlungen',
    inviteFriends: 'Laden Sie Freunde ein und verdienen Sie Belohnungen',
    referralCode: 'Ihr Empfehlungscode',
    copyCode: 'Code kopieren',
    earned: 'Insgesamt verdient',
    totalReferred: 'Insgesamt empfohlen',
    shareLink: 'Teilen Sie Ihren Empfehlungslink',
    howItWorks: 'So funktioniert es',
    step1: 'Teilen Sie Ihren einzigartigen Empfehlungscode mit Freunden',
    step2: 'Freunde melden sich mit Ihrem Code an',
    step3: 'Beide verdienen Belohnungen!',
  },
  settings: {
    title: 'Einstellungen',
    subtitle: 'Verwalten Sie Ihre Präferenzen und Konfiguration',
    preferences: 'Präferenzen',
    currency: 'Währung',
    darkMode: 'Dunkelmodus',
    notifications: 'Benachrichtigungen',
    budgetAlerts: 'Budget-Warnungen',
    billReminders: 'Rechnungserinnerungen',
    showBalances: 'Salden anzeigen',
    language: 'Sprache',
    selectLanguage: 'Sprache auswählen',
    cloudSync: 'Cloud-Synchronisierung',
    connected: 'Verbunden',
    disconnected: 'Getrennt',
    supabaseUrl: 'Supabase Projekt-URL',
    supabaseKey: 'Supabase Anon-Schlüssel',
    testConnection: 'Verbindung testen',
    saveConfig: 'Konfiguration speichern',
    profile: 'Profil',
    security: 'Sicherheit',
    dataManagement: 'Datenverwaltung',
    exportData: 'Daten exportieren',
    importData: 'Daten importieren',
    deleteAllData: 'Alle Daten löschen',
  },
  transactions: {
    title: 'Transaktionen',
    subtitle: 'Alle Transaktionen anzeigen und verwalten',
    addTransaction: 'Transaktion hinzufügen',
    noTransactions: 'Noch keine Transaktionen. Fügen Sie Ihre erste Transaktion hinzu.',
    income: 'Einnahmen',
    expense: 'Ausgabe',
    all: 'Alle',
    recurring: 'Wiederkehrend',
  },
  withdrawal: {
    title: 'Abhebungen',
    subtitle: 'Alle Ihre Abhebungsanfragen und deren Status anzeigen.',
    noWithdrawals: 'Keine aktuellen Abhebungsanfragen.',
    from: 'Von',
  },
  contracts: {
    title: 'Verträge',
    subtitle: 'Verwalten Sie Ihre Verträge und Vereinbarungen',
    addContract: 'Vertrag hinzufügen',
    noContracts: 'Noch keine Verträge.',
  },
  invoices: {
    title: 'Rechnungen',
    subtitle: 'Erstellen und verwalten Sie Rechnungen',
    createInvoice: 'Rechnung erstellen',
    noInvoices: 'Noch keine Rechnungen.',
  },
  ai: {
    title: 'KI-Assistent',
    subtitle: 'Chatten Sie mit Tally Wise KI',
    askAnything: 'Fragen Sie alles über Ihre Finanzen',
    placeholder: 'Fragen Sie mich alles...',
  },
};

const ja: TranslationKeys = {
  nav: {
    home: 'ホーム',
    contracts: '契約',
    documents: 'ドキュメント',
    invoices: '請求書',
    card: 'カード',
    transactions: '取引',
    withdrawal: '出金',
    accounts: 'アカウント',
    budgets: '予算',
    goals: '目標',
    analytics: '分析',
    reports: 'レポート',
    referrals: '紹介',
    settings: '設定',
  },
  common: {
    add: '追加',
    edit: '編集',
    delete: '削除',
    save: '保存',
    cancel: 'キャンセル',
    search: '検索',
    filter: 'フィルター',
    export: 'エクスポート',
    import: 'インポート',
    confirm: '確認',
    back: '戻る',
    next: '次へ',
    loading: '読み込み中...',
    noData: 'データがありません',
    signOut: 'サインアウト',
    signIn: 'サインイン',
    name: '名前',
    email: 'メール',
    amount: '金額',
    date: '日付',
    category: 'カテゴリ',
    description: '説明',
    status: 'ステータス',
    type: 'タイプ',
    total: '合計',
    actions: 'アクション',
  },
  dashboard: {
    greeting: { morning: 'おはようございます', afternoon: 'こんにちは', evening: 'こんばんは', night: 'おやすみなさい' },
    totalBalance: '合計残高',
    withdrawFunds: '出金する',
    addFunds: '入金する',
    yourCards: 'あなたのカード',
    addCard: 'カードを追加',
    recentActivity: '最近のアクティビティ',
  },
  accounts: {
    title: 'アカウント',
    subtitle: 'アカウントと残高を管理する',
    addAccount: 'アカウントを追加',
    editAccount: 'アカウントを編集',
    noAccounts: 'まだアカウントがありません。最初のアカウントを追加してください。',
    balance: '残高',
    institution: '機関',
    accountType: 'アカウントタイプ',
    checking: '当座預金',
    savings: '普通預金',
    credit: 'クレジット',
    cash: '現金',
    investment: '投資',
  },
  budgets: {
    title: '予算',
    subtitle: 'カテゴリ別に支出を計画・追跡する',
    addBudget: '予算を追加',
    editBudget: '予算を編集',
    noBudgets: 'まだ予算がありません。支出を追跡するための予算を作成してください。',
    spent: '使用済み',
    remaining: '残り',
    alertThreshold: 'アラートしきい値',
    rollover: '繰り越し',
    period: '期間',
    monthly: '月次',
    yearly: '年次',
  },
  goals: {
    title: '目標',
    subtitle: '貯蓄目標を作成し、進捗を追跡する',
    addGoal: '目標を追加',
    editGoal: '目標を編集',
    noGoals: 'まだ目標がありません。貯蓄目標を設定してください。',
    targetAmount: '目標金額',
    currentAmount: '現在の金額',
    deadline: '期限',
    priority: '優先度',
    contribute: '貢献する',
    low: '低',
    medium: '中',
    high: '高',
    completed: '完了',
  },
  analytics: {
    title: '分析',
    subtitle: '財務パターンを理解する',
    income: '収入',
    expenses: '支出',
    netSavings: '純貯蓄',
    monthlyTrend: '月次トレンド',
    categoryBreakdown: 'カテゴリ内訳',
    topCategories: 'トップカテゴリ',
    vsLastMonth: '先月比',
    thisMonth: '今月',
  },
  reports: {
    title: 'レポート',
    subtitle: '支出と収入を視覚化する',
    expensesByCategory: 'カテゴリ別支出',
    summary: '概要',
    expenseCategories: '支出カテゴリ',
    totalExpense: '総支出',
    incomeVsExpense: '収入 vs 支出',
    savingsRate: '貯蓄率',
    monthlyOverview: '月次概要',
    downloadReport: 'レポートをダウンロード',
  },
  referrals: {
    title: '紹介',
    subtitle: '友達を招待して報酬を獲得',
    noReferrals: 'まだ紹介がありません',
    inviteFriends: '友達を招待して報酬を獲得しましょう',
    referralCode: 'あなたの紹介コード',
    copyCode: 'コードをコピー',
    earned: '合計獲得',
    totalReferred: '合計紹介',
    shareLink: '紹介リンクを共有',
    howItWorks: '仕組み',
    step1: 'ユニークな紹介コードを友達と共有する',
    step2: '友達があなたのコードで登録する',
    step3: '二人とも報酬を獲得！',
  },
  settings: {
    title: '設定',
    subtitle: '設定と構成を管理する',
    preferences: '環境設定',
    currency: '通貨',
    darkMode: 'ダークモード',
    notifications: '通知',
    budgetAlerts: '予算アラート',
    billReminders: '請求書リマインダー',
    showBalances: '残高を表示',
    language: '言語',
    selectLanguage: '言語を選択',
    cloudSync: 'クラウド同期',
    connected: '接続済み',
    disconnected: '未接続',
    supabaseUrl: 'Supabaseプロジェクト URL',
    supabaseKey: 'Supabase Anonキー',
    testConnection: '接続をテスト',
    saveConfig: '設定を保存',
    profile: 'プロフィール',
    security: 'セキュリティ',
    dataManagement: 'データ管理',
    exportData: 'データをエクスポート',
    importData: 'データをインポート',
    deleteAllData: 'すべてのデータを削除',
  },
  transactions: {
    title: '取引',
    subtitle: 'すべての取引を表示・管理する',
    addTransaction: '取引を追加',
    noTransactions: 'まだ取引がありません。最初の取引を追加してください。',
    income: '収入',
    expense: '支出',
    all: 'すべて',
    recurring: '定期的',
  },
  withdrawal: {
    title: '出金',
    subtitle: 'すべての出金リクエストとそのステータスを表示します。',
    noWithdrawals: '最近の出金リクエストはありません。',
    from: 'から',
  },
  contracts: {
    title: '契約',
    subtitle: '契約と合意を管理する',
    addContract: '契約を追加',
    noContracts: 'まだ契約がありません。',
  },
  invoices: {
    title: '請求書',
    subtitle: '請求書を作成・管理する',
    createInvoice: '請求書を作成',
    noInvoices: 'まだ請求書がありません。',
  },
  ai: {
    title: 'AIアシスタント',
    subtitle: 'Tally Wise AIとチャット',
    askAnything: '財務について何でも質問してください',
    placeholder: '何でも聞いてください...',
  },
};

const ar: TranslationKeys = {
  nav: {
    home: 'الرئيسية',
    contracts: 'العقود',
    documents: 'المستندات',
    invoices: 'الفواتير',
    card: 'البطاقة',
    transactions: 'المعاملات',
    withdrawal: 'السحب',
    accounts: 'الحسابات',
    budgets: 'الميزانيات',
    goals: 'الأهداف',
    analytics: 'التحليلات',
    reports: 'التقارير',
    referrals: 'الإحالات',
    settings: 'الإعدادات',
  },
  common: {
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    import: 'استيراد',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    signOut: 'تسجيل الخروج',
    signIn: 'تسجيل الدخول',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    amount: 'المبلغ',
    date: 'التاريخ',
    category: 'الفئة',
    description: 'الوصف',
    status: 'الحالة',
    type: 'النوع',
    total: 'المجموع',
    actions: 'الإجراءات',
  },
  dashboard: {
    greeting: { morning: 'صباح الخير', afternoon: 'مساء الخير', evening: 'مساء الخير', night: 'تصبح على خير' },
    totalBalance: 'الرصيد الإجمالي',
    withdrawFunds: 'سحب الأموال',
    addFunds: 'إضافة أموال',
    yourCards: 'بطاقاتك',
    addCard: 'إضافة بطاقة',
    recentActivity: 'النشاط الأخير',
  },
  accounts: {
    title: 'الحسابات',
    subtitle: 'إدارة حساباتك وأرصدتك',
    addAccount: 'إضافة حساب',
    editAccount: 'تعديل الحساب',
    noAccounts: 'لا توجد حسابات بعد. أضف حسابك الأول للبدء.',
    balance: 'الرصيد',
    institution: 'المؤسسة',
    accountType: 'نوع الحساب',
    checking: 'جاري',
    savings: 'توفير',
    credit: 'ائتمان',
    cash: 'نقدي',
    investment: 'استثمار',
  },
  budgets: {
    title: 'الميزانيات',
    subtitle: 'خطط وتتبع الإنفاق حسب الفئة',
    addBudget: 'إضافة ميزانية',
    editBudget: 'تعديل الميزانية',
    noBudgets: 'لا توجد ميزانيات بعد. أنشئ ميزانية لتتبع إنفاقك.',
    spent: 'المنفق',
    remaining: 'المتبقي',
    alertThreshold: 'حد التنبيه',
    rollover: 'ترحيل',
    period: 'الفترة',
    monthly: 'شهري',
    yearly: 'سنوي',
  },
  goals: {
    title: 'الأهداف',
    subtitle: 'أنشئ أهداف ادخار وتتبع تقدمك',
    addGoal: 'إضافة هدف',
    editGoal: 'تعديل الهدف',
    noGoals: 'لا توجد أهداف بعد. حدد هدف ادخار لبناء مستقبلك.',
    targetAmount: 'المبلغ المستهدف',
    currentAmount: 'المبلغ الحالي',
    deadline: 'الموعد النهائي',
    priority: 'الأولوية',
    contribute: 'المساهمة',
    low: 'منخفض',
    medium: 'متوسط',
    high: 'مرتفع',
    completed: 'مكتمل',
  },
  analytics: {
    title: 'التحليلات',
    subtitle: 'افهم أنماطك المالية',
    income: 'الدخل',
    expenses: 'المصروفات',
    netSavings: 'صافي المدخرات',
    monthlyTrend: 'الاتجاه الشهري',
    categoryBreakdown: 'تفصيل الفئات',
    topCategories: 'أعلى الفئات',
    vsLastMonth: 'مقارنة بالشهر الماضي',
    thisMonth: 'هذا الشهر',
  },
  reports: {
    title: 'التقارير',
    subtitle: 'تصور إنفاقك ودخلك',
    expensesByCategory: 'المصروفات حسب الفئة',
    summary: 'ملخص',
    expenseCategories: 'فئات المصروفات',
    totalExpense: 'إجمالي المصروفات',
    incomeVsExpense: 'الدخل مقابل المصروفات',
    savingsRate: 'معدل الادخار',
    monthlyOverview: 'نظرة عامة شهرية',
    downloadReport: 'تحميل التقرير',
  },
  referrals: {
    title: 'الإحالات',
    subtitle: 'ادعُ أصدقاءك واكسب مكافآت',
    noReferrals: 'لا توجد إحالات بعد',
    inviteFriends: 'ادعُ أصدقاءك واكسب مكافآت',
    referralCode: 'رمز الإحالة الخاص بك',
    copyCode: 'نسخ الرمز',
    earned: 'إجمالي المكتسب',
    totalReferred: 'إجمالي الإحالات',
    shareLink: 'شارك رابط الإحالة الخاص بك',
    howItWorks: 'كيف يعمل',
    step1: 'شارك رمز الإحالة الفريد مع أصدقائك',
    step2: 'الأصدقاء يسجلون باستخدام رمزك',
    step3: 'كلاكما يكسب مكافآت!',
  },
  settings: {
    title: 'الإعدادات',
    subtitle: 'إدارة تفضيلاتك وإعداداتك',
    preferences: 'التفضيلات',
    currency: 'العملة',
    darkMode: 'الوضع المظلم',
    notifications: 'الإشعارات',
    budgetAlerts: 'تنبيهات الميزانية',
    billReminders: 'تذكيرات الفواتير',
    showBalances: 'إظهار الأرصدة',
    language: 'اللغة',
    selectLanguage: 'اختر اللغة',
    cloudSync: 'مزامنة السحابة',
    connected: 'متصل',
    disconnected: 'غير متصل',
    supabaseUrl: 'عنوان مشروع Supabase',
    supabaseKey: 'مفتاح Supabase Anon',
    testConnection: 'اختبار الاتصال',
    saveConfig: 'حفظ الإعدادات',
    profile: 'الملف الشخصي',
    security: 'الأمان',
    dataManagement: 'إدارة البيانات',
    exportData: 'تصدير البيانات',
    importData: 'استيراد البيانات',
    deleteAllData: 'حذف جميع البيانات',
  },
  transactions: {
    title: 'المعاملات',
    subtitle: 'عرض وإدارة جميع معاملاتك',
    addTransaction: 'إضافة معاملة',
    noTransactions: 'لا توجد معاملات بعد. أضف معاملتك الأولى للبدء.',
    income: 'دخل',
    expense: 'مصروف',
    all: 'الكل',
    recurring: 'متكرر',
  },
  withdrawal: {
    title: 'السحوبات',
    subtitle: 'عرض جميع طلبات السحب وحالاتها.',
    noWithdrawals: 'لا توجد طلبات سحب حديثة.',
    from: 'من',
  },
  contracts: {
    title: 'العقود',
    subtitle: 'إدارة عقودك واتفاقياتك',
    addContract: 'إضافة عقد',
    noContracts: 'لا توجد عقود بعد.',
  },
  invoices: {
    title: 'الفواتير',
    subtitle: 'إنشاء وإدارة الفواتير',
    createInvoice: 'إنشاء فاتورة',
    noInvoices: 'لا توجد فواتير بعد.',
  },
  ai: {
    title: 'مساعد الذكاء الاصطناعي',
    subtitle: 'تحدث مع Tally Wise AI',
    askAnything: 'اسأل أي شيء عن أموالك',
    placeholder: 'اسألني أي شيء...',
  },
};

export const translations: Record<Locale, TranslationKeys> = {
  en,
  hi,
  ta,
  es,
  fr,
  de,
  ja,
  ar,
};
