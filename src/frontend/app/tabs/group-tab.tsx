import {TextInput, View, Text, Pressable, Keyboard, Modal, ActivityIndicator } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import styles from "@/app/styles/groupTab";
import {images} from "@/app/assets";
import {Image} from "expo-image";
import {useGroup} from "@/hooks/useGroup";
import { Ionicons } from "@expo/vector-icons";

const Grupa = () => {
    const [code, setCode] = useState(['', '', '', '', '']);
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const { joinGroupHandler, makeGroupHandler, isLoading, error } = useGroup();
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleChange = (text: string, index: number) => {
        if (text.length > 1) return;

        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Automatski prebaci na sljedeće polje
        if (text && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            sendCode();
        }
    }, [code]);

    const sendCode = async () => {
        try {
            const codeString = code.join('');
            const profile = await joinGroupHandler(codeString);
            console.log('Pridružio se grupi:', profile.group);
        } catch (err) {
            console.error('Greška:', err);
        }
    };

    const makeGroup = () => {
        setShowModal(true);
        setGroupName('');
        setShowSuccess(false);
    };

    const submitGroupName = async () => {
        if (!groupName.trim()) {
            alert('Unesite ime grupe');
            return;
        }

        try {
            const result = await makeGroupHandler(groupName);
            console.log('Grupa kreirana:', result);
            setShowSuccess(true);

            setTimeout(() => {
                setShowModal(false);
                setGroupName('');
                setShowSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Greška pri kreiranju grupe:', err);
            alert('Greška pri kreiranju grupe');
        }
    };

    const closeModal = () => {
        if (!isLoading) {
            setShowModal(false);
            setGroupName('');
            setShowSuccess(false);
        }
    };

    return (
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
            <View style={styles.main}>
                <Image source={images.groupImage} style={styles.image} />

                <View style={styles.codeView}>
                    <Text style={styles.title}>Unesite Kod</Text>

                    <View style={styles.codeContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref }}
                                style={styles.codeInput}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.makeGroup}>
                    <Text>ili napravite svoju grupu</Text>

                    <Pressable onPress={makeGroup} style={styles.button}>
                        <Text style={styles.text}>Napravi grupu</Text>
                    </Pressable>
                </View>

                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <Pressable
                        style={styles.statusModalOverlay}
                        onPress={closeModal}
                    >
                        <Pressable
                            style={styles.statusModalContent}
                            onPress={() => {}}
                        >
                            {isLoading ? (
                                <>
                                    <ActivityIndicator size="large" color="#2563EB" />
                                    <Text style={styles.statusModalTitle}>Kreiram grupu...</Text>
                                    <Text style={styles.statusModalSubtitle}>Molimo pričekajte</Text>
                                </>
                            ) : showSuccess ? (
                                <>
                                    <View style={styles.successIconContainer}>
                                        <Ionicons name="checkmark-circle" size={80} color="#34C759" />
                                    </View>
                                    <Text style={styles.statusModalTitle}>Grupa kreirana!</Text>
                                    <Text style={styles.statusModalSubtitle}>Grupa je uspješno napravljena</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.statusModalTitle}>Napravi grupu</Text>
                                    <TextInput
                                        style={styles.groupNameInput}
                                        placeholder="Unesite ime grupe"
                                        placeholderTextColor={"#64748B"}
                                        value={groupName}
                                        onChangeText={setGroupName}
                                        editable={!isLoading}
                                    />
                                    <View style={styles.modalButtonContainer}>
                                        <Pressable
                                            style={styles.cancelButton}
                                            onPress={closeModal}
                                            disabled={isLoading}
                                        >
                                            <Text style={styles.cancelButtonText}>Odustani</Text>
                                        </Pressable>
                                        <Pressable
                                            style={styles.submitButton}
                                            onPress={submitGroupName}
                                            disabled={isLoading}
                                        >
                                            <Text style={styles.submitButtonText}>Kreiraj</Text>
                                        </Pressable>
                                    </View>
                                </>
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>
            </View>
        </Pressable>
    )
}

export default Grupa