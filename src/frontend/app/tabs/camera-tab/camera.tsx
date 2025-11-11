import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking, AppState, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import {router} from "expo-router";
import styles from "../../styles/camera";
import { images } from "@/app/assets";
import UpperTab from "@/app/tabs/camera-tab/upperTab";

const Skeniraj = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("back");
    const comingFromSettings = useRef(false);
    const cameraRef = useRef<CameraView>(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (!permission) return;
        if (!permission.granted && permission.canAskAgain) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    useEffect(() => {
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active" && comingFromSettings.current) {
                comingFromSettings.current = false;
                // ostani na istom ekranu; ništa dodatno
            }
        });
        return () => sub.remove();
    }, []);

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const takePicture = async () => {
        try {
            const result = await cameraRef.current?.takePictureAsync({
                quality: 1,
                base64: true,
                skipProcessing: true,
            });
            if (result?.uri) {
                Alert.alert("Picture taken", result.uri, [
                    { text: "Ok", onPress: () => router.push("/tabs/home-tab") },
                ]);
            }
        } catch (error) {
            console.log("Error taking picture:", error);
            Alert.alert("Greška", "Nije moguće snimiti fotografiju.");
        }
    };

    if (!permission) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top"]}>
                <UpperTab />
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff" }}>Provjeravam dozvole…</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top"]}>
                <UpperTab />
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <Text style={{ color: "#fff", textAlign: "center", paddingHorizontal: 24 }}>
                        Za skeniranje je potrebna dozvola za kameru.
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (permission.canAskAgain) requestPermission();
                            else {
                                comingFromSettings.current = true;
                                Linking.openSettings();
                            }
                        }}
                        style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#2563EB", borderRadius: 8 }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>Dodijeli dozvolu</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Gornji tab */}
            <UpperTab />

            {isFocused ? (
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                    active={true}
                    onCameraReady={() => console.log("Camera ready")}
                />
            ) : (
                <View style={[styles.camera, { backgroundColor: "#000" }]} />
            )}

            {/* Kontrole */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleCameraFacing}>
                    <Image source={images.thumbnail} style={styles.flipButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture}>
                    <Image source={images.shutter} style={styles.shutterButton} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraFacing}>
                    <Image source={images.flipCamera} style={styles.flipButton} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Skeniraj;
