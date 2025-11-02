import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Skeniraj from "@/app/tabs/camera-tab/camera";
import { SafeAreaView } from "react-native-safe-area-context";
import ManualInput from "@/app/tabs/camera-tab/manual-input";

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>

            {/* Kada se stisne plus otvori se kamera i gore se moze birati izmedu skeniraj ili unesi*/}
            <Tab.Navigator
                screenOptions={{
                    tabBarScrollEnabled: false,
                    tabBarIndicatorStyle: { height: 3 },
                    tabBarLabelStyle: { fontWeight: "600", fontSize: 16 },
                    tabBarStyle: { backgroundColor: "#fff" },
                }}
            >
                {/* Unesi */}
                <Tab.Screen
                    name="Skeniraj"
                    component={Skeniraj}
                    options={{ title: "Skeniraj",
                    headerShown: false}}
                />

                {/* Skeniraj */}
                <Tab.Screen
                    name="Unesi"
                    component={ManualInput}
                    options={{ title: "Unesi" }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}
