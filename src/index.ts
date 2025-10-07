// Main exports for the booking app
export { AppNavigator } from './navigations/AppNavigator';
export { HomeScreen } from './screens/HomeScreen';
export { BookingDetailScreen } from './screens/BookingDetailScreen';
export { BookingFormScreen } from './screens/BookingFormScreen';
export { BookingCard } from './components/BookingCard';
export { ServiceCard } from './components/ServiceCard';

// Types
export type { Booking, Service, BookingFormData, BookingFilters } from './types/booking';

// Data
export { services } from './data/services';
export { mockBookings } from './data/mockBookings';

// Utils
export {
  formatDate,
  formatTime,
  formatCurrency,
  getStatusColor,
  getStatusText,
  generateTimeSlots,
  filterBookings,
  sortBookingsByDate,
} from './utils/bookingUtils';

// Style
export { colors } from './style/colors';
export { typography } from './style/typography';
export { spacing, borderRadius, shadows } from './style/spacing';
