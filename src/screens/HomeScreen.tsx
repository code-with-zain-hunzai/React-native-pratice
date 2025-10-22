import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native"
import { colors } from "../style/colors"
import { spacing, borderRadius, shadows } from "../style/spacing"
import { typography } from "../style/typography"
import { featuredStudios, discoverPlaces } from "../data/places"
import { useWishlist } from "../hooks/useWishlist"

const { width: SCREEN_WIDTH } = Dimensions.get("window")


interface HomeScreenProps {
  onPlacePress?: (id: string) => void
  onNavigateToWishlist?: () => void
  onNavigateToProfile?: () => void
  onNavigateToTrip?: () => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlacePress,
  onNavigateToWishlist,
  onNavigateToProfile,
  onNavigateToTrip,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("1")
  const [searchQuery, setSearchQuery] = useState("")
  const { isInWishlist, toggleWishlist } = useWishlist()

  const handleToggleFavorite = async (place: typeof featuredStudios[0] | typeof discoverPlaces[0]) => {
    await toggleWishlist(place)
  }

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => setSelectedCategory(item.id)}
    >
      <View
        style={[
          styles.categoryIconContainer,
          selectedCategory === item.id && styles.categoryIconContainerActive,
        ]}
      >
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )

  const renderFeaturedStudio = ({
    item,
  }: {
    item: typeof featuredStudios[0]
  }) => (
    <TouchableOpacity
      style={styles.studioCard}
      onPress={() => onPlacePress?.(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.studioImage} />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleToggleFavorite(item)}
      >
        <Text style={styles.favoriteIcon}>
          {isInWishlist(item.id) ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>
      <View style={styles.studioInfo}>
        <Text style={styles.studioName}>{item.name}</Text>
        <View style={styles.studioRating}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.ratingText}>({item.rating})</Text>
        </View>
      </View>
      <Text style={styles.studioDescription}>{item.description}</Text>
    </TouchableOpacity>
  )

  const renderDiscoverPlace = ({ item }: { item: typeof discoverPlaces[0] }) => (
    <TouchableOpacity
      style={styles.discoverCard}
      onPress={() => onPlacePress?.(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.discoverImage} />
      <View style={styles.discoverContent}>
        <View style={styles.discoverHeader}>
          <Text style={styles.discoverName}>{item.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButtonSmall}
            onPress={() => handleToggleFavorite(item)}
          >
            <Text style={styles.favoriteIconSmall}>
              {isInWishlist(item.id) ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.discoverDescription}>{item.description}</Text>
        <View style={styles.discoverFooter}>
          <View style={styles.discoverRating}>
            <Text style={styles.starIconSmall}>⭐</Text>
            <Text style={styles.discoverRatingText}>({item.rating})</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>BOOK NOW</Text>
          </TouchableOpacity>
          <Text style={styles.distanceText}>{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Studios */}
        <View style={styles.section}>
          <FlatList
            data={featuredStudios}
            renderItem={renderFeaturedStudio}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.studiosContainer}
            snapToInterval={SCREEN_WIDTH * 0.7 + spacing.md}
            decelerationRate="fast"
          />
        </View>

        {/* Discover Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover Places</Text>
          <View style={styles.discoverList}>
            {discoverPlaces.map((item) => (
              <View key={item.id}>{renderDiscoverPlace({ item })}</View>
            ))}
          </View>
        </View>

        {/* Placeholder for faded item */}
        <View style={styles.fadedPlaceholder}>
          <View style={styles.fadedCard}>
            <View style={styles.fadedImage} />
            <View style={styles.fadedContent}>
              <Text style={styles.fadedText}>Name of Place</Text>
              <Text style={styles.fadedTextSmall}>Lorem ipsum</Text>
              <Text style={styles.fadedTextSmall}>⭐ (5.0)</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    ...shadows.small,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  searchTextContainer: {
    flex: 1,
  },
  searchLabel: {
    ...typography.body2,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  searchInput: {
    ...typography.caption,
    color: colors.text.secondary,
    padding: 0,
    margin: 0,
  },
  filterButton: {
    marginLeft: spacing.sm,
  },
  filterIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl + 60,
  },
  categoriesSection: {
    paddingVertical: spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: spacing.lg,
    minWidth: 70,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIconContainerActive: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 26,
  },
  categoryText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  studiosContainer: {
    paddingHorizontal: spacing.lg,
  },
  studioCard: {
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginRight: spacing.md,
    overflow: "hidden",
    ...shadows.medium,
  },
  studioImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.small,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  studioInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  studioName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  studioRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  ratingText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: "600",
  },
  studioDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  discoverList: {
    paddingHorizontal: spacing.lg,
  },
  discoverCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.medium,
  },
  discoverImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  discoverContent: {
    padding: spacing.md,
  },
  discoverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  discoverName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  favoriteButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIconSmall: {
    fontSize: 16,
  },
  discoverDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  discoverFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discoverRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIconSmall: {
    fontSize: 12,
    marginRight: 2,
  },
  discoverRatingText: {
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
  fadedPlaceholder: {
    paddingHorizontal: spacing.lg,
    opacity: 0.3,
  },
  fadedCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.small,
  },
  fadedImage: {
    width: "100%",
    height: 160,
    backgroundColor: colors.border,
  },
  fadedContent: {
    padding: spacing.md,
  },
  fadedText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.hint,
    marginBottom: spacing.xs,
  },
  fadedTextSmall: {
    ...typography.caption,
    color: colors.text.hint,
    marginBottom: 2,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
})

