import React, { useState } from 'react';
import { Mail, ShieldCheck, BadgeCheck, ShieldAlert, HeartPulse, Lock, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginViewProps {
  onLoginSuccess: (type: 'admin' | 'family') => void;
  onNavigateHome: () => void;
}

export default function AdminLoginView({ onLoginSuccess, onNavigateHome }: AdminLoginViewProps) {
  // Available Admin Profiles
  const adminProfiles = [
    { email: 'diwaspal9@gmail.com', label: 'Diwas Pal', password: 'David@9082' },
    { email: 'jeevanparivartan2@gmail.com', label: 'Jeevan Parivartan', password: 'Nashamukti@9082' }
  ];

  // Login Form States - Default prefilled with the first profile
  const [email, setEmail] = useState('diwaspal9@gmail.com');
  const [password, setPassword] = useState('David@9082');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Standard Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const targetEmail = email.trim().toLowerCase();
    const allowedEmails = ['jeevanparivartan2@gmail.com', 'diwaspal9@gmail.com'];

    if (!allowedEmails.includes(targetEmail)) {
      setError('Access denied: This email address is not authorized as an administrator.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: password.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password verification failed. Please try again.');
      }

      setSuccessMessage('Secure verification complete. Directing to administrative workspace...');
      console.log('[Password Login Success]: Admin authenticated', data);
      
      // Delay slightly for visual feedback on successful authentication
      setTimeout(() => {
        onLoginSuccess('admin');
      }, 750);
    } catch (err: any) {
      console.error('[Password Login Error]:', err);
      setError(err?.message || 'Invalid email or password. Verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSelect = (selectedEmail: string, selectedPassword: string) => {
    setEmail(selectedEmail);
    setPassword(selectedPassword);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 md:px-12 relative overflow-hidden font-sans text-slate-100 selection:bg-teal-500/20 selection:text-teal-200">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10000ms]"></div>
      
      {/* Abstract Glowing Grid Ring */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>

      <div className="w-full max-w-lg z-10 space-y-8">
        
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <motion.button 
            onClick={onNavigateHome}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 px-5 py-2.5 rounded-2xl shadow-xl transition-all duration-300 backdrop-blur-md"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 group-hover:rotate-6 transition-transform duration-300">
              <HeartPulse className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-100 tracking-tight block">
                Jeevan Parivartan
              </span>
              <span className="text-[9px] text-teal-400/90 font-bold tracking-widest uppercase block mt-0.5 font-mono">
                SYSTEM PORTAL
              </span>
            </div>
          </motion.button>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 tracking-tight font-display">
            Administrative Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Verify system credentials to access patient charts, ledger balances, and security logs.
          </p>
        </div>

        {/* Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-slate-900/50 border border-slate-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-950/50 relative overflow-hidden"
        >
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

          {/* Profile Quick Selector */}
          <div className="mb-6 space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Admin Profile
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
              {adminProfiles.map((profile) => {
                const isActive = email.toLowerCase() === profile.email.toLowerCase();
                return (
                  <button
                    key={profile.email}
                    type="button"
                    onClick={() => handleProfileSelect(profile.email, profile.password)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/10'
                        : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/40'
                    }`}
                  >
                    <span>{profile.label}</span>
                    <span className={`text-[9px] font-medium font-mono ${isActive ? 'text-slate-900/70' : 'text-slate-500'}`}>
                      {profile.email}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notification Messages */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 mb-6 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-350 flex gap-3 items-start"
            >
              <ShieldAlert className="w-5 h-5 text-rose-450 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-350">Authentication Failure</p>
                <p className="leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-300 flex gap-3 items-start"
            >
              <BadgeCheck className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Authorized</p>
                <p className="leading-relaxed">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-450">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="diwaspal9@gmail.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:border-teal-500/80 focus:ring-4 focus:ring-teal-950/50 transition-all text-slate-100 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-450">
                Security Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:border-teal-500/80 focus:ring-4 focus:ring-teal-950/50 transition-all text-slate-100 font-semibold font-mono tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-550 hover:text-slate-350 focus:outline-none cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Action Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 py-4 rounded-2xl font-bold tracking-wide shadow-xl shadow-teal-950/30 flex justify-center items-center gap-2 hover:shadow-teal-500/10 transition-all cursor-pointer disabled:cursor-not-allowed text-sm uppercase"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-slate-950" />
                  <span>Verify & Sign In</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Security badges */}
        <div className="flex justify-center items-center gap-6 text-[10px] text-slate-500 font-mono font-bold tracking-wider">
          <span className="flex items-center gap-1.5 uppercase">
            <BadgeCheck className="w-4 h-4 text-teal-555" />
            256-Bit SSL Secured
          </span>
          <span className="flex items-center gap-1.5 uppercase">
            <BadgeCheck className="w-4 h-4 text-teal-555" />
            Firebase Storage
          </span>
        </div>
      </div>
    </div>
  );
}
