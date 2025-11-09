import {ImageSourcePropType, View, Text} from "react-native";
import styles from "@/app/styles/expenseSetup";
import React, {useState} from "react";
import {Image} from "expo-image";
import Checkbox from "expo-checkbox";


type Props = {
    id: string,
    title: string,
    image: ImageSourcePropType,
    onPress?: () => void;
    onToggle: (id: string) => void;
    checked: boolean;
};

export default function CategoryTile({ id, title, image, onToggle, onPress, checked}: Props) {

    return (
        <View style={styles.modalBoxComponent}>
            <View style={styles.componentPictureBox}>
                <Image source={image} style={styles.componentPicture}/>
            </View>
            <View style={styles.componentBox}>
                <Text style={styles.componentName}> {title} </Text>
                <Checkbox value={checked} onValueChange={()=>{
                    onToggle(id);
                }} color={checked ? "#2563EB" : "#2563EB"} />
            </View>

        </View>
    )
}