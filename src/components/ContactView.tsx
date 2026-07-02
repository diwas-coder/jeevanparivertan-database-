import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { Enquiry } from '../types';

interface ContactViewProps {
  onAddEnquiry: (newEnq: Omit<Enquiry, 'id' | 'status' | 'date'>) => void;
}

export default function ContactView({ onAddEnquiry }: ContactViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addictionType: 'Alcohol Addiction',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill out your Name and Phone Number.');
      return;
    }
    
    onAddEnquiry({
      name: formData.name,
      phone: formData.phone,
      age: 30, // Default fallback
      addictionType: formData.addictionType,
      message: formData.message || 'Direct contact page submission.'
    });

    setFormSubmitted(true);
    setFormData({ name: '', phone: '', addictionType: 'Alcohol Addiction', message: '' });
  };

  return (
    <div className="bg-stone-50 min-h-screen py-16 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="text-teal-700 text-xs font-bold uppercase tracking-widest block mb-3">Reach Us Anytime</span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">
            Contact Jeevan Parivartan
          </h1>
          <p className="text-sm sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We are here to help you or your family member take the first step towards recovery. Connect with us confidentially.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row">
          {/* Info Side */}
          <div className="md:w-5/12 p-10 md:p-12 bg-teal-900 text-white flex flex-col justify-between">
            <div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-2">Available 24/7 Helpline</span>
              <h3 className="text-2xl font-display font-extrabold mb-4">Immediate Admissions</h3>
              <p className="text-sm text-teal-100 leading-relaxed mb-10 font-normal">
                We are always available to listen, advise, and schedule priority transport if needed. Your query is completely private.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 w-11 h-11 rounded-lg flex items-center justify-center text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-200 uppercase tracking-wider leading-none">Location</p>
                    <p className="text-sm font-semibold mt-1">Lucknow, Uttar Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-white/10 w-11 h-11 rounded-lg flex items-center justify-center text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-200 uppercase tracking-wider leading-none">Call / WhatsApp</p>
                    <p className="text-sm font-extrabold mt-1 text-emerald-400">+91 8052948863</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-12 flex items-center gap-2 text-xs text-teal-100/70 font-medium">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              <span>WHO &amp; Ministry of Health Aligned Protocols</span>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:w-7/12 p-10 md:p-12">
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-display font-bold text-slate-900 mb-2">Request Submitted!</h4>
                <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                  Thank you. Your call back is scheduled. A senior coordinator will reach out confidentially to you at this phone number within 15-30 minutes.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 mb-1">Request a Confidential Call</h3>
                  <p className="text-xs text-slate-500 mb-6">Complete this form and a professional will call you back at your convenience.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter patient or family name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-100/50 transition-all bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Contact Number</label>
                  <input 
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-100/50 transition-all bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Addiction Type</label>
                  <select 
                    value={formData.addictionType}
                    onChange={(e) => setFormData({ ...formData, addictionType: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-100/50 transition-all bg-slate-50 cursor-pointer"
                  >
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

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Brief Message (Optional)</label>
                  <textarea 
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any specific instructions (e.g. call after 5 PM)..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-100/50 transition-all bg-slate-50 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 rounded-xl font-semibold shadow-md shadow-teal-100/50 hover:shadow-lg transition-all duration-150 cursor-pointer text-center"
                >
                  Send Call Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
