import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Booking, BookingFormData } from '../types/booking';
import { HomeScreen } from '../screens/HomeScreen';
import { BookingDetailScreen } from '../screens/BookingDetailScreen';
import { BookingFormScreen } from '../screens/BookingFormScreen';

export type AppScreen = 'home' | 'bookingDetail' | 'bookingForm';

export interface AppNavigatorProps {}

export const AppNavigator: React.FC<AppNavigatorProps> = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();

  const navigateToHome = () => {
    setCurrentScreen('home');
    setSelectedBooking(undefined);
  };

  const navigateToBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setCurrentScreen('bookingDetail');
  };

  const navigateToBookingForm = (booking?: Booking) => {
    setSelectedBooking(booking);
    setCurrentScreen('bookingForm');
  };

  const handleBookingSave = (bookingData: BookingFormData) => {
    // In a real app, this would save to backend
    console.log('Saving booking:', bookingData);
    Alert.alert('Success', 'Booking saved successfully!', [
      { text: 'OK', onPress: navigateToHome }
    ]);
  };

  const handleBookingStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    // In a real app, this would update the backend
    console.log(`Changing booking ${bookingId} status to ${newStatus}`);
    Alert.alert('Success', 'Booking status updated successfully!');
  };

  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen
          onBookingPress={navigateToBookingDetail}
          onCreateBooking={() => navigateToBookingForm()}
        />
      );

    case 'bookingDetail':
      if (!selectedBooking) {
        navigateToHome();
        return null;
      }
      return (
        <BookingDetailScreen
          booking={selectedBooking}
          onBack={navigateToHome}
          onEdit={navigateToBookingForm}
          onStatusChange={handleBookingStatusChange}
        />
      );

    case 'bookingForm':
      return (
        <BookingFormScreen
          booking={selectedBooking}
          onSave={handleBookingSave}
          onCancel={navigateToHome}
        />
      );

    default:
      navigateToHome();
      return null;
  }
};
