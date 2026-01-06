import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, Phone } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import images from '../../config/images';
import ChatMessage from '../../components/chatMessage/ChatMessage';
import ChatInput from '../../components/chatInput/ChatInput';

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  time?: string;
}

const Chat = ({ navigation, route }: { navigation?: any; route?: any }) => {
  const { top, bottom } = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Lorem ipsum dolor sit amet, consectetur',
      isSent: true,
    },
    {
      id: '2',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscin elit, sed do eiusmod tempor incididunt ut labore',
      isSent: false,
    },
    {
      id: '3',
      text: 'Lorem ipsum dolor sit amet, consectetur',
      isSent: true,
    },
    {
      id: '4',
      text: 'Lorem ipsum dolor sit amet, consectetur',
      isSent: true,
    },
    {
      id: '5',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad',
      isSent: false,
    },
    {
      id: '6',
      text: 'minim veniam, quis nostrud exercitation ullamco',
      isSent: true,
    },
    {
      id: '7',
      text: 'laboris nisi ut aliquip ex ea commodo consequat.',
      isSent: false,
    },
  ]);

  const flatListRef = useRef<FlatList>(null);
  const contactName = route?.params?.name || 'Henry Willson';
  const contactAvatar = route?.params?.avatar || images.avatar;

  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Keyboard event listeners
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom when keyboard appears
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSend = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isSent: true,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAttachmentPress = () => {
    // Handle attachment
    console.log('Attachment pressed');
  };

  const handleCameraPress = () => {
    // Handle camera
    console.log('Camera pressed');
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    return (
      <ChatMessage
        message={item.text}
        isSent={item.isSent}
        time={item.time}
        showAvatar={!item.isSent}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[headerStyles.headerContainer, styles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ChevronLeftIcon color={colors.white} size={24} />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Image source={contactAvatar} style={styles.profileImage} />
          <View style={styles.greenDot} />
        </View>

        <Text style={styles.contactName}>{contactName}</Text>

        <TouchableOpacity
          style={styles.phoneButton}
          onPress={() => {
            // Handle phone call
            console.log('Call pressed');
          }}
        >
          <Phone color={colors.white} size={20} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: bottom + 80 + keyboardHeight },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
      </View>

      {/* Input Area */}
      <View
        style={[
          styles.inputContainer,
          { paddingBottom: bottom, marginBottom: keyboardHeight },
        ]}
      >
        <ChatInput
          onSend={handleSend}
          onAttachmentPress={handleAttachmentPress}
          onCameraPress={handleCameraPress}
        />
      </View>
    </View>
  );
};

export default Chat;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    headerContainer: {
      paddingTop: top + 10,
      paddingBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.c_F3F3F3,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
  },
  backButton: {
    backgroundColor: colors.c_F47E20,
    padding: 8,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greenDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
  },
  contactName: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
    marginLeft: 12,
  },
  phoneButton: {
    backgroundColor: colors.c_F47E20,
    padding: 8,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  dateLabel: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateLabelText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
});
