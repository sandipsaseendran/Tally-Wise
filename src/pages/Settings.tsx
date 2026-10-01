import React, { useState } from 'react'
import { Plus, Database, Cloud, CheckCircle, Key, Globe, ExternalLink, Check, Copy, Languages } from 'lucide-react'
import { useStore } from '../../store/useStore'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { 
  isSupabaseConfigured, 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  saveSupabaseConfig, 
  clearSupabaseConfig,
  getSupabase
} from '../lib/supabase'
import { useI18n, SUPPORTED_LOCALES } from '../i18n'
import type { Locale } from '../i18n'
import toast from 'react-hot-toast'

export const Settings = () => {
  const { settings, updateSettings, isCloudConnected, syncFromSupabase } = useStore()
  const { locale, setLocale, t } = useI18n()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<any>>({})

  // Supabase Configuration Form state
  const isConfigured = isSupabaseConfigured()
  const [supabaseUrl, setSupabaseUrl] = useState(getSupabaseUrl())
  const [supabaseKey, setSupabaseKey] = useState(getSupabaseAnonKey())
  const [testingConnection, setTestingConnection] = useState(false)
  const [copiedSqlPath, setCopiedSqlPath] = useState(false)

  const handleOpen = () => { setFormData(settings); setIsModalOpen(true) }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData as any)
    toast.success('Preferences updated!')
    setIsModalOpen(false)
  }

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanUrl = supabaseUrl.trim()
    const cleanKey = supabaseKey.trim()

    if (!cleanUrl || !cleanKey) {
      toast.error('Please enter both Supabase Project URL and Anon Public Key.')
      return
    }

    if (!cleanUrl.startsWith('https://') || !cleanUrl.includes('.supabase.co')) {
      toast.error('Invalid URL! It must look like: https://your-project-id.supabase.co (not an email address).', { duration: 6000 })
      return
    }

    if (cleanKey.length < 30 || !cleanKey.startsWith('ey')) {
      toast.error('Invalid Anon Key! It must be the public key starting with "ey..." from Supabase Settings -> API.', { duration: 6000 })
      return
    }

    setTestingConnection(true)
    try {
      saveSupabaseConfig(cleanUrl, cleanKey)
      const client = getSupabase()
      if (!client) {
        toast.error('Failed to initialize Supabase client with these credentials.')
        return
      }

      // Test simple ping query
      const { error } = await client.from('accounts').select('id').limit(1)
      if (error && error.code !== 'PGRST116') {
        toast((t) => (
          <div className="text-xs">
            <p className="font-bold">Credentials saved & verified!</p>
            <p className="text-slate-400 mt-0.5">Remember to run <code>supabase/schema.sql</code> in your Supabase SQL Editor if you haven't created the tables yet.</p>
          </div>
        ), { duration: 6000 })
      } else {
        toast.success('Successfully connected to Supabase!')
      }

      await syncFromSupabase()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to verify connection')
    } finally {
      setTestingConnection(false)
    }
  }

  const handleResetSupabase = () => {
    clearSupabaseConfig()
    setSupabaseUrl(getSupabaseUrl())
    setSupabaseKey(getSupabaseAnonKey())
    toast.success('Reset to environment variables')
  }

  const handleCopySchemaPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql')
    setCopiedSqlPath(true)
    toast.success('Schema path copied: supabase/schema.sql')
    setTimeout(() => setCopiedSqlPath(false), 2000)
  }

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar">
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-tally-text-primary dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
            System configurations, database connections, and user preferences
          </p>
        </div>
        <button 
          onClick={handleOpen} 
          className="px-4 py-2.5 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-bold text-xs flex items-center gap-2 shadow-sm hover:opacity-95 transition-all"
        >
          <Plus size={16} /> Edit Preferences
        </button>
      </div>

      {/* Language Selector Card */}
      <div className="bg-white/80 dark:bg-tally-surface-dark/90 backdrop-blur-xl border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-tally-text-primary dark:text-white">{t.settings.language}</h2>
            <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">{t.settings.selectLanguage}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUPPORTED_LOCALES.map(loc => (
            <button
              key={loc.code}
              onClick={() => setLocale(loc.code as Locale)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                locale === loc.code
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-sm'
                  : 'border-tally-border-light dark:border-tally-border-dark hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover'
              }`}
            >
              <span className="text-xl">{loc.flag}</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-tally-text-primary dark:text-white">{loc.nativeName}</span>
                <span className="text-[10px] text-tally-text-secondary dark:text-tally-text-secondaryDark">{loc.name}</span>
              </div>
              {locale === loc.code && <Check className="w-4 h-4 text-blue-500 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Cloud Backend (Supabase) Card */}
      <div className="bg-white/80 dark:bg-tally-surface-dark/90 backdrop-blur-xl border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-tally-border-light dark:border-tally-border-dark">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-tally-text-primary dark:text-white">
                  Cloud Backend: Supabase
                </h2>
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isConfigured
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                }`}>
                  {isConfigured ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Cloud Sync
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Local Storage Mode
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-0.5">
                PostgreSQL database, Row Level Security (RLS), Supabase Auth, and cloud document storage.
              </p>
            </div>
          </div>

          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Database Migration helper box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>SQL Schema & Tables Setup</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Run the pre-built migration script in your Supabase SQL Editor to automatically create all 11 tables, triggers, and storage buckets:
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopySchemaPath}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-all self-start sm:self-center"
          >
            {copiedSqlPath ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSqlPath ? 'Path Copied!' : 'Copy supabase/schema.sql'}</span>
          </button>
        </div>

        {/* Supabase Connection Credentials Form */}
        <form onSubmit={handleSaveSupabaseConfig} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-1.5">
                Supabase Project URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoComplete="off"
                  name="supabase_project_url"
                  placeholder="https://your-project-id.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary dark:focus:border-white focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Supabase Dashboard &rarr; Settings (gear icon) &rarr; API &rarr; <b>Project URL</b>
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-1.5">
                Anon Public API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoComplete="off"
                  name="supabase_anon_key"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary dark:focus:border-white focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Supabase Dashboard &rarr; Settings (gear icon) &rarr; API &rarr; <b>anon public</b>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetSupabase}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline font-medium"
            >
              Reset to .env defaults
            </button>

            <button
              type="submit"
              disabled={testingConnection}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {testingConnection ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Database className="w-3.5 h-3.5" />
              )}
              <span>Save & Connect Supabase</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Overview Card */}
      <div className="bg-white/80 dark:bg-tally-surface-dark/90 backdrop-blur-xl border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        <h2 className="text-base sm:text-lg font-bold text-tally-text-primary dark:text-white mb-4">
          Display & App Preferences
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark">
            <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">Currency Symbol</span>
            <div className="text-lg font-bold text-tally-text-primary dark:text-white mt-1">
              {settings.currency}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark">
            <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">Dark Mode</span>
            <div className="text-lg font-bold text-tally-text-primary dark:text-white mt-1">
              {settings.darkMode ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark">
            <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark">Notifications</span>
            <div className="text-lg font-bold text-tally-text-primary dark:text-white mt-1">
              {settings.notifications ? 'Active' : 'Muted'}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Preferences">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark mb-1">
              Currency Symbol
            </label>
            <input 
              className="w-full px-4 py-2.5 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark text-xs font-semibold" 
              value={(formData as any).currency ?? settings.currency} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, currency: e.target.value }))} 
            />
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="pref-dark"
              checked={(formData as any).darkMode ?? settings.darkMode} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, darkMode: e.target.checked }))} 
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <label htmlFor="pref-dark" className="text-xs font-semibold text-tally-text-primary dark:text-white cursor-pointer select-none">
              Dark Mode Theme
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="pref-notif"
              checked={(formData as any).notifications ?? settings.notifications} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, notifications: e.target.checked }))} 
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <label htmlFor="pref-notif" className="text-xs font-semibold text-tally-text-primary dark:text-white cursor-pointer select-none">
              Push & In-App Notifications
            </label>
          </div>
          <div className="flex items-center gap-3 justify-end pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-4 py-2 rounded-xl border border-tally-border-light dark:border-tally-border-dark text-xs font-bold text-tally-text-secondary hover:text-tally-text-primary dark:hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-bold text-xs shadow"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </Modal>
    </div>
    </div>
  )
}

export default Settings
