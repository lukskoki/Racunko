import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import styles from "@/app/styles/homeTab";
import {images} from "@/app/assets";
import {Image} from "expo-image";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type Expense = {
    id: number;
    amount: number;
    category: string;
    expenseName: string;
};


export function ExpenseItem({ expense , onDelete}: { expense: Expense , onDelete: (id: number) => void}) {

    const swipeRef = React.useRef<any>(null);
    const renderRightActions = () => {
        return (
            <TouchableOpacity
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f14d4d",
                    borderRadius: 6,
                    marginLeft: 10,
                    marginTop: 16,
                }}

                onPress={() => {
                    onDelete(expense.id);
                    swipeRef.current?.close();
                }}
            >
                <Image source={images.trash} style={{
                    width: "100%",
                    height: "100%",
                }}/>
            </TouchableOpacity>
        );
    };



    return (
        <Swipeable
            ref={swipeRef}
            renderRightActions={renderRightActions}
            rightThreshold={40}
            overshootRight={false}
        >
            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    alignContent: "center",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    width: "100%",
                    gap: 10,
                }}
            >
                <View style={{ flex: 1 , flexDirection: "row", alignItems: "center"}}>
                    <View style={styles.categoryDot} />
                    <View style={{
                        flexDirection: "column",
                    }}>
                        <Text style={{ fontSize: 17, fontWeight: "700", color: "#111827" }}>
                            {expense.expenseName}
                        </Text>
                        <Text style={{
                            color: "#898995",
                            fontSize: 12,
                            marginTop: 3,
                        }}>
                            {expense.category}
                        </Text>
                    </View>

                </View>

                <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
                    {expense.amount} €
                </Text>



            </View>
        </Swipeable>
    );
}