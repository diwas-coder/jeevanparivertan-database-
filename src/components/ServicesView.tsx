import { useState } from 'react';
import { 
  Wine, 
  Syringe, 
  Leaf, 
  Pill, 
  Flame, 
  Users, 
  Car, 
  ArrowRight, 
  X 
} from 'lucide-react';
import { Screen } from '../types';

interface ServicesViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function ServicesView({ onNavigate }: ServicesViewProps) {
  const [activeProgram, setActiveProgram] = useState<{ title: string; text: string; details: string } | null>(null);

  const programs = [
    {
      icon: <Wine className="w-8 h-8 text-teal-700" />,
      title: "Alcohol De-addiction",
      text: "Complete medical detox, physical stabilization, and comprehensive behavioral therapies for chronic alcoholism.",
      details: "Our Alcohol Recovery program combines clinical detox under 24/7 supervision of qualified nurses with psychological counseling to tackle underlying triggers. Post-detox therapy consists of personal sessions, family intervention, and AA-aligned support networks for holistic integration."
    },
    {
      icon: <Syringe className="w-8 h-8 text-teal-700" />,
      title: "Drug Addiction",
      text: "Specialized clinical pathways to systematically address synthetic, chemical, and pharmaceutical drug dependencies.",
      details: "This intensive program targets dependencies on narcotics, illicit substances, and stimulants. We focus heavily on neuro-rehabilitation, safe physical tapering, cognitive restructuring, and preventing relapse through customized daily activity schedules."
    },
    {
      icon: <Leaf className="w-8 h-8 text-teal-700" />,
      title: "Cannabis / Ganja",
      text: "Rigorous psychological therapy modules centered on dismantling behavioral habits and breaking psychological reliance.",
      details: "Though often misunderstood, cannabis dependency requires focused cognitive behavioral therapy (CBT). Our program emphasizes mental acuity, healthy habit cultivation, mindfulness training, and coping strategies to replace toxic loops."
    },
    {
      icon: <Pill className="w-8 h-8 text-teal-700" />,
      title: "Opioids & Meds",
      text: "Medically safe, highly structured weaning systems specifically developed for prescription painkiller and opioid dependencies.",
      details: "Opioid withdrawal is highly taxing. Our specialized clinical team oversees progressive step-by-down tapering, utilizing FDA-approved protocols, constant physiological monitoring, and deep mental health support to rebuild natural opioid pathways."
    },
    {
      icon: <Flame className="w-8 h-8 text-teal-700" />,
      title: "Tobacco & Gutkha",
      text: "Behavior modification programs to eliminate oral nicotine habits and actively restore long-term cardiorespiratory health.",
      details: "Tobacco and gutkha habits are deeply physical. We utilize aversion therapies, nicotine replacement planning, constant counseling, lifestyle coaching, and oral check-ups to restore overall bodily confidence and stamina."
    },
    {
      icon: <Users className="w-8 h-8 text-teal-700" />,
      title: "Family Counseling",
      text: "Carefully mediated group sessions designed to heal co-dependency, rebuild boundaries, and establish a firm support network.",
      details: "Addiction affects the entire family unit. Our psychologists host weekly mediated group interactions where both patients and families express feelings safely, learn co-dependency triggers, and establish long-term supportive boundaries."
    },
    {
      icon: <Car className="w-8 h-8 text-teal-700" />,
      title: "24/7 Home Pickup",
      text: "Immediate, safe, and confidential patient transportation from home to our facility anytime, day or night.",
      details: "We understand that starting the recovery journey can be difficult, and physical transport can sometimes feel like a hurdle. Our dedicated 24/7 home pickup service provides a safe, discreet, and medically escorted vehicle to transport the patient directly to our center, ensuring a hassle-free transition."
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-16 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <div className="text-center mb-16">
          <span className="text-teal-700 text-xs font-bold uppercase tracking-widest block mb-3">Evidence-Based Treatment</span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">
            Our Recovery Services
          </h1>
          <p className="text-sm sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We treat chemical dependencies using highly systematic physical detox protocols and compassionate mental therapies. Select a program below to explore details.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-teal-700 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="bg-stone-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-teal-700 group-hover:bg-teal-50 transition-colors">
                  {prog.icon}
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-3">{prog.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">{prog.text}</p>
              </div>
              <button 
                onClick={() => setActiveProgram(prog)}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:gap-1.5 transition-all w-fit cursor-pointer focus:outline-none"
              >
                <span>Read program timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Call to action section */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-teal-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-teal-800">
          <div>
            <h3 className="text-2xl font-display font-extrabold mb-3">Not sure which program fits?</h3>
            <p className="text-sm text-teal-100 max-w-xl">
              Our clinical advisors are available 24 hours a day to guide you or your loved one confidentially towards the right path.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('REQUEST_CALL')}
            className="w-full lg:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-900 hover:text-white px-8 py-4 rounded-xl font-bold transition-all text-sm cursor-pointer shadow-md"
          >
            Consult with our counselor
          </button>
        </div>
      </div>

      {/* PROGRAM TIMELINE MODAL */}
      {activeProgram && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveProgram(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-2">{activeProgram.title} Timeline</h3>
            <span className="text-xs text-teal-700 font-bold uppercase tracking-wider block mb-6">Admission Step-by-Step Path</span>
            
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {activeProgram.details}
            </p>

            <div className="bg-teal-50 rounded-xl p-4.5 border border-teal-100 space-y-3.5 text-xs text-teal-950">
              <div className="flex gap-3">
                <span className="font-bold text-teal-700 min-w-[50px]">Days 1-7:</span>
                <span>Immediate clinical intake, psychiatric evaluation, and safe physical detoxification.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-teal-700 min-w-[50px]">Days 8-30:</span>
                <span>Therapeutic restoration, personal psychotherapy, group discussion circles, yoga.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-teal-700 min-w-[50px]">Days 30+:</span>
                <span>Family counseling, re-integration planning, relapse prevention training, and AA mentorship.</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveProgram(null)}
              className="w-full mt-6 bg-teal-700 hover:bg-teal-800 text-white py-3.5 rounded-xl font-bold transition-all cursor-pointer"
            >
              Close Details View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
