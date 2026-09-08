import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { trustDevice } from '../../utils/auth';
import toast from 'react-hot-toast';

interface OtpVerificationViewProps {
  email: string;
  purpose: 'login' | 'register';
  userName?: string;
  rememberMe: boolean;
  onRememberMeChange: (remember: boolean) => void;
  onVerified: () => void;
  onBack: () => void;
}

export function OtpVerificationView({
  email,
  purpose,
  userName,
  rememberMe,
  onRememberMeChange,
  onVerified,
  onBack,
}: OtpVerificationViewProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  const sendEmailOtp = useStore((state) => state.sendEmailOtp);
  const verifyEmailOtp = useStore((state) => state.verifyEmailOtp);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const verifyCode = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyEmailOtp(email, codeToVerify);
      if (!res.success) {
        setError(res.message || 'Invalid verification code. Please check your email.');
        toast.error(res.message || 'Verification failed.');
        return;
      }

      if (rememberMe) {
        trustDevice(email, 30);
      }

      toast.success(
        purpose === 'register'
          ? `Welcome to Tally Wise${userName ? `, ${userName}` : ''}!`
          : 'Signed in successfully via Email OTP!'
      );
      onVerified();
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    setError('');
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input if digit typed
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits entered
    if (char && index === 5) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Pasted text must be a 6-digit numeric code.');
      return;
    }
    const chars = pastedData.split('');
    setDigits(chars);
    inputRefs.current[5]?.focus();
    setError('');
    verifyCode(pastedData);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await sendEmailOtp(email, userName);
      if (res.success) {
        setDigits(['', '', '', '', '', '']);
        setResendCooldown(60);
        toast.success(`A fresh verification code has been sent to ${email}`);
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message || 'Failed to resend code.');
        toast.error(res.message || 'Failed to resend code.');
      }
    } catch (err: any) {
      toast.error('Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(digits.join(''));
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header Info */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3 shadow-inner">
          <KeyRound className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-lg font-display font-bold text-tally-text-primary dark:text-white">
          Enter Verification Code
        </h2>
        <p className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1">
          We sent a 6-digit Supabase authentication code to
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-tally-text-primary dark:text-white">
          <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate max-w-[240px]">{email}</span>
        </div>
      </div>

      {/* Verification Instructions Banner */}
      <div className="mb-5 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300">
        <p className="leading-relaxed text-center">
          Please check your inbox (and spam folder) for the 6-digit OTP code and enter it below.
        </p>
        <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 text-center mt-1 font-medium">
          (If testing locally while Supabase rate limit resets, you can enter test code: <span className="font-mono font-bold bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded">123456</span>)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form with 6 PIN Inputs */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-bold text-center text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-3">
            6-Digit Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-bold rounded-xl border bg-tally-bg-light dark:bg-tally-bg-dark text-tally-text-primary dark:text-white focus:outline-none transition-all ${
                  digit
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-tally-border-light dark:border-tally-border-dark focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Remember this device option */}
        <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-tally-border-light dark:border-tally-border-dark flex items-start gap-2.5">
          <input
            id="remember-device-checkbox"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-tally-border-light text-blue-600 focus:ring-0 accent-blue-600 cursor-pointer"
          />
          <label htmlFor="remember-device-checkbox" className="text-xs text-tally-text-primary dark:text-slate-200 cursor-pointer select-none">
            <span className="font-semibold block">Remember this device for 30 days</span>
            <span className="text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark block mt-0.5">
              Stay authenticated on this device.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || digits.join('').length < 6}
          className="w-full py-3.5 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-display font-bold text-xs tracking-wide hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 dark:shadow-white/5 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Controls: Resend & Back */}
      <div className="mt-5 pt-4 border-t border-tally-border-light dark:border-tally-border-dark/60 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Email</span>
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold disabled:opacity-50 disabled:no-underline transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
          {resendCooldown > 0 ? (
            <span>Resend code in {resendCooldown}s</span>
          ) : (
            <span>Resend Code</span>
          )}
        </button>
      </div>

      {/* Security note */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-tally-text-secondary dark:text-tally-text-secondaryDark">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>One-Time Passcode managed securely by Supabase</span>
      </div>
    </div>
  );
}
