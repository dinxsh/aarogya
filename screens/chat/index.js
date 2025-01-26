import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Animated, TouchableOpacity } from 'react-native';
import { TextInput, IconButton, Chip, Avatar, Portal, Dialog, Button, Provider, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatDistanceToNow } from 'date-fns';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyCXzlJRd3krr5e32pXTAS14mfS3a8dDsMA');

const callGeminiAPI = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    if (response.promptFeedback && response.promptFeedback.blockReason) {
      return "I'm sorry, but I can't respond to that request due to content restrictions.";
    }
    
    if (response.error && response.error.code === 429) {
      return "I'm sorry, but we've hit our rate limit. Please try again in a moment.";
    }
    
    return text.replace(/\*\*(.*?)\*\*/g, '**$1**');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error.response && error.response.status === 403) {
      return "I'm sorry, but it seems we don't have permission to use this service right now.";
    }
    return "I'm sorry, I encountered an error while processing your request.";
  }
};

const prebuiltPrompts = [
  "Suggest a 15-minute HIIT workout routine",
  "How can I set and track fitness goals effectively?", 
  "What are some journaling prompts for self-reflection?",
  "Can you provide a balanced meal plan for a day?",
  "How do I organize my fitness notes and progress?",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const sendMessage = async (text) => {
    if (text.trim() === '') return;

    const newMessage = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await callGeminiAPI(text);
      const aiMessage = { id: Date.now() + 1, text: response, sender: 'ai', timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  const renderMessage = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Surface style={[styles.messageSurface, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
        {item.sender === 'ai' && (
          <Avatar.Icon size={32} icon="robot" style={styles.avatarIcon} />
        )}
        <View style={styles.messageContent}>
          <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.aiMessageText]}>
            {item.text.split(/(\*\*.*?\*\*)/).map((part, index) => 
              part.startsWith('**') && part.endsWith('**') ? 
                <Text key={index} style={{fontWeight: 'bold'}}>{part.slice(2, -2)}</Text> : 
                part
            )}
          </Text>
          <Text style={styles.timestampText}>
            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
          </Text>
        </View>
      </Surface>
    </Animated.View>
  );

  const renderPromptChip = (prompt) => (
    <Chip
      style={styles.promptChip}
      onPress={() => sendMessage(prompt)}
      mode="outlined"
      textStyle={styles.promptChipText}
    >
      {prompt}
    </Chip>
  );

  const deleteChat = () => {
    setMessages([]);
  };

  return (
    <Provider>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <LinearGradient
          colors={['#13141C', '#1A1B25', '#2D2E3D']}
          style={styles.header}
        >
          <Text style={styles.headerText}>AI Fitness Assistant</Text>
          <View style={styles.headerIcons}>
            <IconButton
              icon="delete"
              iconColor="#9397FF"
              size={28}
              onPress={deleteChat}
            />
            <IconButton
              icon="information"
              iconColor="#9397FF" 
              size={28}
              onPress={() => setIsDialogVisible(true)}
            />
          </View>
        </LinearGradient>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messageList}
        />

        {messages.length === 0 && (
          <View style={styles.promptContainer}>
            <Text style={styles.promptTitle}>Get started with these prompts:</Text>
            <View style={styles.chipContainer}>
              {prebuiltPrompts.map(prompt => renderPromptChip(prompt))}
            </View>
          </View>
        )}

        {isTyping && (
          <Surface style={styles.typingIndicator}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#9397FF" />
            <Text style={styles.typingText}>AI is thinking...</Text>
          </Surface>
        )}

        <Surface style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="rgba(147, 151, 255, 0.6)"
            right={
              <TextInput.Icon 
                icon="send" 
                onPress={() => sendMessage(inputText)}
                color="#9397FF"
              />
            }
            mode="flat"
          />
        </Surface>

        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>About AI Fitness Assistant</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>
                This AI assistant is powered by Google's Gemini API. It uses advanced machine learning models to provide you with accurate and helpful responses about fitness, nutrition, and wellness.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)} color="#9397FF">Got it</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAvoidingView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13141C',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  messageList: {
    padding: 16,
  },
  messageSurface: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  timestampText: {
    fontSize: 10,
    color: 'rgba(147, 151, 255, 0.6)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#363B64',
    marginLeft: 40,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2C2F48',
    marginRight: 40,
  },
  avatarIcon: {
    backgroundColor: 'rgba(147, 151, 255, 0.2)',
    marginRight: 8,
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#2C2F48',
  },
  input: {
    backgroundColor: '#363B64',
    color: '#FFFFFF',
    borderRadius: 12,
  },
  promptContainer: {
    padding: 16,
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  promptChip: {
    margin: 4,
    backgroundColor: '#363B64',
    borderColor: '#9397FF',
  },
  promptChipText: {
    color: '#FFFFFF',
  },
  typingIndicator: {
    margin: 16,
    padding: 12,
    backgroundColor: '#2C2F48',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  typingText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dialogText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});
