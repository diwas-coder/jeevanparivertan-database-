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
    <div className="bg-slate-950 min-h-screen flex items-center justify-center py-16 px-6 md:px-12 relative overflow-hidden font-sans text-slate-100 selection:bg-teal-500/20 selection:text-teal-200">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10000ms]"></div>
      
      {/* Abstract Glowing Grid Ring */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Access the Jeevan Parivartan medical portal.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 border border-slate-800/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-950/50 relative overflow-hidden">
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>

          {/* Tab toggles */}
          <div className="flex bg-slate-950/60 p-1.5 rounded-2xl mb-8 border border-slate-800/80">
            <button
              type="button"
              onClick={() => handleTabChange('family')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all focus:outline-none cursor-pointer ${
                activeTab === 'family' 
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/10' 
                  : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/40'
              }`}
            >
              Family Portal
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all focus:outline-none cursor-pointer ${
                activeTab === 'admin' 
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/10' 
                  : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/40'
              }`}
            >
              Admin Portal
            </button>
          </div>

          {/* Tips Box */}
          <div className="mb-6 p-4 rounded-2xl bg-teal-950/30 border border-teal-500/20 text-xs text-teal-300 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-teal-405">
              <span>🔑 Portal Access Guide:</span>
            </p>
            {activeTab === 'admin' ? (
              <p className="leading-relaxed">
                Please enter your administrator email and password to access the clinical dashboard.
              </p>
            ) : (
              <div className="space-y-1.5 leading-relaxed">
                <p>
                  <strong>Patient Name / ID:</strong> Use the patient's full name or first name (e.g., <code className="bg-teal-950/50 border border-teal-850 px-1 py-0.5 rounded font-mono font-bold text-teal-300">Rahul Sharma</code> or <code className="bg-teal-950/50 border border-teal-850 px-1 py-0.5 rounded font-mono font-bold text-teal-300">rahul</code>)
                </p>
                <p>
                  <strong>Password:</strong> Use the registered family contact phone number (e.g., <code className="bg-teal-950/50 border border-teal-850 px-1 py-0.5 rounded font-mono font-bold text-teal-300">9876543210</code>)
                </p>
                <p className="text-[10px] text-teal-450 font-semibold italic border-t border-teal-900/40 pt-1.5 mt-1.5">
                  * Note: This allows multiple patients sharing the same family phone number to log in separately!
                </p>
              </div>
            )}
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-350 flex gap-3 items-start">
              <ShieldAlert className="w-5 h-5 text-rose-450 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Authentication Failure</p>
                <p className="leading-relaxed">{loginError}</p>
              </div>
            </div>
          )}

          {activeTab === 'admin' ? (
            /* Admin Flow Form */
            <form onSubmit={handleAdminLoginSubmit} className="space-y-6">
              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-450">
                  Admin Email Address
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. jeevanparivartan2@gmail.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:border-teal-500/80 focus:ring-4 focus:ring-teal-950/50 transition-all text-slate-100 font-semibold placeholder-slate-650"
                  />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="Enter security password"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:border-teal-500/80 focus:ring-4 focus:ring-teal-950/50 transition-all text-slate-100 font-semibold placeholder-slate-650"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 focus:outline-none cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 py-4 rounded-2xl font-bold tracking-wide shadow-xl shadow-teal-950/30 flex justify-center items-center gap-2 hover:shadow-teal-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:cursor-not-allowed text-sm uppercase"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                    <span>Verifying admin credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Sign In</span>
                    <LogIn className="w-4.5 h-4.5 text-slate-950" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Family Portal Flow */
            <form onSubmit={handleFamilyLoginSubmit} className="space-y-6">
              {/* Username/Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-450">
                  Patient Name (or Patient ID)
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter patient name (e.g., Rahul Sharma)"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:border-teal-500/80 focus:ring-4 focus:ring-teal-950/50 transition-all text-slate-100 font-medium placeholder-slate-655"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-455">
                    Password (Family Phone Number)
                  </label>
                  <button 
                    type="button"
                    onClick={() => alert("The password is the patient's registered family contact phone number (e.g., '9876543210'). Please check spelling or contact the clinical administrator if you cannot sign in.")} 
                    className="text-xs font-bold text-teal-450 hover:text-teal-350 hover:underline focus:outline-none cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter registered family phone number"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-sm focus:outline-none focus:border-teal-500/80 focus:ring-4 focus:ring-teal-950/50 transition-all text-slate-100 placeholder-slate-655"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 focus:outline-none cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Keep logged in */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  defaultChecked
                  className="w-4.5 h-4.5 text-teal-500 border-slate-800 rounded focus:ring-teal-500 focus:ring-offset-slate-950 cursor-pointer bg-slate-950"
                />
                <label htmlFor="remember" className="ml-2.5 text-xs font-semibold text-slate-450 hover:text-slate-200 cursor-pointer select-none">
                  Keep me logged in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 py-4 rounded-2xl font-bold tracking-wide shadow-xl shadow-teal-950/30 flex justify-center items-center gap-2 hover:shadow-teal-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:cursor-not-allowed text-sm uppercase"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="w-4.5 h-4.5 text-slate-950" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security standards badges */}
        <div className="flex justify-center items-center gap-6 text-[10px] text-slate-500 font-mono font-bold tracking-wider uppercase">
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-teal-600" />
            256-bit SSL Protection
          </span>
          <span className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-teal-600" />
            ISO 27001 Certified
          </span>
        </div>
      </div>
    </div>
  );
}
