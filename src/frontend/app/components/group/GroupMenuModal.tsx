import React from 'react';
import { View, Text, Pressable, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import styles from '@/app/styles/groupTab';

interface GroupMenuModalProps {
    visible: boolean;
    groupCode: string;
    onClose: () => void;
    onLeaveGroup: () => Promise<void>;
    isLoading?: boolean;
}

const GroupMenuModal = ({
    visible,
    groupCode,
    onClose,
    onLeaveGroup,
    isLoading
}: GroupMenuModalProps) => {

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(groupCode);
        Alert.alert('Kopirano', 'Kod grupe je kopiran u međuspremnik');
    };

    const handleLeaveGroup = () => {
        Alert.alert(
            'Napusti grupu',
            'Jeste li sigurni da želite napustiti grupu?',
            [
                {
                    text: 'Odustani',
                    style: 'cancel'
                },
                {
                    text: 'Napusti',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await onLeaveGroup();
                            onClose();
                        } catch {
                            Alert.alert('Greška', 'Nije moguće napustiti grupu');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}>
            <Pressable style={styles.menuModal} onPress={onClose}>
                <Pressable style={styles.menuContent}>
                    <View style={styles.menuHandle} />

                    <Text style={styles.menuTitle}>Opcije grupe</Text>

                    {/* Kod za grupu */}
                    <View style={styles.groupCodeSection}>
                        <Text style={styles.groupCodeLabel}>Kod za pridruživanje</Text>
                        <View style={styles.groupCodeContainer}>
                            <Text style={styles.groupCode}>{groupCode}</Text>
                            <Pressable style={styles.copyButton} onPress={copyToClipboard}>
                                <Ionicons name="copy-outline" size={24} color="#2563EB" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Napusti grupu gumb */}
                    <Pressable
                        style={styles.menuItem}
                        onPress={handleLeaveGroup}
                        disabled={isLoading}>
                        <Ionicons name="exit-outline" size={24} color="#EF4444" />
                        <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                            Napusti grupu
                        </Text>
                    </Pressable>

                    <Pressable style={styles.closeMenuItem} onPress={onClose}>
                        <Text style={styles.closeMenuItemText}>Zatvori</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default GroupMenuModal;
