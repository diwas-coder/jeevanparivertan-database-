import React, { useState, useEffect } from 'react';
import { Lock, UserCheck, Calendar, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Screen, Enquiry } from '../types';

interface RequestCallViewProps {
  onNavigate: (screen: Screen) => void;
  onAddEnquiry: (enquiry: Omit<Enquiry, 'id' | 'status' | 'date'>) => void;
}

export default function RequestCallView({ onNavigate, onAddEnquiry }: RequestCallViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    patientAge: '',
    addictionType: '',
    preferredDate: '',
    message: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  // Default preferred date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, preferredDate: today }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.patientAge || !formData.addictionType) {
      alert('Please fill out all required fields.');
      return;
    }

    onAddEnquiry({
      name: formData.name,
      phone: formData.phone,
      age: parseInt(formData.patientAge) || 30,
      addictionType: formData.addictionType,
      message: `Preferred Call Date: ${formData.preferredDate}. Message: ${formData.message || 'None'}`
    });

    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      phone: '',
      patientAge: '',
      addictionType: '',
      preferredDate: new Date().toISOString().split('T')[0],
      message: ''
    });
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Trust & Context */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="inline-flex px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs uppercase tracking-wider mb-6 border border-emerald-200 shadow-sm">
              Confidential Support
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
              Take the first step towards a <span className="text-emerald-600 block sm:inline">brighter tomorrow.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
              We understand the courage it takes to seek help. Our compassionate, qualified coordinators are ready to listen without judgment and map a clean, personalized path to recovery.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">100% Confidential Support</h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">All queries, patient information, and medical details are heavily encrypted and strictly protected.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700 shadow-sm">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">Senior Counselor Assessment</h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">Discuss symptoms, co-occurring mental disorders, and treatment plans directly with experienced guides.</p>
              </div>
            </div>
          </div>

          {/* Consultation Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl relative aspect-[16/10] border border-slate-200">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKAtsZEIrk5LEtIcPVkby6WWDM6FuXJUru9SMRkfwFHgsblUpaAJAQoThcKhZWqc0yuLFnQbl4-nq9e6CoS406vo0KLfYRtym-x8uCjiNstbmf7D3eYYnSgKljywlBdsAiAIGAvtGO61prUHw7bDi4QbQBHNFYzEb60g-XkBV_9lgNLg6DvFHaw08bKT73290aBwiNJZ9mu3YVgjblTC1EGjckVHs75UJlQ1v3XsjPoiwd1z5LoiBDNOWBpDKkEaktU4nbpYb1jPRf" 
              alt="Jeevan Parivartan Safe Counseling Environment" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent"></div>
          </div>
        </div>

        {/* Right Side: Form or Success */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-slate-100 relative overflow-hidden">
            {!isSuccess ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-2">Request a Confidential Call</h3>
                  <p className="text-sm text-slate-500">Submit the details below and we will contact you at your preferred time.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-500">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all placeholder-slate-400"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-500">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">+91</span>
                      <input 
                        type="tel" 
                        required
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Patient Age */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-500">Patient Age</label>
                    <input 
                      type="number" 
                      required
                      min={5}
                      max={110}
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      placeholder="Years"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all placeholder-slate-400"
                    />
                  </div>

                  {/* Addiction Type */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-500">Addiction Type</label>
                    <select 
                      required
                      value={formData.addictionType}
                      onChange={(e) => setFormData({ ...formData, addictionType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all cursor-pointer"
                    >
                      <option disabled value="">Select Addiction Type</option>
                      <option value="Alcohol Addiction">Alcohol Addiction</option>
                      <option value="Drug Addiction">Drug Addiction</option>
                      <option value="Cannabis (Ganja/Charas)">Cannabis (Ganja/Charas)</option>
                      <option value="Opioids (Heroin/Smack/Brown Sugar)">Opioids (Heroin/Smack/Brown Sugar)</option>
                      <option value="Prescription Medicine Addiction">Prescription Medicine Addiction</option>
                      <option value="Tobacco / Cigarette Addiction">Tobacco / Cigarette Addiction</option>
                      <option value="Gutkha / Pan Masala Addiction">Gutkha / Pan Masala Addiction</option>
                      <option value="Nicotine Addiction">Nicotine Addiction</option>
                      <option value="Injection Drug Use">Injection Drug Use</option>
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-500">Preferred Call Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all cursor-pointer"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-500">Message (Optional)</label>
                    <textarea 
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can support you (e.g., best time of day to reach)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all resize-none placeholder-slate-400"
                    ></textarea>
                  </div>

                  {/* Privacy details */}
                  <div className="md:col-span-2 flex items-center gap-3 bg-teal-50/70 p-4 rounded-xl border border-teal-100/50">
                    <ShieldCheck className="w-5.5 h-5.5 text-teal-700 flex-shrink-0" />
                    <p className="text-[11px] sm:text-xs text-teal-950 leading-relaxed font-medium">
                      All submission metrics are confidential. We will never share your number or sell contact lists.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-teal-900 hover:bg-teal-950 text-white py-4 rounded-xl font-semibold shadow-md shadow-teal-100/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <span>Schedule Call Back</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-teal-900 mb-3">Request Submitted!</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Your scheduled callback request has been recorded. Our admissions team is on standby and will contact you shortly.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl w-full max-w-sm text-xs space-y-2 text-left border border-slate-200">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Average Wait Time:</span>
                    <span className="font-bold text-slate-800">15-30 minutes</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Helpline Status:</span>
                    <span className="font-bold text-emerald-600 uppercase flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      24/7 Live
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleReset}
                  className="text-teal-700 font-bold text-sm flex items-center gap-2 hover:underline focus:outline-none cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Go Back &amp; Re-Submit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
