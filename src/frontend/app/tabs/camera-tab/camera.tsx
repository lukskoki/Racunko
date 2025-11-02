import {Camera, CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {Button, Pressable, View, Text, TouchableOpacity, Alert, Linking, AppState,Image} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import styles from "../../styles/camera"
import {useFocusEffect, useNavigation} from "expo-router";
import {images} from "@/app/assets";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {text} from "node:stream/consumers";


const Skeniraj = () => {
    const [permission, requestPermission ] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const navigation = useNavigation<any>();
    const comingFromSettings = useRef(false);
    const alertShown = useRef(false);
    const cameraRef = useRef<CameraView>(null);


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
        try {
            const result = await cameraRef.current?.takePictureAsync({
                quality: 1,
                base64: true,
                skipProcessing: true,
            });
            if(result?.uri){
                Alert.alert(
                    "Picture taken",
                    result?.uri ?? "No such picture taken",
                    [{text: "Ok", onPress: () => navigation.navigate("camera-tab")}],
                )
            }

        }catch(error){
            console.log("Error taking picture:", error);
        }
    }
    if(!permission) return;
    if(permission.granted){
        return (
            <View style={styles.container}>
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}/>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={toggleCameraFacing} >
                        <Image source={images.thumbnail} style={styles.flipButton}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePicture} >
                        <Image source={images.shutter} style={styles.shutterButton}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleCameraFacing}>
                        <Image source={images.flipCamera} style={styles.flipButton}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Skeniraj;