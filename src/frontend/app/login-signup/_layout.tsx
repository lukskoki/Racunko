import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Stack} from "expo-router";
import {ProfileSetupProvider} from "@/contexts/ProfileSetupContext";

const _Layout = () => {
    return (
        <ProfileSetupProvider>
            <Stack>
                <Stack.Screen name="login" options={{headerShown: false}} />
                <Stack.Screen name="signup" options={{headerShown: false}} />
                <Stack.Screen name="profileSetup" options={{headerShown: false}} />
                <Stack.Screen name="expenseSetup" options={{headerShown: false}} />
            </Stack>
        </ProfileSetupProvider>

    )
}
export default _Layout;
