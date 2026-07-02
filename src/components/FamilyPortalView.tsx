import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Lock, 
  Phone, 
  CreditCard, 
  MessageCircle, 
  LogOut, 
  Award, 
  Clock, 
  FileText, 
  ChevronRight, 
  Download,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { Screen, Patient, SessionLog, Notice } from '../types';
import { getDaysAdmitted } from '../utils';

interface FamilyPortalViewProps {
  patient: Patient;
  sessionLogs: SessionLog[];
  noticesList: Notice[];
  onLogout: () => void;
  onPostFamilyMessage: (message: string) => void;
}

export default function FamilyPortalView({
  patient,
  sessionLogs,
  noticesList,
  onLogout,
  onPostFamilyMessage
}: FamilyPortalViewProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'finance' | 'message_staff'>('status');
  
  // Local state for family message form
  const [familyMessage, setFamilyMessage] = useState('');
  const [msgSubmitted, setMsgSubmitted] = useState(false);

  // Percentage calculation of treatment (Benchmark is 60 days recommended duration)
  const treatmentTerm = 60;
  const progressPercent = Math.min(100, Math.floor((patient.daysAdmitted / treatmentTerm) * 100));

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyMessage.trim()) return;

    onPostFamilyMessage(`Family of ${patient.name} (${patient.id}) wrote: ${familyMessage}`);
    setMsgSubmitted(true);
    setFamilyMessage('');
    setTimeout(() => {
      setMsgSubmitted(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex flex-col lg:flex-row pb-20 lg:pb-0">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 lg:h-screen lg:fixed lg:left-0 lg:top-0 z-40 flex flex-col justify-between">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-blue-950 font-display font-extrabold text-sm block leading-none">Family Portal</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Jeevan Parivartan</span>
            </div>
          </div>

          {/* Active Patient summary inside sidebar */}
          <div className="p-4 mx-4 my-6 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Logged in For</p>
            <p className="font-display font-extrabold text-slate-900 text-sm">{patient.name}</p>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5">{patient.id}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase">{patient.status}</span>
            </div>
          </div>

          {/* Nav buttons */}
          <nav className="px-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('status')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-xs font-bold focus:outline-none cursor-pointer ${
                activeTab === 'status' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Heart className="w-4.5 h-4.5" />
              <span>Status &amp; Recovery</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-xs font-bold focus:outline-none cursor-pointer ${
                activeTab === 'finance' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4.5 h-4.5" />
              <span>Balance Statement</span>
            </button>

            <button
              onClick={() => setActiveTab('message_staff')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-xs font-bold focus:outline-none cursor-pointer ${
                activeTab === 'message_staff' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>Message to Staff</span>
            </button>
          </nav>
        </div>

        {/* Footer logout */}
        <div className="p-4 border-t border-slate-100 hidden lg:block">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold text-xs focus:outline-none cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN BODY CANVAS */}
      <main className="flex-1 lg:ml-64 bg-slate-50 min-h-screen relative pb-16">
        
        {/* UPPER STATUS BAR */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-5 flex justify-between items-center border-b border-slate-100 shadow-[0_4px_20px_rgba(16,185,129,0.02)]">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'status' && 'Status & Recovery Summary'}
              {activeTab === 'finance' && 'Admission Bill Ledger'}
              {activeTab === 'message_staff' && 'Message to Clinical Staff'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Confidential monitoring portal for immediate family members.</p>
          </div>

          <button 
            onClick={onLogout}
            className="lg:hidden text-xs font-bold text-red-600 flex items-center gap-1 hover:underline focus:outline-none cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        {/* WORKSPACE CONTENT GRID */}
        <div className="p-6 max-w-5xl mx-auto space-y-8">
          
          {/* TAB: STATUS & RECOVERY */}
          {activeTab === 'status' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Patient Card Grid (Bento) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                
                {/* Physical metrics panel */}
                <div className="md:col-span-12 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full mb-6 inline-block">
                      Medical Profile
                    </span>
                    <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">{patient.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono">{patient.id} • Age: {patient.age} Years</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-4 mt-8 border-t border-slate-100 pt-6">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Addiction Focus</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5 block">{patient.addictionType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ward Section</span>
                        <span className={`text-sm font-bold mt-0.5 block ${patient.ward === 'Premium' ? 'text-purple-600' : 'text-slate-800'}`}>
                          {patient.ward || 'Normal'} Ward
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Admit Date</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5 block">{patient.admitDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Days</span>
                        <span className="text-sm font-bold text-emerald-600 mt-0.5 block">{patient.daysAdmitted} Days</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Portal Passcode</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5 block font-mono">{patient.familyPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 text-xs text-slate-600 leading-relaxed font-normal mt-8 flex items-start gap-3">
                    <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p>Current recovery phase indicates excellent somatic healing, progressive detox clarity, and positive psychological counseling cooperation.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: MESSAGE TO STAFF */}
          {activeTab === 'message_staff' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Encouraging message box to doctors */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-900 text-base mb-2">Send Message to Clinical Staff</h4>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">Write words of encouragement or raise health concerns. Our psychiatrists share helpful feedback directly with the patient.</p>
                    
                    {msgSubmitted ? (
                      <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold border border-emerald-100 animate-in zoom-in-95">
                        ✓ Your encouraging support letter has been securely logged on the patient file. Clinical counselors will present it to the patient during their next session. Keep supporting!
                      </div>
                    ) : (
                      <form onSubmit={handleMessageSubmit} className="space-y-4">
                        <textarea
                          rows={4}
                          required
                          value={familyMessage}
                          onChange={(e) => setFamilyMessage(e.target.value)}
                          placeholder={`Write a warm message to ${patient.name} (e.g. 'We are so proud of you, stay strong!') or ask doctors a question...`}
                          className="w-full border border-slate-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-emerald-600 bg-slate-50 resize-none text-slate-800 placeholder-slate-400"
                        ></textarea>
                        <button 
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                        >
                          File Counselor Message
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Emergency Hotline for family */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-900 text-base mb-2">24/7 Family Helpline</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">Need a detailed voice report on daily vitals, behavioral response, or wanting to schedule a supervised call? Connect directly.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Administrative Desk</p>
                          <p className="text-sm font-extrabold text-slate-900 mt-1">+91 8052948863</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Supervised Call Window</p>
                          <p className="text-xs font-bold text-slate-700 mt-1">Sundays (10:00 AM - 2:00 PM)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-6 block font-medium">All phone lines are protected with confidential patient security rules.</span>
                </div>

              </div>
            </div>
          )}

          {/* TAB: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Ledger breakdown */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-display font-bold text-slate-900">Outstanding Treatment Statement</h3>
                  <p className="text-xs text-slate-400">Review bed costs, psychiatric consultation fees, meals, and medical detox balance sheets.</p>
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pending Ledger Balance</span>
                    <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-1">₹ {patient.balance.toLocaleString()}</h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      All basic counseling included in statement
                    </p>
                  </div>

                  {patient.balance > 0 ? (
                    <button 
                      onClick={() => alert('Statement sheet downloaded. Check local downloads.')}
                      className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-800 text-slate-700 px-5 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      <FileText className="w-4.5 h-4.5" />
                      Download PDF
                    </button>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Ledger completely cleared! No pending outstanding balance due.</span>
                    </div>
                  )}
                </div>

                {/* Patient Details instead of detailed line ledger */}
                <div className="px-6 pb-6 border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Inpatient billing details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Inpatient Name</span>
                      <span className="font-extrabold text-slate-900 mt-1 block">{patient.name}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patient ID / Case Code</span>
                      <span className="font-mono font-bold text-slate-800 mt-1 block">{patient.id}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Age / Gender</span>
                      <span className="font-bold text-slate-800 mt-1 block">{patient.age} Years</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Admission Date</span>
                      <span className="font-mono font-bold text-slate-800 mt-1 block">{patient.admitDate}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Section Ward</span>
                      <span className="font-bold text-slate-800 mt-1 block">{patient.ward || 'Normal'} Ward</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Addiction Focus Path</span>
                      <span className="font-bold text-slate-800 mt-1 block">{patient.addictionType}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* MOBILE STICKY FOOTER TABS */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-3.5 z-40 shadow-xl">
          <button 
            onClick={() => setActiveTab('status')}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeTab === 'status' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[9px]">Milestone</span>
          </button>

          <button 
            onClick={() => setActiveTab('finance')}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeTab === 'finance' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[9px]">Ledger</span>
          </button>

          <button 
            onClick={() => setActiveTab('message_staff')}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeTab === 'message_staff' ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[9px]">Message</span>
          </button>
        </nav>

      </main>

    </div>
  );
}
