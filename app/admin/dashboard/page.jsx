'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email === 'jeevanparivartan2@gmail.com') {
          setAdminUser(user);
        } else {
          window.location.assign('/admin-login');
        }
      } catch (err) {
        console.error('Failed to resolve auth session:', err);
        window.location.assign('/admin-login');
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.assign('/admin-login');
    } catch (err) {
      console.error('Logout error:', err);
      window.location.assign('/admin-login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 font-sans">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Verifying secure admin session...</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Welcome, {adminUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center space-y-4">
          <p className="text-slate-700 text-sm leading-relaxed">
            This is the production admin dashboard. Only authorized administrators who complete Email OTP verification can access this secure resource.
          </p>
        </div>
      </div>
    </div>
  );
}
