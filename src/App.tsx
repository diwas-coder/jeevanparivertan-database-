import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileStickyBar from './components/MobileStickyBar';
import Chatbot from './components/Chatbot';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import RequestCallView from './components/RequestCallView';
import LoginView from './components/LoginView';
import AdminLoginView from './components/AdminLoginView';
import AdminDashboardView from './components/AdminDashboardView';
import FamilyPortalView from './components/FamilyPortalView';
import GalleryView from './components/GalleryView';

import { Screen, Enquiry, Patient, Appointment, SessionLog, Notice, FamilyMessage, GalleryItem } from './types';
import { 
  initialEnquiries, 
  initialPatients, 
  initialAppointments, 
  initialSessionLogs, 
  initialNotices,
  initialFamilyMessages,
  initialGalleryItems
} from './data';
import { getCollection, saveDocument, deleteDocument } from './lib/firebase';

export default function App() {
  // Screens state
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');

  // Core business states (re-hydrating with safe fallback)
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('jp_enquiries');
    return saved ? JSON.parse(saved) : initialEnquiries;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('jp_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('jp_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    const saved = localStorage.getItem('jp_session_logs');
    return saved ? JSON.parse(saved) : initialSessionLogs;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('jp_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [familyMessages, setFamilyMessages] = useState<FamilyMessage[]>(() => {
    const saved = localStorage.getItem('jp_family_messages');
    return saved ? JSON.parse(saved) : initialFamilyMessages;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('jp_gallery_items');
    return saved ? JSON.parse(saved) : initialGalleryItems;
  });

  // Authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('jp_logged_in') === 'true';
  });
  const [userType, setUserType] = useState<'admin' | 'family' | null>(() => {
    return localStorage.getItem('jp_user_type') as 'admin' | 'family' | null;
  });
  const [activePatientId, setActivePatientId] = useState<string | null>(() => {
    return localStorage.getItem('jp_active_patient_id');
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('jp_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('jp_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('jp_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('jp_session_logs', JSON.stringify(sessionLogs));
  }, [sessionLogs]);

  useEffect(() => {
    localStorage.setItem('jp_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('jp_family_messages', JSON.stringify(familyMessages));
  }, [familyMessages]);

  useEffect(() => {
    localStorage.setItem('jp_gallery_items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  // Auth synchronization
  useEffect(() => {
    localStorage.setItem('jp_logged_in', String(isLoggedIn));
    if (userType) localStorage.setItem('jp_user_type', userType);
    else localStorage.removeItem('jp_user_type');
    
    if (activePatientId) localStorage.setItem('jp_active_patient_id', activePatientId);
    else localStorage.removeItem('jp_active_patient_id');
  }, [isLoggedIn, userType, activePatientId]);

  // Real-world path routing sync
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/admin-login') {
        setCurrentScreen('ADMIN_LOGIN');
      } else if (path === '/admin/dashboard') {
        if (isLoggedIn && userType === 'admin') {
          setCurrentScreen('ADMIN_DASHBOARD');
        } else {
          // If not logged in as admin, redirect to admin-login
          window.history.replaceState(null, '', '/admin-login');
          setCurrentScreen('ADMIN_LOGIN');
        }
      } else if (path === '/family/portal' || path === '/family-portal') {
        if (isLoggedIn && userType === 'family') {
          setCurrentScreen('FAMILY_PORTAL');
        } else {
          window.history.replaceState(null, '', '/login');
          setCurrentScreen('LOGIN');
        }
      } else if (path === '/login') {
        setCurrentScreen('LOGIN');
      } else if (path === '/services') {
        setCurrentScreen('SERVICES');
      } else if (path === '/about') {
        setCurrentScreen('ABOUT');
      } else if (path === '/contact') {
        setCurrentScreen('CONTACT');
      } else if (path === '/request-call') {
        setCurrentScreen('REQUEST_CALL');
      } else if (path === '/gallery') {
        setCurrentScreen('GALLERY');
      } else if (path === '/' || path === '') {
        setCurrentScreen('HOME');
      }
    };

    // Initialize on load
    handleLocationChange();

    // Listen to history events (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [isLoggedIn, userType]);

  // Cloud database synchronization state
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    async function initFirebaseSync() {
      try {
        setDbStatus('connecting');

        // Sync Patients
        let fbPatients: Patient[] = [];
        try {
          fbPatients = await getCollection('patients') as Patient[];
        } catch (e) {
          console.error("Firebase patient fetch error, will try seeding...", e);
        }
        if (fbPatients && fbPatients.length > 0) {
          setPatients(fbPatients);
        } else {
          for (const p of patients) {
            await saveDocument('patients', p.id, p);
          }
        }

        // Sync Enquiries
        let fbEnquiries: Enquiry[] = [];
        try {
          fbEnquiries = await getCollection('enquiries') as Enquiry[];
        } catch (e) {}
        if (fbEnquiries && fbEnquiries.length > 0) {
          setEnquiries(fbEnquiries);
        } else {
          for (const enq of enquiries) {
            await saveDocument('enquiries', enq.id, enq);
          }
        }

        // Sync Session Logs
        let fbSessionLogs: SessionLog[] = [];
        try {
          fbSessionLogs = await getCollection('session_logs') as SessionLog[];
        } catch (e) {}
        if (fbSessionLogs && fbSessionLogs.length > 0) {
          setSessionLogs(fbSessionLogs);
        } else {
          for (const s of sessionLogs) {
            await saveDocument('session_logs', s.id, s);
          }
        }

        // Sync Notices
        let fbNotices: Notice[] = [];
        try {
          fbNotices = await getCollection('notices') as Notice[];
        } catch (e) {}
        if (fbNotices && fbNotices.length > 0) {
          setNotices(fbNotices);
        } else {
          for (const n of notices) {
            await saveDocument('notices', n.id, n);
          }
        }

        // Sync Family Messages
        let fbFamilyMessages: FamilyMessage[] = [];
        try {
          fbFamilyMessages = await getCollection('family_messages') as FamilyMessage[];
        } catch (e) {}
        if (fbFamilyMessages && fbFamilyMessages.length > 0) {
          setFamilyMessages(fbFamilyMessages);
        } else {
          for (const fm of familyMessages) {
            await saveDocument('family_messages', fm.id, fm);
          }
        }

        // Sync Gallery Items
        let fbGalleryItems: GalleryItem[] = [];
        try {
          fbGalleryItems = await getCollection('gallery_items') as GalleryItem[];
        } catch (e) {}
        if (fbGalleryItems && fbGalleryItems.length > 0) {
          setGalleryItems(fbGalleryItems);
        } else {
          for (const g of galleryItems) {
            await saveDocument('gallery_items', g.id, g);
          }
        }

        setDbStatus('connected');
      } catch (error) {
        console.error("Failed to fully sync with Firebase:", error);
        setDbStatus('error');
      }
    }

    initFirebaseSync();
  }, []);

  // Global Actions
  const handleAddEnquiry = (newEnq: Omit<Enquiry, 'id' | 'status' | 'date'>) => {
    const fresh: Enquiry = {
      ...newEnq,
      id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    };
    setEnquiries((prev) => [fresh, ...prev]);
    saveDocument('enquiries', fresh.id, fresh);
  };

  const handleUpdateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    setEnquiries((prev) => {
      const updated = prev.map((item) => item.id === id ? { ...item, status } : item);
      const target = updated.find(item => item.id === id);
      if (target) saveDocument('enquiries', id, target);
      return updated;
    });
  };

  const handleAddPatient = (freshPatient: Patient) => {
    setPatients((prev) => [freshPatient, ...prev]);
    saveDocument('patients', freshPatient.id, freshPatient);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients((prev) => {
      const updated = prev.map((p) => p.id === updatedPatient.id ? updatedPatient : p);
      saveDocument('patients', updatedPatient.id, updatedPatient);
      return updated;
    });
  };

  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    deleteDocument('patients', id);
  };

  const handleDeleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((enq) => enq.id !== id));
    deleteDocument('enquiries', id);
  };

  const handleDeleteFamilyMessage = (id: string) => {
    setFamilyMessages((prev) => prev.filter((msg) => msg.id !== id));
    deleteDocument('family_messages', id);
  };

  const handleAddNotice = (freshNotice: Notice) => {
    setNotices((prev) => [freshNotice, ...prev]);
    saveDocument('notices', freshNotice.id, freshNotice);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
    deleteDocument('notices', id);
  };

  const handleEditNotice = (updatedNotice: Notice) => {
    setNotices((prev) => {
      const updated = prev.map((notice) => notice.id === updatedNotice.id ? updatedNotice : notice);
      saveDocument('notices', updatedNotice.id, updatedNotice);
      return updated;
    });
  };

  const handlePostFamilyMessage = (messageText: string) => {
    // Append an interactive notification log to session logs for confirmation
    const freshLog: SessionLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      title: 'Family Message Received',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Family of ${loggedInPatient.name} wrote: ${messageText}`,
      type: 'interaction'
    };
    setSessionLogs((prev) => [freshLog, ...prev]);
    saveDocument('session_logs', freshLog.id, freshLog);

    // Create real family message for the admin view
    const freshMsg: FamilyMessage = {
      id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
      patientId: loggedInPatient.id,
      patientName: loggedInPatient.name,
      patientPhone: loggedInPatient.familyPhone || 'N/A',
      message: messageText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'undone'
    };
    setFamilyMessages((prev) => [freshMsg, ...prev]);
    saveDocument('family_messages', freshMsg.id, freshMsg);
  };

  const handleUpdateFamilyMessageStatus = (id: string, status: 'done' | 'undone') => {
    setFamilyMessages((prev) => {
      const updated = prev.map((msg) => msg.id === id ? { ...msg, status } : msg);
      const target = updated.find(msg => msg.id === id);
      if (target) saveDocument('family_messages', id, target);
      return updated;
    });
  };

  const handleAddGalleryItem = (newItem: Omit<GalleryItem, 'id' | 'date'>) => {
    const fresh: GalleryItem = {
      ...newItem,
      id: `GAL-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setGalleryItems((prev) => [fresh, ...prev]);
    saveDocument('gallery_items', fresh.id, fresh);
  };

  const handleUpdateGalleryItem = (updated: GalleryItem) => {
    setGalleryItems((prev) => {
      const updatedList = prev.map((item) => item.id === updated.id ? updated : item);
      saveDocument('gallery_items', updated.id, updated);
      return updatedList;
    });
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    deleteDocument('gallery_items', id);
  };

  const handleLoginSuccess = (type: 'admin' | 'family', matchedId?: string) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (matchedId) {
      setActivePatientId(matchedId);
      setTimeout(() => {
        navigateTo('FAMILY_PORTAL');
      }, 50);
    } else {
      setTimeout(() => {
        navigateTo('ADMIN_DASHBOARD');
      }, 50);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setActivePatientId(null);
    setTimeout(() => {
      navigateTo('HOME');
    }, 50);
  };

  const navigateTo = (screen: Screen) => {
    // Prevent navigating away from dashboards arbitrarily without logout
    if (screen === 'HOME' && isLoggedIn) {
      if (confirm('Do you want to log out from your active session?')) {
        handleLogout();
      }
      return;
    }

    // Update browser URL path to match the screen
    let path = '/';
    if (screen === 'ADMIN_LOGIN') path = '/admin-login';
    else if (screen === 'ADMIN_DASHBOARD') path = '/admin/dashboard';
    else if (screen === 'FAMILY_PORTAL') path = '/family/portal';
    else if (screen === 'LOGIN') path = '/login';
    else if (screen === 'SERVICES') path = '/services';
    else if (screen === 'ABOUT') path = '/about';
    else if (screen === 'CONTACT') path = '/contact';
    else if (screen === 'REQUEST_CALL') path = '/request-call';
    else if (screen === 'GALLERY') path = '/gallery';

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  // Resolve matching logged-in family patient
  const loggedInPatient = patients.find(p => p.id === activePatientId) || patients[0];

  return (
    <div className="flex flex-col min-h-screen text-slate-800 bg-slate-50 font-sans custom-scrollbar selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden w-full max-w-full">
      
      {/* Dynamic Navbar (Omit in full dashboard portals to avoid double crowding) */}
      {currentScreen !== 'ADMIN_DASHBOARD' && currentScreen !== 'FAMILY_PORTAL' && (
        <Navbar 
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          userType={userType}
        />
      )}

      {/* Main Screen Router */}
      <div className="flex-1">
        {currentScreen === 'HOME' && (
          <HomeView 
            onNavigate={navigateTo} 
          />
        )}

        {currentScreen === 'SERVICES' && (
          <ServicesView 
            onNavigate={navigateTo} 
          />
        )}

        {currentScreen === 'ABOUT' && (
          <AboutView 
            onNavigate={navigateTo} 
          />
        )}

        {currentScreen === 'CONTACT' && (
          <ContactView 
            onAddEnquiry={handleAddEnquiry} 
          />
        )}

        {currentScreen === 'REQUEST_CALL' && (
          <RequestCallView 
            onNavigate={navigateTo} 
            onAddEnquiry={handleAddEnquiry} 
          />
        )}

        {currentScreen === 'GALLERY' && (
          <GalleryView 
            galleryItems={galleryItems}
            onNavigate={navigateTo} 
          />
        )}

        {currentScreen === 'LOGIN' && (
          <LoginView 
            onLoginSuccess={handleLoginSuccess} 
            patientsList={patients} 
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'ADMIN_LOGIN' && (
          <AdminLoginView 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => navigateTo('HOME')}
          />
        )}

        {currentScreen === 'ADMIN_DASHBOARD' && isLoggedIn && userType === 'admin' && (
          <AdminDashboardView 
            dbStatus={dbStatus}
            onLogout={handleLogout}
            enquiriesList={enquiries}
            patientsList={patients}
            onAddPatient={handleAddPatient}
            onUpdatePatient={handleUpdatePatient}
            onDeletePatient={handleDeletePatient}
            onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
            onDeleteEnquiry={handleDeleteEnquiry}
            familyMessagesList={familyMessages}
            onUpdateFamilyMessageStatus={handleUpdateFamilyMessageStatus}
            onDeleteFamilyMessage={handleDeleteFamilyMessage}
            galleryItemsList={galleryItems}
            onAddGalleryItem={handleAddGalleryItem}
            onUpdateGalleryItem={handleUpdateGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
          />
        )}

        {currentScreen === 'FAMILY_PORTAL' && isLoggedIn && userType === 'family' && (
          <FamilyPortalView 
            patient={loggedInPatient}
            sessionLogs={sessionLogs}
            noticesList={notices}
            onLogout={handleLogout}
            onPostFamilyMessage={handlePostFamilyMessage}
          />
        )}
      </div>

      {/* Footer (Omitted in active full-screen dashboards for desktop-first feel) */}
      {currentScreen !== 'ADMIN_DASHBOARD' && currentScreen !== 'FAMILY_PORTAL' && (
        <Footer onNavigate={navigateTo} />
      )}

      {/* Floating interactive Chatbot */}
      {currentScreen !== 'ADMIN_DASHBOARD' && currentScreen !== 'FAMILY_PORTAL' && (
        <Chatbot 
          patientsList={patients} 
          onAddEnquiry={handleAddEnquiry} 
        />
      )}

      {/* Mobile Sticky bottom call-to-action bar */}
      <MobileStickyBar 
        onNavigate={navigateTo} 
        currentScreen={currentScreen} 
      />

    </div>
  );
}
