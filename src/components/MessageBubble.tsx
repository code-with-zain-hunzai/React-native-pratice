import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types/api';
import { colors } from '../style/colors';
import { spacing, borderRadius } from '../style/spacing';
import { typography } from '../style/typography';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.ownText : styles.otherText,
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.timeText,
            isOwnMessage ? styles.ownTimeText : styles.otherTimeText,
          ]}
        >
          {formatTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  ownText: {
    color: colors.background,
  },
  otherText: {
    color: colors.text.primary,
  },
  timeText: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 4,
  },
  ownTimeText: {
    color: colors.background + 'CC',
  },
  otherTimeText: {
    color: colors.text.secondary,
  },
});

