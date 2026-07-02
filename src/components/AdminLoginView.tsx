import React, { useState } from 'react';
import { Mail, ShieldCheck, BadgeCheck, ShieldAlert, HeartPulse, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminLoginViewProps {
  onLoginSuccess: (type: 'admin' | 'family') => void;
  onNavigateHome: () => void;
}

export default function AdminLoginView({ onLoginSuccess, onNavigateHome }: AdminLoginViewProps) {
  // Login Form States
  const [email, setEmail] = useState('jeevanparivartan2@gmail.com');
  const [password, setPassword] = useState('');
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

      console.log('[Password Login Success]: Admin authenticated', data);
      onLoginSuccess('admin');
    } catch (err: any) {
      console.error('[Password Login Error]:', err);
      setError(err?.message || 'Invalid email or password. Verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen flex items-center justify-center py-8 sm:py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden font-sans">
      {/* Ambient background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10 space-y-6 sm:space-y-8">
        <div className="text-center">
          {/* Logo */}
          <button 
            onClick={onNavigateHome}
            className="inline-flex items-center gap-3 group text-left cursor-pointer focus:outline-none mb-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-100 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight block">
                Jeevan Parivartan
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase block -mt-1">
                Clinical Administration
              </span>
            </div>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
            Secure Clinician & Administration Access
          </p>
        </div>

        {/* Card */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 sm:p-8 shadow-xl border border-slate-100"
        >
          {/* Authorized Admin Note */}
          <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-100/50 text-xs text-teal-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Authorized Admin Verification</p>
              <p className="mt-1 text-[11px] text-teal-900/80 leading-relaxed">
                Only authorized clinicians (<code className="bg-teal-100/60 px-1 py-0.5 rounded font-mono font-bold text-teal-950 break-all">jeevanparivartan2@gmail.com</code> and <code className="bg-teal-100/60 px-1 py-0.5 rounded font-mono font-bold text-teal-950 break-all">diwaspal9@gmail.com</code>) have access to security logs and patient registers.
              </p>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3.5 mb-6 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 flex gap-2.5 items-start"
            >
              <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-1">
                <p className="font-bold">Access Warning</p>
                <p className="leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Success Notice */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex gap-2.5 items-start"
            >
              <BadgeCheck className="w-4.5 h-4.5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <span className="font-medium leading-relaxed">{successMessage}</span>
            </motion.div>
          )}

          {/* Simple Email and Password Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jeevanparivartan2@gmail.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter clinical password"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all text-slate-900 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-900 hover:bg-teal-950 disabled:bg-teal-800/80 text-white py-4 rounded-xl font-semibold shadow-md shadow-teal-100/50 flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying password...</span>
                </>
              ) : (
                <>
                  <span>Verify & Sign In</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Security standards badges */}
        <div className="flex justify-center items-center gap-6 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <BadgeCheck className="w-4.5 h-4.5 text-emerald-500" />
            Clinician Verified
          </span>
          <span className="flex items-center gap-1">
            <BadgeCheck className="w-4.5 h-4.5 text-emerald-500" />
            Firebase Secured
          </span>
        </div>
      </div>
    </div>
  );
}
