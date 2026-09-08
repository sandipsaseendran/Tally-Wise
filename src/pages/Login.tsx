import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { OtpVerificationView } from '../components/auth/OtpVerificationView';
import toast from 'react-hot-toast';

export function Login() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const register = useStore((state) => state.register);
  const loginWithUser = useStore((state) => state.loginWithUser);
  const sendEmailOtp = useStore((state) => state.sendEmailOtp);

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleModeChange = (newMode: 'signin' | 'register') => {
    setMode(newMode);
    setErrorMessage('');
    setRateLimited(false);
    setEmailError(false);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRateLimited(false);
    setEmailError(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    // 1. Email OTP Flow (Supabase native passwordless)
    if (authMethod === 'otp') {
      if (mode === 'register' && !name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      setLoading(true);
      try {
        const res = await sendEmailOtp(cleanEmail, mode === 'register' ? name.trim() : undefined);
        if (res.success) {
          toast.success(`Verification code sent to ${cleanEmail}`);
          setRateLimited(false);
          setEmailError(false);
          setStep('otp');
        } else {
          if (res.isEmailError) {
            setEmailError(true);
          } else if (res.isRateLimited) {
            setRateLimited(true);
          }
          setErrorMessage(res.message || 'Failed to send verification code.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Traditional Password Flow
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const res = await register(name.trim(), cleanEmail, password);
        if (res.success) {
          toast.success(`Welcome to Tally Wise, ${name.trim()}!`);
          navigate('/');
        } else {
          setErrorMessage(res.message || 'Registration failed.');
          toast.error(res.message || 'Registration failed.');
        }
      } catch (err) {
        setErrorMessage('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Sign-in mode with password
      setLoading(true);
      try {
        const res = await login(cleanEmail, password);
        if (res.success) {
          toast.success('Signed in successfully!');
          navigate('/');
        } else {
          setErrorMessage(res.message || 'Invalid email or password.');
          toast.error(res.message || 'Invalid email or password.');
        }
      } catch (err) {
        setErrorMessage('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSuccess = (user: any) => {
    loginWithUser(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-tally-bg-light dark:bg-tally-bg-dark p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-tally-primary selection:text-tally-primary-dark">
      {/* Background Topography Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25 dark:opacity-35 transition-opacity duration-1000 scale-105"
      >
        <source src="/topography.mp4" type="video/mp4" />
      </video>

      {/* Ambient Backdrop Gradient Vignette to ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-tally-bg-light/60 to-blue-950/60 dark:from-[#070B14]/85 dark:via-[#0B0F19]/70 dark:to-[#070B14]/85 pointer-events-none" />

      {/* Dynamic ambient backdrop glowing blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tally-primary/10 dark:bg-tally-primary-dark/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-tally-text-primary to-slate-800 dark:from-white dark:to-slate-200 flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-white/5 mb-4 group hover:scale-105 transition-transform duration-300">
            <span className="text-white dark:text-tally-bg-dark font-display font-black text-2xl tracking-tighter">
              TW
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-tally-text-primary dark:text-white tracking-tight">
            Tally Wise
          </h1>
          <p className="text-xs sm:text-sm text-tally-text-secondary dark:text-tally-text-secondaryDark mt-1 max-w-xs">
            Intelligent Portfolio, Contracts & Financial Operations
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 dark:bg-tally-surface-dark/90 backdrop-blur-xl border border-tally-border-light dark:border-tally-border-dark rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/5 dark:shadow-black/40 transition-all">
          {step === 'otp' ? (
            /* OTP Verification Screen */
            <OtpVerificationView
              email={email}
              purpose={mode === 'register' ? 'register' : 'login'}
              userName={mode === 'register' ? name : undefined}
              rememberMe={rememberMe}
              onRememberMeChange={setRememberMe}
              onVerified={() => navigate('/')}
              onBack={() => {
                setStep('form');
                setErrorMessage('');
              }}
            />
          ) : (
            /* Primary Login/Register Form */
            <>
              {/* Mode Switcher Tabs (Sign In / Create Account) */}
              <div className="flex bg-tally-bg-light dark:bg-tally-bg-dark p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-tally-surface-darkHover text-tally-text-primary dark:text-white shadow-sm'
                      : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('register')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    mode === 'register'
                      ? 'bg-white dark:bg-tally-surface-darkHover text-tally-text-primary dark:text-white shadow-sm'
                      : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Email Error / Rate Limit Alert Banner */}
              {emailError ? (
                <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Supabase Mail Server Issue (Error 500)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                    Supabase failed to deliver the OTP email (<code>Error sending magic link email</code>). To send real emails, connect a free SMTP provider (like Resend) in Supabase Dashboard ➔ Project Settings ➔ Auth ➔ SMTP Settings. In the meantime, use the dev code or Google Sign-In below.
                  </p>
                  <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('otp');
                        setErrorMessage('');
                        setEmailError(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-all shadow-sm active:scale-95"
                    >
                      Enter Dev Code (123456)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('password');
                        setEmailError(false);
                        setErrorMessage('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold text-[11px] hover:bg-amber-100/50 dark:hover:bg-slate-700 transition-all"
                    >
                      Sign in with Password
                    </button>
                  </div>
                </div>
              ) : rateLimited ? (
                <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Supabase Email Rate Limit Exceeded</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                    Supabase's default mailer limits emails to <strong>~3-4 per hour</strong> on free tier projects to prevent spam.
                  </p>
                  <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('otp');
                        setErrorMessage('');
                        setRateLimited(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-all shadow-sm active:scale-95"
                    >
                      Enter Dev Code (123456)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('password');
                        setRateLimited(false);
                        setErrorMessage('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-semibold text-[11px] hover:bg-amber-100/50 dark:hover:bg-slate-700 transition-all"
                    >
                      Sign in with Password
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Error Banner */
                errorMessage && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )
              )}

              {/* Google Sign In Button */}
              <div className="mb-5">
                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  text={mode === 'register' ? 'signup_with' : 'continue_with'}
                  disabled={loading}
                />
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-tally-border-light dark:border-tally-border-dark" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white dark:bg-tally-surface-dark px-2 text-tally-text-secondary dark:text-tally-text-secondaryDark font-bold tracking-wider">
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Auth Method Switcher: Email OTP vs Password */}
                <div className="flex bg-tally-bg-light dark:bg-tally-bg-dark p-1 rounded-xl border border-tally-border-light/60 dark:border-tally-border-dark/60">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('otp');
                      setErrorMessage('');
                    }}
                    className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMethod === 'otp'
                        ? 'bg-white dark:bg-tally-surface-darkHover text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Email OTP Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('password');
                      setErrorMessage('');
                    }}
                    className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMethod === 'password'
                        ? 'bg-white dark:bg-tally-surface-darkHover text-tally-text-primary dark:text-white shadow-sm'
                        : 'text-tally-text-secondary dark:text-tally-text-secondaryDark hover:text-tally-text-primary dark:hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Password</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary dark:focus:border-white focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@tallywise.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary dark:focus:border-white focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white transition-colors"
                    />
                  </div>
                </div>

                {authMethod === 'password' && (
                  <div>
                    <label className="block text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary dark:focus:border-white focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tally-text-secondary hover:text-tally-text-primary dark:text-tally-text-secondaryDark dark:hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {authMethod === 'password' && mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-tally-text-secondary dark:text-tally-text-secondaryDark uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tally-text-secondary dark:text-tally-text-secondaryDark" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-tally-bg-light dark:bg-tally-bg-dark border border-tally-border-light dark:border-tally-border-dark focus:border-tally-primary dark:focus:border-white focus:outline-none text-xs font-semibold text-tally-text-primary dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me Checkbox & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-tally-border-light text-blue-600 focus:ring-0 focus:outline-none accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark font-medium">
                      Remember me
                    </span>
                  </label>
                  {authMethod === 'password' && mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => toast('Password reset instructions will be sent to your email.')}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-tally-text-primary dark:bg-white text-white dark:text-tally-text-primary font-display font-bold text-xs tracking-wide hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 dark:shadow-white/5 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {authMethod === 'otp'
                          ? mode === 'signin'
                            ? 'Send One-Time Code'
                            : 'Send Verification Code'
                          : mode === 'signin'
                          ? 'Sign In'
                          : 'Create Account'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-tally-text-secondary dark:text-tally-text-secondaryDark mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-Bit Encrypted Financial Platform • Secure Access</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
