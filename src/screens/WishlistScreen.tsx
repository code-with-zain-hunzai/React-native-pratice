import React from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native"
import { colors } from "../style/colors"
import { spacing, borderRadius, shadows } from "../style/spacing"
import { typography } from "../style/typography"
import { useWishlist } from "../hooks/useWishlist"
import { Place } from "../data/places"
import { useAuth } from "../contexts/AuthContext"

interface WishlistScreenProps {
  onPlacePress?: (id: string) => void
  onNavigateToHome?: () => void
  onNavigateToProfile?: () => void
  onNavigateToTrip?: () => void
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  onPlacePress,
  onNavigateToHome,
  onNavigateToProfile,
  onNavigateToTrip,
}) => {
  const { wishlistItems, isInWishlist, toggleWishlist } = useWishlist()
  const { user } = useAuth()

  const handleMenuButtonPress = () => {
    Alert.alert(
      'Navigation',
      'Where would you like to go?',
      [
        { text: 'Home', onPress: onNavigateToHome },
        { text: 'Profile', onPress: onNavigateToProfile },
        { text: 'Trips', onPress: onNavigateToTrip },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  const handleProfileButtonPress = () => {
    onNavigateToProfile?.()
  }

  const handlePlacePress = (id: string) => {
    Alert.alert(
      'Place Details',
      `Place ${id} details coming soon!`,
      [
        { text: 'OK' },
        { text: 'Book Now', onPress: () => console.log('Book place:', id) },
      ]
    )
    onPlacePress?.(id)
  }

  const handleToggleFavorite = async (place: Place) => {
    await toggleWishlist(place)
  }

  const renderWishlistItem = (item: Place) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.wishlistCard}
        onPress={() => handlePlacePress(item.id)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.wishlistImage}
        />
        <View style={styles.wishlistContent}>
          <View style={styles.wishlistHeader}>
            <Text style={styles.wishlistName}>
              {item.name}
            </Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleToggleFavorite(item)}
            >
              <View style={styles.favoriteCircle}>
                <Text style={styles.favoriteIcon}>
                  {isInWishlist(item.id) ? "❤️" : "🤍"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.wishlistDescription}>
            {item.description}
          </Text>
          <View style={styles.wishlistFooter}>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>({item.rating})</Text>
            </View>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>BOOK NOW</Text>
            </TouchableOpacity>
            {item.distance && (
              <Text style={styles.distanceText}>{item.distance}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Wishlist</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfileButtonPress}>
          <Image
            source={{
              uri: user?.avatar_url || "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {wishlistItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptyDescription}>
              Start adding places you love to your wishlist!
            </Text>
          </View>
        ) : (
          <View style={styles.wishlistList}>
            {wishlistItems.map((item) => renderWishlistItem(item))}
          </View>
        )}

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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    ...shadows.small,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl + 60,
  },
  wishlistList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  wishlistCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.medium,
  },
  wishlistCardFaded: {
    opacity: 0.4,
  },
  wishlistImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  imageFaded: {
    opacity: 0.6,
  },
  wishlistContent: {
    padding: spacing.md,
  },
  wishlistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  wishlistName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  favoriteButton: {
    marginLeft: spacing.sm,
  },
  favoriteCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.small,
  },
  favoriteCircleFaded: {
    backgroundColor: colors.border,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  wishlistDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  wishlistFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: "600",
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  bookButtonFaded: {
    backgroundColor: colors.border,
  },
  bookButtonText: {
    ...typography.caption,
    fontWeight: "700",
    color: colors.surface,
    letterSpacing: 0.5,
  },
  distanceText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  textFaded: {
    color: colors.text.hint,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 3,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyDescription: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
})

