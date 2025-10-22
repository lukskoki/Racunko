import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Link} from "expo-router";

const Login = () => {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-2xl">Napravit log in</Text>
            <Link href="/tabs/home-tab"> Continue</Link>
        </View>
    )
}
export default Login
const styles = StyleSheet.create({})
