import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserPresence } from '../types/api';
import { colors } from '../style/colors';
import { spacing, borderRadius } from '../style/spacing';
import { typography } from '../style/typography';

interface UserListItemProps {
  userPresence: UserPresence;
  onPress: () => void;
  showLastMessage?: boolean;
  lastMessageText?: string;
  unreadCount?: number;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  userPresence,
  onPress,
  showLastMessage = false,
  lastMessageText,
  unreadCount = 0,
}) => {
  const isOnline = userPresence.status === 'online';

  const formatLastSeen = (dateString: string) => {
    const lastSeen = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeen.toLocaleDateString();
  };

  // Get initials from email or user ID
  const getInitials = () => {
    const email = userPresence.email || userPresence.user?.email || '';
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  const getUserName = () => {
    if (userPresence.full_name) {
      return userPresence.full_name;
    }
    if (userPresence.username) {
      return userPresence.username;
    }
    if (userPresence.email) {
      return userPresence.email.split('@')[0];
    }
    // Fallback to user object if available
    if (userPresence.user?.full_name) {
      return userPresence.user.full_name;
    }
    if (userPresence.user?.username) {
      return userPresence.user.username;
    }
    if (userPresence.user?.email) {
      return userPresence.user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <View style={[styles.statusDot, isOnline ? styles.online : styles.offline]} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {getUserName()}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {showLastMessage && lastMessageText ? (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText}
          </Text>
        ) : (
          <Text style={styles.status}>
            {isOnline ? 'Online' : `Last seen ${formatLastSeen(userPresence.last_seen)}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.subtitle,
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.background,
  },
  online: {
    backgroundColor: '#10B981',
  },
  offline: {
    backgroundColor: colors.text.secondary,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    ...typography.subtitle,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  status: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text.secondary,
  },
  lastMessage: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text.secondary,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  unreadText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.background,
    fontWeight: '700',
  },
});

