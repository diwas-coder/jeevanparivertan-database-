'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('jeevanparivartan2@gmail.com');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const targetEmail = email.trim().toLowerCase();

    // Strict rule: Only allow jeevanparivartan2@gmail.com
    if (targetEmail !== 'jeevanparivartan2@gmail.com') {
      setError('Access denied. This email is not allowed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: targetEmail,
        options: {
          shouldCreateUser: false
        }
      });

      if (otpError) {
        throw otpError;
      }

      setSuccessMessage('A 6-digit verification code has been sent to your email.');
      setStep('otp');
    } catch (err) {
      console.error('[Supabase Auth Error]:', err);
      const is504Error = err?.status === 504 || 
                         err?.status === '504' || 
                         err?.code === '504' || 
                         err?.name === 'AuthRetryableFetchError' || 
                         String(err).includes('504') || 
                         String(err).includes('FetchError') ||
                         String(err).includes('Failed to fetch');

      if (is504Error) {
        setError('Could not connect to Supabase. Please check Supabase URL, anon key, internet connection, and project status.');
      } else {
        setError(err?.message || 'Failed to dispatch verification code. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const targetEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: targetEmail,
        token: cleanOtp,
        type: 'email'
      });

      if (verifyError) {
        throw verifyError;
      }

      // On success, redirect to /admin/dashboard
      window.location.assign('/admin/dashboard');
    } catch (err) {
      console.error('[Supabase Verify Error]:', err);
      const is504Error = err?.status === 504 || 
                         err?.status === '504' || 
                         err?.code === '504' || 
                         err?.name === 'AuthRetryableFetchError' || 
                         String(err).includes('504') || 
                         String(err).includes('FetchError') ||
                         String(err).includes('Failed to fetch');

      if (is504Error) {
        setError('Could not connect to Supabase. Please check Supabase URL, anon key, internet connection, and project status.');
      } else {
        setError(err?.message || 'Invalid or expired OTP. Please check your inbox and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen flex items-center justify-center py-16 px-6 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Admin Portal</h1>
          <p className="text-sm text-slate-500 font-medium">Secure OTP verification login</p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100">
          <div className="mb-6 p-3 rounded-lg bg-teal-50 border border-teal-100/50 text-xs text-teal-950">
            <p className="font-bold">🔑 Real Supabase OTP Login:</p>
            <p className="mt-1">Enter your admin email to receive a secure login code via email.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 font-medium">
              {successMessage}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jeevanparivartan2@gmail.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all text-slate-900 font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-900 hover:bg-teal-950 disabled:bg-teal-800/80 text-white py-4 rounded-xl font-semibold shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Code...' : 'Send 6-Digit OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase text-slate-500">
                    Enter OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setError('');
                    }}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    Change Email
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all text-slate-900 text-center font-mono tracking-widest text-lg font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-900 hover:bg-teal-950 disabled:bg-teal-800/80 text-white py-4 rounded-xl font-semibold shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
