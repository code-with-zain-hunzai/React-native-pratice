import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { Booking, Service, BookingFormData } from '../types/booking';
import { services } from '../data/services';
import { generateTimeSlots } from '../utils/bookingUtils';
import { ServiceCard } from '../components/ServiceCard';

interface BookingFormScreenProps {
  booking?: Booking;
  onSave: (bookingData: BookingFormData) => void;
  onCancel: () => void;
}

export const BookingFormScreen: React.FC<BookingFormScreenProps> = ({
  booking,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    notes: '',
  });
  
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState(generateTimeSlots());

  useEffect(() => {
    if (booking) {
      setFormData({
        serviceId: booking.serviceId,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        date: booking.date,
        time: booking.time,
        notes: booking.notes || '',
      });
    }
  }, [booking]);

  const selectedService = services.find(s => s.id === formData.serviceId);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceSelect = (service: Service) => {
    setFormData(prev => ({ ...prev, serviceId: service.id }));
    setShowServiceModal(false);
  };

  const handleDateSelect = (date: string) => {
    setFormData(prev => ({ ...prev, date }));
    setShowDateModal(false);
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
    setShowTimeModal(false);
  };

  const validateForm = (): boolean => {
    if (!formData.serviceId) {
      Alert.alert('Error', 'Please select a service');
      return false;
    }
    if (!formData.customerName.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return false;
    }
    if (!formData.customerEmail.trim()) {
      Alert.alert('Error', 'Please enter customer email');
      return false;
    }
    if (!formData.customerPhone.trim()) {
      Alert.alert('Error', 'Please enter customer phone');
      return false;
    }
    if (!formData.date) {
      Alert.alert('Error', 'Please select a date');
      return false;
    }
    if (!formData.time) {
      Alert.alert('Error', 'Please select a time');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {booking ? 'Edit Booking' : 'New Booking'}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setShowServiceModal(true)}
          >
            <Text style={selectedService ? styles.selectorButtonText : styles.selectorButtonPlaceholder}>
              {selectedService ? selectedService.name : 'Choose a service...'}
            </Text>
            <Text style={styles.selectorArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.customerName}
              onChangeText={(value) => handleInputChange('customerName', value)}
              placeholder="Enter customer name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.customerEmail}
              onChangeText={(value) => handleInputChange('customerEmail', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.customerPhone}
              onChangeText={(value) => handleInputChange('customerPhone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date *</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowDateModal(true)}
            >
              <Text style={formData.date ? styles.selectorButtonText : styles.selectorButtonPlaceholder}>
                {formData.date ? formatDateForDisplay(formData.date) : 'Select date...'}
              </Text>
              <Text style={styles.selectorArrow}>›</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Time *</Text>
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowTimeModal(true)}
            >
              <Text style={formData.time ? styles.selectorButtonText : styles.selectorButtonPlaceholder}>
                {formData.time ? formData.time : 'Select time...'}
              </Text>
              <Text style={styles.selectorArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Any special requests or notes..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Service Selection Modal */}
      <Modal visible={showServiceModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Service</Text>
            <TouchableOpacity onPress={() => setShowServiceModal(false)}>
              <Text style={styles.modalCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleServiceSelect}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Date Selection Modal */}
      <Modal visible={showDateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity onPress={() => setShowDateModal(false)}>
              <Text style={styles.modalCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {generateDates().map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateOption,
                  formData.date === date && styles.selectedOption,
                ]}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={[
                  styles.dateOptionText,
                  formData.date === date && styles.selectedOptionText,
                ]}>
                  {formatDateForDisplay(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Time Selection Modal */}
      <Modal visible={showTimeModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <TouchableOpacity onPress={() => setShowTimeModal(false)}>
              <Text style={styles.modalCloseButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {availableTimeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeOption,
                  formData.time === slot.time && styles.selectedOption,
                  !slot.available && styles.disabledOption,
                ]}
                onPress={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
              >
                <Text style={[
                  styles.timeOptionText,
                  formData.time === slot.time && styles.selectedOptionText,
                  !slot.available && styles.disabledOptionText,
                ]}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelButton: {
    paddingVertical: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    paddingVertical: 4,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  notesInput: {
    height: 100,
  },
  selectorButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectorButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectorButtonPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  selectorArrow: {
    fontSize: 20,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  dateOption: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  timeOption: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  disabledOption: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  disabledOptionText: {
    color: '#999',
  },
});
