import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/app/styles/groupTab';
import { MemberTransaction, getMemberTransactions } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface MemberDetailModalProps {
    visible: boolean;
    memberId: number;
    memberName: string;
    totalSpent: number;
    allowance: number | null;
    onClose: () => void;
}

const MemberDetailModal = ({
    visible,
    memberId,
    memberName,
    totalSpent,
    allowance,
    onClose
}: MemberDetailModalProps) => {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState<MemberTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (visible && token) {
            loadTransactions();
        }
    }, [visible, memberId]);

    const loadTransactions = async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await getMemberTransactions(token, memberId);
            setTransactions(result);
        } catch (err: any) {
            setError(err.message || 'Greška pri dohvaćanju transakcija');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `€${numAmount.toFixed(2)}`;
    };

    const renderTransaction = ({ item }: { item: MemberTransaction }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
                <Text style={styles.transactionCategory}>{item.category}</Text>
                <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
                {item.transactionNote && (
                    <Text style={styles.transactionNote}>{item.transactionNote}</Text>
                )}
            </View>
            <Text style={styles.transactionAmount}>{formatCurrency(item.amount)}</Text>
        </View>
    );

    const allowanceNum = allowance ? (typeof allowance === 'string' ? parseFloat(allowance as any) : allowance) : null;
    const isOverBudget = allowanceNum !== null && totalSpent > allowanceNum;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}>
            <Pressable style={styles.menuModal} onPress={onClose}>
                <Pressable style={styles.detailModalContent}>
                    <View style={styles.menuHandle} />

                    <Text style={styles.menuTitle}>Transakcije - {memberName}</Text>

                    {/* Summary */}
                    <View style={styles.detailSummary}>
                        <View style={styles.detailSummaryItem}>
                            <Text style={styles.detailSummaryLabel}>Potrošeno</Text>
                            <Text style={[
                                styles.detailSummaryValue,
                                isOverBudget && styles.spendingValueOver
                            ]}>
                                {formatCurrency(totalSpent)}
                            </Text>
                        </View>
                        {allowanceNum !== null && (
                            <View style={styles.detailSummaryItem}>
                                <Text style={styles.detailSummaryLabel}>Limit</Text>
                                <Text style={styles.detailSummaryValue}>
                                    {formatCurrency(allowanceNum)}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Transactions list */}
                    {isLoading ? (
                        <View style={styles.detailLoading}>
                            <ActivityIndicator size="small" color="#2563EB" />
                            <Text style={styles.loadingText}>Učitavanje...</Text>
                        </View>
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <FlatList
                            data={transactions}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderTransaction}
                            style={styles.transactionList}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>Nema transakcija ovaj mjesec</Text>
                            }
                        />
                    )}

                    <Pressable style={styles.closeMenuItem} onPress={onClose}>
                        <Text style={styles.closeMenuItemText}>Zatvori</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default MemberDetailModal;
