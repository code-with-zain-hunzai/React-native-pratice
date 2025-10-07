export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  image?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  service: Service;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  notes?: string;
}

export interface BookingFilters {
  status?: Booking['status'];
  date?: string;
  serviceId?: string;
}
