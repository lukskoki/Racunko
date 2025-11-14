import {Pressable, Text, View} from 'react-native'
import React from 'react'
import styles from "@/app/styles/upperTabStyle";
import {router, usePathname} from "expo-router";

const UpperTab = () => {
    const pathname = usePathname();
    const active = pathname.endsWith("/manual-input") ? "unesi" : "skeniraj";

    return (
        <View style={styles.container}>
            <Pressable style={active==="skeniraj" ? styles.buttonActive : styles.button} onPress={ () => {
                router.push("/tabs/camera-tab/camera")}}>
                <Text style={active==="skeniraj" ? styles.text : styles.plain}>Skeniraj</Text>
            </Pressable>

            <Pressable style={active!=="skeniraj" ? styles.buttonActive : styles.button} onPress={ () => {
                router.push("/tabs/camera-tab/manual-input")}}>
                <Text style={active!=="skeniraj" ? styles.text : styles.plain}>Unesi</Text>
            </Pressable>
        </View>
    )
}
export default UpperTab
