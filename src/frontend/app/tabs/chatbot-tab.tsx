import {ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import styles from '../styles/chatbot';
import {Message, useChatConversation} from '../../hooks/useChatConversation';

const ChatbotTab = () => {
    const [message, setMessage] = useState('');
    const [conversationId] = useState<string | null>('1'); // Id od razgovora
    const {messages, loading, error} = useChatConversation(conversationId);
    const [localMessages, setLocalMessages] = useState<Message[]>([]); // Nove poruke

    const handleSend = () => {
        if (!message.trim()) {
            return;
        }

        setLocalMessages(prev => [
            ...prev,
            {id: `local-${Date.now()}`, text: message, isUser: true, timestamp: new Date()},
        ]);
        setMessage('');
        // Ovdje ce biti logika za slanje poruke backendu
    };

    const mergedMessages = useMemo(() => [...messages, ...localMessages], [messages, localMessages]);

    const renderMessage = ({item}: {item: Message}) => (
        <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
            <Text
                style={[
                    styles.messageText,
                    item.isUser ? styles.userMessageText : styles.botMessageText,
                ]}>
                {item.text}
            </Text>
            <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Financijski asistent</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerIconButton} onPress={() => {}}>
                        <MaterialIcons name="history" size={28} color="#111827" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconButton} onPress={() => {}}>
                        <MaterialIcons name="add" size={28} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.chatContainer}>
                        {loading && (
                            <View style={styles.placeholderContainer}>
                                <ActivityIndicator size="small" color="#6B21A8" />
                                <Text style={styles.placeholderSubtext}>Učitavanje razgovora...</Text>
                            </View>
                        )}

                        {!!error && (
                            <View style={styles.placeholderContainer}>
                                <MaterialIcons name="error-outline" size={48} color="#EF4444" />
                                <Text style={styles.placeholderText}>Greška</Text>
                                <Text style={styles.placeholderSubtext}>{error}</Text>
                            </View>
                        )}

                        {!loading && !error && mergedMessages.length === 0 ? (
                            <View style={styles.placeholderContainer}>
                                <MaterialIcons name="chat-bubble-outline" size={64} color="#9CA3AF" />
                                <Text style={styles.placeholderText}>
                                    Započnite razgovor o svojim financijama
                                </Text>
                                <Text style={styles.placeholderSubtext}>
                                    Postavite pitanje o vašim prihodima, rashodima ili financijskim ciljevima
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={mergedMessages}
                                keyExtractor={item => item.id}
                                style={styles.messagesList}
                                contentContainerStyle={styles.messagesContainer}
                                renderItem={renderMessage}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Postavite pitanje"
                        placeholderTextColor="#9CA3AF"
                        value={message}
                        onChangeText={setMessage}
                        onSubmitEditing={handleSend}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <MaterialIcons name="send" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatbotTab;
