import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Stack} from "expo-router";

const _Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="login" options={{headerShown: false}} />
            <Stack.Screen name="signup" options={{headerShown: false}} />
            <Stack.Screen name="profileSetup" options={{headerShown: false}} />
        </Stack>
    )
}
export default _Layout;
