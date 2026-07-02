import { useState } from 'react';
import {
  CheckCircle2,
  X,
  ShieldCheck,
  Users,
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';
import { Screen } from '../types';

interface AboutViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  const [showStory, setShowStory] = useState(false);

  return (
    <div className="bg-stone-50 min-h-screen py-16 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main About Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative group">
            <div className="absolute -inset-4 bg-teal-100/30 rounded-3xl blur-2xl group-hover:bg-teal-100/60 transition-all duration-500"></div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-100">
              <img
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                src="/image/image01.jpeg"
                alt="Jeevan Parivartan Modern Lucknow Facility"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-teal-900 text-white p-6 rounded-2xl shadow-xl hidden md:block border border-teal-800">
              <p className="text-emerald-400 font-display font-extrabold text-3xl leading-none">10+ Years</p>
              <p className="text-teal-100 text-xs font-semibold uppercase mt-1 tracking-wider">Restoring Families</p>
            </div>
          </div>

          <div>
            <span className="text-teal-700 text-xs font-bold uppercase tracking-widest block mb-3">About Us</span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
              About Jeevan Parivartan Nasha Mukti Kendra
            </h1>
            <p className="text-sm sm:text-base text-slate-700 mb-6 leading-relaxed font-normal">
              <strong>Jeevan Parivartan Nasha Mukti Kendra</strong> is a de-addiction and rehabilitation support center located in Lucknow. Our aim is to help individuals and families who are facing problems related to alcohol, drugs, tobacco, gutkha, and other substance addiction.
            </p>
            <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed font-normal">
              We provide a safe, peaceful, and supportive environment where people can take steps toward a healthier and more disciplined life. Our center focuses on counseling support, family guidance, routine care, and motivation for recovery.
            </p>
            <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed font-normal">
              We understand that addiction affects not only the patient but also the whole family. That is why we maintain privacy, respect, and confidentiality for every person who contacts us.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5.5 h-5.5 text-teal-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-slate-800">Guiding with care, patience, and responsibility</p>
              </div>
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5.5 h-5.5 text-teal-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-slate-800">100% private, respectful, and confidential counseling</p>
              </div>
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="w-5.5 h-5.5 text-teal-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-slate-800">Empathetic support for families and patient rehabilitation</p>
              </div>
            </div>

            <button
              onClick={() => setShowStory(true)}
              className="bg-teal-900 hover:bg-teal-950 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-150 shadow-md shadow-teal-100/50 cursor-pointer focus:ring-2 focus:ring-teal-600"
            >
              Our Mission Statement
            </button>
          </div>
        </div>

        {/* Core Pillars / Trust section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-widest block mb-2">Our Foundation</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Four Pillars of Safe Rehabilitation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="bg-teal-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-teal-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Confidential Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Your recovery journey is completely secure under strict clinical non-disclosure and privacy protocols.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Family Counseling</h3>
              <p className="text-sm text-slate-600 leading-relaxed">We support families alongside patients, healing relationships and preparing safe environments.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Expert Psychiatrists</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Senior clinical psychologists address primary mental trauma to treat addiction roots, not just behaviors.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-red-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-3">Safe Infrastructure</h3>
              <p className="text-sm text-slate-600 leading-relaxed">A completely secure, 24/7 medically staffed facility guaranteeing peaceful, restorative detoxification.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT STORY MODAL */}
      {showStory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowStory(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-4">Our Mission Statement</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              At <strong>Jeevan Parivartan</strong>, our ultimate goal is to guide people with utmost care, patience, and unwavering responsibility so they can break free from dependency and move gracefully towards a healthier, more fulfilling, and better life.
              <br /><br />
              We believe that true healing begins when physical safety, deep psychological support, and a respectful community come together. Every individual receives dedicated family counseling and routine-oriented motivational care to support their long-term recovery journey.
            </p>
            <button
              onClick={() => setShowStory(false)}
              className="w-full bg-teal-900 hover:bg-teal-950 text-white py-3 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Close Mission Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
