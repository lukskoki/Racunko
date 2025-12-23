import {ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import styles from '../styles/chatbot';
import {Message, useChatConversation} from '../../hooks/useChatConversation';
import {ConversationMeta, useChatHistory} from '../../hooks/useChatHistory';
import {sendChatMessage} from '../../services/api';
import {useAuth} from '../../contexts/AuthContext';

const ChatbotTab = () => {
    const [message, setMessage] = useState('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const {messages, loading, error} = useChatConversation(conversationId ? String(conversationId) : null);
    const {items: historyItems} = useChatHistory();
    const [localMessages, setLocalMessages] = useState<Message[]>([]);
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
        const tempUserMessage: Message = {
            id: `local-${Date.now()}`,
            text: userMessage,
            isUser: true,
            timestamp: new Date(),
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
            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                text: response.message,
                isUser: false,
                timestamp: new Date(),
            };
            setLocalMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            // Dodaj error poruku
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                text: '❌ Greška pri slanju poruke. Molimo pokušajte ponovno.',
                isUser: false,
                timestamp: new Date(),
            };
            setLocalMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    const mergedMessages = useMemo(() => [...messages, ...localMessages], [messages, localMessages]);

    // Renderiranje poruke
    const renderMessage = ({item}: {item: Message}) => (
        <View style={styles.messageWrapper}>
            {item.isUser ? (
                <View style={styles.userBubble}>
                    <Text style={styles.userMessageText}>{item.text}</Text>
                    <Text style={[styles.messageTime, {color: 'rgba(255,255,255,0.8)'}]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            ) : (
                <View>
                    <Markdown style={{body: {fontSize: 17}}}>{item.text}</Markdown>
                    <Text style={styles.messageTime}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            )}
        </View>
    );

    // Stvaranje razgovora u historyu
    const renderHistoryItem = ({item}: {item: ConversationMeta}) => (
        <TouchableOpacity style={styles.historyItem} onPress={() => handleSelectConversation(item.id)}>
            <View style={styles.historyTextContainer}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                {!!item.lastMessage && (
                    <Text numberOfLines={1} style={styles.historySubtitle}>
                        {item.lastMessage}
                    </Text>
                )}
            </View>
            {!!item.updatedAt && (
                <Text style={styles.historyTime}>{item.updatedAt.toLocaleDateString()}</Text>
            )}
        </TouchableOpacity>
    );

    // Kad se selektira razgovor onda treba resetirat messages i postavit conversation ID
    const handleSelectConversation = (id: string) => {
        setConversationId(Number(id));
        setLocalMessages([]);
        setMessage('');
        setShowHistory(false);
    };

    // Handler za kreiranje novog razgovora
    const handleNewConversation = () => {
        setConversationId(null);
        setLocalMessages([]);
        setMessage('');
        setShowHistory(false);
    };



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
                keyboardVerticalOffset={100}>
                    
                    <View style={styles.chatContainer}>
                        {showHistory ? (
                            historyItems.length === 0 ? (
                                <View style={styles.placeholderContainer}>
                                    <MaterialIcons name="inbox" size={64} color="#9CA3AF" />
                                    <Text style={styles.placeholderText}>Nema razgovora</Text>
                                    <Text style={styles.placeholderSubtext}>
                                        Kreirajte novi ili pričekajte da započne
                                    </Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={historyItems}
                                    keyExtractor={item => item.id}
                                    renderItem={renderHistoryItem}
                                    contentContainerStyle={styles.historyListContainer}
                                    style={styles.messagesList}
                                />
                            )
                        ) : (
                            <>
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
                            </>
                        )}
                    </View>
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
