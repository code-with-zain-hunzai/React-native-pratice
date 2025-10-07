import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Booking } from '../types/booking';
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusText } from '../utils/bookingUtils';

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
  onStatusChange?: (bookingId: string, newStatus: Booking['status']) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  onStatusChange,
}) => {
  const handleStatusChange = (newStatus: Booking['status']) => {
    Alert.alert(
      'Change Status',
      `Are you sure you want to change this booking to ${getStatusText(newStatus).toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => onStatusChange?.(booking.id, newStatus),
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(booking)}>
      <View style={styles.header}>
        <Text style={styles.serviceName}>{booking.service.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>
      
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{booking.customerName}</Text>
        <Text style={styles.customerContact}>{booking.customerEmail}</Text>
        <Text style={styles.customerContact}>{booking.customerPhone}</Text>
      </View>
      
      <View style={styles.bookingDetails}>
        <Text style={styles.dateTime}>
          {formatDate(booking.date)} at {formatTime(booking.time)}
        </Text>
        <Text style={styles.duration}>
          Duration: {booking.service.duration} minutes
        </Text>
        <Text style={styles.price}>{formatCurrency(booking.service.price)}</Text>
      </View>
      
      {booking.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notes}>{booking.notes}</Text>
        </View>
      )}
      
      {booking.status === 'pending' && onStatusChange && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusChange('confirmed')}
          >
            <Text style={styles.actionButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleStatusChange('cancelled')}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {booking.status === 'confirmed' && onStatusChange && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleStatusChange('completed')}
          >
            <Text style={styles.actionButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTime: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  notesContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  completeButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
