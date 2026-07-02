import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit, 
  AlertCircle, 
  Activity, 
  MessageSquare,
  CheckCircle2,
  Lock,
  PlusCircle,
  Eye,
  X,
  LayoutDashboard,
  Award,
  Trash2,
  Phone,
  Check,
  RotateCcw,
  Filter,
  Clock,
  Play,
  Menu
} from 'lucide-react';
import { Screen, Enquiry, Patient, FamilyMessage, GalleryItem } from '../types';
import { getDaysAdmitted, formatDateToInput, formatDateToLongString } from '../utils';
import { getCollection, saveDocument, deleteDocument } from '../lib/firebase';

interface AdminDashboardViewProps {
  dbStatus?: 'connecting' | 'connected' | 'error';
  onLogout: () => void;
  enquiriesList: Enquiry[];
  patientsList: Patient[];
  onAddPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient?: (id: string) => void;
  onUpdateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  onDeleteEnquiry?: (id: string) => void;
  familyMessagesList: FamilyMessage[];
  onUpdateFamilyMessageStatus: (id: string, status: 'done' | 'undone') => void;
  onDeleteFamilyMessage?: (id: string) => void;
  galleryItemsList: GalleryItem[];
  onAddGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  onUpdateGalleryItem: (item: GalleryItem) => void;
  onDeleteGalleryItem: (id: string) => void;
}

