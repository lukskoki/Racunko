import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, TextInput, Alert } from 'react-native';
import styles from '@/app/styles/groupTab';

interface AllowanceModalProps {
    visible: boolean;
    memberName: string;
    currentAllowance: number | null;
    isOwner: boolean;
    isCoOwner: boolean;
    onClose: () => void;
    onSave: (allowance: number) => Promise<void>;
    onToggleAdmin: () => Promise<void>;
    isLoading?: boolean;
}

const AllowanceModal = ({
                            visible,
                            memberName,
                            currentAllowance,
                            isOwner,
                            isCoOwner,
                            onClose,
                            onSave,
                            onToggleAdmin,
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
            Alert.alert('Uspjeh', 'Promjene su pohranjene');
        } catch {
            Alert.alert('Greška', 'Nije moguće pohreniti promjene');
        }
    };

    const handleToggleAdmin = async () => {
        const newRole = isCoOwner ? 'Član' : 'Suvlasnik';
        Alert.alert(
            'Potvrda',
            `Jeste li sigurni da želite promijeniti ulogu u ${newRole}?`,
            [
                {
                    text: 'Odustani',
                    style: 'cancel'
                },
                {
                    text: 'Potvrdi',
                    onPress: async () => {
                        try {
                            await onToggleAdmin();
                            Alert.alert('Uspjeh', `Uloga promijenjena u ${newRole}`);
                        } catch {
                            Alert.alert('Greška', 'Nije moguće promijeniti ulogu');
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
            animationType="fade"
            onRequestClose={onClose}>
            <Pressable style={styles.statusModalOverlay} onPress={onClose}>
                <Pressable style={styles.statusModalContent}>
                    <Text style={styles.statusModalTitle}>Uredi člana</Text>
                    <Text style={styles.statusModalSubtitle}>
                        Član: {memberName}
                    </Text>

                    {/* Toggle Admin Role */}
                    { isOwner && (
                        <View style={styles.roleSection}>
                            <Text style={styles.roleSectionTitle}>Ovlasti</Text>
                            <Pressable
                                style={styles.roleToggleButton}
                                onPress={handleToggleAdmin}
                                disabled={isLoading}>
                                <View style={styles.roleToggleLeft}>
                                    <Text style={styles.roleToggleLabel}>Trenutna uloga:</Text>
                                    <Text style={styles.roleToggleValue}>
                                        {isCoOwner ? 'Suvlasnik' : 'Član'}
                                    </Text>
                                </View>
                                <Text style={styles.roleToggleArrow}>→</Text>
                            </Pressable>
                            <Text style={styles.roleDescription}>
                                {isCoOwner
                                    ? 'Suvlasnik može mijenjati budžet članova'
                                    : 'Član može samo pregledati svoje transakcije'}
                            </Text>
                        </View>
                    )}

                    {/* Allowance Input */}
                    <View style={styles.limitSection}>
                        <Text style={styles.limitSectionTitle}>Mjesečni limit</Text>
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