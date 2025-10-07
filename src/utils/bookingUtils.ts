import { Booking, TimeSlot, BookingFilters } from '../types/booking';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getStatusColor = (status: Booking['status']): string => {
  switch (status) {
    case 'pending':
      return '#FFA500';
    case 'confirmed':
      return '#4CAF50';
    case 'completed':
      return '#2196F3';
    case 'cancelled':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

export const getStatusText = (status: Booking['status']): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const generateTimeSlots = (startHour: number = 9, endHour: number = 18): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time: timeString,
        available: true, // In a real app, this would check against existing bookings
      });
    }
  }
  return slots;
};

export const filterBookings = (bookings: Booking[], filters: BookingFilters): Booking[] => {
  return bookings.filter((booking) => {
    if (filters.status && booking.status !== filters.status) {
      return false;
    }
    if (filters.date && booking.date !== filters.date) {
      return false;
    }
    if (filters.serviceId && booking.serviceId !== filters.serviceId) {
      return false;
    }
    return true;
  });
};

export const sortBookingsByDate = (bookings: Booking[]): Booking[] => {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
};
