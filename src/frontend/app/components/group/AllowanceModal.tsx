import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Alert } from 'react-native';
import styles from '@/app/styles/groupTab';

interface AllowanceModalProps {
    visible: boolean;
    memberName: string;
    currentAllowance: number | null;
    onClose: () => void;
    onSave: (allowance: number) => Promise<void>;
    isLoading?: boolean;
}

const AllowanceModal = ({
    visible,
    memberName,
    currentAllowance,
    onClose,
    onSave,
    isLoading
}: AllowanceModalProps) => {
    const [allowanceInput, setAllowanceInput] = useState('');

    useEffect(() => {
        if (visible) {
            setAllowanceInput(currentAllowance?.toString() || '');
        }
    }, [visible, currentAllowance]);

    const handleSave = async () => {
        const newAllowance = parseFloat(allowanceInput);
        if (isNaN(newAllowance) || newAllowance < 0) {
            Alert.alert('Greška', 'Unesite ispravan iznos');
            return;
        }

        try {
            await onSave(newAllowance);
            Alert.alert('Uspjeh', 'Limit je ažuriran');
        } catch {
            Alert.alert('Greška', 'Nije moguće ažurirati limit');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}>
            <Pressable style={styles.statusModalOverlay} onPress={onClose}>
                <Pressable style={styles.statusModalContent}>
                    <Text style={styles.statusModalTitle}>Uredi limit</Text>
                    <Text style={styles.statusModalSubtitle}>
                        Član: {memberName}
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.currencyPrefix}>€</Text>
                        <TextInput
                            style={styles.budgetInput}
                            value={allowanceInput}
                            onChangeText={setAllowanceInput}
                            keyboardType="decimal-pad"
                            placeholder="0.00"
                            placeholderTextColor="#94A3B8"/>
                    </View>

                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            style={styles.cancelButton}
                            onPress={onClose}
                            disabled={isLoading}>
                            <Text style={styles.cancelButtonText}>Odustani</Text>
                        </Pressable>
                        <Pressable
                            style={styles.submitButton}
                            onPress={handleSave}
                            disabled={isLoading}>
                            <Text style={styles.submitButtonText}>Spremi</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default AllowanceModal;
