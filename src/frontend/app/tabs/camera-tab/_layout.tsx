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
            {/* Glavni camera tab s tab switchingom */}
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />

            {/* Dodatni ekran koji se otvara kada se stisne desna strelica za kategorije */}
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
