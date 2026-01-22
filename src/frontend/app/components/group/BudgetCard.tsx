import React, { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/app/styles/groupTab';
import { Group, GroupSpending } from "@/services/api";

interface BudgetCardProps {
    budget: number | null;
    groupSpending: GroupSpending | null;
    isOwner: boolean;
    canEdit: boolean;
    onBudgetChange: (newBudget: number) => Promise<Group | null>
    isLoading?: boolean;
}

const BudgetCard = ({ budget, groupSpending, isOwner, canEdit, onBudgetChange, isLoading }: BudgetCardProps) => {
    const [showModal, setShowModal] = useState(false);
    const [budgetInput, setBudgetInput] = useState('');

    const formatCurrency = (amount: number | null) => {
        if (amount === null || amount === undefined) {
            return 'Nije postavljeno';
        }
        // ako dode kao string
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) {
            return 'Nije postavljeno';
        }
        return `€${numAmount.toFixed(2)}`;
    };

    const handleEditPress = () => {
        setBudgetInput(budget?.toString() || '');
        setShowModal(true);
    };

    const handleSave = async () => {
        const newBudget = parseFloat(budgetInput);
        if (isNaN(newBudget) || newBudget < 0) {
            Alert.alert('Greška', 'Unesite ispravan iznos');
            return;
        }

        try {
            await onBudgetChange(newBudget);
            setShowModal(false);
            Alert.alert('Uspjeh', 'Budžet je ažuriran');
        } catch {
            Alert.alert('Greška', 'Nije moguće ažurirati budžet');
        }
    };

    // Calculate progress bar data
    const budgetNum = budget ? (typeof budget === 'string' ? parseFloat(budget) : budget) : null;
    const totalSpent = groupSpending?.totalSpent || 0;
    const hasBudget = budgetNum !== null && !isNaN(budgetNum) && budgetNum > 0;
    const spentPercentage = hasBudget ? Math.min((totalSpent / budgetNum) * 100, 100) : 0;
    const isOverBudget = hasBudget && totalSpent > budgetNum;

    if (canEdit) {
        return (
            <View style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                    <View>
                        <Text style={styles.budgetLabel}>Budžet grupe</Text>
                        <Text style={styles.budgetAmount}>{formatCurrency(budget)}</Text>
                    </View>

                    {isOwner && (
                        <Pressable style={styles.budgetEditButton} onPress={handleEditPress}>
                            <Ionicons name="pencil" size={20} color="#FFFFFF" />
                        </Pressable>
                    )}
                </View>

                {/* Group Progress Bar */}
                {hasBudget && groupSpending && (
                    <View style={styles.groupSpendingContainer}>
                        <View style={styles.spendingHeader}>
                            <Text style={styles.spendingLabelGroupSpending}>Ukupna potrošnja grupe:</Text>
                            <Text style={[
                                styles.spendingValueGroupBudget,
                                isOverBudget && styles.spendingValueOver
                            ]}>
                                €{totalSpent.toFixed(2)} / €{budgetNum!.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View
                                style={[
                                    styles.progressBar,
                                    { width: `${spentPercentage}%` },
                                    isOverBudget ? styles.progressBarOver : styles.progressBarNormal
                                ]}
                            />
                        </View>
                    </View>
                )}

                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowModal(false)}>
                    <Pressable
                        style={styles.statusModalOverlay}
                        onPress={() => setShowModal(false)}>
                        <Pressable
                            style={styles.statusModalContent}>
                            <Text style={styles.statusModalTitle}>Uredi budžet</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.currencyPrefix}>€</Text>
                                <TextInput
                                    style={styles.budgetInput}
                                    value={budgetInput}
                                    onChangeText={setBudgetInput}
                                    keyboardType="decimal-pad"
                                    placeholder="0.00"
                                    placeholderTextColor="#94A3B8"/>
                            </View>
                            <View style={styles.modalButtonContainer}>
                                <Pressable
                                    style={styles.cancelButton}
                                    onPress={() => setShowModal(false)}
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
            </View>
        )
    }
};

export default BudgetCard;
