import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native"
import { colors } from "../style/colors"
import { spacing, borderRadius, shadows } from "../style/spacing"
import { typography } from "../style/typography"

export type TabName = "Explore" | "Home" | "Wishlist" | "Trip" | "Profile"

interface BottomTabBarProps {
  activeTab: TabName
  onTabPress: (tab: TabName) => void
}

const tabs: Array<{ name: TabName; icon: string; activeIcon: string }> = [
  { name: "Explore", icon: "🔍", activeIcon: "🔍" },
  { name: "Home", icon: "🏠", activeIcon: "🏠" },
  { name: "Wishlist", icon: "🤍", activeIcon: "❤️" },
  { name: "Trip", icon: "📋", activeIcon: "📋" },
  { name: "Profile", icon: "👤", activeIcon: "👤" },
]

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Text style={[styles.icon, isActive && styles.iconActive]}>
                  {isActive ? tab.activeIcon : tab.icon}
                </Text>
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingBottom: Platform.OS === "ios" ? spacing.lg : spacing.sm,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.large,
    shadowOffset: {
      width: 0,
      height: -4,
    },
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: colors.primary + "15",
  },
  icon: {
    fontSize: 22,
  },
  iconActive: {
    fontSize: 24,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  labelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
})

