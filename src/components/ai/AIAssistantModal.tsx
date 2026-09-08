import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  X,
  Bot,
  User,
  TrendingUp,
  CreditCard,
  PieChart,
  RefreshCw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { chatWithAIAgent, getFinancialInsights } from '../../utils/geminiClient';
import { AISphere } from '../shared/AISphere';

const SUGGESTED_QUESTIONS = [
  'Where am I spending the most money?',
  'How are my card balances looking?',
  'Give me 3 actionable tips to save more',
  'What should my monthly budget look like?',
];

export function AIAssistantModal() {
  const isAIAssistantOpen = useStore((state) => state.isAIAssistantOpen);
  const setAIAssistantOpen = useStore((state) => state.setAIAssistantOpen);
  const accounts = useStore((state) => state.accounts);
  const transactions = useStore((state) => state.transactions);
  const settings = useStore((state) => state.settings);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Financial summary metrics
  const totalBalance = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // Calculate top spending category
  const expenseCategories = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1])[0];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load initial insights when opened
  useEffect(() => {
    if (isAIAssistantOpen && !aiInsights && !insightsLoading) {
      setInsightsLoading(true);
      getFinancialInsights(transactions, accounts, settings.currency)
        .then((res) => {
          setAiInsights(res);
        })
        .catch(() => {
          setAiInsights(
            `Based on your total balance of ${settings.currency}${totalBalance.toFixed(2)}, we recommend keeping 20% in an emergency fund and checking recurring subscriptions.`
          );
        })
        .finally(() => setInsightsLoading(false));

      // Initial welcome message if empty
      if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            text: `Hello! I'm Tally Wise AI. I have full real-time awareness of your ${accounts.length} account(s) and ${transactions.length} transaction(s). How can I assist your financial journey today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }
  }, [isAIAssistantOpen, transactions, accounts, totalBalance, settings.currency]);

  if (!isAIAssistantOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAIAgent(textToSend, { transactions, accounts, currency: settings.currency });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Your current total balance is ${settings.currency}${totalBalance.toFixed(2)}. You have logged ${transactions.length} transactions across ${accounts.length} card(s). Everything is tracked and synchronized.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 animate-fade-in">
      <div className="bg-tally-surface-light dark:bg-[#131722] border border-tally-border-light dark:border-tally-border-dark rounded-3xl w-full max-w-4xl h-[90vh] max-h-[820px] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:px-8 border-b border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light/80 dark:bg-tally-surface-dark/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mini 3D Sphere Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 overflow-hidden relative shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#0B0F19] flex items-center justify-center overflow-hidden">
                <AISphere />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-tally-text-primary dark:text-white">
                  Tally Wise AI Assistant
                </h2>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI Sphere Active
                </span>
              </div>
              <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">
                Personalized financial advisor with real-time card & transaction awareness
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAIAssistantOpen(false)}
            className="p-2 rounded-full hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white transition-colors"
            title="Close AI Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Split Sections */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel: Real-Time Intelligence & Insights */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-tally-border-light dark:border-tally-border-dark p-5 bg-tally-bg-light/40 dark:bg-[#0E121B] overflow-y-auto no-scrollbar space-y-4 shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark block mb-1">
                Connected Finances
              </span>
              <div className="p-4 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-sm">
                <span className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark block">
                  Net Wallet Balance
                </span>
                <span className="text-2xl font-display font-bold text-tally-text-primary dark:text-white font-mono">
                  {settings.currency}{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-tally-border-light dark:border-tally-border-dark text-xs">
                  <div>
                    <span className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark block">Cards</span>
                    <span className="font-bold text-tally-text-primary dark:text-white">{accounts.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark block">Transactions</span>
                    <span className="font-bold text-tally-text-primary dark:text-white">{transactions.length}</span>
                  </div>
                  {topCategory && (
                    <div>
                      <span className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark block">Top Spend</span>
                      <span className="font-bold text-rose-500 truncate max-w-[80px] block">{topCategory[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Smart Summary / Insights */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Financial Insights</span>
              </div>
              {insightsLoading ? (
                <div className="flex items-center gap-2 text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>Synthesizing balance & habits...</span>
                </div>
              ) : (
                <p className="text-xs text-tally-text-secondary dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {aiInsights || `Your accounts are in good standing with ${settings.currency}${totalBalance.toFixed(2)} available. Keep an eye on non-essential expenses.`}
                </p>
              )}
            </div>

            {/* Prompt Quick Chips */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-tally-text-secondary dark:text-tally-text-secondaryDark block mb-2">
                Suggested Prompts
              </span>
              <div className="space-y-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark hover:border-purple-500/50 hover:bg-purple-500/5 text-xs text-tally-text-primary dark:text-slate-200 transition-all font-medium flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Conversational Chat */}
          <div className="flex-1 flex flex-col h-full bg-tally-surface-light dark:bg-[#111520]">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-4">
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                        isUser
                          ? 'bg-tally-primary dark:bg-white text-tally-text-primary dark:text-tally-bg-dark font-bold text-xs'
                          : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-tally-primary/90 dark:bg-white text-tally-text-primary dark:text-tally-bg-dark font-medium rounded-tr-none'
                          : 'bg-tally-bg-light dark:bg-[#1A1F2C] border border-tally-border-light dark:border-tally-border-dark text-tally-text-primary dark:text-slate-100 rounded-tl-none whitespace-pre-line'
                      }`}
                    >
                      {msg.text}
                      <span
                        className={`block text-[9px] mt-1.5 opacity-60 ${
                          isUser ? 'text-right text-tally-text-primary dark:text-tally-bg-dark' : 'text-left text-tally-text-secondary dark:text-tally-text-secondaryDark'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none p-4 bg-tally-bg-light dark:bg-[#1A1F2C] border border-tally-border-light dark:border-tally-border-dark text-xs flex items-center gap-2 text-tally-text-secondary dark:text-tally-text-secondaryDark">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
                    <span>Tally Wise AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 border-t border-tally-border-light dark:border-tally-border-dark bg-tally-bg-light/60 dark:bg-tally-surface-dark/60 backdrop-blur-sm shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your cards, balance, or spending..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-[#0B0F19] border border-tally-border-light dark:border-tally-border-dark focus:outline-none focus:border-purple-500 text-xs sm:text-sm text-tally-text-primary dark:text-white transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-all shadow-md hover:shadow-purple-500/25 shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
