import {
    ActivityIndicator,
    Animated, FlatList,
    Keyboard, KeyboardAvoidingView, Modal, Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import styles from "../../styles/manuallyTransaction";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {router, useLocalSearchParams} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { useTransactions } from "@/hooks/useTransactions";
import globals from "@/app/styles/globals";
import { SafeAreaView } from "react-native-safe-area-context";
import ScrollView = Animated.ScrollView;
import {useCategories} from "@/hooks/useCategories";
import type {Category} from "@/services/categories";


    {/* Format za date varijablu */}
function format(d?: Date | null) {
    if (!d) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}.`;
}

const ManualInput = () => {

    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [errorMessage, setErrorMessage] = useState('');



    const { createTransaction } = useTransactions();

    const sendToBackend = async() => {
        // Minimalna validacija
        if (!amount || !date || !categoryId) {
            setErrorMessage("Iznos, kategorija i datum su obavezni.");
            return;
        }
        const dateStr = date.toISOString().slice(0, 10);

        {/* Tu se salju podaci na backend */}
        try {
            await createTransaction({amount, category: categoryId, date: dateStr,});
            router.push("/tabs/home-tab");
        }
        catch (error: any) {
            console.error('sending failed: ', error);
            setErrorMessage(error.message || "Greška prilikom slanja!");
        }
    }


    const [data, setData] = useState<Category[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pickingCategory, setPickingCategory] = useState(false)
    const { listCategories } = useCategories();

    const getCategories = async() => {
        Keyboard.dismiss();
        setLoading(true)
        try {
            const res = await listCategories();
            setPickingCategory(true);
            setData(res);
        } catch (e: any) {
            setError(e.message || "Greška pri dohvaćanju kategorija");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <ActivityIndicator style={{ margin: 16 }} />;
    if (error) return <Text style={{ color: "red", margin: 16 }}>{error}</Text>;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Iznos */}
                <View style={styles.inputContainer}>

                    <Text style={styles.text}>Iznos</Text>

                    <View style={styles.amountWrap}>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            inputMode="numeric"
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

                    {/* “Input” koji otvara modal */}
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

            <Modal
                visible={pickingCategory}
                animationType="slide"
                onRequestClose={() => {
                    Keyboard.dismiss();
                    setPickingCategory(false)
                }}
            >
                <SafeAreaView style={{ flex: 1}}>
                    {loading ? (
                        <ActivityIndicator style={{ margin: 16 }} />
                    ) :
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={data}
                                keyExtractor={(c) => String(c.id)}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => setPickingCategory(false)}
                                        style={{
                                            paddingVertical: 12,
                                            paddingHorizontal: 16,
                                            borderBottomWidth: 1,
                                            borderColor: "#eee",
                                            backgroundColor: item.id === selectedId ? "#f2f2f2" : "white",
                                        }}
                                    >
                                        <Text style={{ fontWeight: item.id === selectedId ? "700" : "400" }}>
                                            {item.categoryName}
                                        </Text>
                                    </Pressable>
                                )}
                                ListEmptyComponent={<Text style={{ padding: 16 }}>Nema kategorija.</Text>}
                            />
                        </View>
                    }
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}
export default ManualInput;