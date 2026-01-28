import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface MessageProps {
  text: string;
  sender: 'user' | 'character' | 'system';
  isAction?: boolean;
  avatar?: string;
}

export const ChatMessage: React.FC<MessageProps> = ({ text, sender, isAction, avatar }) => {
  const isUser = sender === 'user';
  
  if (isUser) {
    return (
        <View style={styles.userMessageContainer}>
            <View style={styles.userBubble}>
                <Text style={styles.userText}>{text}</Text>
            </View>
        </View>
    );
  }

  return (
    <View style={styles.characterMessageContainer}>
        <View style={styles.avatarContainer}>
             {/* Placeholder Avatar */}
            <View style={styles.avatar}>
               <Ionicons name="person" size={16} color="#ccc" />
            </View>
        </View>
        <View style={styles.characterContent}>
             <View style={styles.nameRow}>
                <Text style={styles.characterName}>Theo Weston</Text>
                {/* Voice icon placeholder */}
                 <Ionicons name="volume-medium" size={14} color={COLORS.textSecondary} style={{marginLeft: 8}}/>
             </View>
            <View style={styles.characterBubble}>
                <Text style={[styles.characterText, isAction && styles.actionText]}>
                    {text}
                </Text>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginBottom: SPACING.l,
    marginRight: SPACING.m,
  },
  userBubble: {
    backgroundColor: COLORS.surfaceHighlight,
    padding: SPACING.m,
    borderRadius: SIZES.borderRadius,
    borderBottomRightRadius: 2,
  },
  userText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
  },
  characterMessageContainer: {
    flexDirection: 'row',
    maxWidth: '90%',
    marginBottom: SPACING.l,
    marginLeft: SPACING.m,
  },
  avatarContainer: {
    marginRight: SPACING.s,
    marginTop: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  characterName: {
     color: COLORS.text,
     fontWeight: 'bold',
     fontSize: 14,
  },
  characterBubble: {
    // Character messages in this design often don't have a bubble background, just text
    // But checking screenshot 2... "It has been..." is in a dark bubble.
    backgroundColor: 'transparent', 
  },
  characterText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
  actionText: {
    fontStyle: 'italic',
    color: '#CCC', // Slightly lighter/different for actions
  }
});
