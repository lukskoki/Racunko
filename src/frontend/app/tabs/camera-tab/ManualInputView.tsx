import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {router, useLocalSearchParams} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { useTransaction } from "@/hooks/useTransaction";
import styles from "@/app/styles/manualInput";

{/* Format za date varijablu */}
function format(d?: Date | null) {
    if (!d) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}.`;
}

const ManualInputView = () => {

    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    const params = useLocalSearchParams<{
        categoryId?: string | string[];
        categoryName?: string | string[];
        amount?: string | string[];
        date?: string | string[];
    }>();

    // helper za normalizaciju
    function toStr(v?: string | string[]) {
        return Array.isArray(v) ? v[0] : v;   // uzmi prvi ako je array
    }
    const onAmountChange = (v: string) => {
        // dopusti samo znamenke, jednu točku/zarez i max 2 decimale
        const normalized = v.replace(",", ".");
        if (/^\d*\.?\d{0,2}$/.test(normalized)) {
            setAmount(v);
        }
    };

    const idStr = toStr(params.categoryId);
    const nameStr = toStr(params.categoryName);
    const amountStr = toStr(params.amount);
    const dateStr = toStr(params.date);

    useEffect(() => {

        if (typeof amountStr === "string") setAmount(amountStr);
        if (dateStr) {
            const d = new Date(dateStr);
            if (!Number.isNaN(d.getTime())) setDate(d);
        }

        if (idStr && nameStr) {
            setCategoryId(Number(idStr));
            setCategoryName(nameStr);
        }
    }, [idStr, nameStr, amountStr, dateStr]);

    const { createTransaction } = useTransaction();

    const sendToBackend = async() => {
        // Minimalna validacija
        if (!amount || !date || !categoryId) {
            setErrorMessage("Iznos, kategorija i datum su obavezni.");
            return;
        }
        const dateStr = date.toISOString().slice(0, 10);
        const amountNumber = parseFloat(amount.replace(",", "."));

        console.log(`Amount: ${amountNumber}, category: ${categoryId}, date: ${dateStr}`);

        {/* Tu se salju podaci na backend */}
        try {
            await createTransaction({amount: amountNumber, category: categoryId, date: dateStr});
            router.push("/tabs/home-tab");
        }
        catch (error: any) {
            console.error('sending failed: ', error);
            setErrorMessage(error.message || "Greška prilikom slanja!");
        }
    }

    const getCategories = async() => {
        Keyboard.dismiss();
        router.push({
            pathname: "/tabs/camera-tab/categoryList",
            params: {
                amount: amount ? amount.toString() : "",
                date: date ? date.toISOString() : "",
            },
        });
    }

    const isFormValid = amount.trim() !== '' && date !== null && categoryId !== null;

    return (
        <Pressable style={styles.wrapper} onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="wallet-outline" size={32} color="#2563EB" />
                    <Text style={styles.headerTitle}>Nova Transakcija</Text>
                </View>

                {/* Main Content Card */}
                <View style={styles.card}>
                    {/* Iznos */}
                    <View style={styles.amountSection}>
                        <Text style={styles.sectionLabel}>Unesite Iznos</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencySymbol}>€</Text>
                            <TextInput
                                value={amount}
                                onChangeText={onAmountChange}
                                keyboardType="decimal-pad"
                                maxLength={10}
                                style={styles.amountInput}
                                placeholder="0.00"
                                placeholderTextColor="#CBD5E1"
                            />
                        </View>
                    </View>

                    {/* Kategorija */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Kategorija</Text>
                        <TouchableOpacity
                            onPress={() => getCategories()}
                            style={styles.selectButton}
                        >
                            <View style={styles.selectContent}>
                                <Ionicons
                                    name={categoryName ? "pricetag" : "pricetag-outline"}
                                    size={20}
                                    color={categoryName ? "#2563EB" : "#94A3B8"}
                                />
                                <Text style={[
                                    styles.selectText,
                                    !categoryName && styles.selectTextPlaceholder
                                ]}>
                                    {categoryName || "Odaberite kategoriju"}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94A3B8"/>
                        </TouchableOpacity>
                    </View>

                    {/* Datum */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Datum</Text>
                        <TouchableOpacity
                            onPress={() => setOpen(true)}
                            style={styles.selectButton}
                        >
                            <View style={styles.selectContent}>
                                <Ionicons
                                    name={date ? "calendar" : "calendar-outline"}
                                    size={20}
                                    color={date ? "#2563EB" : "#94A3B8"}
                                />
                                <Text style={[
                                    styles.selectText,
                                    !date && styles.selectTextPlaceholder
                                ]}>
                                    {date ? format(date) : "Odaberite datum"}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94A3B8"/>
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={open}
                            mode="date"
                            onConfirm={(d) => { setDate(d); setOpen(false); }}
                            onCancel={() => setOpen(false)}
                        />
                    </View>
                </View>

                {/* Error Message */}
                {errorMessage && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#EF4444" />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                )}

                {/* Spremi Button */}
                <TouchableOpacity
                    style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
                    onPress={() => sendToBackend()}
                    disabled={!isFormValid}
                    activeOpacity={0.8}
                >
                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                    <Text style={styles.saveButtonText}>Spremi Transakciju</Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}


export default ManualInputView;
