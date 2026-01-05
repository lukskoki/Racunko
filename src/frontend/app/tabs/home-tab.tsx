import {StyleSheet, Text, View} from 'react-native'
import React, {useCallback, useEffect, useState} from 'react'
import style from "../styles/homePage";
import {SafeAreaView} from "react-native-safe-area-context";
import {Expense, useExpenses} from "@/hooks/useExpenses";
import {Transaction, useAllTransactions} from "@/hooks/useAllTransactions";
import {useFocusEffect} from "expo-router";
import {useProfileIncome} from "@/hooks/useProfileIncome";


const Pocetna = () => {
    const {listExpenses, isLoading} = useExpenses();
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const {listAllTransactions, isLoaded} = useAllTransactions();

    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const {getProfileIncome} = useProfileIncome();
    const [income, setIncome] = useState();

    useFocusEffect(
        useCallback(() => {
            listExpenses().then(setExpenses).catch(console.error);
            listAllTransactions().then(setTransactions).catch(console.error);
            getProfileIncome().then(setIncome).catch(console.error);
        }, [listExpenses, listAllTransactions, getProfileIncome])
    );



    let sum = 0;
    for (let i = 0; i < expenses.length; i++) {
        sum += parseFloat(expenses[i].amount);
    }
    for(let i = 0; i < transactions.length; i++) {
        if(month == new Date(transactions[i].date).getMonth()+1){
            sum += parseFloat(transactions[i].amount);
        }
    }
    console.log(sum);
    console.log(parseFloat(income?.income));
    const remaining = parseFloat(income) - sum;
    return (
        <SafeAreaView style={style.display}>
            <View style={style.topBoxContainer}>
                <View style={style.topBoxHeaderContainer}>
                    <Text style={style.topBoxHeaderText}>
                        Monthly Overview
                    </Text>
                </View>
                <View style={style.topBoxElementContainer}>
                    <View style={style.topBoxElement}>
                        <Text style={style.topBoxElementName}>Total Budget</Text>
                        <Text style={style.topBoxElementBudget}> {parseFloat(income)} </Text>
                    </View>

                    <View style={style.topBoxElement}>
                        <Text style={style.topBoxElementName}>Spent</Text>
                        <Text style={style.topBoxElementSpent}> {sum} </Text>
                    </View>

                    <View style={style.topBoxElement}>
                        <Text style={style.topBoxElementName}>Remaining</Text>
                        <Text style={style.topBoxElementRemaining}> {remaining} </Text>
                    </View>
                </View>



            </View>
        </SafeAreaView>
    )
}
export default Pocetna
