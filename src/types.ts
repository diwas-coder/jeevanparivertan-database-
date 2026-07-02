export type Screen = 'HOME' | 'SERVICES' | 'ABOUT' | 'CONTACT' | 'REQUEST_CALL' | 'LOGIN' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD' | 'FAMILY_PORTAL' | 'GALLERY';

export interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  url: string; // Unsplash URL or YouTube video ID / URL
  title: string;
  description: string;
  category: string; // e.g., 'Facility' | 'Activities' | 'Counseling' | 'Yoga'
  date: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  age: number;
  addictionType: string;
  status: 'Followed Up' | 'Urgent' | 'New';
  date: string;
  message: string;
}

export interface Patient {
  id: string; // e.g., JP-2024-089
  name: string;
  age: number;
  addictionType: string;
  status: 'Recovering' | 'Detoxing' | 'Observation' | 'Completed';
  daysAdmitted: number;
  admitDate: string;
  balance: number;
  familyPhone: string; // Used for family portal log-in match
  ward: 'Premium' | 'Normal';
}

export interface Appointment {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface SessionLog {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'interaction' | 'evaluation' | 'therapy';
}

export interface Notice {
  id: string;
  priority: 'high' | 'normal';
  title: string;
  content: string;
  author: string;
}

export interface FamilyMessage {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  message: string;
  date: string;
  status?: 'done' | 'undone';
}

