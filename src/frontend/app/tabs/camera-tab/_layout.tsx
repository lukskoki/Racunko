import React from 'react'
import {Stack} from "expo-router";
import {Platform} from "react-native";

const _Layout = () => {
    return (
        <Stack
            screenOptions={{
                keyboardHandlingEnabled: Platform.OS === "ios" ? false : undefined,
            }}
        >
            {/* ovo otvara kameru */}
            <Stack.Screen
                name="camera"
                options={{ headerShown: false }}
            />
            
            {/* ovo otvara rucni unos racuna */}
            <Stack.Screen
                name="manual-input"
                options={{ headerShown: false }}
            />

            {/* ovo je dodatni ekran koji se otvara kada se stisne desna strelica za kategorije */}
            <Stack.Screen
                name="categoryList"
                options={{
                    headerShown: true,
                    title: "Kategorije",
                    headerBackTitle: "Unesi",
                }}
            />
        </Stack>
    )
}
export default _Layout;
