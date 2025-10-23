import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Image} from "expo-image";
import {images} from "@/app/assets";

const Pocetna = () => {
    return (
        <View>
            <Text>Pocetna</Text>
            <Image source={images.home} />
        </View>
    )
}
export default Pocetna
const styles = StyleSheet.create({})
