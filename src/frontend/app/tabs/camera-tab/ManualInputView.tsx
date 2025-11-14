import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View, Modal, ScrollView, ActivityIndicator} from 'react-native'
import React, {useEffect, useState} from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {router, useLocalSearchParams} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { useTransaction } from "@/hooks/useTransaction";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/services/api";
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
    const [open, setOpen] = useState(false); // State za prikaz date time pickera
    const [date, setDate] = useState<Date | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false); // S ovim pratimo dal prikazujemo modal za kategorije
    const [categories, setCategories] = useState<Category[]>([]); // Spremamo kategorije u state varijablu da izbjegnemo ponovno pozivanje API-a, ako user opet stisne kategorije
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Ovdje pratimo kad smo stisnuli save pa da mozemo prikazat loader za slanje transkacije
    const [showSuccess, setShowSuccess] = useState(false); // S ovim pratimo dal je spremanje bilo uspjesno, pa mozemo prikazat success poruku

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
    const { listCategories } = useCategories();

    const sendToBackend = async() => {
        // Minimalna validacija
        if (!amount || !date || !categoryId) {
            setErrorMessage("Iznos, kategorija i datum su obavezni.");
            return;
        }

        setErrorMessage(''); // Makni prijasnje errore
        setIsSaving(true); // Prikazi loadanje

        const dateStr = date.toISOString().slice(0, 10);
        const amountNumber = parseFloat(amount.replace(",", "."));

        console.log(`Amount: ${amountNumber}, category: ${categoryId}, date: ${dateStr}`);

        {/* Tu se salju podaci na backend */}
        try {
            await createTransaction({amount: amountNumber, category: categoryId, date: dateStr});

            setIsSaving(false);
            setShowSuccess(true);

            // Cekaj 2 sekunde pa resetiraj formu i idi na home
            setTimeout(() => {
                setShowSuccess(false);
                // Resetiranje 
                setAmount('');
                setCategoryId(null);
                setCategoryName(null);
                setDate(null);
                router.push("/tabs/home-tab");
            }, 2000);
        }
        catch (error: any) {
            console.error('sending failed: ', error);
            setIsSaving(false);
            setErrorMessage(error.message || "Greška prilikom slanja!");
        }
    }

    const openCategoryModal = async() => {
        Keyboard.dismiss();
        setShowCategoryModal(true);

        // Dohvati kategorije ako ih jod nema
        if (categories.length === 0) {
            try {
                setLoadingCategories(true);
                const fetchedCategories = await listCategories();
                setCategories(fetchedCategories);
                setLoadingCategories(false);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setLoadingCategories(false);
            }
        }
    }

    const selectCategory = (category: Category) => {
        setCategoryId(category.id);
        setCategoryName(category.categoryName);
        setShowCategoryModal(false);
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
                            onPress={() => openCategoryModal()}
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

                {/* Error */}
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

                {/* Selektiranje kategorije */}
                <Modal
                    visible={showCategoryModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowCategoryModal(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setShowCategoryModal(false)}
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
                                        
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryItem,
                                                categoryId === category.id && styles.categoryItemSelected
                                            ]}
                                            onPress={() => selectCategory(category)}
                                        >
                                            <Ionicons
                                                name="pricetag"
                                                size={22}
                                                color={categoryId === category.id ? "#2563EB" : "#64748B"}
                                            />
                                            <Text style={[
                                                styles.categoryItemText,
                                                categoryId === category.id && styles.categoryItemTextSelected
                                            ]}>
                                                {category.categoryName}
                                            </Text>
                                            {categoryId === category.id && (
                                                <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>

                {/* Save status */}
                <Modal
                    visible={isSaving || showSuccess}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.statusModalOverlay}>
                        <View style={styles.statusModalContent}>
                            {isSaving ? (
                                <>
                                    <ActivityIndicator size="large" color="#2563EB" />
                                    <Text style={styles.statusModalTitle}>Spremam transakciju...</Text>
                                    <Text style={styles.statusModalSubtitle}>Molimo pričekajte</Text>
                                </>
                            ) : showSuccess ? (
                                <>
                                    <View style={styles.successIconContainer}>
                                        <Ionicons name="checkmark-circle" size={80} color="#34C759" />
                                    </View>
                                    <Text style={styles.statusModalTitle}>Uspješno spremljeno!</Text>
                                    <Text style={styles.statusModalSubtitle}>Transakcija je dodana</Text>
                                </>
                            ) : null}
                        </View>
                    </View>
                </Modal>
            </View>
        </Pressable>
    )
}


export default ManualInputView;
