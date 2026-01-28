import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, SIZES } from '../constants/theme';
import { CATEGORIES, CHARACTERS } from '../constants/data';
import { CharacterCard } from '../components/CharacterCard';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('For You');

  const renderHeader = () => (
    <View style={[styles.headerContainer, { paddingTop: insets.top + SPACING.s }]}>
        <View style={styles.topBar}>
            <Text style={styles.logo}>Alter</Text>
            <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="search" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoriesContainer}
        >
            {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                    key={cat} 
                    style={[styles.categoryChip, activeCategory === cat && styles.activeCategoryChip]}
                    onPress={() => setActiveCategory(cat)}
                >
                    <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={CHARACTERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CharacterCard 
            {...item} 
            onPress={() => navigation.navigate('Chat', { character: item })}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.itemRow}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingBottom: SPACING.s,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: SPACING.l,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  profileButton: {
    marginLeft: SPACING.l,
  },
  profilePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#555',
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.s,
  },
  categoryChip: {
    paddingHorizontal: SPACING.l,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SPACING.s,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeCategoryChip: {
    backgroundColor: COLORS.surfaceHighlight,
    borderColor: COLORS.surfaceHighlight,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.s,
  },
  itemRow: {
    justifyContent: 'space-between',
  },
});
