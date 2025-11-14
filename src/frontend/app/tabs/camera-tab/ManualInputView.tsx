import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import styles from "../../styles/manuallyTransaction";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {router, useLocalSearchParams} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { useTransaction } from "@/hooks/useTransaction";
import globals from "@/app/styles/globals";

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

    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container]} >
            {/* Iznos */}
            <View style={styles.inputContainer}>

                <Text style={styles.text}>Iznos</Text>

                <View style={styles.amountWrap}>
                    <TextInput
                        value={amount}
                        onChangeText={onAmountChange}
                        keyboardType="numeric"
                        maxLength={10}
                        style={styles.amount}
                        placeholder="0"
                        placeholderTextColor="grey"
                    />
                    <Text style={{color: "red", fontSize: 25}}> €</Text>
                </View>
            </View>

            {/* Kategorija */}
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Kategorija</Text>
                <View style={styles.amountWrap}>

                    {/* Ovo nas salje na categoyrList stranicu da se odabere kategorija */}
                    <Pressable onPress={() => getCategories()}
                               style={styles.chooseCategory}>
                        <Text style={styles.text2}>{!categoryName ? "Odaberi" : categoryName}</Text>
                        <Ionicons name="chevron-forward" size={20}/>
                    </Pressable>
                </View>
            </View>

            {/* Datum */}
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Datum</Text>

                {/* "Input" koji otvara modal */}
                <Pressable onPress={() => setOpen(true)}>
                    <TextInput
                        editable={false}
                        pointerEvents="none"
                        value={format(date) || "Odaberi"}
                        style={styles.text2}
                    />
                </Pressable>

                {/* Modal date picker */}
                <DateTimePickerModal
                    isVisible={open}
                    mode="date"
                    onConfirm={(d) => { setDate(d); setOpen(false); }}
                    onCancel={() => setOpen(false)}
                />
            </View>

            {errorMessage && (
                <View style ={globals.errorContainer}>
                    <Text style={globals.errorText}>{errorMessage}</Text>
                </View>
            )}

            {/* Spremi gumb */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => sendToBackend()}
                >
                    <Text style={styles.text3}>SPREMI</Text>
                </TouchableOpacity>
            </View>
        </View>
        </Pressable>
    )
}
export default ManualInputView;
