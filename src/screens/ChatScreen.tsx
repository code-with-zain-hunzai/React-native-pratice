import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { colors } from '../style/colors';
import { spacing, borderRadius } from '../style/spacing';
import { typography } from '../style/typography';
import { MessageBubble, ChatInput, UserListItem } from '../components';
import { chatService, presenceService } from '../services';
import { Message, UserPresence } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

interface ChatScreenProps {
  onNavigateToHome: () => void;
  onNavigateToWishlist: () => void;
  onNavigateToTrip: () => void;
  onNavigateToProfile: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  onNavigateToHome,
  onNavigateToWishlist,
  onNavigateToTrip,
  onNavigateToProfile,
}) => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserPresence | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const unsubscribeMessages = useRef<(() => void) | null>(null);
  const unsubscribePresence = useRef<(() => void) | null>(null);

  // Load active users on mount
  useEffect(() => {
    loadActiveUsers();
    
    // Set current user as online
    presenceService.setOnline().catch(console.error);

    // Subscribe to presence changes
    unsubscribePresence.current = presenceService.subscribeToPresence(
      handlePresenceChange
    );

    return () => {
      // Cleanup
      if (unsubscribePresence.current) {
        unsubscribePresence.current();
      }
      presenceService.setOffline().catch(console.error);
    };
  }, []);

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser.user_id);

      // Subscribe to new messages
      unsubscribeMessages.current = chatService.subscribeToMessages(
        handleNewMessage
      );

      // Mark messages as read
      chatService.markConversationAsRead(selectedUser.user_id).catch(console.error);
    } else {
      // Unsubscribe when no user is selected
      if (unsubscribeMessages.current) {
        unsubscribeMessages.current();
        unsubscribeMessages.current = null;
      }
    }

    return () => {
      if (unsubscribeMessages.current) {
        unsubscribeMessages.current();
      }
    };
  }, [selectedUser]);

  const loadActiveUsers = async () => {
    try {
      setLoading(true);
      const users = await presenceService.getAllUsers();
      setActiveUsers(users);
    } catch (error) {
      console.error('Error loading active users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (userId: string) => {
    try {
      setLoading(true);
      const conversation = await chatService.getConversation(userId);
      setMessages(conversation);
      
      // Scroll to bottom after messages load
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    // Only add message if it's from or to the selected user
    if (selectedUser && 
        (message.sender_id === selectedUser.user_id || 
         message.receiver_id === selectedUser.user_id)) {
      setMessages(prev => [...prev, message]);
      
      // Mark as read if we're in the conversation
      if (message.receiver_id === user?.id) {
        chatService.markMessagesAsRead([message.id]).catch(console.error);
      }
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handlePresenceChange = (presence: UserPresence) => {
    setActiveUsers(prev => {
      const index = prev.findIndex(u => u.user_id === presence.user_id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = presence;
        return updated;
      }
      return [...prev, presence];
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUser) return;

    try {
      setSendingMessage(true);
      const newMessage = await chatService.sendMessage(selectedUser.user_id, content);
      setMessages(prev => [...prev, newMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUserPress = (userPresence: UserPresence) => {
    setSelectedUser(userPresence);
  };

  const handleBackPress = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedUser) {
      await loadConversation(selectedUser.user_id);
    } else {
      await loadActiveUsers();
    }
    setRefreshing(false);
  };

  const renderUserList = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (activeUsers.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No users available</Text>
          <Text style={styles.emptySubtext}>
            When users sign up and go online, they'll appear here
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={activeUsers}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <UserListItem
            userPresence={item}
            onPress={() => handleUserPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={activeUsers.length === 0 ? styles.emptyList : undefined}
      />
    );
  };

  const renderConversation = () => {
    if (!selectedUser) return null;

    const getUserName = () => {
      // First try to get from UserPresence direct fields
      if (selectedUser.full_name) {
        return selectedUser.full_name;
      }
      if (selectedUser.username) {
        return selectedUser.username;
      }
      if (selectedUser.email) {
        return selectedUser.email.split('@')[0];
      }
      // Fallback to nested user object if available
      if (selectedUser.user?.full_name) {
        return selectedUser.user.full_name;
      }
      if (selectedUser.user?.username) {
        return selectedUser.user.username;
      }
      if (selectedUser.user?.email) {
        return selectedUser.user.email.split('@')[0];
      }
      return 'User';
    };

    return (
      <SafeAreaView style={styles.conversationContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{getUserName()}</Text>
            <Text style={styles.headerStatus}>
              {selectedUser.status === 'online' ? '🟢 Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Messages */}
        {loading && messages.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start the conversation by sending a message!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isOwnMessage={item.sender_id === user?.id}
              />
            )}
            contentContainerStyle={styles.messageList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
          />
        )}

        {/* Input */}
        <ChatInput onSend={handleSendMessage} />
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {selectedUser ? (
        renderConversation()
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>
              {activeUsers.filter(u => u.status === 'online').length} online
            </Text>
          </View>
          {renderUserList()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conversationContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.primary,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...typography.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerStatus: {
    ...typography.caption,
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  messageList: {
    paddingVertical: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.subtitle,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyList: {
    flex: 1,
  },
});

