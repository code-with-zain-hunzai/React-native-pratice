import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native"
import { colors } from "../style/colors"
import { spacing, borderRadius, shadows } from "../style/spacing"
import { typography } from "../style/typography"

const upcomingTrips = [
  {
    id: "1",
    name: "Bali Paradise",
    destination: "Bali, Indonesia",
    dates: "Nov 15 - Nov 22, 2025",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    status: "Confirmed",
    nights: 7,
  },
  {
    id: "2",
    name: "Paris Getaway",
    destination: "Paris, France",
    dates: "Dec 10 - Dec 15, 2025",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
    status: "Pending",
    nights: 5,
  },
]

const pastTrips = [
  {
    id: "3",
    name: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    dates: "Sep 5 - Sep 12, 2025",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
    rating: 5.0,
    nights: 7,
  },
  {
    id: "4",
    name: "Dubai Luxury",
    destination: "Dubai, UAE",
    dates: "Aug 20 - Aug 25, 2025",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
    rating: 4.8,
    nights: 5,
  },
]

interface TripScreenProps {
  onTripPress?: (id: string) => void
}

export const TripScreen: React.FC<TripScreenProps> = ({ onTripPress }) => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  const renderUpcomingTrip = (item: typeof upcomingTrips[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tripCard}
      onPress={() => onTripPress?.(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.tripImage} />
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripName}>{item.name}</Text>
            <Text style={styles.tripDestination}>{item.destination}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === "Confirmed"
                ? styles.statusConfirmed
                : styles.statusPending,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === "Confirmed"
                  ? styles.statusTextConfirmed
                  : styles.statusTextPending,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.tripDetails}>
          <View style={styles.tripDetail}>
            <Text style={styles.tripDetailIcon}>📅</Text>
            <Text style={styles.tripDetailText}>{item.dates}</Text>
          </View>
          <View style={styles.tripDetail}>
            <Text style={styles.tripDetailIcon}>🌙</Text>
            <Text style={styles.tripDetailText}>{item.nights} Nights</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const renderPastTrip = (item: typeof pastTrips[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.tripCard}
      onPress={() => onTripPress?.(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.tripImage} />
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripName}>{item.name}</Text>
            <Text style={styles.tripDestination}>{item.destination}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.tripDetails}>
          <View style={styles.tripDetail}>
            <Text style={styles.tripDetailIcon}>📅</Text>
            <Text style={styles.tripDetailText}>{item.dates}</Text>
          </View>
          <View style={styles.tripDetail}>
            <Text style={styles.tripDetailIcon}>🌙</Text>
            <Text style={styles.tripDetailText}>{item.nights} Nights</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>Write Review</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.tabActive]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.tabActive]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[styles.tabText, activeTab === "past" && styles.tabTextActive]}
          >
            Past Trips
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "upcoming" ? (
          <View style={styles.tripsList}>
            {upcomingTrips.map(renderUpcomingTrip)}
            {upcomingTrips.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>✈️</Text>
                <Text style={styles.emptyTitle}>No Upcoming Trips</Text>
                <Text style={styles.emptyText}>
                  Start planning your next adventure!
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.tripsList}>
            {pastTrips.map(renderPastTrip)}
            {pastTrips.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📸</Text>
                <Text style={styles.emptyTitle}>No Past Trips</Text>
                <Text style={styles.emptyText}>
                  Your travel history will appear here
                </Text>
              </View>
            )}
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    ...shadows.small,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl + 60,
  },
  tripsList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.medium,
  },
  tripImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  tripContent: {
    padding: spacing.md,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  tripDestination: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
  },
  statusConfirmed: {
    backgroundColor: "#DCFCE7",
  },
  statusPending: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    ...typography.caption,
    fontWeight: "700",
  },
  statusTextConfirmed: {
    color: "#15803D",
  },
  statusTextPending: {
    color: "#A16207",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  starIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  ratingText: {
    ...typography.body2,
    fontWeight: "700",
    color: colors.text.primary,
  },
  tripDetails: {
    marginBottom: spacing.md,
  },
  tripDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  tripDetailIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  tripDetailText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.small,
  },
  viewButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  reviewButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  reviewButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: "center",
  },
  bottomSpacer: {
    height: spacing.xl,
  },
})

