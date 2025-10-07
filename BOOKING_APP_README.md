# Kekar Booking App

A comprehensive booking management system built with React Native for service providers.

## Features

### 🏠 Home Screen
- View all bookings with filtering by status (All, Pending, Confirmed, Completed, Cancelled)
- Real-time statistics showing total bookings and status counts
- Quick action buttons to create new bookings
- Beautiful card-based layout for easy browsing

### 📋 Booking Management
- **Create New Bookings**: Complete form with service selection, customer details, date/time picker
- **Edit Existing Bookings**: Modify any booking details
- **Status Management**: Update booking status with confirmation dialogs
- **Booking Details**: Comprehensive view of all booking information

### 🛠 Service Management
- Pre-configured services with categories, pricing, and duration
- Service categories: Hair, Beard, Eyebrows, Package
- Easy service selection with modal picker

### 📱 User Experience
- Modern, intuitive UI design
- Smooth navigation between screens
- Form validation with helpful error messages
- Status-based color coding for easy identification
- Responsive design for different screen sizes

## App Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookingCard.tsx     # Individual booking display
│   └── ServiceCard.tsx     # Service selection display
├── data/               # Mock data and services
│   ├── services.ts         # Available services
│   └── mockBookings.ts     # Sample booking data
├── navigations/        # App navigation logic
│   └── AppNavigator.tsx    # Main navigation controller
├── screens/           # Main app screens
│   ├── HomeScreen.tsx      # Booking list and dashboard
│   ├── BookingDetailScreen.tsx  # Detailed booking view
│   └── BookingFormScreen.tsx    # Create/edit bookings
├── style/            # Design system
│   ├── colors.ts         # Color palette
│   ├── typography.ts     # Text styles
│   └── spacing.ts        # Spacing and shadows
├── types/            # TypeScript definitions
│   └── booking.ts        # Booking-related types
└── utils/            # Helper functions
    └── bookingUtils.ts   # Booking utilities and formatters
```

## Key Components

### BookingCard
- Displays booking information in a clean card format
- Shows customer details, service info, date/time, and status
- Includes action buttons for status changes
- Color-coded status badges

### ServiceCard
- Service selection component
- Shows service name, description, price, duration, and category
- Used in service selection modal

### HomeScreen
- Main dashboard with booking statistics
- Filterable booking list
- Quick access to create new bookings

### BookingDetailScreen
- Comprehensive booking information display
- Status management actions
- Edit booking functionality

### BookingFormScreen
- Complete booking creation/editing form
- Service selection with modal picker
- Date and time selection
- Form validation

## Data Models

### Booking
```typescript
interface Booking {
  id: string;
  serviceId: string;
  service: Service;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Service
```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  image?: string;
}
```

## Usage

1. **View Bookings**: The home screen shows all bookings with filtering options
2. **Create Booking**: Tap "New Booking" to create a new appointment
3. **Edit Booking**: Tap on any booking card to view details and edit
4. **Manage Status**: Use action buttons to update booking status
5. **Filter Bookings**: Use the filter buttons to view specific status types

## Future Enhancements

- Backend integration with REST API
- User authentication and authorization
- Push notifications for booking updates
- Calendar integration
- Payment processing
- Customer management system
- Reporting and analytics
- Multi-language support

## Getting Started

1. Install dependencies: `npm install`
2. Run on Android: `npm run android`
3. Run on iOS: `npm run ios`
4. Start Metro bundler: `npm start`

The app is ready to use with mock data and can be easily extended with real backend integration.
