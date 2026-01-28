import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, SIZES } from '../constants/theme';
import { ChatMessage } from '../components/ChatMessage';
import { Ionicons } from '@expo/vector-icons';
import { generateCharacterResponse } from '../services/ai';

export const ChatScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { character } = route.params || {};
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const pickImage = async () => {
    // Request permission first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload screenshots.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
        const newMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: '', 
            imageUri: result.assets[0].uri,
            isAction: false
        };
        
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setIsTyping(true);

        // Notify AI about the image (Contextual workaround since generic LLM API might not take images)
        // We pass 'messages' (current state before this update) + the new message with descriptive text
        const responseText = await generateCharacterResponse(
            character || { name: 'Unknown', description: 'A mysterious stranger.' },
            [...messages, { ...newMessage, text: '[User sent an image]' }]
        );

        const aiMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'character',
            text: responseText,
            isAction: responseText.startsWith('*')
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: messageText,
        isAction: false
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessageText('');
    setIsTyping(true);

    // Call Groq AI
    const responseText = await generateCharacterResponse(
        character || { name: 'Unknown', description: 'A mysterious stranger.' },
        updatedMessages
    );

    const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'character',
        text: responseText,
        isAction: responseText.startsWith('*') // Basic action detection
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.s }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
            <View style={styles.headerAvatar}>
               {character?.image ? (
                  <Image 
                    source={typeof character.image === 'string' && character.image.startsWith('http') ? { uri: character.image } : character.image} 
                    style={styles.headerImage} 
                    resizeMode="cover" 
                  />
               ) : (
                  <Ionicons name="person" size={20} color="#666" />
               )}
            </View>
            <View>
                <Text style={styles.headerName}>{character?.name || 'Theo Weston'}</Text>
                <Text style={styles.headerStatus}>{isTyping ? 'Typing...' : (character?.creator || '@system')}</Text>
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
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {renderHeader()}
        
        <FlatList
            style={{ flex: 1 }}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <ChatMessage 
                    text={item.text} 
                    sender={item.sender as any} 
                    isAction={item.isAction} 
                    name={item.sender === 'user' ? 'You' : (character?.name || 'Character')}
                    avatar={item.sender === 'user' ? undefined : character?.image}
                    imageUri={item.imageUri}
                />
            )}
            contentContainerStyle={styles.listContent}
        />

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + SPACING.s }]}>
            <View style={styles.inputWrapper}>
                <TouchableOpacity style={styles.inputIcon}>
                     <Ionicons name="happy-outline" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputIcon} onPress={pickImage}>
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
    overflow: 'hidden', // Ensure image respects border radius
  },
  headerImage: {
    width: '100%',
    height: '100%',
    marginRight: SPACING.s,
  },
  headerName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: COLORS.textSecondary,
    fontSize: 12,
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
