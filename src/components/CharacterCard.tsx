import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  name: string;
  description: string;
  chats: string;
  creator: string;
  image: any; 
  onPress: () => void;
}

export const CharacterCard: React.FC<CardProps> = ({ name, description, chats, creator, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
         {image ? (
            <Image 
                source={typeof image === 'string' && image.startsWith('http') ? { uri: image } : image} 
                style={styles.image} 
                resizeMode="cover" 
            />
         ) : (
            <View style={[styles.image, { backgroundColor: '#333' }]} >
                <Ionicons name="person" size={40} color="#555" />
            </View>
         )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{name}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{description}</Text>
        <View style={styles.footer}>
            <View style={styles.stat}>
                <Ionicons name="chatbubble-outline" size={12} color={COLORS.textSecondary} />
                <Text style={styles.statText}>{chats}</Text>
            </View>
        </View>
        <Text style={styles.creator}>{creator}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'transparent',
    marginBottom: SPACING.m,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Square image
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    marginBottom: SPACING.s,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  creator: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});
