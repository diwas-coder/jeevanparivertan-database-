import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { Screen } from '../types';

interface MobileStickyBarProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
}

export default function MobileStickyBar({ onNavigate, currentScreen }: MobileStickyBarProps) {
  // Don't show inside active dashboards to avoid screen crowding
  if (currentScreen === 'ADMIN_DASHBOARD' || currentScreen === 'FAMILY_PORTAL') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(13,148,136,0.06)] grid grid-cols-3 h-16 z-50">
      <a 
        href="tel:+918052948863"
        className="flex flex-col items-center justify-center text-teal-900 font-semibold hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <Phone className="w-5 h-5 text-teal-800" />
        <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">Call Now</span>
      </a>

      <a 
        href="https://wa.me/918052948863" 
        target="_blank"
        referrerPolicy="no-referrer"
        className="bg-emerald-500 text-white flex flex-col items-center justify-center hover:bg-emerald-600 transition-colors focus:outline-none"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">WhatsApp</span>
      </a>

      <button 
        onClick={() => onNavigate('REQUEST_CALL')}
        className="flex flex-col items-center justify-center text-teal-900 font-semibold hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <Calendar className="w-5 h-5 text-teal-800" />
        <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">Book Call</span>
      </button>
    </div>
  );
}
