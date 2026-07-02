import { useState, useEffect } from 'react';
import { HeartPulse, ArrowLeft, LogOut, Menu, X, Home, Info, Image, PhoneCall, ShieldAlert, Award } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen } from '../types';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  userType: 'admin' | 'family' | null;
}

export default function Navbar({ currentScreen, onNavigate, onLogout, isLoggedIn, userType }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close mobile menu on screen change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentScreen]);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-[0_4px_20px_rgba(30,58,138,0.04)] border-b border-slate-100 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Logo Section */}
        <button 
          onClick={() => onNavigate('HOME')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100 group-hover:scale-105 transition-transform duration-200">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight block">
              Jeevan Parivartan
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase block -mt-1">
              Nasha Mukti Kendra
            </span>
          </div>
        </button>

        {/* Navigation Links & Actions */}
        <div className="flex gap-3 md:gap-8 items-center">
          {['HOME', 'SERVICES', 'ABOUT', 'CONTACT', 'REQUEST_CALL', 'GALLERY'].includes(currentScreen) && (
            <nav className="hidden md:flex gap-8 items-center mr-2">
              <button 
                onClick={() => onNavigate('HOME')}
                className={`transition-colors text-sm font-semibold cursor-pointer focus:outline-none ${
                  currentScreen === 'HOME' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('SERVICES')}
                className={`transition-colors text-sm font-semibold cursor-pointer focus:outline-none ${
                  currentScreen === 'SERVICES' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                Services
              </button>
              <button 
                onClick={() => onNavigate('ABOUT')}
                className={`transition-colors text-sm font-semibold cursor-pointer focus:outline-none ${
                  currentScreen === 'ABOUT' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                About
              </button>
              <button 
                onClick={() => onNavigate('GALLERY')}
                className={`transition-colors text-sm font-semibold cursor-pointer focus:outline-none ${
                  currentScreen === 'GALLERY' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                Gallery
              </button>
              <button 
                onClick={() => onNavigate('CONTACT')}
                className={`transition-colors text-sm font-semibold cursor-pointer focus:outline-none ${
                  currentScreen === 'CONTACT' ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                Contact
              </button>
            </nav>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                {userType} Mode
              </span>
              <button 
                onClick={onLogout}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 focus:ring-2 focus:ring-red-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {!['HOME', 'SERVICES', 'ABOUT', 'CONTACT', 'REQUEST_CALL', 'GALLERY'].includes(currentScreen) && (
                <button
                  onClick={() => onNavigate('HOME')}
                  className="flex items-center gap-1 text-slate-600 hover:text-teal-700 font-semibold text-sm mr-2 transition-colors focus:outline-none cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Web</span>
                </button>
              )}
              {currentScreen !== 'LOGIN' && (
                <button
                  onClick={() => onNavigate('LOGIN')}
                  className="bg-teal-900 text-white hover:bg-teal-950 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:scale-[1.02] active:scale-95 duration-150 transition-all shadow-md shadow-teal-100/50 focus:ring-2 focus:ring-teal-600 cursor-pointer"
                >
                  Portal Login
                </button>
              )}
            </div>
          )}

          {/* Hamburger Menu Toggle Button */}
          {['HOME', 'SERVICES', 'ABOUT', 'CONTACT', 'REQUEST_CALL', 'GALLERY'].includes(currentScreen) && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all cursor-pointer flex items-center justify-center border border-slate-100 bg-slate-50/50"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Animated Dropdown Menu for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && ['HOME', 'SERVICES', 'ABOUT', 'CONTACT', 'REQUEST_CALL', 'GALLERY'].includes(currentScreen) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
          >
            <nav className="flex flex-col p-4 gap-1 bg-white">
              <button 
                onClick={() => onNavigate('HOME')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left focus:outline-none cursor-pointer ${
                  currentScreen === 'HOME' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button 
                onClick={() => onNavigate('SERVICES')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left focus:outline-none cursor-pointer ${
                  currentScreen === 'SERVICES' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'
                }`}
              >
                <Award className="w-4 h-4" />
                Services
              </button>
              <button 
                onClick={() => onNavigate('ABOUT')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left focus:outline-none cursor-pointer ${
                  currentScreen === 'ABOUT' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'
                }`}
              >
                <Info className="w-4 h-4" />
                About
              </button>
              <button 
                onClick={() => onNavigate('GALLERY')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left focus:outline-none cursor-pointer ${
                  currentScreen === 'GALLERY' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'
                }`}
              >
                <Image className="w-4 h-4" />
                Gallery
              </button>
              <button 
                onClick={() => onNavigate('CONTACT')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left focus:outline-none cursor-pointer ${
                  currentScreen === 'CONTACT' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                Contact
              </button>

              {!isLoggedIn && currentScreen !== 'LOGIN' && (
                <div className="pt-3 border-t border-slate-100 mt-2 px-1">
                  <button
                    onClick={() => onNavigate('LOGIN')}
                    className="w-full bg-teal-900 text-white hover:bg-teal-950 py-3 rounded-xl text-center font-semibold text-sm duration-150 transition-all shadow-md shadow-teal-100/50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Portal Login
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
