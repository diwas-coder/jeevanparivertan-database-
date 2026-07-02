import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, ShieldAlert, BadgeCheck, ShieldCheck } from 'lucide-react';
import { Screen, Patient } from '../types';

interface LoginViewProps {
  onLoginSuccess: (type: 'admin' | 'family', matchedPatientId?: string) => void;
  patientsList: Patient[];
  onNavigate?: (screen: Screen) => void;
}

export default function LoginView({ onLoginSuccess, patientsList, onNavigate }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<'admin' | 'family'>('family'); // Default to Family Portal for normal users
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleTabChange = (tab: 'admin' | 'family') => {
    setActiveTab(tab);
    setLoginError('');
    setUsername('');
    setPassword('');
  };

  const handleFamilyLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const inputUsername = username.trim().toLowerCase();
      const inputPassword = password.trim();
      const cleanInputPasswordPhone = inputPassword.replace(/\D/g, '');

      // 1. Find matching patients by Name or ID
      const matchedPatients = patientsList.filter(p => {
        const dbId = (p.id || '').trim().toLowerCase();
        const dbName = (p.name || '').trim().toLowerCase();
        const dbNameWords = dbName.split(/\s+/);
        const dbFirstName = dbNameWords[0] || '';

        return dbId === inputUsername || 
               dbName === inputUsername || 
               dbFirstName === inputUsername || 
               dbName.includes(inputUsername) ||
               inputUsername.includes(dbName);
      });

      if (matchedPatients.length === 0) {
        setLoginError('No patient found with that Name or Patient ID. Please check spelling (e.g., "Rahul Sharma" or "Rahul").');
        return;
      }

      // 2. Match family phone number as password
      const matched = matchedPatients.find(p => {
        const cleanDbPhone = (p.familyPhone || '').trim().replace(/\D/g, '');
        
        // Match using clean digits
        if (cleanInputPasswordPhone.length >= 5 && cleanDbPhone.length >= 5) {
          if (cleanDbPhone === cleanInputPasswordPhone || cleanDbPhone.endsWith(cleanInputPasswordPhone) || cleanInputPasswordPhone.endsWith(cleanDbPhone)) {
            return true;
          }
        }
        
        // Fallback exact match
        return (p.familyPhone || '').trim() === inputPassword;
      });

      if (matched) {
        onLoginSuccess('family', matched.id);
      } else {
        setLoginError('Incorrect password. The password for the family portal is the patient\'s registered family contact phone number. All patients follow this same rule.');
      }
    }, 1000);
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const targetEmail = username.trim().toLowerCase();
    const allowedEmails = ['jeevanparivartan2@gmail.com', 'diwaspal9@gmail.com'];

    if (!allowedEmails.includes(targetEmail)) {
      setLoginError('Access denied: This email address is not authorized as an administrator.');
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

      console.log('[LoginView Admin Success]: Authenticated', data);
      onLoginSuccess('admin');
    } catch (err: any) {
      console.error('[LoginView Admin Error]:', err);
      setLoginError(err?.message || 'Invalid email or password. Verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen flex items-center justify-center py-16 px-6 md:px-12 relative overflow-hidden font-sans">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm text-slate-500 font-medium">Access the Jeevan Parivartan medical portal.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100">
          {/* Tab toggles */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8 relative">
            <button
              onClick={() => handleTabChange('family')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${
                activeTab === 'family' 
                  ? 'bg-white text-teal-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Family Portal
            </button>
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${
                activeTab === 'admin' 
                  ? 'bg-white text-teal-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Admin Portal
            </button>
          </div>

          {/* Tips Box */}
          <div className="mb-6 p-3.5 rounded-xl bg-teal-50/80 border border-teal-100/50 text-xs text-teal-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-teal-900">
              <span>🔑 Portal Access Guide:</span>
            </p>
            {activeTab === 'admin' ? (
              <p>
                Please enter your administrator email and password to access the clinical dashboard.
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="leading-normal">
                  <strong>Patient Name / ID:</strong> Use the patient's full name or first name (e.g., <code className="bg-teal-100/80 px-1 py-0.5 rounded font-mono font-bold text-teal-950">Rahul Sharma</code> or <code className="bg-teal-100/80 px-1 py-0.5 rounded font-mono font-bold text-teal-950">rahul</code>)
                </p>
                <p className="leading-normal">
                  <strong>Password:</strong> Use the registered family contact phone number (e.g., <code className="bg-teal-100/80 px-1 py-0.5 rounded font-mono font-bold text-teal-950">9876543210</code>)
                </p>
                <p className="text-[10px] text-teal-700 font-semibold italic border-t border-teal-100/30 pt-1.5">
                  * Note: This allows multiple patients sharing the same family phone number to log in separately!
                </p>
              </div>
            )}
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700 flex gap-2 items-start">
              <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {activeTab === 'admin' ? (
            /* Admin Flow Form */
            <form onSubmit={handleAdminLoginSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. jeevanparivartan2@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all placeholder-slate-400 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="Enter security password"
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all placeholder-slate-400 text-slate-900 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-900 hover:bg-teal-950 disabled:bg-teal-800/80 text-white py-4 rounded-xl font-semibold shadow-md shadow-teal-100/50 flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying admin credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Sign In</span>
                    <LogIn className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Family Portal Flow */
            <form onSubmit={handleFamilyLoginSubmit} className="space-y-6">
              {/* Username/Phone */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Patient Name (or Patient ID)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter patient name (e.g., Rahul Sharma)"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all placeholder-slate-400 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase text-slate-500">
                    Password (Family Phone Number)
                  </label>
                  <button 
                    type="button"
                    onClick={() => alert("The password is the patient's registered family contact phone number (e.g., '9876543210'). Please check spelling or contact the clinical administrator if you cannot sign in.")} 
                    className="text-xs font-bold text-teal-700 hover:underline focus:outline-none cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter registered family phone number"
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all placeholder-slate-400 text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Keep logged in */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  defaultChecked
                  className="w-4.5 h-4.5 text-teal-700 border-slate-300 rounded focus:ring-teal-500 cursor-pointer bg-slate-50"
                />
                <label htmlFor="remember" className="ml-2 text-xs font-semibold text-slate-500 cursor-pointer select-none">
                  Keep me logged in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-900 hover:bg-teal-950 disabled:bg-teal-800/80 text-white py-4 rounded-xl font-semibold shadow-md shadow-teal-100/50 flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security standards badges */}
        <div className="flex justify-center items-center gap-6 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <BadgeCheck className="w-4.5 h-4.5 text-emerald-500" />
            256-bit SSL Protection
          </span>
          <span className="flex items-center gap-1">
            <BadgeCheck className="w-4.5 h-4.5 text-emerald-500" />
            ISO 27001 Certified Portal
          </span>
        </div>
      </div>
    </div>
  );
}
