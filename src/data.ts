import { Enquiry, Patient, Appointment, SessionLog, Notice, FamilyMessage, GalleryItem } from './types';

export const initialEnquiries: Enquiry[] = [
  {
    id: 'ENQ-001',
    name: 'Rahul Kumar',
    phone: '9876543210',
    age: 26,
    addictionType: 'Alcohol De-addiction',
    status: 'Followed Up',
    date: '2026-06-28',
    message: 'Needs immediate admission consultation.',
  },
  {
    id: 'ENQ-002',
    name: 'Amit Singh',
    phone: '8765432109',
    age: 32,
    addictionType: 'Drug Addiction',
    status: 'Urgent',
    date: '2026-06-29',
    message: 'Severe heroin dependency, family wants a call ASAP.',
  },
  {
    id: 'ENQ-003',
    name: 'Priya Sharma',
    phone: '7654321098',
    age: 24,
    addictionType: 'Other',
    status: 'New',
    date: '2026-06-30',
    message: 'Inquiring about family counseling sessions and pricing.',
  },
];

export const initialPatients: Patient[] = [
  {
    id: 'JP-2024-089',
    name: 'Rahul Sharma',
    age: 28,
    addictionType: 'Alcohol & Substance',
    status: 'Recovering',
    daysAdmitted: 42,
    admitDate: 'October 14, 2025',
    balance: 14500,
    familyPhone: '9876543210',
    ward: 'Premium',
  },
  {
    id: 'JP-2024-112',
    name: 'Vikram Singh',
    age: 35,
    addictionType: 'Opioids & Meds',
    status: 'Detoxing',
    daysAdmitted: 12,
    admitDate: 'November 18, 2025',
    balance: 28000,
    familyPhone: '9988776655',
    ward: 'Normal',
  },
  {
    id: 'JP-2024-054',
    name: 'Arjun Verma',
    age: 41,
    addictionType: 'Tobacco & Gutkha',
    status: 'Completed',
    daysAdmitted: 60,
    admitDate: 'September 01, 2025',
    balance: 0,
    familyPhone: '8877665544',
    ward: 'Normal',
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'APP-001',
    time: '10:00 AM',
    title: 'Dr. Verma - Counseling',
    description: 'Patient ID: #JP-2024-089',
  },
  {
    id: 'APP-002',
    time: '12:00 PM',
    title: 'Group Therapy Session',
    description: 'Main Hall - Block B',
  },
  {
    id: 'APP-003',
    time: '02:00 PM',
    title: 'Yoga & Meditation',
    description: 'Zen Garden Area',
  },
];

export const initialSessionLogs: SessionLog[] = [
  {
    id: 'LOG-001',
    title: 'Family Interaction Day',
    date: 'Nov 20, 2025',
    description: 'The patient showed positive emotional response during the 30-minute supervised video call. Encouraged by family participation.',
    type: 'interaction',
  },
  {
    id: 'LOG-002',
    title: 'Psychiatric Evaluation',
    date: 'Nov 18, 2025',
    description: 'Routine check-up completed. Medication dosage adjusted. Patient is exhibiting improved sleep patterns and cognitive clarity.',
    type: 'evaluation',
  },
  {
    id: 'LOG-003',
    title: 'Group Therapy Session',
    date: 'Nov 15, 2025',
    description: 'Actively participated in "Peer-Support Circle". Expressed desire for long-term sobriety goals.',
    type: 'therapy',
  },
];

export const initialNotices: Notice[] = [
  {
    id: 'NOT-001',
    priority: 'high',
    title: 'High Priority Notice',
    content: 'Ward 4 HVAC system needs maintenance by evening.',
    author: 'Facility Manager',
  },
  {
    id: 'NOT-002',
    priority: 'normal',
    title: 'Staff Meeting',
    content: 'General staff briefing at 4:30 PM in the main hall.',
    author: 'Clinical Director',
  },
  {
    id: 'NOT-003',
    priority: 'normal',
    title: 'Family Counseling Notice',
    content: 'Family counseling session is scheduled for this Sunday at 10:00 AM. Please confirm your attendance.',
    author: 'Dr. Mehta, Chief Psychiatrist',
  },
];

export const initialFamilyMessages: FamilyMessage[] = [
  {
    id: 'MSG-001',
    patientId: 'JP-2024-001',
    patientName: 'Rahul Verma',
    patientPhone: '9876543210',
    message: 'We are very happy to hear that Rahul is showing great recovery. Please let us know if we can bring any personal items for him this Sunday.',
    date: 'Jun 29, 2026',
    status: 'undone',
  },
  {
    id: 'MSG-002',
    patientId: 'JP-2024-002',
    patientName: 'Karan Malhotra',
    patientPhone: '8765432109',
    message: 'Can you please confirm if the psychiatric evaluation reports are ready to view? Thank you so much for the care!',
    date: 'Jun 30, 2026',
    status: 'undone',
  },
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: 'GAL-001',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
    title: 'Director Dr. Jyoti Pal\'s Consultation Desk',
    description: 'Dr. Jyoti Pal conducting specialized clinical evaluations and patient counselings at her workspace.',
    category: 'Counseling',
    date: '2026-06-15'
  },
  {
    id: 'GAL-002',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop',
    title: 'Hygienic and Comfortable Lodging Ward',
    description: 'Fitted with cozy bedding and air filtering units to ensure stress-free and deep healing.',
    category: 'Facility',
    date: '2026-06-18'
  },
  {
    id: 'GAL-003',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
    title: 'Serene Aquarium Reception Lobby',
    description: 'A vibrant fish aquarium at our Mohanlalganj center to ease stress and create a tranquil entrance.',
    category: 'Facility',
    date: '2026-06-20'
  },
  {
    id: 'GAL-004',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
    title: 'Group De-addiction Class & Lecture',
    description: 'Recovering individuals attending our signature coping-skills workshop and peer support circles.',
    category: 'Activities',
    date: '2026-06-25'
  },
  {
    id: 'GAL-005',
    type: 'video',
    url: 'https://www.youtube.com/embed/coN_CunU310',
    title: 'Daily Yoga & Breathing Meditation Flow',
    description: 'A short guide showing the morning meditation routine performed in our outdoor green garden.',
    category: 'Yoga',
    date: '2026-06-27'
  },
  {
    id: 'GAL-006',
    type: 'video',
    url: 'https://www.youtube.com/embed/6m6SreS8x9M',
    title: 'Reclaiming Life: De-addiction Counseling Steps',
    description: 'Dr. Jyoti Pal explains the clinical process of safe physical detoxification and psychological therapy.',
    category: 'Counseling',
    date: '2026-06-29'
  }
];

