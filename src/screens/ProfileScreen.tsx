import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native"
import { colors } from "../style/colors"
import { spacing, borderRadius, shadows } from "../style/spacing"
import { typography } from "../style/typography"
import { useAuth } from "../contexts/AuthContext"
import Toast from 'react-native-toast-message'

const menuItems = [
  {
    id: "1",
    title: "Edit Profile",
    icon: "👤",
    action: "editProfile",
  },
  {
    id: "2",
    title: "Payment Methods",
    icon: "💳",
    action: "payment",
  },
  {
    id: "3",
    title: "Booking History",
    icon: "📋",
    action: "history",
  },
  {
    id: "4",
    title: "Notifications",
    icon: "🔔",
    action: "notifications",
    hasToggle: true,
  },
  {
    id: "5",
    title: "Settings",
    icon: "⚙️",
    action: "settings",
  },
  {
    id: "6",
    title: "Help & Support",
    icon: "❓",
    action: "support",
  },
  {
    id: "7",
    title: "About",
    icon: "ℹ️",
    action: "about",
  },
]

interface ProfileScreenProps {
  onMenuItemPress?: (action: string) => void
  onLogout?: () => void
  onNavigateToHome?: () => void
  onNavigateToTrip?: () => void
  onNavigateToWishlist?: () => void
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onMenuItemPress,
  onLogout,
  onNavigateToHome,
  onNavigateToTrip,
  onNavigateToWishlist,
}) => {
  const { user, refreshUser, signOut } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)

  // Refresh user data when component mounts
  React.useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const handleMenuItemPress = (action: string) => {
    switch (action) {
      case 'editProfile':
        Alert.alert('Edit Profile', 'Edit profile functionality coming soon!')
        break
      case 'payment':
        Alert.alert('Payment Methods', 'Payment methods functionality coming soon!')
        break
      case 'history':
        onNavigateToTrip?.()
        break
      case 'notifications':
        // Toggle is handled by the switch
        break
      case 'settings':
        Alert.alert('Settings', 'Settings functionality coming soon!')
        break
      case 'support':
        Alert.alert('Help & Support', 'Support functionality coming soon!')
        break
      case 'about':
        Alert.alert('About', 'Kekar App v1.0.0\nYour travel companion!')
        break
      default:
        onMenuItemPress?.(action)
    }
  }

  const handleMenuButtonPress = () => {
    Alert.alert(
      'Navigation',
      'Where would you like to go?',
      [
        { text: 'Home', onPress: onNavigateToHome },
        { text: 'Trips', onPress: onNavigateToTrip },
        { text: 'Wishlist', onPress: onNavigateToWishlist },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut()
              Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been successfully logged out.',
                position: 'top',
              })
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: error?.message || 'An error occurred while logging out.',
                position: 'top',
              })
            }
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuButtonPress}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: user?.avatar_url || "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>
            {user?.full_name || user?.username || 'User'}
          </Text>
          <Text style={styles.profileEmail}>
            {user?.email || 'user@example.com'}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.action)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIconContainer}>
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              {item.hasToggle ? (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.surface}
                />
              ) : (
                <Text style={styles.menuItemArrow}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...shadows.small,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: "space-between",
  },
  menuLine: {
    width: 24,
    height: 2.5,
    backgroundColor: colors.text.primary,
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl + 60,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    ...shadows.medium,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  menuSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.medium,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuItemIcon: {
    fontSize: 20,
  },
  menuItemTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: "600",
  },
  menuItemArrow: {
    fontSize: 28,
    color: colors.text.hint,
    fontWeight: "300",
  },
  logoutButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.error,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    ...shadows.small,
  },
  logoutText: {
    ...typography.button,
    color: colors.error,
    fontSize: 16,
  },
  versionText: {
    ...typography.caption,
    color: colors.text.hint,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
})

