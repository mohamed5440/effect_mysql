export interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  expertise: string;
  experience: string;
  portfolio: string;
  skills: string;
  min_rate: number;
  max_rate: number;
  bio: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  created_at: string;
}

export interface Contact {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
}
