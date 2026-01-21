import style from "@/app/styles/homePage";
import {Text, View} from "react-native";
import Progress from "react-native-progress";
import React from "react";
import {images} from "@/app/assets";


type Props = {
    /*Dodat element za sliku i da se dodaje u Category Expense i onda ju poslat iz home-tab*/
    spent: number,
    name: string;
};
export default function CategoryExpense({spent, name}: Props){
    return (
        <View style={style.categoryExpenseBox}>
            {/*<View style={styles.componentPictureBox}>*/}
            {/*    <Image source={images.hrana} style={styles.componentPicture}/>*/}
            {/*</View>*/}
            <View style={style.categoryName}>
                <Text style={style.categoryNameText}>{name}</Text>
            </View>
            <View style={style.categoryExpense}>
                <Text style={style.categoryExpenseText}>- {spent}€</Text>
            </View>
        </View>
    )
}