import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {Pressable, View, Text, TouchableOpacity, Alert, Linking, AppState,Image, ActivityIndicator, Modal, TextInput} from "react-native";
import {useCallback, useRef, useState} from "react";
import styles from "../../styles/camera"
import {useFocusEffect, useNavigation} from "expo-router";
import {images} from "@/app/assets";
import React from "react";

import { categorizeReceipt } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Ionicons} from "@expo/vector-icons";


const Skeniraj = () => {
    const [permission, requestPermission ] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [receiptData, setReceiptData] = useState<{
        amount: number;
        category_name: string;
        category_id: number;
    } | null>(null);

    // Editable polja
    const [editedAmount, setEditedAmount] = useState("");
    const [editedCategory, setEditedCategory] = useState("");
    const [editedDate, setEditedDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const navigation = useNavigation<any>();
    const comingFromSettings = useRef(false);
    const alertShown = useRef(false);
    const cameraRef = useRef<CameraView>(null);
    const { token } = useAuth();


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

            // Spremi rezultat i prikaži ga u modalu
            setReceiptData({
                amount: aiResponse.amount,
                category_name: aiResponse.category_name,
                category_id: aiResponse.category_id
            });

            // Postavi editable polja
            setEditedAmount(aiResponse.amount.toString());
            setEditedCategory(aiResponse.category_name);
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

    function handleSaveReceipt() {


        // Zatvori modal i resetuj state
        setShowResultModal(false);
        setReceiptData(null);
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
    if(!permission) return;
    if(permission.granted){
        return (
            <View style={styles.container}>
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}/>

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
                                // Loading faza
                                <>
                                    <ActivityIndicator size="large" color="#007AFF" />
                                    <Text style={styles.modalTitle}>Analiziram račun...</Text>
                                    <Text style={styles.modalSubtitle}>Molimo pričekajte</Text>
                                </>
                            ) : receiptData ? (
                                // Rezultati
                                <>
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
                                            <TextInput
                                                style={styles.input}
                                                value={editedCategory}
                                                onChangeText={setEditedCategory}
                                                placeholder="Kategorija"
                                            />
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
                                </>
                            ) : null}
                        </View>
                    </View>
                </Modal>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={toggleCameraFacing} disabled={isAnalyzing} >
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
}

export default Skeniraj;