import {ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import styles from '../styles/chatbot';
import {Message, useChatConversation} from '../../hooks/useChatConversation';
import {ConversationMeta, useChatHistory} from '../../hooks/useChatHistory';

const ChatbotTab = () => {
    const [message, setMessage] = useState('');
    const [conversationId, setConversationId] = useState<string | null>('1');
    const {messages, loading, error} = useChatConversation(conversationId);
    const {items: historyItems} = useChatHistory();
    const [localMessages, setLocalMessages] = useState<Message[]>([]);
    const [showHistory, setShowHistory] = useState(false);

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

    // Stvaranje chat bubble-a
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
        setConversationId(id);
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
                    <TouchableOpacity style={styles.headerIconButton}>
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
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <MaterialIcons name="send" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatbotTab;
