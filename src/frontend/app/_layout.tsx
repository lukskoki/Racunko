import { Stack } from "expo-router";
import "../global.css";
import React from "react";
import { AuthProvider} from "@/contexts/AuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <AuthProvider>
                <Stack screenOptions={{ gestureEnabled: true }}>
                    <Stack.Screen
                        name="tabs"
                        options={{
                            headerShown: false,
                            gestureEnabled: false, // S ovim onemogucujemo da se moze swipeat da bi se vratilo iz home nazad na registraciju i login
                        }}
                    />
                    <Stack.Screen name="index" options={{headerShown: false}} />
                    <Stack.Screen name="login-signup" options={{headerShown: false}} />
                </Stack>
            </AuthProvider>
        </GestureHandlerRootView>

    );
}
