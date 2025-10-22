import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Link} from "expo-router";

const Signup = () => {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-2xl">Napravit sign up</Text>
            <Link href="/tabs/home-tab"> Continue</Link>
        </View>
    )
}
export default Signup
const styles = StyleSheet.create({})
