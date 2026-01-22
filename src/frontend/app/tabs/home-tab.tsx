import {
    ActivityIndicator, Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAnalytics} from '../../hooks/useAnalytics';
import {AnalyticsResponse, Category, deleteExpense, Expense, sendExpense} from '../../services/api';
import styles from '../styles/homeTab';
import {useExpenses} from "@/hooks/useExpenses";
import {Ionicons} from "@expo/vector-icons";
import {useCategories} from "@/hooks/useCategories";
import { List, TextInput } from "react-native-paper";
import {transparent} from "react-native-paper/src/styles/themes/v2/colors";
import {useSendExpense} from "@/hooks/useSendExpense";
import {ExpenseItem} from "@/app/components/ExpenseItem";
import { AuthContext } from "@/contexts/AuthContext";
import { images } from "@/app/assets";
import {Image} from "expo-image";
import {useAuth} from "@/hooks/useAuth";



const Pocetna = () => {
    const {fetchAnalytics, isLoading, error} = useAnalytics();
    const [refreshing, setRefreshing] = useState(false);
    const {createExpense} = useSendExpense();              // funkcija za slat expense novi
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const { token } = useAuth();
    const [amountByCategory, setAmountByCategory] = useState<Record<string, string>>({}); //Ovdje se sprema amount po kategoriji za expense
    const [nameByCategory, setNameByCategory] = useState<Record<string, string>>({});  // Ovdje se sprema expenseName po toj kategoriji za koju je napravljen
    const [modalVisible, setModalVisible] = useState(false);            //Ovo je za prikaz kategorija
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const {listExpenses} = useExpenses();
    const { listCategories } = useCategories();
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [value, setValue] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<number[]>([]);

    useEffect(() => {
        loadAnalytics();
        loadExpenses();
        loadCategories();
    }, [selectedMonth]);



    const handleDeleteExpense = async (id: number) => {
        try{
            if(!token){
                console.error("Morate biti prijavljeni");
                return;
            }
            await deleteExpense(id, token);
            setExpenses(prev => prev.filter(e => e.id !== id));
        }catch(e){
            console.error("Neuspješno brisanje: ", e);
        }
    };


    const loadAnalytics = async () => {
        try {
            const data = await fetchAnalytics(selectedMonth);
            setAnalytics(data);

        } catch (err) {
            console.error('Error loading analytics:', err);
        }
    };

    const loadExpenses = async () => {
        try{
            const data = await listExpenses();
            console.log(data);
            setExpenses(data);
        }catch(err){
            console.error('Error loading expenses:', err);
        }
    };

    const loadCategories = async () => {
        try{
            setLoadingCategories(true);
            const categories = await listCategories();
            setCategories(categories);
            setLoadingCategories(false);
        }catch(err){
            console.error('Error loading categories:', err);
        }
    };

    const selectCategory = (category: Category) => {
        setCategoryId(category.id);
        setCategoryName(category.categoryName);
        setSelectedCategory(prev => prev.includes(category.id) ? prev.filter(id => id !== category.id)
            : [...prev, category.id]
        );
        setExpandedId(prev => (prev === category.id ? null : category.id));

    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadAnalytics();
        await loadExpenses();
        await loadCategories();
        setRefreshing(false);
    }, [loadAnalytics]);

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

    if (isLoading && !refreshing) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
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
                <View style={styles.loadingContainer}>
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
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2563EB']}
                        tintColor="#2563EB"
                    />
                }
                >
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




                    <View style={styles.card1}>
                        <View style={styles.plusContainer}>
                            <Text style={styles.cardTitle}>Fiksni troškovi</Text>
                            <TouchableOpacity
                                style={styles.plusButton}
                                onPress={()=> setModalVisible(true)}
                            >
                                <Text style={styles.plus}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {expenses.map((item) => {
                            return (
                                <View style={{
                                    width: "100%",
                                    marginBottom: 10,
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    gap: 10,
                                    alignItems: "center",
                                }}>
                                    <ExpenseItem expense={item} onDelete={handleDeleteExpense}></ExpenseItem>

                                </View>

                            );
                        })}
                    </View>







                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <Pressable
                            style={styles.modalOverlay}
                            onPress={() => setModalVisible(false)}
                        >
                            <Pressable
                                style={styles.categoryBottomSheet}
                                onPress={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalHandle} />
                                    <Text style={styles.modalTitle}>Odaberite Kategoriju</Text>
                                </View>

                                {/* Kategorije */}
                                {loadingCategories ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#2563EB" />
                                        <Text style={styles.loadingText}>Učitavam kategorije...</Text>
                                    </View>
                                ) : (
                                    <ScrollView style={styles.categoriesScrollView}>
                                        {categories.map((category) => (

                                            <List.Accordion
                                                key={category.id}
                                                style={[
                                                    styles.categoryItem,
                                                ]}
                                                left={() => <View style={styles.categoryDot2} />}
                                                title={category.categoryName}
                                                onPress={() => selectCategory(category)}
                                            >


                                                <View style={{paddingBottom: 12, paddingLeft: 12, flexDirection:"row", justifyContent: "flex-start", gap: 10, alignItems: "center"}}>
                                                    <TextInput
                                                        label="Unesite vrstu troška..."
                                                        keyboardType="default"
                                                        returnKeyType="done"
                                                        value={nameByCategory[category.id] ?? ""}
                                                        onChangeText={(text) =>
                                                            setNameByCategory(prev =>({
                                                                ...prev,
                                                                [category.id]: text,
                                                            }))}
                                                        style={{
                                                            borderStyle: "solid",
                                                            borderWidth: 1,
                                                            width: "85%",
                                                            borderColor: '#2563EB',
                                                            backgroundColor: 'white',
                                                            borderRadius: 6,
                                                            fontSize: 16,

                                                        }}
                                                        underlineColor={transparent}
                                                        activeUnderlineColor={transparent}

                                                        contentStyle={{ textAlign: "left" }}


                                                    />
                                                </View>




                                                <View style={{paddingBottom: 12, paddingLeft: 12, flexDirection:"row", justifyContent: "flex-start", gap: 10, alignItems: "center"}}>
                                                    <TextInput
                                                        label="Unesite iznos..."
                                                        keyboardType="decimal-pad"
                                                        returnKeyType="done"
                                                        value={amountByCategory[category.id] ?? ""}
                                                        onChangeText={(text) =>
                                                            setAmountByCategory(prev =>({
                                                                ...prev,
                                                                [category.id]: text,
                                                            }))}
                                                        style={{
                                                            borderStyle: "solid",
                                                            borderWidth: 1,
                                                            width: "85%",
                                                            borderColor: '#2563EB',
                                                            backgroundColor: 'white',
                                                            borderRadius: 6,
                                                            fontSize: 16,

                                                        }}
                                                        underlineColor={transparent}
                                                        activeUnderlineColor={transparent}

                                                        contentStyle={{ textAlign: "left" }}
                                                        left={<TextInput.Affix text="€" />}

                                                    />

                                                    <TouchableOpacity
                                                        style={{
                                                            width: 45,
                                                            height: 45,
                                                            borderWidth: 1,
                                                            borderColor: '#FFFFFF',
                                                            backgroundColor: "#FFFFFF",
                                                            borderRadius: 8,
                                                            shadowColor: '#404040',
                                                            shadowOffset: { width: 0, height:2},
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 5,
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}

                                                        onPress={async () => {
                                                            try{
                                                                const amount = Number((amountByCategory[category.id] ?? "0").replace(",", "."));
                                                                const name = String(nameByCategory[category.id] ?? "");
                                                                if(amount != 0) {
                                                                    await createExpense({
                                                                        amount,
                                                                        category: category.id,
                                                                        expenseName: name,
                                                                    });
                                                                }else {
                                                                    return;
                                                                }


                                                                setAmountByCategory(prev => ({
                                                                    ...prev,
                                                                    [category.id]: "",
                                                                }));
                                                                setModalVisible(false);

                                                            } catch (error) {
                                                                console.error("Create expense error: ", error);
                                                            }
                                                        }}
                                                    >
                                                        <Text style={{
                                                            color: "#2563EB",
                                                            fontSize: 16,
                                                        }}>
                                                            →
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>




                                            </List.Accordion>


                                        ))}
                                    </ScrollView>
                                )}
                            </Pressable>
                        </Pressable>
                    </Modal>
                

                {/* Transaction Count */}
                <View style={styles.card}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.sectionTitle}>Ukupno transakcija ovaj mjesec:</Text>
                        <Text style={styles.summaryValue}>{personalAnalytics.transactionCount}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};
 

export default Pocetna;