export default function AdminDashboardView({
  dbStatus = 'connecting',
  onLogout,
  enquiriesList,
  patientsList,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
  onUpdateEnquiryStatus,
  onDeleteEnquiry,
  familyMessagesList,
  onUpdateFamilyMessageStatus,
  onDeleteFamilyMessage,
  galleryItemsList,
  onAddGalleryItem,
  onUpdateGalleryItem,
  onDeleteGalleryItem
 }: AdminDashboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'enquiries' | 'patients' | 'messages' | 'gallery'>('overview');
  const [msgFilter, setMsgFilter] = useState<'all' | 'undone' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWardFilter, setSelectedWardFilter] = useState<'All' | 'Premium' | 'Normal'>('All');
  const [dashboardWardView, setDashboardWardView] = useState<'None' | 'Premium' | 'Normal' | 'Enquiries'>('None');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modals / Form toggles
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  
  // Edit Patient State
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Balance & Legacy Admissions States
  const [editingBalanceId, setEditingBalanceId] = useState<string | null>(null);
  const [editBalanceValue, setEditBalanceValue] = useState<string>('');

  // Custom non-blocking Delete Confirmation state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  
  interface LegacyAdmission {
    id: string;
    name: string;
    year: string;
    phone: string;
    balance: number;
  }
  
  const [legacyRecords, setLegacyRecords] = useState<LegacyAdmission[]>(() => {
    const saved = localStorage.getItem('jp_legacy_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 'LEG-101', name: 'Legacy Admissions Ledger', year: '2023-2024', phone: 'Pre-digital', balance: 120000 }
    ];
  });

  React.useEffect(() => {
    async function syncLegacyAdmissions() {
      try {
        const fbLegacy = await getCollection('legacy_admissions') as LegacyAdmission[];
        if (fbLegacy && fbLegacy.length > 0) {
          setLegacyRecords(fbLegacy);
          localStorage.setItem('jp_legacy_records', JSON.stringify(fbLegacy));
        } else {
          // Seed if Firestore collection is empty
          const initial = [
            { id: 'LEG-101', name: 'Legacy Admissions Ledger', year: '2023-2024', phone: 'Pre-digital', balance: 120000 }
          ];
          for (const rec of initial) {
            await saveDocument('legacy_admissions', rec.id, rec);
          }
          setLegacyRecords(initial);
          localStorage.setItem('jp_legacy_records', JSON.stringify(initial));
        }
      } catch (err) {
        console.error("Failed to sync legacy admissions with Firebase:", err);
      }
    }
    syncLegacyAdmissions();
  }, []);

  const [editingLegacyId, setEditingLegacyId] = useState<string | null>(null);
  const [editLegacyValue, setEditLegacyValue] = useState<string>('');
  const [showAddLegacyForm, setShowAddLegacyForm] = useState(false);
  const [newLegacyName, setNewLegacyName] = useState('');
  const [newLegacyYear, setNewLegacyYear] = useState('');
  const [newLegacyPhone, setNewLegacyPhone] = useState('');
  const [newLegacyBalance, setNewLegacyBalance] = useState('');

  const handleSaveLegacyRecords = (updated: LegacyAdmission[]) => {
    setLegacyRecords(updated);
    localStorage.setItem('jp_legacy_records', JSON.stringify(updated));
  };

  const handleUpdatePatientBalance = (patient: Patient, val: string) => {
    const parsed = parseInt(val, 10) || 0;
    const updated: Patient = {
      ...patient,
      balance: parsed
    };
    onUpdatePatient(updated);
    setEditingBalanceId(null);
  };

  const handleUpdateLegacyBalance = (id: string, val: string) => {
    const parsed = parseInt(val, 10) || 0;
    const updated = legacyRecords.map(rec => {
      if (rec.id === id) {
        const updatedRec = { ...rec, balance: parsed };
        saveDocument('legacy_admissions', id, updatedRec);
        return updatedRec;
      }
      return rec;
    });
    handleSaveLegacyRecords(updated);
    setEditingLegacyId(null);
  };

  const handleAddLegacyRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLegacyName) return;
    const fresh: LegacyAdmission = {
      id: `LEG-${Math.floor(100 + Math.random() * 900)}`,
      name: newLegacyName,
      year: newLegacyYear || '2023-2024',
      phone: newLegacyPhone || 'N/A',
      balance: parseInt(newLegacyBalance, 10) || 0
    };
    handleSaveLegacyRecords([...legacyRecords, fresh]);
    saveDocument('legacy_admissions', fresh.id, fresh);
    setNewLegacyName('');
    setNewLegacyYear('');
    setNewLegacyPhone('');
    setNewLegacyBalance('');
    setShowAddLegacyForm(false);
  };

  const handleDeleteLegacyRecord = (id: string) => {
    const record = legacyRecords.find(rec => rec.id === id);
    const name = record ? record.name : 'this legacy record';
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Legacy Admissions Record',
      message: `Are you sure you want to permanently delete the legacy admission record for "${name}"?`,
      onConfirm: () => {
        const updated = legacyRecords.filter(rec => rec.id !== id);
        handleSaveLegacyRecords(updated);
        deleteDocument('legacy_admissions', id);
      }
    });
  };

  // Gallery Manager State
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryItemToDelete, setGalleryItemToDelete] = useState<GalleryItem | null>(null);
  
  const [galleryFormType, setGalleryFormType] = useState<'photo' | 'video'>('photo');
  const [galleryFormTitle, setGalleryFormTitle] = useState('');
  const [galleryFormDescription, setGalleryFormDescription] = useState('');
  const [galleryFormCategory, setGalleryFormCategory] = useState('Facility');
  const [galleryFormCustomCategory, setGalleryFormCustomCategory] = useState('');
  const [galleryFormUrl, setGalleryFormUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const pendingMessagesCount = familyMessagesList.filter(m => (m.status || 'undone') === 'undone').length;

  // New Patient Form state
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: '',
    addictionType: '',
    status: 'Recovering' as Patient['status'],
    daysAdmitted: '0',
    admitDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    balance: '15000',
    familyPhone: '',
    ward: 'Normal' as Patient['ward'],
    admitDateInput: new Date().toISOString().split('T')[0]
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientData.name || !newPatientData.familyPhone) {
      alert('Please fill out Name and Family Contact Phone!');
      return;
    }
    if (!newPatientData.addictionType || newPatientData.addictionType === 'Select Addiction Type') {
      alert('Please select a valid Addiction Type!');
      return;
    }

    const patientId = `JP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const calculatedDays = getDaysAdmitted(newPatientData.admitDate);
    const freshPatient: Patient = {
      id: patientId,
      name: newPatientData.name,
      age: parseInt(newPatientData.age) || 30,
      addictionType: newPatientData.addictionType,
      status: newPatientData.status,
      daysAdmitted: calculatedDays,
      admitDate: newPatientData.admitDate,
      balance: parseInt(newPatientData.balance) || 15000,
      familyPhone: newPatientData.familyPhone,
      ward: newPatientData.ward
    };

    onAddPatient(freshPatient);
    setShowAddPatientModal(false);
    
    // reset form
    setNewPatientData({
      name: '',
      age: '',
      addictionType: '',
      status: 'Recovering',
      daysAdmitted: '0',
      admitDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      balance: '15000',
      familyPhone: '',
      ward: 'Normal',
      admitDateInput: new Date().toISOString().split('T')[0]
    });
    alert(`Successfully registered new patient ${freshPatient.name} with ID: ${patientId}`);
  };

  const handleUpdatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      onUpdatePatient(editingPatient);
      setEditingPatient(null);
      alert(`Patient ${editingPatient.name} records updated successfully.`);
    }
  };

  // Gallery Management Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryFormUrl(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to read file.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = galleryFormCategory === 'Custom' ? galleryFormCustomCategory : galleryFormCategory;
    if (!galleryFormTitle || !galleryFormUrl || !finalCategory) {
      alert('Please fill out Title, Category, and Media File/URL!');
      return;
    }

    onAddGalleryItem({
      type: galleryFormType,
      title: galleryFormTitle,
      description: galleryFormDescription,
      category: finalCategory,
      url: galleryFormUrl
    });

    setShowAddGalleryModal(false);
    resetGalleryForm();
    alert('Gallery item created successfully!');
  };

  const resetGalleryForm = () => {
    setGalleryFormType('photo');
    setGalleryFormTitle('');
    setGalleryFormDescription('');
    setGalleryFormCategory('Facility');
    setGalleryFormCustomCategory('');
    setGalleryFormUrl('');
  };

  const handleStartEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryFormType(item.type);
    setGalleryFormTitle(item.title);
    setGalleryFormDescription(item.description);
    
    const standardCategories = ['Facility', 'Activities', 'Counseling', 'Yoga'];
    if (standardCategories.includes(item.category)) {
      setGalleryFormCategory(item.category);
      setGalleryFormCustomCategory('');
    } else {
      setGalleryFormCategory('Custom');
      setGalleryFormCustomCategory(item.category);
    }
    setGalleryFormUrl(item.url);
  };

  const handleUpdateGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    const finalCategory = galleryFormCategory === 'Custom' ? galleryFormCustomCategory : galleryFormCategory;
    if (!galleryFormTitle || !galleryFormUrl || !finalCategory) {
      alert('Please fill out Title, Category, and Media File/URL!');
      return;
    }

    onUpdateGalleryItem({
      id: editingGalleryItem.id,
      type: galleryFormType,
      title: galleryFormTitle,
      description: galleryFormDescription,
      category: finalCategory,
      url: galleryFormUrl,
      date: editingGalleryItem.date
    });

    setEditingGalleryItem(null);
    resetGalleryForm();
    alert('Gallery item updated successfully!');
  };

  const handleDeleteGalleryClick = (item: GalleryItem) => {
    setGalleryItemToDelete(item);
  };

  const handleConfirmDeleteGallery = () => {
    if (galleryItemToDelete) {
      onDeleteGalleryItem(galleryItemToDelete.id);
      setGalleryItemToDelete(null);
    }
  };

  // Filter lists based on search
  const filteredEnquiries = enquiriesList.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.addictionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatients = patientsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.addictionType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = selectedWardFilter === 'All' || (p.ward || 'Normal') === selectedWardFilter;
    return matchesSearch && matchesWard;
  });

  // Stats calculation
  const totalEnquiries = enquiriesList.length;
  const unviewedEnquiriesCount = enquiriesList.filter(e => e.status === 'New').length;
  const totalPatients = patientsList.length + 449;
  const premiumCount = patientsList.filter(p => p.status !== 'Completed' && p.ward === 'Premium').length;
  const normalCount = patientsList.filter(p => p.status !== 'Completed' && (p.ward || 'Normal') === 'Normal').length;
  const activePatientsCount = premiumCount + normalCount;
  const totalPending = patientsList.reduce((acc, p) => acc + p.balance, 0) + legacyRecords.reduce((acc, r) => acc + r.balance, 0);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 font-sans overflow-x-hidden w-full max-w-full">
      
      {/* MOBILE SIDEBAR DRAWER (Slide-in) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop with elegant fade-in blur */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          ></div>
          
          {/* Drawer content sliding in from left */}
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-6 flex flex-col items-start gap-4 border-b border-slate-100">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100">
                    <Activity className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h1 className="text-teal-900 font-display font-extrabold text-sm leading-tight">Jeevan</h1>
                    <p className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">Parivartan</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl w-full border border-slate-100">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-teal-100 flex items-center justify-center text-teal-700 font-bold font-display text-xs">
                  AD
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">Admin Portal</p>
                  <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active Admin
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links inside Drawer */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              <button 
                onClick={() => { setActiveSubTab('overview'); setSearchQuery(''); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
                  activeSubTab === 'overview' 
                    ? 'bg-teal-900 text-white shadow-md font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 text-xs font-semibold'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span className="text-xs">Dashboard</span>
              </button>

              <button 
                onClick={() => { setActiveSubTab('enquiries'); setSearchQuery(''); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
                  activeSubTab === 'enquiries' 
                    ? 'bg-teal-900 text-white shadow-md font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 text-xs font-semibold'
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
                <span className="text-xs">Enquiries</span>
              </button>

              <button 
                onClick={() => { setShowAddPatientModal(true); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                <PlusCircle className="w-4.5 h-4.5 text-teal-600" />
                <span className="text-xs">Add New Patient</span>
              </button>

              <button 
                onClick={() => { setActiveSubTab('patients'); setSearchQuery(''); setSelectedWardFilter('All'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
                  activeSubTab === 'patients' 
                    ? 'bg-teal-900 text-white shadow-md font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 text-xs font-semibold'
                }`}
              >
                <Users className="w-4.5 h-4.5" />
                <span className="text-xs">In Patients</span>
              </button>

              <button 
                onClick={() => { setActiveSubTab('messages'); setSearchQuery(''); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
                  activeSubTab === 'messages' 
                    ? 'bg-teal-900 text-white shadow-md font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 text-xs font-semibold'
                }`}
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span className="text-xs">Family Messages</span>
                {pendingMessagesCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingMessagesCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { setActiveSubTab('gallery'); setSearchQuery(''); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
                  activeSubTab === 'gallery' 
                    ? 'bg-teal-900 text-white shadow-md font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 text-xs font-semibold'
                }`}
              >
                <Eye className="w-4.5 h-4.5" />
                <span className="text-xs">Gallery Manager</span>
                <span className="ml-auto bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {galleryItemsList.length}
                </span>
              </button>
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all cursor-pointer font-bold text-xs"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Logout Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white border-r border-slate-200 z-40 transition-all duration-300">
        <div className="p-6 flex flex-col items-start gap-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-teal-900 font-display font-extrabold text-base leading-tight">Jeevan</h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Parivartan</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-3 bg-slate-50 p-3 rounded-xl w-full border border-slate-100">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-teal-100 flex items-center justify-center text-teal-700 font-bold font-display">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">Admin Portal</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Admin
              </p>
              {dbStatus === 'connected' ? (
                <p className="text-[9px] text-teal-700 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                  Cloud DB Synced
                </p>
              ) : dbStatus === 'connecting' ? (
                <p className="text-[9px] text-amber-600 font-bold flex items-center gap-1 mt-0.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Connecting DB...
                </p>
              ) : (
                <p className="text-[9px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Offline Mode
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => { setActiveSubTab('overview'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
              activeSubTab === 'overview' 
                ? 'bg-teal-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span className="text-xs font-bold">Dashboard</span>
          </button>

          <button 
            onClick={() => { setActiveSubTab('enquiries'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
              activeSubTab === 'enquiries' 
                ? 'bg-teal-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            <span className="text-xs font-bold">Enquiries</span>
          </button>

          <button 
            onClick={() => setShowAddPatientModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <PlusCircle className="w-4.5 h-4.5 text-teal-600" />
            <span className="text-xs font-bold">Add New Patient</span>
          </button>

          <button 
            onClick={() => { setActiveSubTab('patients'); setSearchQuery(''); setSelectedWardFilter('All'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
              activeSubTab === 'patients' 
                ? 'bg-teal-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span className="text-xs font-bold">In Patients</span>
          </button>

          <button 
            onClick={() => { setActiveSubTab('messages'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
              activeSubTab === 'messages' 
                ? 'bg-teal-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span className="text-xs font-bold">Family Messages</span>
            {pendingMessagesCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingMessagesCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => { setActiveSubTab('gallery'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer focus:outline-none ${
              activeSubTab === 'gallery' 
                ? 'bg-teal-900 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4.5 h-4.5" />
            <span className="text-xs font-bold">Gallery Manager</span>
            <span className="ml-auto bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {galleryItemsList.length}
            </span>
          </button>

        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all cursor-pointer font-bold text-xs"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-1 lg:ml-64 bg-slate-50 min-h-screen relative pb-20 lg:pb-12 overflow-x-hidden w-full max-w-full">
        
        {/* TOP STATUS BAR */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center border-b border-slate-100 shadow-[0_4px_20px_rgba(30,58,138,0.02)]">
          <div className="flex items-center gap-3">
            {/* Hamburger menu button for mobile layout */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none cursor-pointer flex items-center justify-center"
              title="Open Navigation"
            >
              <Menu className="w-5.5 h-5.5 text-teal-800" />
            </button>
            
            <div>
              <h2 className="text-lg sm:text-2xl font-display font-extrabold text-teal-900 tracking-tight">
                {activeSubTab === 'overview' && 'Dashboard Overview'}
                {activeSubTab === 'enquiries' && 'Enquiries Management'}
                {activeSubTab === 'patients' && 'In Patients Management'}
                {activeSubTab === 'messages' && 'Family Messages Board'}
                {activeSubTab === 'gallery' && 'Public Gallery Manager'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Welcome back, Admin. System reports look healthy.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search database..."
                className="pl-10 pr-4 py-2 w-56 rounded-full border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-teal-700 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
            </div>
            


            {/* Direct Logout Button - highly visible on mobile/desktop */}
            <button 
              onClick={onLogout}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-1.5 cursor-pointer focus:outline-none border border-transparent hover:border-red-100 transition-all duration-150"
              title="Logout Portal"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline text-xs font-bold">Logout</span>
            </button>
          </div>
        </header>

        {/* CONTAINER WORKSPACE */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
          
          {/* STATS Bento Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            
            <button 
              onClick={() => {
                setDashboardWardView(dashboardWardView === 'Enquiries' ? 'None' : 'Enquiries');
              }}
              className={`p-6 rounded-2xl border transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 flex flex-col justify-between w-full h-full ${
                dashboardWardView === 'Enquiries'
                  ? 'border-amber-500 bg-amber-50/30 shadow-md ring-1 ring-amber-500'
                  : 'bg-white border-slate-100 shadow-sm hover:border-amber-300 hover:bg-amber-50/10'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12%
                </span>
              </div>
              <div className="mt-4 w-full">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enquiries</p>
                <div className="flex items-baseline justify-between gap-1 mt-1 w-full">
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-blue-900">{totalEnquiries.toLocaleString()}</h3>
                  {unviewedEnquiriesCount > 0 && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse" title="Unviewed / New Enquiries">
                      {unviewedEnquiriesCount} New
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-block hover:underline">
                  {dashboardWardView === 'Enquiries' ? 'Click to hide list' : 'Click to view list'}
                </span>
              </div>
            </button>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-emerald-600 font-bold text-xs flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +5%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Admitted</p>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-blue-900 mt-1">{totalPatients}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Patient</p>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-blue-900 mt-1">{activePatientsCount}</h3>
              </div>
            </div>

            <button 
              onClick={() => {
                setDashboardWardView(dashboardWardView === 'Premium' ? 'None' : 'Premium');
              }}
              className={`p-6 rounded-2xl border transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
                dashboardWardView === 'Premium'
                  ? 'border-purple-500 bg-purple-50/30 shadow-md ring-1 ring-purple-500'
                  : 'bg-white border-slate-100 shadow-sm hover:border-purple-300 hover:bg-purple-50/10'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-purple-600 font-bold text-[10px] bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Premium
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Premium</p>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-purple-900 mt-1">{premiumCount}</h3>
                <span className="text-[10px] text-purple-500 font-semibold mt-1 inline-block hover:underline">
                  {dashboardWardView === 'Premium' ? 'Click to hide list' : 'Click to view list'}
                </span>
              </div>
            </button>

            <button 
              onClick={() => {
                setDashboardWardView(dashboardWardView === 'Normal' ? 'None' : 'Normal');
              }}
              className={`p-6 rounded-2xl border transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                dashboardWardView === 'Normal'
                  ? 'border-blue-500 bg-blue-50/30 shadow-md ring-1 ring-blue-500'
                  : 'bg-white border-slate-100 shadow-sm hover:border-blue-300 hover:bg-blue-50/10'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-blue-600 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Normal
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Normal</p>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-blue-900 mt-1">{normalCount}</h3>
                <span className="text-[10px] text-blue-500 font-semibold mt-1 inline-block hover:underline">
                  {dashboardWardView === 'Normal' ? 'Click to hide list' : 'Click to view list'}
                </span>
              </div>
            </button>

            <button 
              onClick={() => setShowBalanceModal(true)}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between text-left cursor-pointer hover:border-red-300 hover:bg-red-50/10 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-2.5 bg-red-50 text-red-700 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-red-600 font-bold text-xs flex items-center gap-0.5 bg-red-50 px-2 py-0.5 rounded-full">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -2.4k
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pending Balance</p>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-red-700 mt-1">
                  {totalPending >= 100000 ? `₹ ${Number((totalPending / 100000).toFixed(2))}L` : `₹ ${Number((totalPending / 1000).toFixed(1))}K`}
                </h3>
                <span className="text-[10px] text-red-500 font-medium mt-1 inline-block hover:underline">Click to view breakdown</span>
              </div>
            </button>

          </section>

          {/* ACTIVE PORTLET WORKSPACE */}
          {activeSubTab === 'overview' && (
            <>
              {(dashboardWardView === 'Premium' || dashboardWardView === 'Normal') && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        dashboardWardView === 'Premium' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {dashboardWardView === 'Premium' ? <Award className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-bold text-slate-900">
                          Active {dashboardWardView} Ward Patients
                        </h3>
                        <p className="text-xs text-slate-400">
                          List of current patients admitted in the {dashboardWardView.toLowerCase()} ward section.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        dashboardWardView === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {patientsList.filter(p => p.status !== 'Completed' && (p.ward || 'Normal') === dashboardWardView).length} Admitted
                      </span>
                      <button 
                        onClick={() => setDashboardWardView('None')}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                        title="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Inpatient Identity</th>
                          <th className="px-6 py-4">Focus Path</th>
                          <th className="px-6 py-4">Ward Section</th>
                          <th className="px-6 py-4">Duration Admitted</th>
                          <th className="px-6 py-4">Portal Passcode (Phone)</th>
                          <th className="px-6 py-4">Milestone Status</th>
                          <th className="px-6 py-4">Balance / Bill</th>
                          <th className="px-6 py-4">Clinical Modifiers</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                        {patientsList
                          .filter(p => p.status !== 'Completed' && (p.ward || 'Normal') === dashboardWardView)
                          .map((patient) => (
                            <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 font-bold text-xs flex items-center justify-center font-display">
                                    {patient.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{patient.name}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold font-mono tracking-wider">{patient.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-600">
                                {patient.addictionType}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  patient.ward === 'Premium' 
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {patient.ward || 'Normal'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-bold text-slate-900">{getDaysAdmitted(patient.admitDate, patient.daysAdmitted)} Days</p>
                                  <p className="text-[10px] text-slate-400">Admit: {patient.admitDate}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium text-slate-600">
                                {patient.familyPhone}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  patient.status === 'Recovering' 
                                    ? 'bg-emerald-50 text-emerald-800' 
                                    : patient.status === 'Detoxing'
                                    ? 'bg-amber-50 text-amber-800'
                                    : patient.status === 'Completed'
                                    ? 'bg-blue-50 text-blue-800'
                                    : 'bg-indigo-50 text-indigo-800'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    patient.status === 'Recovering' ? 'bg-emerald-500 animate-pulse' : patient.status === 'Detoxing' ? 'bg-amber-500' : 'bg-blue-500'
                                  }`}></span>
                                  {patient.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-900">
                                ₹ {patient.balance.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <button 
                                  onClick={() => setEditingPatient(patient)}
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        {patientsList.filter(p => p.status !== 'Completed' && (p.ward || 'Normal') === dashboardWardView).length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center p-12 text-slate-400 font-semibold">
                              No active patient records found in {dashboardWardView} ward.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {dashboardWardView === 'Enquiries' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-amber-50/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-bold text-slate-900">
                          New / Unviewed Enquiries
                        </h3>
                        <p className="text-xs text-slate-400">
                          List of newly received inquiries awaiting response or assignment.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800 animate-pulse">
                        {unviewedEnquiriesCount} New
                      </span>
                      <button 
                        onClick={() => setDashboardWardView('None')}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                        title="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Sender Name</th>
                          <th className="px-6 py-4">Phone Number</th>
                          <th className="px-6 py-4">Addiction Focus</th>
                          <th className="px-6 py-4">Message / Notes</th>
                          <th className="px-6 py-4">Received Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Action Response</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                        {enquiriesList
                          .filter(e => e.status === 'New')
                          .map((enq) => (
                            <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center font-display">
                                    {enq.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{enq.name}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold font-mono tracking-wider">{enq.age} Years Old</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium text-slate-600">
                                {enq.phone}
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-600">
                                {enq.addictionType}
                              </td>
                              <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={enq.message}>
                                {enq.message}
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                {enq.date}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                  {enq.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => onUpdateEnquiryStatus(enq.id, 'Followed Up')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2.5 py-1.5 rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                                  >
                                    Mark Followed Up
                                  </button>
                                  <button 
                                    onClick={() => onUpdateEnquiryStatus(enq.id, 'Urgent')}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
                                  >
                                    Mark Urgent
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {enquiriesList.filter(e => e.status === 'New').length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center p-12 text-slate-400 font-semibold">
                              All inquiries have been processed! No new unviewed inquiries.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                
                {/* Recent Admissions Enquiries */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="text-lg font-display font-bold text-slate-900">Recent Admissions Enquiries</h3>
                      <p className="text-xs text-slate-400">Direct callbacks requested via website &amp; chatbot.</p>
                    </div>
                    <button 
                      onClick={() => setActiveSubTab('enquiries')}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      View All Hub
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Name / Contact</th>
                          <th className="px-6 py-4">Addiction Focus</th>
                          <th className="px-6 py-4">Inquiry Status</th>
                          <th className="px-6 py-4">Urgency Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredEnquiries.slice(0, 3).map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center font-display">
                                  {enq.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{enq.name}</p>
                                  <p className="text-xs text-slate-500 font-mono">+91 {enq.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                {enq.addictionType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                enq.status === 'Urgent' 
                                  ? 'bg-red-50 text-red-700' 
                                  : enq.status === 'Followed Up'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-blue-50 text-blue-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  enq.status === 'Urgent' 
                                    ? 'bg-red-500 animate-pulse' 
                                    : enq.status === 'Followed Up'
                                    ? 'bg-emerald-500'
                                    : 'bg-blue-500'
                                }`}></span>
                                {enq.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {enq.status !== 'Followed Up' && (
                                  <button 
                                    onClick={() => onUpdateEnquiryStatus(enq.id, 'Followed Up')}
                                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                                  >
                                    Complete Follow-up
                                  </button>
                                )}
                                {enq.status === 'New' && (
                                  <button 
                                    onClick={() => onUpdateEnquiryStatus(enq.id, 'Urgent')}
                                    className="bg-red-100 hover:bg-red-200 text-red-800 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                                  >
                                    Mark Urgent
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grid for New Patient Registration & Ward Occupancy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Intake Button Call */}
                  <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden group border border-blue-850 flex flex-col justify-between min-h-[220px]">
                    <div className="relative z-10">
                      <h3 className="text-lg font-display font-bold mb-1">New Patient Registration</h3>
                      <p className="text-xs text-blue-200 opacity-90 mb-6 leading-relaxed">Systematically record health profiles, set family communication codes, and set initial treatment balances.</p>
                    </div>
                    <div className="relative z-10">
                      <button 
                        onClick={() => setShowAddPatientModal(true)}
                        className="w-full bg-white hover:bg-blue-50 text-blue-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 duration-150 transition-all shadow-md shadow-blue-950/20 cursor-pointer text-xs"
                      >
                        <Plus className="w-4 h-4 text-blue-900" />
                        Register New Patient
                      </button>
                    </div>
                    <Activity className="absolute -right-4 -bottom-4 text-9xl opacity-5 group-hover:rotate-12 transition-transform duration-300 pointer-events-none" />
                  </div>

                  {/* Ward Occupancy status section */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-200 flex flex-col justify-between min-h-[220px]">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-700" />
                          Ward Occupancy
                        </h3>
                        <span className="text-[9px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Live Status
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">Real-time room occupancy and admission limits across both clinical wards.</p>
                    </div>

                    <div className="space-y-3.5">
                      {/* Premium Ward */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                            <span className="font-bold text-slate-700">Premium Ward</span>
                          </div>
                          <span className="font-semibold text-slate-500">{premiumCount}/12 Beds</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                             className="bg-purple-600 h-full rounded-full transition-all duration-500"
                             style={{ width: `${Math.max(8, Math.min(100, (premiumCount / 12) * 100))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Normal Ward */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            <span className="font-bold text-slate-700">Normal Ward</span>
                          </div>
                          <span className="font-semibold text-slate-500">{normalCount}/48 Beds</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                             className="bg-blue-600 h-full rounded-full transition-all duration-500"
                             style={{ width: `${Math.max(8, Math.min(100, (normalCount / 48) * 100))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patients with Remaining Balance Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/10">
                    <div>
                      <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Patients with Remaining Balance
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold">List of active inpatients with outstanding treatment fees.</p>
                    </div>
                    <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                      {patientsList.filter(p => p.balance > 0).length} Patients
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Patient Name / ID</th>
                          <th className="px-6 py-4">Addiction Focus</th>
                          <th className="px-6 py-4">Ward Section</th>
                          <th className="px-6 py-4">Family Contact</th>
                          <th className="px-6 py-4">Milestone Status</th>
                          <th className="px-6 py-4">Remaining Balance</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                        {patientsList
                          .filter(p => p.balance > 0)
                          .map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 font-bold text-[10px] flex items-center justify-center font-display">
                                    {p.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{p.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-600">
                                {p.addictionType}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  p.ward === 'Premium' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {p.ward || 'Normal'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium text-slate-600">
                                {p.familyPhone || 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  p.status === 'Recovering' 
                                    ? 'bg-emerald-50 text-emerald-800' 
                                    : p.status === 'Detoxing'
                                    ? 'bg-amber-50 text-amber-800'
                                    : 'bg-blue-50 text-blue-800'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    p.status === 'Recovering' ? 'bg-emerald-500 animate-pulse' : p.status === 'Detoxing' ? 'bg-amber-500' : 'bg-blue-500'
                                  }`}></span>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-red-700 font-mono">
                                ₹ {p.balance.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => setEditingPatient(p)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                                  >
                                    Update / Pay
                                  </button>
                                  {onDeletePatient && (
                                    <button 
                                      onClick={() => setDeleteDialog({
                                        isOpen: true,
                                        title: 'Delete Inpatient Record',
                                        message: `Are you sure you want to permanently delete the inpatient record for "${p.name}" (${p.id})?`,
                                        onConfirm: () => onDeletePatient(p.id)
                                      })}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center animate-in fade-in zoom-in-95 duration-150"
                                      title="Delete Patient Record"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        {patientsList.filter(p => p.balance > 0).length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center p-12 text-slate-400 font-semibold">
                              All patients balances are fully cleared!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* DYNAMIC SUBTAB: ENQUIRIES HUB */}
          {activeSubTab === 'enquiries' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900">Total Admissions Enquiry Database</h3>
                  <p className="text-xs text-slate-400">Manage digital callbacks, prioritize critical cases, and track followups.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter enquiries..."
                    className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-700 text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Inquirer Name / Contact</th>
                      <th className="px-6 py-4">Primary Concern</th>
                      <th className="px-6 py-4">Inquiry Message Detail</th>
                      <th className="px-6 py-4">Current Status</th>
                      <th className="px-6 py-4">Callback Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-900 font-bold text-xs flex items-center justify-center font-display">
                              {enq.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{enq.name}</p>
                              <p className="text-xs text-slate-400 font-mono">+91 {enq.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {enq.addictionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          <p className="text-slate-500 font-normal">{enq.message}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                            enq.status === 'Urgent' 
                              ? 'bg-red-50 text-red-700' 
                              : enq.status === 'Followed Up'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              enq.status === 'Urgent' ? 'bg-red-500 animate-pulse' : enq.status === 'Followed Up' ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}></span>
                            {enq.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {enq.status !== 'Followed Up' && (
                              <button 
                                onClick={() => onUpdateEnquiryStatus(enq.id, 'Followed Up')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs"
                              >
                                Log Followed-up
                              </button>
                            )}
                            {enq.status === 'New' && (
                              <button 
                                onClick={() => onUpdateEnquiryStatus(enq.id, 'Urgent')}
                                className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs"
                              >
                                Prioritize Urgent
                              </button>
                            )}
                            {onDeleteEnquiry && (
                              <button 
                                onClick={() => setDeleteDialog({
                                  isOpen: true,
                                  title: 'Delete Enquiry',
                                  message: `Are you sure you want to permanently delete the enquiry from "${enq.name}"?`,
                                  onConfirm: () => onDeleteEnquiry(enq.id)
                                })}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredEnquiries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-12 text-slate-400 font-semibold">
                          No matching active enquiries found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DYNAMIC SUBTAB: ACTIVE PATIENTS */}
          {activeSubTab === 'patients' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900">Registered Patient Inpatient Directory</h3>
                  <p className="text-xs text-slate-400">Monitor recovery statuses, edit treatment durations, adjust bills, and check family portal access.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search patient ID or Name..."
                      className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-700 text-slate-800"
                    />
                  </div>
                  <button 
                    onClick={() => setShowAddPatientModal(true)}
                    className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Register Inpatient
                  </button>
                </div>
              </div>

              <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/10 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Filter by Ward Section:</span>
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setSelectedWardFilter('All')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedWardFilter === 'All'
                          ? 'bg-white text-blue-900 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900 font-medium'
                      }`}
                    >
                      All Wards
                    </button>
                    <button
                      onClick={() => setSelectedWardFilter('Premium')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedWardFilter === 'Premium'
                          ? 'bg-purple-600 text-white shadow-sm font-bold'
                          : 'text-purple-700 hover:text-purple-900 font-medium'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      Premium Ward ({premiumCount})
                    </button>
                    <button
                      onClick={() => setSelectedWardFilter('Normal')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedWardFilter === 'Normal'
                          ? 'bg-blue-600 text-white shadow-sm font-bold'
                          : 'text-blue-700 hover:text-blue-900 font-medium'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Normal Ward ({normalCount})
                    </button>
                  </div>
                </div>
                {selectedWardFilter !== 'All' && (
                  <button 
                    onClick={() => setSelectedWardFilter('All')}
                    className="text-[11px] text-blue-700 hover:underline font-bold cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Inpatient Identity</th>
                      <th className="px-6 py-4">Focus Path</th>
                      <th className="px-6 py-4">Ward Section</th>
                      <th className="px-6 py-4">Duration Admitted</th>
                      <th className="px-6 py-4">Portal Passcode (Phone)</th>
                      <th className="px-6 py-4">Milestone Status</th>
                      <th className="px-6 py-4">Balance / Bill</th>
                      <th className="px-6 py-4">Clinical Modifiers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 font-bold text-xs flex items-center justify-center font-display">
                              {patient.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{patient.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold font-mono tracking-wider">{patient.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-600">
                          {patient.addictionType}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            patient.ward === 'Premium' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {patient.ward || 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">{getDaysAdmitted(patient.admitDate, patient.daysAdmitted)} Days</p>
                            <p className="text-[10px] text-slate-400">Admit: {patient.admitDate}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-slate-600">
                          {patient.familyPhone}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            patient.status === 'Recovering' 
                              ? 'bg-emerald-50 text-emerald-800' 
                              : patient.status === 'Detoxing'
                              ? 'bg-amber-50 text-amber-800'
                              : patient.status === 'Completed'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-indigo-50 text-indigo-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              patient.status === 'Recovering' ? 'bg-emerald-500 animate-pulse' : patient.status === 'Detoxing' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}></span>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          ₹ {patient.balance.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setEditingPatient(patient)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg transition-colors cursor-pointer"
                              title="Edit Patient"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {onDeletePatient && (
                              <button 
                                onClick={() => setDeleteDialog({
                                  isOpen: true,
                                  title: 'Delete Inpatient Record',
                                  message: `Are you sure you want to permanently delete the inpatient record for "${patient.name}" (${patient.id})?`,
                                  onConfirm: () => onDeletePatient(patient.id)
                                })}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Delete Inpatient"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center p-12 text-slate-400 font-semibold">
                          No inpatient records found matching query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: FAMILY MESSAGES */}
          {activeSubTab === 'messages' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Summary Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Received</p>
                    <p className="text-2xl font-display font-extrabold text-slate-900 mt-1">
                      {familyMessagesList.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Attention</p>
                    <p className="text-2xl font-display font-extrabold text-amber-600 mt-1">
                      {familyMessagesList.filter(m => (m.status || 'undone') === 'undone').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                    <span className="relative flex h-3 w-3 mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Resolved Messages</p>
                    <p className="text-2xl font-display font-extrabold text-emerald-600 mt-1">
                      {familyMessagesList.filter(m => m.status === 'done').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Main Board Container */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Family Messages Board
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Track, acknowledge, and resolve supportive letters or concerns sent by patient family members.</p>
                  </div>
                  
                  {/* Filter controls */}
                  <div className="flex bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto gap-1">
                    <button
                      onClick={() => setMsgFilter('all')}
                      className={`flex-1 sm:flex-initial text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        msgFilter === 'all'
                          ? 'bg-white text-slate-800 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      All ({familyMessagesList.length})
                    </button>
                    <button
                      onClick={() => setMsgFilter('undone')}
                      className={`flex-1 sm:flex-initial text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        msgFilter === 'undone'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-slate-500 hover:text-amber-600'
                      }`}
                    >
                      Pending ({familyMessagesList.filter(m => (m.status || 'undone') === 'undone').length})
                    </button>
                    <button
                      onClick={() => setMsgFilter('done')}
                      className={`flex-1 sm:flex-initial text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        msgFilter === 'done'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-emerald-600'
                      }`}
                    >
                      Done ({familyMessagesList.filter(m => m.status === 'done').length})
                    </button>
                  </div>
                </div>

                <div className="p-6 divide-y divide-slate-100">
                  {familyMessagesList
                    .filter((msg) => {
                      const status = msg.status || 'undone';
                      if (msgFilter === 'all') return true;
                      return status === msgFilter;
                    })
                    .map((msg) => {
                      const isDone = msg.status === 'done';
                      return (
                        <div 
                          key={msg.id} 
                          className={`py-5 first:pt-0 last:pb-0 flex flex-col lg:flex-row justify-between gap-6 items-start transition-all duration-300 ${
                            isDone ? 'opacity-70' : ''
                          }`}
                        >
                          <div className={`space-y-3 flex-1 w-full pl-3.5 border-l-4 ${isDone ? 'border-emerald-500' : 'border-amber-500'}`}>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">{msg.date}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {msg.id}</span>
                              <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded font-mono">Patient Code: {msg.patientId}</span>
                              
                              {/* Status Badge */}
                              {isDone ? (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  Resolved / Done
                                </span>
                              ) : (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock className="w-3 h-3 animate-spin duration-1000" />
                                  Pending Action
                                </span>
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                Family member of: <span className="text-blue-800 font-extrabold">{msg.patientName}</span>
                              </p>
                            </div>

                            <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-normal ${
                              isDone 
                                ? 'bg-slate-50 border-slate-100 text-slate-500 line-through decoration-slate-300' 
                                : 'bg-amber-50/30 border-amber-100/50 text-slate-700'
                            }`}>
                              "{msg.message}"
                            </div>
                          </div>

                          {/* Actions Panel */}
                          <div className="flex flex-row lg:flex-col justify-end items-center lg:items-end gap-3 flex-shrink-0 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                            
                            {/* Contact Details info card */}
                            <div className="hidden sm:block bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-left lg:text-right">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Family Contact</p>
                              <p className="text-xs font-bold text-slate-700 font-mono mt-0.5">{msg.patientPhone}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
                              {/* Call Family Button */}
                              <a 
                                href={`tel:${msg.patientPhone}`}
                                className="inline-flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call Family
                              </a>

                              {/* DONE / UNDONE Action Button */}
                              {isDone ? (
                                <button
                                  onClick={() => onUpdateFamilyMessageStatus(msg.id, 'undone')}
                                  className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer"
                                  title="Mark as Pending"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                                  Mark Undone
                                </button>
                              ) : (
                                <button
                                  onClick={() => onUpdateFamilyMessageStatus(msg.id, 'done')}
                                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-sm shadow-emerald-100 cursor-pointer"
                                  title="Mark as Handled"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  Mark Done
                                </button>
                              )}

                              {onDeleteFamilyMessage && (
                                <button 
                                  onClick={() => setDeleteDialog({
                                    isOpen: true,
                                    title: 'Delete Family Message',
                                    message: `Are you sure you want to permanently delete this message from the family member of "${msg.patientName}"?`,
                                    onConfirm: () => onDeleteFamilyMessage(msg.id)
                                  })}
                                  className="inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer"
                                  title="Delete Message"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })}

                  {familyMessagesList.filter((msg) => {
                    const status = msg.status || 'undone';
                    if (msgFilter === 'all') return true;
                    return status === msgFilter;
                  }).length === 0 && (
                    <div className="text-center py-16 text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-4">
                      <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm">No messages match the current status filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GALLERY MANAGER */}
          {activeSubTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Action card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-700" />
                    Public Gallery Manager
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add, edit, or remove photos and video embeds that are displayed to the public.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    resetGalleryForm();
                    setShowAddGalleryModal(true);
                  }}
                  className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  Add Gallery Item
                </button>
              </div>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItemsList.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-100 transition-all duration-200">
                    <div>
                      {/* Media preview */}
                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                        {item.type === 'photo' ? (
                          <img 
                            src={item.url} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-blue-950 text-white relative">
                            <Play className="w-10 h-10 text-blue-400 opacity-80 animate-pulse" />
                            <span className="text-[10px] font-mono mt-1 text-blue-200 truncate max-w-[80%]">YouTube Video Embed</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-white/10">
                          {item.category}
                        </span>
                        <span className="absolute top-2 right-2 bg-white/95 text-slate-800 text-[9px] font-bold px-2 py-1 rounded shadow">
                          {item.type === 'photo' ? 'Photo' : 'Video'}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-slate-400 font-mono font-bold">ID: {item.id}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{item.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">{item.description}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-5 pt-0 border-t border-slate-50 flex gap-2">
                      <button
                        onClick={() => handleStartEditGallery(item)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-700" />
                        Edit Details
                      </button>
                      <button
                        onClick={() => handleDeleteGalleryClick(item)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer border border-red-200/50"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {galleryItemsList.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                    <Eye className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-500 font-bold text-sm">No items in public gallery.</p>
                    <p className="text-slate-400 text-xs mt-1">Click the "Add Gallery Item" button to start populating your gallery.</p>
                  </div>
                )}
              </div>
            </div>
          )}





        </div>

        {/* MOBILE STICKY BOTTOM NAVIGATOR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-3.5 z-40 shadow-xl">
          <button 
            onClick={() => { setActiveSubTab('overview'); setSearchQuery(''); }}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeSubTab === 'overview' ? 'text-blue-900 font-bold' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px]">Dashboard</span>
          </button>

          <button 
            onClick={() => { setActiveSubTab('enquiries'); setSearchQuery(''); }}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeSubTab === 'enquiries' ? 'text-blue-900 font-bold' : 'text-slate-400'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[9px]">Enquiries</span>
          </button>

          <button 
            onClick={() => setShowAddPatientModal(true)}
            className="bg-blue-900 text-white p-2.5 rounded-full shadow-lg -mt-8 border-4 border-slate-50 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button 
            onClick={() => { setActiveSubTab('patients'); setSearchQuery(''); setSelectedWardFilter('All'); }}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeSubTab === 'patients' ? 'text-blue-900 font-bold' : 'text-slate-400'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[9px]">In Patients</span>
          </button>

          <button 
            onClick={() => { setActiveSubTab('messages'); setSearchQuery(''); }}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeSubTab === 'messages' ? 'text-blue-900 font-bold' : 'text-slate-400'}`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              {pendingMessagesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                  {pendingMessagesCount}
                </span>
              )}
            </div>
            <span className="text-[9px]">Messages</span>
          </button>

          <button 
            onClick={() => { setActiveSubTab('gallery'); setSearchQuery(''); }}
            className={`flex flex-col items-center gap-1 focus:outline-none cursor-pointer ${activeSubTab === 'gallery' ? 'text-blue-900 font-bold' : 'text-slate-400'}`}
          >
            <Eye className="w-5 h-5" />
            <span className="text-[9px]">Gallery</span>
          </button>

        </nav>

        {/* MODAL: ADD PATIENT INTAKE */}
        {showAddPatientModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] custom-scrollbar animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowAddPatientModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-display font-extrabold text-blue-900 mb-2">Patient Intake Registration</h3>
              <p className="text-xs text-slate-500 mb-6">Create a fresh inpatient medical file and configure security keys.</p>

              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Patient Name</label>
                  <input 
                    type="text"
                    required
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    placeholder="Enter patient full name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Patient Age</label>
                    <input 
                      type="number"
                      required
                      value={newPatientData.age}
                      onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                      placeholder="Years"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Intake Code (Phone)</label>
                    <input 
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={newPatientData.familyPhone}
                      onChange={(e) => setNewPatientData({ ...newPatientData, familyPhone: e.target.value })}
                      placeholder="10-digit family phone"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Addiction Type</label>
                    <select
                      required
                      value={newPatientData.addictionType}
                      onChange={(e) => setNewPatientData({ ...newPatientData, addictionType: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
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
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Milestone Status</label>
                    <select
                      value={newPatientData.status}
                      onChange={(e) => setNewPatientData({ ...newPatientData, status: e.target.value as Patient['status'] })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    >
                      <option value="Detoxing">Detoxing</option>
                      <option value="Recovering">Recovering</option>
                      <option value="Observation">Observation</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Patient Ward Section</label>
                    <select
                      value={newPatientData.ward}
                      onChange={(e) => setNewPatientData({ ...newPatientData, ward: e.target.value as Patient['ward'] })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 animate-in fade-in duration-150"
                    >
                      <option value="Normal">Normal Ward</option>
                      <option value="Premium">Premium Ward</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date of Admission</label>
                    <input 
                      type="date"
                      value={newPatientData.admitDateInput}
                      onChange={(e) => {
                        const dateVal = e.target.value;
                        const longStr = formatDateToLongString(dateVal);
                        const calculatedDays = getDaysAdmitted(longStr);
                        setNewPatientData({
                          ...newPatientData,
                          admitDateInput: dateVal,
                          admitDate: longStr,
                          daysAdmitted: String(calculatedDays)
                        });
                      }}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                    <p className="text-[10px] text-blue-700 font-semibold mt-1">
                      Calculated Duration: {getDaysAdmitted(newPatientData.admitDate)} Days
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Treatment Balance (₹)</label>
                    <input 
                      type="number"
                      value={newPatientData.balance}
                      onChange={(e) => setNewPatientData({ ...newPatientData, balance: e.target.value })}
                      placeholder="Balance in ₹"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowAddPatientModal(false)}
                    className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-bold text-xs hover:bg-blue-950 transition-all shadow-md shadow-blue-100"
                  >
                    Register Patient File
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT PATIENT RECORD */}
        {editingPatient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setEditingPatient(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-display font-extrabold text-blue-900 mb-2">Edit Patient: {editingPatient.name}</h3>
              <p className="text-xs text-slate-500 mb-6">Modify treatment parameters, update billing ledger, and progress markers.</p>

              <form onSubmit={handleUpdatePatientSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Current Milestone Status</label>
                    <select
                      value={editingPatient.status}
                      onChange={(e) => setEditingPatient({ ...editingPatient, status: e.target.value as Patient['status'] })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    >
                      <option value="Detoxing">Detoxing</option>
                      <option value="Recovering">Recovering</option>
                      <option value="Observation">Observation</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Date of Admission</label>
                    <input 
                      type="date"
                      value={formatDateToInput(editingPatient.admitDate)}
                      onChange={(e) => {
                        const dateVal = e.target.value;
                        const longStr = formatDateToLongString(dateVal);
                        const calculatedDays = getDaysAdmitted(longStr);
                        setEditingPatient({ 
                          ...editingPatient, 
                          admitDate: longStr, 
                          daysAdmitted: calculatedDays 
                        });
                      }}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                    <p className="text-[10px] text-blue-700 font-semibold mt-1">
                      Calculated Duration: {getDaysAdmitted(editingPatient.admitDate)} Days
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Ward Section</label>
                    <select
                      value={editingPatient.ward || 'Normal'}
                      onChange={(e) => setEditingPatient({ ...editingPatient, ward: e.target.value as Patient['ward'] })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    >
                      <option value="Normal">Normal Ward</option>
                      <option value="Premium">Premium Ward</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Ledger Balance (₹)</label>
                    <input 
                      type="number"
                      value={editingPatient.balance}
                      onChange={(e) => setEditingPatient({ ...editingPatient, balance: parseInt(e.target.value) || 0 })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Family Verification Phone</label>
                    <input 
                      type="text"
                      value={editingPatient.familyPhone}
                      onChange={(e) => setEditingPatient({ ...editingPatient, familyPhone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-700 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditingPatient(null)}
                    className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-bold text-xs hover:bg-blue-950 transition-all shadow-md shadow-blue-100"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
          {/* MODAL: PATIENTS WITH OUTSTANDING BALANCE */}
        {showBalanceModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] custom-scrollbar animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => {
                  setShowBalanceModal(false);
                  setEditingBalanceId(null);
                  setEditingLegacyId(null);
                  setShowAddLegacyForm(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full mb-2 inline-block">
                    Ledger Audit
                  </span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900">Patients & Legacy Outstanding Balance</h3>
                  <p className="text-xs text-slate-500 mt-1">Breakdown of all active inpatients and legacy admissions with pending dues.</p>
                </div>
                <div>
                  <button
                    onClick={() => setShowAddLegacyForm(!showAddLegacyForm)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Legacy Record</span>
                  </button>
                </div>
              </div>

              {/* Form to add legacy admission record */}
              {showAddLegacyForm && (
                <form onSubmit={handleAddLegacyRecord} className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3 animate-in slide-in-from-top-4 duration-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">New Legacy Record Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Patient Name</label>
                      <input 
                        type="text" 
                        required
                        value={newLegacyName}
                        onChange={(e) => setNewLegacyName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar (Offline)"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Batch Year / Period</label>
                      <input 
                        type="text" 
                        value={newLegacyYear}
                        onChange={(e) => setNewLegacyYear(e.target.value)}
                        placeholder="e.g. 2022-2023"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone / Contact</label>
                      <input 
                        type="text" 
                        value={newLegacyPhone}
                        onChange={(e) => setNewLegacyPhone(e.target.value)}
                        placeholder="e.g. 9876543210 / Offline"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pending Balance (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={newLegacyBalance}
                        onChange={(e) => setNewLegacyBalance(e.target.value)}
                        placeholder="e.g. 45000"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddLegacyForm(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Save Record
                    </button>
                  </div>
                </form>
              )}

              <div className="border border-slate-100 rounded-xl overflow-hidden mb-6 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Patient / ID / Batch</th>
                      <th className="px-4 py-3 hidden sm:table-cell">Addiction Path</th>
                      <th className="px-4 py-3 hidden sm:table-cell">Contact Info</th>
                      <th className="px-4 py-3 hidden sm:table-cell text-center">Type</th>
                      <th className="px-4 py-3 text-right">Pending Dues (Click Edit to Update)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    
                    {/* Active Inpatients with Dues */}
                    {patientsList.filter(p => p.balance > 0).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                              {p.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-slate-600">
                          {p.addictionType}
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell font-mono text-slate-600 font-medium">
                          {p.familyPhone || 'N/A'}
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-center">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">
                            Active Inpatient
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-slate-900 font-mono">
                          {editingBalanceId === p.id ? (
                            <div className="flex items-center gap-1.5 justify-end">
                              <span className="text-slate-400">₹</span>
                              <input 
                                type="number"
                                value={editBalanceValue}
                                onChange={(e) => setEditBalanceValue(e.target.value)}
                                className="w-24 px-2 py-1 text-right text-xs font-mono font-bold bg-white border border-teal-500 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                                autoFocus
                              />
                              <button 
                                onClick={() => handleUpdatePatientBalance(p, editBalanceValue)}
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => setEditingBalanceId(null)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2 group">
                              <span>₹ {p.balance.toLocaleString()}</span>
                              <button 
                                onClick={() => {
                                  setEditingBalanceId(p.id);
                                  setEditBalanceValue(p.balance.toString());
                                }}
                                className="p-1 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Update Balance"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              {onDeletePatient && (
                                <button 
                                  onClick={() => onDeletePatient(p.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  title="Delete Patient Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {/* Legacy Admissions Records */}
                    {legacyRecords.map((rec) => (
                      <tr key={rec.id} className="bg-slate-50/40 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                              LA
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{rec.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{rec.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-slate-500 italic">
                          Legacy Admission
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell font-mono text-slate-500">
                          {rec.phone || 'N/A'}
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-center">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 uppercase tracking-wider">
                            Legacy Record
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-slate-900 font-mono">
                          {editingLegacyId === rec.id ? (
                            <div className="flex items-center gap-1.5 justify-end">
                              <span className="text-slate-400">₹</span>
                              <input 
                                type="number"
                                value={editLegacyValue}
                                onChange={(e) => setEditLegacyValue(e.target.value)}
                                className="w-24 px-2 py-1 text-right text-xs font-mono font-bold bg-white border border-teal-500 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                                autoFocus
                              />
                              <button 
                                onClick={() => handleUpdateLegacyBalance(rec.id, editLegacyValue)}
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Save"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => setEditingLegacyId(null)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-slate-600">₹ {rec.balance.toLocaleString()}</span>
                              <button 
                                onClick={() => {
                                  setEditingLegacyId(rec.id);
                                  setEditLegacyValue(rec.balance.toString());
                                }}
                                className="p-1 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Update Legacy Balance"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteLegacyRecord(rec.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="Delete Legacy Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {patientsList.filter(p => p.balance > 0).length === 0 && legacyRecords.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-slate-400 font-semibold italic">
                          All patient and legacy balances are fully cleared!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">Grand Total Outstanding</span>
                <span className="text-sm font-extrabold text-red-700 font-mono">₹ {totalPending.toLocaleString()}</span>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => {
                    setShowBalanceModal(false);
                    setEditingBalanceId(null);
                    setEditingLegacyId(null);
                    setShowAddLegacyForm(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Close Ledger Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD GALLERY ITEM */}
        {showAddGalleryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] custom-scrollbar animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowAddGalleryModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-display font-extrabold text-blue-900 mb-2">Add Public Gallery Item</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Publish a new photo or video for de-addiction awareness and center tour.</p>

              <form onSubmit={handleCreateGalleryItem} className="space-y-4">
                {/* Media Type */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Media Type</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => { setGalleryFormType('photo'); setGalleryFormUrl(''); }}
                      className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${galleryFormType === 'photo' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Photo File
                    </button>
                    <button
                      type="button"
                      onClick={() => { setGalleryFormType('video'); setGalleryFormUrl(''); }}
                      className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${galleryFormType === 'video' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      YouTube Video Embed
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Item Title</label>
                  <input 
                    type="text"
                    required
                    value={galleryFormTitle}
                    onChange={(e) => setGalleryFormTitle(e.target.value)}
                    placeholder="e.g., Clinical Therapy Session Room"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                {/* Category Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                    <select
                      value={galleryFormCategory}
                      onChange={(e) => setGalleryFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800 font-medium"
                    >
                      <option value="Facility">Facility</option>
                      <option value="Activities">Activities</option>
                      <option value="Counseling">Counseling</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Custom">Custom / Add New...</option>
                    </select>
                  </div>

                  {galleryFormCategory === 'Custom' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Custom Category Name</label>
                      <input 
                        type="text"
                        required
                        value={galleryFormCustomCategory}
                        onChange={(e) => setGalleryFormCustomCategory(e.target.value)}
                        placeholder="e.g., Outdoor Sports"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Short Description</label>
                  <textarea 
                    rows={2}
                    value={galleryFormDescription}
                    onChange={(e) => setGalleryFormDescription(e.target.value)}
                    placeholder="Provide context or therapeutic goals of this visual..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Media Link / Upload File */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    {galleryFormType === 'photo' ? 'Photo Source (Select File or enter URL)' : 'YouTube Video Link / ID'}
                  </label>
                  
                  {galleryFormType === 'photo' ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={galleryFormUrl.startsWith('data:') ? '' : galleryFormUrl}
                          onChange={(e) => setGalleryFormUrl(e.target.value)}
                          placeholder="Paste image URL or choose local file below"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800 truncate"
                        />
                      </div>
                      
                      {/* Local File Selector converting to Base64 */}
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {galleryFormUrl.startsWith('data:') ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Local Image Selected ({Math.round(galleryFormUrl.length / 1024)} KB)</span>
                          </div>
                        ) : isUploading ? (
                          <span className="text-xs text-blue-600 animate-pulse font-bold">Encoding file...</span>
                        ) : (
                          <div className="text-slate-400">
                            <p className="text-xs font-bold text-slate-700">Choose Local Photo</p>
                            <p className="text-[10px] mt-0.5">Drag &amp; drop or click to upload</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="text"
                        required
                        value={galleryFormUrl}
                        onChange={(e) => setGalleryFormUrl(e.target.value)}
                        placeholder="Paste YouTube video link (e.g., https://www.youtube.com/watch?v=coN_CunU310)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800"
                      />
                      <p className="text-[10px] text-slate-400 font-medium mt-1">We support full YouTube URLs, watch?v= format, and share links.</p>
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddGalleryModal(false); resetGalleryForm(); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-blue-900 hover:bg-blue-950 text-white py-3 rounded-xl font-bold transition-all text-xs cursor-pointer disabled:opacity-50"
                  >
                    Publish Visual
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT GALLERY ITEM */}
        {editingGalleryItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] custom-scrollbar animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setEditingGalleryItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-display font-extrabold text-blue-900 mb-2">Edit Gallery Item Details</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Update the visual attributes, category tags, or caption text for this gallery item.</p>

              <form onSubmit={handleUpdateGallerySubmit} className="space-y-4">
                {/* Media Type */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Media Type</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => { setGalleryFormType('photo'); setGalleryFormUrl(''); }}
                      className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${galleryFormType === 'photo' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Photo File
                    </button>
                    <button
                      type="button"
                      onClick={() => { setGalleryFormType('video'); setGalleryFormUrl(''); }}
                      className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all cursor-pointer ${galleryFormType === 'video' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      YouTube Video Embed
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Item Title</label>
                  <input 
                    type="text"
                    required
                    value={galleryFormTitle}
                    onChange={(e) => setGalleryFormTitle(e.target.value)}
                    placeholder="e.g., Clinical Therapy Session Room"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                {/* Category Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                    <select
                      value={galleryFormCategory}
                      onChange={(e) => setGalleryFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800 font-medium"
                    >
                      <option value="Facility">Facility</option>
                      <option value="Activities">Activities</option>
                      <option value="Counseling">Counseling</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Custom">Custom / Add New...</option>
                    </select>
                  </div>

                  {galleryFormCategory === 'Custom' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Custom Category Name</label>
                      <input 
                        type="text"
                        required
                        value={galleryFormCustomCategory}
                        onChange={(e) => setGalleryFormCustomCategory(e.target.value)}
                        placeholder="e.g., Outdoor Sports"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Short Description</label>
                  <textarea 
                    rows={2}
                    value={galleryFormDescription}
                    onChange={(e) => setGalleryFormDescription(e.target.value)}
                    placeholder="Provide context or therapeutic goals of this visual..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Media Link / Upload File */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    {galleryFormType === 'photo' ? 'Photo Source (Select File or enter URL)' : 'YouTube Video Link / ID'}
                  </label>
                  
                  {galleryFormType === 'photo' ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={galleryFormUrl.startsWith('data:') ? '' : galleryFormUrl}
                          onChange={(e) => setGalleryFormUrl(e.target.value)}
                          placeholder="Paste image URL or choose local file below"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800 truncate"
                        />
                      </div>
                      
                      {/* Local File Selector converting to Base64 */}
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {galleryFormUrl.startsWith('data:') ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Local Image Selected ({Math.round(galleryFormUrl.length / 1024)} KB)</span>
                          </div>
                        ) : isUploading ? (
                          <span className="text-xs text-blue-600 animate-pulse font-bold">Encoding file...</span>
                        ) : (
                          <div className="text-slate-400">
                            <p className="text-xs font-bold text-slate-700">Choose Local Photo</p>
                            <p className="text-[10px] mt-0.5">Drag &amp; drop or click to replace current photo</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="text"
                        required
                        value={galleryFormUrl}
                        onChange={(e) => setGalleryFormUrl(e.target.value)}
                        placeholder="Paste YouTube video link (e.g., https://www.youtube.com/watch?v=coN_CunU310)"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-700 bg-slate-50 focus:bg-white transition-all text-slate-800"
                      />
                      <p className="text-[10px] text-slate-400 font-medium mt-1">We support full YouTube URLs, watch?v= format, and share links.</p>
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setEditingGalleryItem(null); resetGalleryForm(); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-blue-900 hover:bg-blue-950 text-white py-3 rounded-xl font-bold transition-all text-xs cursor-pointer disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CONFIRMATION */}
        {galleryItemToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setGalleryItemToDelete(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-100">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-extrabold text-slate-900">Delete Gallery Item</h3>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-slate-900 font-bold">"{galleryItemToDelete.title}"</strong> from the public gallery?
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  This action cannot be undone and the visual will immediately be removed from the front-end.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGalleryItemToDelete(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-xs cursor-pointer"
                >
                  Cancel, Keep It
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteGallery}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-md shadow-red-100"
                >
                  Yes, Delete Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM IN-APP DELETE CONFIRMATION DIALOG (IFRAME-SAFE) */}
        {deleteDialog.isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4 text-rose-600">
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-extrabold text-slate-900">{deleteDialog.title}</h3>
              </div>

              <div className="space-y-3 mb-6 text-left">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {deleteDialog.message}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  This action is irreversible and will permanently delete the record from Firebase Firestore.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteDialog.onConfirm();
                    setDeleteDialog({ ...deleteDialog, isOpen: false });
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-md shadow-rose-100"
                >
                  Yes, Delete Record
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
