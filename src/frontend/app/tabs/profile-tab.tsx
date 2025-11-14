import {Pressable, Text, View} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import styles from "../styles/profile";
import {Image} from "expo-image";
import {images} from "@/app/assets";
import {router} from "expo-router";
import { useAuth } from '@/hooks/useAuth';

const Profil = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        // Ocisti token i user data
        logout();
    
        router.replace("/");
    };

    return (
        <SafeAreaView style={styles.display}>
            <View style={styles.profileHeaderBox}>
                <View style={styles.profileHeader}>
                    <Image source={images.profile} style={styles.profileImage}/>
                    <Text style={styles.profileHeaderText}>Profil</Text>
                </View>
                <View style={styles.line}></View>
            </View>
            <View style={styles.logOutBox} >
                <Pressable onPress={handleLogout} style={styles.logOutButton}>
                    <Text style={styles.logOutText}>Log Out</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}
export default Profil

