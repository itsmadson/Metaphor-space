import React, { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '../components/ThemeContext';

const ChatScreen = ({ route, navigation }) => {
  const { story } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colors, toggleTheme } = useContext(ThemeContext);

  const GEMINI_API_KEY = 'gemeni api ';
  const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const askGemini = async (userMessage) => {
    try {
      const dnsResolvedUrl = `https://free.shecan.ir/dns-query`;
      const storyContent = story.content.rendered.replace(/<[^>]+>/g, '').trim().substring(0, 500);

      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'generativelanguage.googleapis.com',
          'DNS-Over-HTTPS': dnsResolvedUrl,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `User: ${userMessage}` }],
          }],
        }),
      });

      if (!response.ok) {
        console.error('Error:', response.status);
        return 'متأسفم، در حال حاضر نمی‌توانم پاسخ دهم.';
      }

      const data = await response.json();
      return data.candidates?.[0]?.content || 'پاسخی یافت نشد.';
    } catch (error) {
      console.error('Request Error:', error);
      return 'خطای اتصال به سرور.';
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: inputText }]);
    setInputText('');

    const response = await askGemini(inputText);
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={toggleTheme}>
          <MaterialIcons name={colors.isDarkMode ? 'wb-sunny' : 'nights-stay'} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.appName, { color: colors.text }]}>فضای استعاره</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.role === 'user' ? styles.userMessage : styles.aiMessage,
              { backgroundColor: item.role === 'user' ? colors.accent : colors.card },
            ]}
          >
            <Text style={[styles.messageText, { color: colors.text }]}>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {isLoading && <ActivityIndicator size="small" color={colors.accent} />}
      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="پیام خود را بنویسید..."
          placeholderTextColor={colors.text + '80'}
          value={inputText}
          onChangeText={setInputText}
          editable={!isLoading}
        />
        <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: colors.accent }]}>
          <Text style={styles.sendButtonText}>ارسال</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 30, 
    elevation: 4,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Vazirmatn',
    fontWeight: 'bold',
  },
  messagesContainer: {
    paddingHorizontal: 16, 
    paddingVertical: 8, 
  },
  message: {
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 8, 
    maxWidth: '80%',
  },
  userMessage: { alignSelf: 'flex-end', marginLeft: '20%' }, 
  aiMessage: { alignSelf: 'flex-start', marginRight: '20%' }, 
  messageText: {
    fontSize: 16,
    textAlign: 'right',
    fontFamily: 'Vazirmatn', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
    textAlign: 'right',
    fontFamily: 'Vazirmatn', 
  },
  sendButton: {
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontFamily: 'Vazirmatn', 
  },
});

export default ChatScreen;