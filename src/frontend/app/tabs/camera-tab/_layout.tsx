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

        </Stack>
    )
}
export default _Layout;
