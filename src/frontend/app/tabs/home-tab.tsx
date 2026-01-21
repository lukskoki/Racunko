import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import style from "../styles/homePage";
import {SafeAreaView} from "react-native-safe-area-context";
import {Expense, useExpenses} from "@/hooks/useExpenses";
import {Transaction, useAllTransactions} from "@/hooks/useAllTransactions";
import {useFocusEffect} from "expo-router";
import {useProfileIncome} from "@/hooks/useProfileIncome";
import * as Progress from 'react-native-progress';
import {Category} from "@/services/api";
import {useCategories} from "@/hooks/useCategories";
import CategoryExpense from "@/app/components/CategoryExpense";
import sessionUrlProvider from "expo-auth-session/src/SessionUrlProvider";
import { MONTHS } from "../components/months";
import PieChart from "react-native-pie-chart";
import { LinearGradient } from "expo-linear-gradient";


const Pocetna = () => {
    const {listExpenses, isLoading} = useExpenses();
    const [expenses, setExpenses] = useState<Expense[]>([]);



    const [categories, setCategories] = useState<Category[]>([]);
    const {listCategories} = useCategories();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const {listAllTransactions, isLoaded} = useAllTransactions();

    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const {getProfileIncome} = useProfileIncome();
    const [income, setIncome] = useState<number>(0);


    const COLORS = [
        "#FF6B6B", // crvena / food
        "#4D96FF", // plava / transport
        "#FFD93D", // žuta
        "#6BCB77", // zelena
        "#845EC2", // ljubičasta
        "#FF9F45", // narančasta
        "#4D4D4D", // tamno siva
    ];
    useFocusEffect(
        useCallback(() => {
            listCategories().then(setCategories).catch(console.error);
            listExpenses().then(setExpenses).catch(console.error);
            listAllTransactions().then(setTransactions).catch(console.error);
            getProfileIncome().then((profile) => setIncome(profile.income)).catch(console.error);
        }, [listExpenses, listAllTransactions, getProfileIncome])
    );

    const [totals, setTotals] = useState<number[]>([]);
    let [sum, setSum] = useState<number>(0);

    useFocusEffect(
        useCallback(() => {
                let s = 0;
                for (let i = 0; i < expenses.length; i++) {
                    s += parseFloat(expenses[i].amount);
                }
                for(let i = 0; i < transactions.length; i++) {
                    if(month == new Date(transactions[i].date).getMonth()+1){
                        s += parseFloat(transactions[i].amount);
                    }
                }

                setSum(s);
        }, [expenses, transactions, month])
    );

    const CATEGORY_COLORS: Record<string, string> = {
      Food: "#FF6B6B",
      Transport: "#4D96FF",
      University: "#FFD93D",
      Restaurants: "#6BCB77",
      Trips: "#845EC2",
      Sports: "#FF9F45",
      Games: "#4D4D4D",
    };


    useFocusEffect(
        useCallback(() => {
            if (!categories.length || !expenses.length) return;
            const ukupno = new Array(categories.length).fill(0);

            for(let i = 0; i < categories.length; i++) {
                for(let j = 0; j < expenses.length; j++) {
                    if(expenses[j].category == categories[i].categoryName){
                        ukupno[i] += parseFloat(expenses[j].amount) || 0;

                    }
                }
            }

            for(let i = 0; i < categories.length; i++) {
                for(let j = 0; j < transactions.length; j++) {
                    if(transactions[j].category == categories[i].categoryName){

                        ukupno[i] += parseFloat(transactions[j].amount) || 0;

                    }
                }
            }

            setTotals(ukupno);
        }, [categories, expenses, transactions])
    );



    console.log(sum);
    console.log(income);
    const series = categories.map((category, index) => ({
        value: totals[index],
        color: CATEGORY_COLORS[category.categoryName]
    }));

    for (let i = 0; i < series.length; i++) {
        console.log(series[i].value);
        console.log(series[i].color);
    }
    const progress = income > 0 ? Math.max(0, Math.min(1, (income - sum) / income)) : 0;

    return (
        <ScrollView style={{flex: 1}}
            contentContainerStyle={{flex: 1}}
            >
            <SafeAreaView style={style.display}>

                <View style={style.topBoxContainer}>
                    <View style={style.topBoxHeaderContainer}>
                        <Text style={style.topBoxHeaderText}>
                            {MONTHS[month-1]}
                        </Text>
                    </View>


                    <View style={style.topBoxElementContainer}>
                        <View style={style.topBoxElement}>
                            <Text style={style.topBoxElementName}>Budžet</Text>
                            <Text style={style.topBoxElementBudget}>€{income}</Text>
                        </View>

                        <View style={style.topBoxElement}>
                            <Text style={style.topBoxElementName}>Potrošeno</Text>
                            <Text style={style.topBoxElementSpent}>€{sum.toFixed(2)}</Text>
                        </View>

                        <View style={style.topBoxElement}>
                            <Text style={style.topBoxElementName}>Preostalo</Text>
                            <Text style={style.topBoxElementRemaining}>€{(income - sum).toFixed(2)}</Text>
                        </View>
                    </View>


                    <View style={style.progressBarBox}>
                        <Progress.Bar progress={progress} width={300} color={"#11EA09FF"} borderColor={"black"} unfilledColor={"red"} borderWidth={0.5} height={13} borderRadius={20}/>
                    </View>



                </View>

                <View style={style.expenseHeader}>
                    <Text style={style.expenseText}>Potrošnja</Text>
                </View>
                <View style={{height: 240,
                    width: "100%",
                    borderRadius: 20,
                    overflow: "hidden",
                }}>
                    <ScrollView style={{height: 100, width: "100%"}}
                                contentContainerStyle={{justifyContent: "center", alignItems: "center"}}>
                        {categories.map((item) => {


                            return (
                                <CategoryExpense
                                    spent={totals[item.id-1] || 0}
                                    name={item.categoryName}
                                />


                            );
                        })}
                    </ScrollView>




                </View>


                <View style={style.expenseHeader}>
                    <Text style={style.expenseText}>Analitika</Text>
                </View>

                <View style={style.pieChartBox}>
                    <PieChart
                        widthAndHeight={200}
                        series={series}
                    />

                    <View style={style.grafSpentBox}>
                        <Text style={style.grafSpentText}>€{sum}</Text>
                    </View>
                </View>


            </SafeAreaView>
        </ScrollView>
    )
}
export default Pocetna
