import {Keyboard, Pressable, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import React, {useState} from 'react'
import styles from "../../styles/manuallyTransaction";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

function format(d?: Date | null) {
    if (!d) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}.`;
}



const ManualInput = () => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("")
    const [type, setType] = useState("expense")
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(null);

    const sendToBackend = async() => {

        try {
            await login({username: username, password});
            router.push("/tabs/home-tab");
        }
        catch (error: any) {
            console.error('login failed: ', error);
            setErrorMessage(error.message || "Neispravan username ili password");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

            <View style={styles.transactionType}>
                {/* TROŠAK gumb */}
                <TouchableOpacity
                    onPress={() => setType("expense")}
                    style={type === "expense" ? styles.buttonExpense : styles.buttonGray}
                >
                    <Text style={styles.text4}>Trošak</Text>
                </TouchableOpacity>

                {/* PRIHOD gumb */}
                <TouchableOpacity
                    style={type === "income" ? styles.buttonIncome : styles.buttonGray}
                    onPress={() => setType("income")}
                >
                    <Text style={styles.text4}>Prihod</Text>
                </TouchableOpacity>
            </View>

            {/* Iznos */}
            <View style={styles.inputContainer}>

                <Text style={styles.text}>Iznos</Text>

                <View style={styles.amountWrap}>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        maxLength={10}
                        style={[type === "expense" ? {color: "red"} : {color: "green"}, styles.amount]}
                        placeholder="0"
                        placeholderTextColor="grey"
                    />
                    <Text style={[type === "expense" ? {color: "red"} : {color: "green"}, {fontSize: 25}]}> €</Text>
                </View>
            </View>

            {/* Kategorija */}
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Kategorija</Text>
                <View style={styles.amountWrap}>
                    <TextInput
                        value={category}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        maxLength={10}
                    />
                    <Pressable onPress={() => router.push("/tabs/camera-tab/categoryList")} style={styles.chooseCategory}>
                        <TextInput value={!category ? "Odaberi" : category} readOnly style={styles.text2}></TextInput>
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
                        value={format(date) || "Odaberi datum"}
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
        </TouchableWithoutFeedback>
    )
}
export default ManualInput;