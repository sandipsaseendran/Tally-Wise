import { Users, Copy, Check, Gift, Share2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useI18n } from '../i18n';
import toast from 'react-hot-toast';

export function Referrals() {
  const currentUser = useStore(s => s.currentUser);
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  // Generate a referral code from user ID
  const referralCode = currentUser?.id ? `TALLY-${currentUser.id.slice(0, 6).toUpperCase()}` : 'TALLY-XXXX';
  const referralLink = `https://tally-wise.vercel.app/login?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-medium text-tally-text-primary dark:text-white tracking-tight">{t.referrals.title}</h1>
        <p className="text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">{t.referrals.subtitle}</p>
      </div>

      {/* Hero Section */}
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">{t.referrals.inviteFriends}</h2>
              <p className="text-violet-200 text-sm">{t.referrals.shareLink}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 font-mono text-sm select-all truncate">
              {referralLink}
            </div>
            <button onClick={handleCopy} className="px-5 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm flex items-center gap-2 hover:bg-violet-50 transition-colors shadow-md">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : t.referrals.copyCode}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase font-bold tracking-wide">{t.referrals.totalReferred}</p>
          <p className="text-3xl font-display font-bold text-tally-text-primary dark:text-white mt-1">0</p>
        </div>
        <div className="p-5 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
          <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase font-bold tracking-wide">{t.referrals.earned}</p>
          <p className="text-3xl font-display font-bold text-emerald-500 mt-1">$0.00</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="p-6 rounded-2xl bg-tally-surface-light dark:bg-tally-surface-dark border border-tally-border-light dark:border-tally-border-dark shadow-soft dark:shadow-soft-dark">
        <h3 className="font-display font-bold text-tally-text-primary dark:text-white mb-6 text-lg">{t.referrals.howItWorks}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', icon: Share2, title: t.referrals.step1, color: 'from-blue-500 to-blue-600' },
            { step: '2', icon: Users, title: t.referrals.step2, color: 'from-violet-500 to-violet-600' },
            { step: '3', icon: Gift, title: t.referrals.step3, color: 'from-emerald-500 to-emerald-600' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                <item.icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-tally-text-primary dark:text-white font-semibold leading-relaxed">{item.title}</p>
              {i < 2 && <ArrowRight className="w-5 h-5 text-tally-text-secondary dark:text-tally-text-secondaryDark mt-3 hidden md:block rotate-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
