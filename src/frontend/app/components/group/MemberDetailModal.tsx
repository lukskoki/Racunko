/*
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

                    {/!* Summary *!/}
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

                    {/!* Transactions list *!/}
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
*/

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator, ScrollView } from 'react-native';
import styles from '@/app/styles/groupTab';
import homeStyles from '@/app/styles/homeTab';
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

    const formatDateShort = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('hr-HR', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `${numAmount.toFixed(2)} €`;
    };

    // Grupiraj transakcije po kategorijama
    const spendingByCategory = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + Number(transaction.amount);
        return acc;
    }, {});

    const categoryData = Object.entries(spendingByCategory)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

    // Grupiraj transakcije po danima za graf
    const dailySpending = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        const date = formatDateShort(transaction.date);
        acc[date] = (acc[date] || 0) + Number(transaction.amount);
        return acc;
    }, {});

    // Sortiraj po datumu i uzmi zadnjih 7 dana
    const sortedDays = Object.entries(dailySpending)
        .sort((a, b) => {
            const [dayA, monthA] = a[0].split('.');
            const [dayB, monthB] = b[0].split('.');
            const dateA = new Date(2024, parseInt(monthA) - 1, parseInt(dayA));
            const dateB = new Date(2024, parseInt(monthB) - 1, parseInt(dayB));
            return dateA.getTime() - dateB.getTime();
        })
        .slice(-7);

    const maxDailySpending = Math.max(...sortedDays.map(([, amount]) => amount), 1);

    const allowanceNum = allowance ? (typeof allowance === 'string' ? parseFloat(allowance as any) : allowance) : null;
    const isOverBudget = allowanceNum !== null && totalSpent > allowanceNum;

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

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}>
            <Pressable style={styles.menuModal} onPress={onClose}>
                <Pressable style={styles.detailModalContent}>
                    <View style={styles.menuHandle} />

                    <Text style={styles.menuTitle}>{memberName}</Text>

                    {isLoading ? (
                        <View style={styles.detailLoading}>
                            <ActivityIndicator size="small" color="#2563EB" />
                            <Text style={homeStyles.loadingText}>Učitavanje...</Text>
                        </View>
                    ) : error ? (
                        <Text style={homeStyles.errorText}>{error}</Text>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Header with Total Spending */}
                            <View style={homeStyles.header}>
                                <Text style={homeStyles.headerSubtitle}>Ukupna potrošnja</Text>
                                <Text style={[
                                    homeStyles.headerAmount,
                                    isOverBudget && styles.spendingValueOver
                                ]}>
                                    {formatCurrency(totalSpent)}
                                </Text>
                                {allowanceNum !== null && (
                                    <Text style={homeStyles.headerBudget}>
                                        od {formatCurrency(allowanceNum)} limita
                                    </Text>
                                )}
                            </View>

                            {/* Daily Spending Chart & Categories */}
                            {sortedDays.length > 0 && (
                                <View style={homeStyles.card}>
                                    <Text style={homeStyles.cardTitle}>Potrošnja po danima</Text>
                                    <View style={homeStyles.chartContainer}>
                                        {sortedDays.map(([date, amount]) => {
                                            const heightPercentage = (amount / maxDailySpending) * 100;
                                            return (
                                                <View key={date} style={homeStyles.chartBar}>
                                                    <Text style={homeStyles.chartAmount}>
                                                        {Number(amount).toFixed(0)}€
                                                    </Text>
                                                    <View style={homeStyles.chartBarWrapper}>
                                                        <View
                                                            style={[
                                                                homeStyles.chartBarFill,
                                                                { height: `${heightPercentage}%` },
                                                            ]}
                                                        />
                                                    </View>
                                                    <Text style={homeStyles.chartDate}>{date}</Text>
                                                </View>
                                            );
                                        })}
                                    </View>

                                    <View style={homeStyles.divider} />

                                    {/* Spending by Category */}
                                    <Text style={homeStyles.sectionTitle}>Potrošnja po kategorijama</Text>
                                    {categoryData.length > 0 ? (
                                        categoryData.map((item, index) => (
                                            <View key={index} style={homeStyles.categoryRow}>
                                                <View style={homeStyles.categoryLeft}>
                                                    <View style={homeStyles.categoryDot} />
                                                    <Text style={homeStyles.categoryName}>{item.category}</Text>
                                                </View>
                                                <Text style={homeStyles.categoryAmount}>
                                                    {formatCurrency(item.amount)}
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={homeStyles.emptyText}>Nema transakcija ovaj mjesec</Text>
                                    )}
                                </View>
                            )}

                            {/* Transaction Count */}
                            <View style={homeStyles.card}>
                                <View style={homeStyles.summaryRow}>
                                    <Text style={homeStyles.summaryLabel}>Ukupno transakcija ovaj mjesec:</Text>
                                    <Text style={homeStyles.summaryValue}>{transactions.length}</Text>
                                </View>
                            </View>

                            {/* Recent Transactions List */}
                            <View style={homeStyles.card}>
                                <Text style={homeStyles.cardTitle}>Nedavne transakcije</Text>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction, index) => (
                                        <View key={index}>
                                            {renderTransaction({ item: transaction })}
                                        </View>
                                    ))
                                ) : (
                                    <Text style={homeStyles.emptyText}>Nema transakcija ovaj mjesec</Text>
                                )}
                            </View>
                        </ScrollView>
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
