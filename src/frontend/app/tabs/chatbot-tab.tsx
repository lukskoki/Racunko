import {ActivityIndicator, Animated, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, View} from 'react-native';
import React, {useMemo, useState, useEffect, useRef} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import styles from '../styles/chatbot';
import {useConversations} from '../../hooks/useConversations';
import {useChatHistory} from '../../hooks/useChatHistory';
import {sendChatMessage, type ChatConversation, type ChatMessage} from '../../services/api';
import {useAuth} from '../../contexts/AuthContext';
import {ThinkingDots} from "../components/ThinkingDots";

const ChatbotTab = () => {
    const [message, setMessage] = useState('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const {getChatHistory, isLoading: isLoadingHistory, error: historyError} = useChatHistory();
    const {getConversations, isLoading: isLoadingConversations, error: conversationsError} = useConversations();
    const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const {token} = useAuth();

    const handleSend = async () => {
        if (!message.trim() || !token || isSending) {
            return;
        }

        const userMessage = message.trim();
        setMessage('');

        // Dodaj user poruku odmah u UI
        const tempUserMessage: ChatMessage = {
            id: `local-${Date.now()}`,
            message: userMessage,
            isUser: true,
            created_at: String(new Date()),
        };
        setLocalMessages(prev => [...prev, tempUserMessage]);

        setIsSending(true);

        try {
            // Pošalji poruku na backend
            const response = await sendChatMessage(token, {
                message: userMessage,
                conversation_id: conversationId ?? undefined,
                title: conversationId ? undefined : userMessage.substring(0, 50),
            });

            // Postavi conversation_id ako je novi razgovor
            if (!conversationId) {
                setConversationId(response.conversation_id);
            }

            // Dodaj AI odgovor u UI
            const aiMessage: ChatMessage = {
                id: `ai-${Date.now()}`,
                message: response.message,
                isUser: false,
                created_at: String(new Date()),
            };
            setLocalMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            // Dodaj error poruku
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                message: '❌ Greška pri slanju poruke. Molimo pokušajte ponovno.',
                isUser: false,
                created_at: String(new Date()),
            };
            setLocalMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    const mergedMessages = useMemo(() => [...messages, ...localMessages], [messages, localMessages]);

    // Renderiranje poruke
    const renderMessage = ({item}: {item: ChatMessage}) => {
        // Koristi created_at ili timestamp, bilo što je dostupno
        const timeString = item.timestamp || item.created_at;
        const timestamp = typeof timeString === 'string' ? new Date(timeString) : timeString;
        const messageText = item.message || item.text || '';

        return (
            <View style={styles.messageWrapper}>
                {item.isUser ? (
                    <View style={styles.userBubble}>
                        <Text style={styles.userMessageText}>{messageText}</Text>
                        <Text style={[styles.messageTime, {color: 'rgba(255,255,255,0.8)'}]}>
                            {timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                ) : (
                    <View>
                        <Markdown style={{body: {fontSize: 17}}}>{messageText}</Markdown>
                        <Text style={styles.messageTime}>
                            {timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    // Renderiranje razgovora u historiju
    const renderHistoryItem = ({item}: {item: ChatConversation}) => (
        <TouchableOpacity style={styles.historyItem} onPress={() => handleSelectConversation(item.id)}>
            <View style={styles.historyTextContainer}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                {!!item.lastMessage && (
                    <Text numberOfLines={1} style={styles.historySubtitle}>
                        {item.lastMessage}
                    </Text>
                )}
            </View>
            {!!item.lastMessageAt && (
                <Text style={styles.historyTime}>{new Date(item.lastMessageAt).toLocaleDateString()}</Text>
            )}
        </TouchableOpacity>
    );

    // Dohvati sve razgovore kada se otvori history
    const loadConversations = async () => {
        try {
            const convs = await getConversations();
            setConversations(convs);
        } catch (err) {
            console.error('Error loading conversations:', err);
        }
    };

    // Dohvati poruke za određeni razgovor
    const loadChatHistory = async (convId: number) => {
        try {
            const history = await getChatHistory(convId);
            // Transformiraj backend format u frontend format
            const transformedMessages: ChatMessage[] = history.map(msg => ({
                id: msg.id,
                text: msg.message,
                message: msg.message,
                isUser: msg.isUser,
                timestamp: msg.created_at,
                created_at: msg.created_at,
            }));
            setMessages(transformedMessages);
            setLocalMessages([]); // Ocisti lokalne poruke
        } catch (err) {
            console.error('Error loading chat history:', err);
        }
    };

    // Kad se selektira razgovor
    const handleSelectConversation = async (id: number) => {
        setConversationId(id);
        setMessage('');
        setShowHistory(false);
        await loadChatHistory(id);
    };

    // Handler za kreiranje novog razgovora
    const handleNewConversation = () => {
        setConversationId(null);
        setMessages([]);
        setLocalMessages([]);
        setMessage('');
        setShowHistory(false);
    };

    // Ucitaj razgovore kada se otvori history
    React.useEffect(() => {
        if (showHistory) {
            loadConversations();
        }
    }, [showHistory]);



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Financijski asistent</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerIconButton} onPress={() => {setShowHistory(true)}}>
                        <MaterialIcons name="history" size={24} color="#111827" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconButton} onPress={handleNewConversation}>
                        <MaterialIcons name="add" size={24} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={10}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.chatContainer}>
                        {showHistory ? (
                            isLoadingConversations ? (
                                <View style={styles.placeholderContainer}>
                                    <ActivityIndicator size="small" color="#6B21A8" />
                                    <Text style={styles.placeholderSubtext}>Učitavanje razgovora...</Text>
                                </View>
                            ) : conversations.length === 0 ? (
                                <View style={styles.placeholderContainer}>
                                    <MaterialIcons name="inbox" size={64} color="#9CA3AF" />
                                    <Text style={styles.placeholderText}>Nema razgovora</Text>
                                    <Text style={styles.placeholderSubtext}>
                                        Kreirajte novi ili pričekajte da započne
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={conversations}
                                    keyExtractor={item => String(item.id)}
                                    renderItem={renderHistoryItem}
                                    contentContainerStyle={styles.historyListContainer}
                                    style={styles.messagesList}
                                    keyboardShouldPersistTaps="handled"
                                />
                            )
                        ) : (
                            <>
                                {isLoadingHistory && (
                                    <View style={styles.placeholderContainer}>
                                        <ActivityIndicator size="small" color="#6B21A8" />
                                        <Text style={styles.placeholderSubtext}>Učitavanje razgovora...</Text>
                                    </View>
                                )}

                                {(!!historyError || !!conversationsError) && (
                                    <View style={styles.placeholderContainer}>
                                        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
                                        <Text style={styles.placeholderText}>Greška</Text>
                                        <Text style={styles.placeholderSubtext}>{historyError || conversationsError}</Text>
                                    </View>
                                )}

                                {!isLoadingHistory && !historyError && mergedMessages.length === 0 && !isSending ? (
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
                                        keyExtractor={item => String(item.id)}
                                        style={styles.messagesList}
                                        contentContainerStyle={styles.messagesContainer}
                                        renderItem={renderMessage}
                                        showsVerticalScrollIndicator={false}
                                        keyboardShouldPersistTaps="handled"
                                        ListFooterComponent={isSending ? <ThinkingDots /> : null}
                                    />
                                )}
                            </>
                        )}
                    </View>
                </TouchableWithoutFeedback>
                {!showHistory && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Postavite pitanje"
                            placeholderTextColor="#9CA3AF"
                            value={message}
                            onChangeText={setMessage}
                            onSubmitEditing={handleSend}
                            multiline
                            editable={!isSending}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, isSending && {opacity: 0.5}]}
                            onPress={handleSend}
                            disabled={isSending}
                        >
                            {isSending ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <MaterialIcons name="send" size={24} color="#FFFFFF" />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatbotTab;
