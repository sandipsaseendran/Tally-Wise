import { GoogleGenAI } from '@google/genai';
import { Transaction, Account } from '../types';

const getAPIKey = () => {
  let key = import.meta.env?.VITE_GEMINI_API_KEY || '';
  if (!key || key === 'YOUR_GEMINI_API_KEY') return '';
  return key.trim();
};

// Intelligent contextual local fallback advisor if API key is invalid/offline
const generateLocalFinancialAnswer = (
  prompt: string,
  transactions: Transaction[],
  accounts: Account[],
  currency: string = '$'
): string => {
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');
  const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = incomes.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const p = prompt.toLowerCase();

  if (p.includes('spend') || p.includes('expense') || p.includes('cost') || p.includes('where')) {
    const catMap = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);
    const top = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    return `📊 **Spending Summary**:\n• Total Expenses: ${currency}${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${expenses.length} transaction${expenses.length === 1 ? '' : 's'})\n${
      top ? `• Highest Category: **${top[0]}** (${currency}${top[1].toLocaleString('en-US', { minimumFractionDigits: 2 })})\n` : ''
    }• Recommendation: Consider setting a monthly threshold for your top spending category to avoid budget overruns.`;
  }

  if (p.includes('balance') || p.includes('card') || p.includes('account') || p.includes('wallet')) {
    const cardList = accounts
      .map((a) => `• **${a.name}** (${a.institution || 'Personal'}): ${currency}${(a.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} [${a.type}]`)
      .join('\n');
    return `💳 **Card & Account Breakdown**:\n• Total Net Wallet Balance: **${currency}${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}**\n• Active Accounts (${accounts.length}):\n${cardList}\n\nAll funds are synchronized in real-time across your cards, dashboard, and wallet stack.`;
  }

  if (p.includes('save') || p.includes('tip') || p.includes('budget') || p.includes('plan') || p.includes('goal')) {
    return `💡 **Smart Financial Recommendations**:\n1. **Build a 3-Month Buffer**: Target keeping at least 3 months of baseline expenses in your primary checking or cash account.\n2. **Optimize Card Utilization**: Distribute larger purchases across cards with rewards or lower APR.\n3. **Automate Savings**: With your net balance of ${currency}${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}, set aside a weekly transfer into an emergency vault.`;
  }

  return `I've analyzed your financial snapshot:\n• **Net Wallet Balance**: ${currency}${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n• **Active Cards**: ${accounts.length}\n• **Total Transactions**: ${transactions.length}\n\nAsk me about your spending breakdown, saving strategies, or card balances anytime!`;
};

export const getFinancialInsights = async (
  transactions: Transaction[],
  accounts: Account[],
  currency: string = '$'
): Promise<string> => {
  const apiKey = getAPIKey();
  const totalBalance = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const recentTxs = transactions.slice(-10).map(t => `${t.date}: ${t.type === 'expense' ? '-' : '+'}${currency}${Math.abs(t.amount)} for ${t.category}`).join('\n');
      const prompt = `
You are Tally Wise AI, a financial advisor.
- Total Balance: ${currency}${totalBalance}
- Recent Transactions:
${recentTxs}

Provide 2-3 short, highly actionable financial insights. Friendly and concise.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) return response.text;
    } catch (error) {
      console.warn("Gemini API falling back to local intelligence:", error);
    }
  }

  return `• **Healthy Liquidity**: You have a total balance of ${currency}${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} across ${accounts.length} account(s).\n• **Transaction Tracking**: ${transactions.length} transactions logged. Consistent tracking keeps your cashflow predictable.\n• **Pro Tip**: Review any recurring charges or subscriptions this month to maximize your savings.`;
};

export const chatWithAIAgent = async (
  prompt: string,
  context: { transactions: Transaction[]; accounts: Account[]; currency?: string }
): Promise<string> => {
  const apiKey = getAPIKey();
  const currency = context.currency || '$';
  const totalBalance = context.accounts.reduce((acc, a) => acc + (a.balance || 0), 0);

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const sysPrompt = `You are Tally Wise AI, a warm, intelligent financial copilot. User's total balance is ${currency}${totalBalance} across ${context.accounts.length} accounts, with ${context.transactions.length} transactions. Keep answers practical, structured, and concise.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${sysPrompt}\n\nUser Question: ${prompt}`,
      });

      if (response.text) return response.text;
    } catch (error) {
      console.warn("Gemini chat falling back to local financial intelligence:", error);
    }
  }

  return generateLocalFinancialAnswer(prompt, context.transactions, context.accounts, currency);
};

export const analyzeDocumentWithAI = async (dataUrl: string, mimeType: string): Promise<string> => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    return "Document analyzed: File processed successfully. Please configure a valid Gemini API key for deep OCR extraction.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = dataUrl.split(',')[1];
    if (!base64Data) return "Invalid document data format.";

    const prompt = `You are a financial analyst AI. Extract key entities, total amounts, dates, and a 1-sentence summary from this document.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ],
    });

    return response.text || "No details could be extracted.";
  } catch (error: any) {
    console.error("Gemini Document Analysis Error:", error);
    return `Could not extract text from document. Error: ${error?.message || error}`;
  }
};
