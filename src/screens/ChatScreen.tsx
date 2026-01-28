import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, SIZES } from '../constants/theme';
import { ChatMessage } from '../components/ChatMessage';
import { CHAT_HISTORY } from '../constants/data';
import { Ionicons } from '@expo/vector-icons';

export const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { character } = route.params || {};
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(CHAT_HISTORY);

  const handleSend = () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: messageText,
        isAction: false
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.s }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
            <View style={styles.headerAvatar}>
               {/* Image placeholder */}
               <Ionicons name="person" size={20} color="#666" />
            </View>
            <View>
                <Text style={styles.headerName}>{character?.name || 'Theo Weston'}</Text>
                 {/* Online status or subtitle could go here */}
            </View>
        </View>

        <View style={styles.headerActions}>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="volume-mute-outline" size={24} color={COLORS.text} />
             </TouchableOpacity>
             <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="share-social-outline" size={24} color={COLORS.text} />
             </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <ChatMessage 
                text={item.text} 
                sender={item.sender as any} 
                isAction={item.isAction} 
            />
        )}
        contentContainerStyle={styles.listContent}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + SPACING.s }]}>
            <View style={styles.inputWrapper}>
                <TouchableOpacity style={styles.inputIcon}>
                     <Ionicons name="happy-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputIcon}>
                     <Ionicons name="image-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
                
                <TextInput
                    style={styles.input}
                    placeholder="Message..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                />
                
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={20} color={COLORS.text} />
                </TouchableOpacity>
            </View>
            <Text style={styles.footerNote}>This is AI and not a real person. Treat everything it says as fiction.</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: SPACING.s,
    marginLeft: -SPACING.s,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.s,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.s,
  },
  headerName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: SPACING.m,
  },
  listContent: {
    paddingTop: SPACING.m,
    paddingBottom: SPACING.m,
  },
  inputContainer: {
    padding: SPACING.m,
    backgroundColor: COLORS.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 25,
    paddingHorizontal: SPACING.s,
    paddingVertical: 8,
  },
  inputIcon: {
    padding: SPACING.s,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    maxHeight: 100,
    marginLeft: SPACING.s,
  },
  sendButton: {
      padding: SPACING.s,
  },
  footerNote: {
      color: '#555',
      fontSize: 10,
      textAlign: 'center',
      marginTop: 8,
  }
});
