import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, Database, Check, Copy, User as UserIcon, Globe, Key, ArrowRight } from 'lucide-react';
import { processGoogleLogin } from '../../utils/googleAuth';
import { 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  saveSupabaseConfig, 
  isSupabaseConfigured,
  getSupabase 
} from '../../lib/supabase';
import { User } from '../../types';
import toast from 'react-hot-toast';

interface GoogleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export function GoogleConfigModal({ isOpen, onClose, onSuccess }: GoogleConfigModalProps) {
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseUrl());
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseAnonKey());
  const [demoName, setDemoName] = useState('Alex Morgan');
  const [demoEmail, setDemoEmail] = useState('alex.morgan@gmail.com');
  const [copiedCallback, setCopiedCallback] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Derive Supabase project reference if available
  let projectRef = '<your-project-id>';
  if (supabaseUrl.includes('.supabase.co')) {
    const match = supabaseUrl.match(/https:\/\/([a-zA-Z0-9_-]+)\.supabase\.co/);
    if (match && match[1]) {
      projectRef = match[1];
    }
  }
  const callbackUrl = `https://${projectRef}.supabase.co/auth/v1/callback`;

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedCallback(true);
    toast.success('Redirect URI copied!');
    setTimeout(() => setCopiedCallback(false), 2000);
  };

  const handleSaveAndSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = supabaseUrl.trim();
    const cleanKey = supabaseKey.trim();

    if (!cleanUrl || !cleanKey) {
      toast.error('Please enter both your Supabase Project URL and Anon Key.');
      return;
    }

    if (!cleanUrl.startsWith('https://') || !cleanUrl.includes('.supabase.co')) {
      toast.error('Invalid URL! It must look like: https://your-project-id.supabase.co (not an email address).', { duration: 6000 });
      return;
    }

    if (cleanKey.length < 30 || !cleanKey.startsWith('ey')) {
      toast.error('Invalid Anon Key! It must be the public key starting with "ey..." from Supabase Settings -> API.', { duration: 6000 });
      return;
    }

    saveSupabaseConfig(cleanUrl, cleanKey);
    toast.success('Supabase credentials saved!');

    const client = getSupabase();
    if (!client) {
      toast.error('Failed to initialize Supabase client.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        toast.error(error.message || 'Supabase Google OAuth error');
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to start Supabase Google login');
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    const cleanEmail = demoEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const mockGooglePayload = {
      sub: `demo-google-${Date.now()}`,
      name: demoName.trim() || 'Google User',
      email: cleanEmail,
      picture: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      email_verified: true,
    };

    const user = processGoogleLogin(mockGooglePayload);
    toast.success(`Signed in as ${user.name} via Google!`);
    onSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Supabase Google Authentication</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Managed Google OAuth handled securely by your Supabase backend
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Quick Demo Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-800/60 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Instant Demo Mode (Test Right Now)
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                1-Click Ready
              </span>
            </div>
            <p className="text-[11px] text-blue-800/90 dark:text-blue-300/90 mb-3 leading-relaxed">
              Want to test the app without setting up Supabase or Google Cloud credentials right now? Sign in instantly with a test Google profile.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl text-xs border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Gmail Address
                </label>
                <input
                  type="email"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl text-xs border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Continue as {demoName || 'Google User'}</span>
            </button>
          </div>

          {/* Live Supabase Setup Guide */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-500" />
                Connect Live Supabase Project
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step-by-step instructions */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-[11px]">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                To let Supabase handle Google Sign-In:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>
                  In <b>Google Cloud Console</b> &rarr; Credentials &rarr; OAuth 2.0 Client ID &rarr; set <b>Authorized redirect URIs</b> to your Supabase callback:
                  <div className="flex items-center gap-2 mt-1 mb-1">
                    <code className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-emerald-400 font-mono text-[10px] break-all select-all flex-1">
                      {callbackUrl}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyCallback}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1 shrink-0"
                    >
                      {copiedCallback ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCallback ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </li>
                <li>
                  In <b>Supabase Dashboard</b> &rarr; <i>Authentication</i> &rarr; <i>Providers</i> &rarr; <b>Google</b>: toggle ON and paste your Google Client ID &amp; Secret.
                </li>
                <li>
                  Enter your Supabase credentials below and click <b>Connect &amp; Sign In</b>.
                </li>
              </ol>
            </div>

            <form onSubmit={handleSaveAndSignIn} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    autoComplete="off"
                    name="supabase_modal_url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Supabase Anon Public Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    autoComplete="off"
                    name="supabase_modal_key"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                  <span>Connect &amp; Sign In with Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
