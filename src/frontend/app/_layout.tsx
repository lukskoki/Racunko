import { Stack } from "expo-router";
import "../global.css";
import React from "react";
export default function RootLayout() {
    return <Stack screenOptions={{ gestureEnabled: true }}>
        <Stack.Screen
            name="tabs"
            options={{
                headerShown: false,
                gestureEnabled: false, // S ovim onemogucujemo da se moze swipeat da bi se vratilo iz home nazad na registraciju i login
            }}
        />
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="login-signup" options={{headerShown: false}} />
    </Stack>;
}
