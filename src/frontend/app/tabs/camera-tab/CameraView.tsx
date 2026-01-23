import {CameraType, CameraView as ExpoCameraView, useCameraPermissions} from "expo-camera";
import {Pressable, View, Text, TouchableOpacity, Alert, Linking, AppState, Image, ActivityIndicator, Modal, TextInput, Keyboard, TouchableWithoutFeedback} from "react-native";
import {useCallback, useRef, useState} from "react";
import styles from "../../styles/camera"
import {useFocusEffect, useNavigation} from "expo-router";
import {images} from "@/app/assets";
import React from "react";
import * as ImagePicker from 'expo-image-picker';

import { categorizeReceipt, type Category } from '@/services/api';
import { useTransaction } from "@/hooks/useTransaction";
import { useAuth } from '@/hooks/useAuth';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Ionicons} from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';

const CameraView = () => {
    const [permission, requestPermission ] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [receiptData, setReceiptData] = useState<{
        amount: number;
        category_name: string;
        category_id: number;
    } | null>(null);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

    // Editable polja
    const [editedAmount, setEditedAmount] = useState("");
    const [editedCategoryId, setEditedCategoryId] = useState<number | null>(null);
    const [editedDate, setEditedDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const navigation = useNavigation<any>();
    const comingFromSettings = useRef(false);
    const alertShown = useRef(false);
    const cameraRef = useRef<ExpoCameraView>(null);
    const { token } = useAuth();
    const {createTransaction, error} = useTransaction();


    useFocusEffect(
        useCallback(() => {
            if(!permission) return;
            if(!permission.granted){
                if(permission.canAskAgain){
                    requestPermission();
                }else{
                    alertShown.current = true;
                    Alert.alert(
                        "Permission needed",
                        "Camera access denied. To use the Scan option enable permissions in the Settings.",
                        [{text: "Open Settings", onPress: () => {
                                comingFromSettings.current = true;
                                Linking.openSettings();
                            }},
                            {text: "Cancel", onPress: () => {navigation.navigate("home-tab")
                                }}
                        ],

                    )
                }

            }
        }, [permission,requestPermission,navigation])

    );


    useFocusEffect(() => {
        const sub = AppState.addEventListener("change", async (state) =>{
            if(state === "active" && comingFromSettings.current){
                navigation.navigate("home-tab");
            }
        })
    })

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function pickImageFromGallery() {
        try {
            // Zatraži dozvolu za pristup galeriji
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert("Dozvola potrebna", "Molimo dozvolite pristup galeriji");
                return;
            }

            // Otvori image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 1,
                base64: true,
            });

            if (result.canceled) {
                return;
            }

            if (!result.assets[0].base64) {
                Alert.alert("Greška", "Nije moguće učitati sliku");
                return;
            }

            if (!token) {
                Alert.alert("Greška", "Token nedostaje");
                return;
            }

            // Analiziraj sliku kao i za kameru
            setIsAnalyzing(true);
            const aiResponse = await categorizeReceipt(result.assets[0].base64, token);

            

            setAvailableCategories(aiResponse.available_categories);

            setReceiptData({
                amount: aiResponse.amount,
                category_name: aiResponse.category_name,
                category_id: aiResponse.category_id
            });

            setEditedAmount(aiResponse.amount.toString());
            setEditedCategoryId(aiResponse.category_id);
            setEditedDate(new Date());

            setIsAnalyzing(false);
            setShowResultModal(true);

        } catch (error: any) {
            console.error("Error analyzing image from gallery:", error);
            setIsAnalyzing(false);
            Alert.alert(
                "Greška pri analizi",
                error.message || "Nije moguće analizirati sliku"
            );
        }
    }

    async function takePicture() {
        if (!token) {
            Alert.alert("Error", "Token nedostaje");
            return;
        }
        try {
            setIsAnalyzing(true);
            const result = await cameraRef.current?.takePictureAsync({
                quality: 1,
                base64: true,
                skipProcessing: true,
            })
            if(!result?.base64){
                Alert.alert("Error", "Slikanje neuspjelo");
                setIsAnalyzing(false);
                return;
            }

            const aiResponse = await categorizeReceipt(result.base64, token!);

            console.log("AI response:", aiResponse);

            // Spremi dostupne kategorije
            setAvailableCategories(aiResponse.available_categories);

            console.log("kategorije: ", availableCategories);


            // Spremi rezultat i prikaži ga u modalu
            setReceiptData({
                amount: aiResponse.amount,
                category_name: aiResponse.category_name,
                category_id: aiResponse.category_id
            });


            // Postavi editable polja
            setEditedAmount(aiResponse.amount.toString());
            setEditedCategoryId(aiResponse.category_id);
            setEditedDate(new Date());

            setIsAnalyzing(false);
            setShowResultModal(true);

        } catch(error: any) {
            console.error("Error analyzing receipt:", error);
            setIsAnalyzing(false);
            Alert.alert(
                "Greška pri analizi",
                error.message || "Nije moguće analizirati račun"
            );
        }
    }

    async function handleSaveReceipt() {
        try {
            // Treba zamjenit zarez sa tockom jer se inace decimalno nece zapamtit
            const normalizedAmount = editedAmount.replace(',', '.');

            // Konvertiraj string u number
            const amountNumber = parseFloat(normalizedAmount);

            if (isNaN(amountNumber) || amountNumber <= 0) {
                Alert.alert("Greška", "Molimo unesite ispravan iznos");
                return;
            }

            if (!editedCategoryId) {
                Alert.alert("Greška", "Kategorija nije odabrana");
                return;
            }

            // Prikazi loading
            setIsSaving(true);

            // Format datuma za backend (YYYY-MM-DD)
            const formattedDate = editedDate.toISOString().split('T')[0];

            // Posalji transakciju na backend
            const response = await createTransaction({
                amount: amountNumber,
                category: editedCategoryId,
                date: formattedDate
            });

            console.log("Transaction created:", response);


            setIsSaving(false);
            setShowSuccess(true);

            // Zatvori modal nakon 2 sekunde
            setTimeout(() => {
                setShowSuccess(false);
                setShowResultModal(false);
                setReceiptData(null);
            }, 2000);

        } catch (error: any) {
            setIsSaving(false);
            Alert.alert("Greska", error.message || "Greska pri spremanju transakcije");
        }
    }

    function handleCancelReceipt() {
        setShowResultModal(false);
        setReceiptData(null);
    }

    function formatDate(date: Date): string {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yy = date.getFullYear();
        return `${dd}.${mm}.${yy}.`;
    }

    if (!permission) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#fff" }}>Provjeravam dozvole…</Text>
            </View>
        );
    }

    if(permission.granted){
        return (
            <View style={styles.container}>
                <ExpoCameraView style={styles.camera} facing={facing} ref={cameraRef}/>

                {/* Bottom Modal za rezultate */}
                <Modal
                    visible={isAnalyzing || showResultModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={handleCancelReceipt}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.bottomSheet}>
                            {isAnalyzing ? (
                                // Analiza racuna
                                <>
                                    <ActivityIndicator size="large" color="#007AFF" />
                                    <Text style={styles.modalTitle}>Analiziram račun...</Text>
                                    <Text style={styles.modalSubtitle}>Molimo pričekajte</Text>
                                </>
                            ) : isSaving ? (
                                // Spremanje transakcije
                                <>
                                    <ActivityIndicator size="large" color="#007AFF" />
                                    <Text style={styles.modalTitle}>Spremam transakciju...</Text>
                                    <Text style={styles.modalSubtitle}>Molimo pričekajte</Text>
                                </>
                            ) : showSuccess ? (
                                // Success
                                <>
                                    <View style={styles.successIcon}>
                                        <Ionicons name="checkmark-circle" size={80} color="#34C759" />
                                    </View>
                                    <Text style={styles.modalTitle}>Uspješno spremljeno!</Text>
                                    <Text style={styles.modalSubtitle}>Transakcija je dodana</Text>
                                </>
                            ) : receiptData ? (
                                // Pregled responsa
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                    <View style={{width: '100%', alignItems: 'center'}}>
                                        <Text style={styles.modalTitle}>Račun analiziran!</Text>
                                        <Text style={styles.modalSubtitle}>Provjerite i uredite podatke</Text>

                                        <View style={styles.resultContainer}>
                                            {/* Iznos */}
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Iznos (€)</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={editedAmount}
                                                    onChangeText={setEditedAmount}
                                                    keyboardType="decimal-pad"
                                                    placeholder="0.00"
                                                />
                                            </View>

                                            {/* Kategorija */}
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Kategorija</Text>
                                                <View style={styles.pickerContainer}>
                                                    <Picker
                                                        selectedValue={editedCategoryId}
                                                        onValueChange={(itemValue) => setEditedCategoryId(itemValue)}

                                                        itemStyle={{fontSize: 16, color: '#333'}}
                                                    >
                                                        <Picker.Item label="Odaberi kategoriju..." value={null} />
                                                        {availableCategories.map((category) => (
                                                            <Picker.Item
                                                                key={category.id}
                                                                label={category.categoryName}
                                                                value={category.id}
                                                            />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>

                                            {/* Datum */}
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Datum</Text>
                                                <Pressable onPress={() => setShowDatePicker(true)}>
                                                    <View style={styles.dateInput}>
                                                        <Text style={styles.dateText}>{formatDate(editedDate)}</Text>
                                                        <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                                                    </View>
                                                </Pressable>
                                            </View>

                                            {/* Date Picker Modal */}
                                            <DateTimePickerModal
                                                isVisible={showDatePicker}
                                                mode="date"
                                                onConfirm={(date) => {
                                                    setEditedDate(date);
                                                    setShowDatePicker(false);
                                                }}
                                                onCancel={() => setShowDatePicker(false)}
                                            />
                                        </View>

                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity
                                                style={styles.cancelButton}
                                                onPress={handleCancelReceipt}
                                            >
                                                <Text style={styles.cancelButtonText}>Otkaži</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.saveButton}
                                                onPress={handleSaveReceipt}
                                            >
                                                <Text style={styles.saveButtonText}>Spremi</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            ) : null}
                        </View>
                    </View>
                </Modal>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={pickImageFromGallery} disabled={isAnalyzing} >
                        <Image source={images.thumbnail} style={styles.flipButton}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePicture} disabled={isAnalyzing}>
                        <Image source={images.shutter} style={styles.shutterButton}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleCameraFacing} disabled={isAnalyzing}>
                        <Image source={images.flipCamera} style={styles.flipButton}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return null;
}

export default CameraView;
