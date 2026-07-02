import { HeartPulse, Facebook, Share2 } from 'lucide-react';
import { Screen } from '../types';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-lg font-display font-bold text-white tracking-tight">
              Jeevan Parivartan
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Dedicated to providing high-quality, compassionate de-addiction and rehabilitation services to help individuals reclaim their lives with dignity.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white text-slate-400 transition-all focus:outline-none"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <button 
              onClick={() => alert('App URL shared to clipboard!')}
              className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-teal-600 hover:text-white text-slate-400 transition-all focus:outline-none"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 md:gap-16">
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Quick Links</h5>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => onNavigate('HOME')} className="hover:text-white transition-colors text-left focus:outline-none">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ABOUT')} className="hover:text-white transition-colors text-left focus:outline-none cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('SERVICES')} className="hover:text-white transition-colors text-left focus:outline-none cursor-pointer">
                  Our Programs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('GALLERY')} className="hover:text-white transition-colors text-left focus:outline-none cursor-pointer">
                  Center Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('CONTACT')} className="hover:text-white transition-colors text-left focus:outline-none cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('LOGIN')} className="hover:text-white transition-colors text-left focus:outline-none">
                  Patient Portal
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Legal</h5>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy policy is under medical standard audit.'); }} className="hover:text-white transition-colors focus:outline-none">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Standard hospital admission terms apply.'); }} className="hover:text-white transition-colors focus:outline-none">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#disclaimer" onClick={(e) => { e.preventDefault(); alert('All content is for informational purposes. Consult professional doctors.'); }} className="hover:text-white transition-colors focus:outline-none">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-slate-800 text-center md:text-left flex flex-col sm:flex-row justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Jeevan Parivartan Nasha Mukti Kendra Lucknow. All Rights Reserved.
        </p>
        <p className="text-xs text-slate-500 font-medium">
          Licensed De-addiction & Rehabilitation Center, Lucknow, UP, India.
        </p>
      </div>
    </footer>
  );
}
