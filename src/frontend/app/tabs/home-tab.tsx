import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAnalytics} from '../../hooks/useAnalytics';
import type {AnalyticsResponse} from '../../services/api';
import styles from '../styles/homeTab';
const Pocetna = () => {
    const {fetchAnalytics, isLoading, error} = useAnalytics();
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    useEffect(() => {
        loadAnalytics();
    }, [selectedMonth]);

    const loadAnalytics = async () => {
        try {
            const data = await fetchAnalytics(selectedMonth);
            setAnalytics(data);
        } catch (err) {
            console.error('Error loading analytics:', err);
        }
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        const [year, month] = selectedMonth.split('-').map(Number);
        let newYear = year;
        let newMonth = month;

        if (direction === 'prev') {
            newMonth -= 1;
            if (newMonth < 1) {
                newMonth = 12;
                newYear -= 1;
            }
        } else {
            newMonth += 1;
            if (newMonth > 12) {
                newMonth = 1;
                newYear += 1;
            }
        }

        setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
    };

    const formatMonthDisplay = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const monthNames = [
            'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
            'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
        ];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Učitavanje...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.errorText}>Greška: {error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!analytics) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.emptyText}>Nema dostupnih podataka</Text>
                </View>
            </SafeAreaView>
        );
    }

    const {personalAnalytics} = analytics;
    

    // Grupiraj transakcije po danima za graf
    const dailySpending = personalAnalytics.recentTransactions.reduce((acc: { [key: string]: number }, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit' });
        acc[date] = (acc[date] || 0) + Number(transaction.amount);
        return acc;
    }, {});

    // Sortiraj po datumu i uzmi zadnjih 7 dana
    const sortedDays = Object.entries(dailySpending)
        .sort((a, b) => {
            const dateA = new Date(a[0].split('.').reverse().join('-'));
            const dateB = new Date(b[0].split('.').reverse().join('-'));
            return dateA.getTime() - dateB.getTime();
        })
        .slice(-7);

    // Nadi maksimalnu vrijednost za skaliranje grafa
    const maxDailySpending = Math.max(...sortedDays.map(([, amount]) => amount), 1);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>
                {/* Month Selector */}
                <View style={styles.monthSelector}>
                    <TouchableOpacity
                        onPress={() => changeMonth('prev')}
                        style={styles.monthArrow}
                    >
                        <Text style={styles.monthArrowText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.monthText}>{formatMonthDisplay(selectedMonth)}</Text>
                    <TouchableOpacity
                        onPress={() => changeMonth('next')}
                        style={styles.monthArrow}
                    >
                        <Text style={styles.monthArrowText}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Header with Total Spending */}
                <View style={styles.header}>
                    <Text style={styles.headerSubtitle}>Ukupna potrošnja</Text>
                    <Text style={styles.headerAmount}>
                        {Number(personalAnalytics.totalSpent || 0).toFixed(2)} €
                    </Text>
                    {personalAnalytics.budget && (
                        <Text style={styles.headerBudget}>
                            od {Number(personalAnalytics.budget || 0).toFixed(2)} € budgeta
                        </Text>
                    )}
                </View>

                {/* Daily Spending Chart */}
                {sortedDays.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Potrošnja po danima</Text>
                        <View style={styles.chartContainer}>
                            {sortedDays.map(([date, amount]) => {
                                const heightPercentage = (amount / maxDailySpending) * 100;
                                return (
                                    <View key={date} style={styles.chartBar}>
                                        <Text style={styles.chartAmount}>
                                            {Number(amount).toFixed(0)}€
                                        </Text>
                                        <View style={styles.chartBarWrapper}>
                                            <View
                                                style={[
                                                    styles.chartBarFill,
                                                    { height: `${heightPercentage}%` },
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.chartDate}>{date}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.divider} />

                        {/* Spending by Category */}
                        <Text style={styles.sectionTitle}>Potrošnja po kategorijama</Text>
                        {personalAnalytics.spendingByCategory.length > 0 ? (
                            personalAnalytics.spendingByCategory.map((item, index) => (
                                <View key={index} style={styles.categoryRow}>
                                    <View style={styles.categoryLeft}>
                                        <View style={styles.categoryDot} />
                                        <Text style={styles.categoryName}>{item.category}</Text>
                                    </View>
                                    <Text style={styles.categoryAmount}>
                                        {Number(item.amount || 0).toFixed(2)} €
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Nema transakcija ovaj mjesec</Text>
                        )}
                    </View>
                )}

                

                {/* Transaction Count */}
                <View style={styles.card}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Ukupno transakcija ovaj mjesec:</Text>
                        <Text style={styles.summaryValue}>{personalAnalytics.transactionCount}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};
 

export default Pocetna;
