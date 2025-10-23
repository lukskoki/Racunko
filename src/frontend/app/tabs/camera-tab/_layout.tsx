import React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {Camera} from "expo-camera";
import Skeniraj from "@/app/tabs/camera-tab/camera-tab";
import {SafeAreaView} from "react-native-safe-area-context";
import Profil from "@/app/tabs/profile-tab";

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
    return (
        <SafeAreaView style={{flex: 1}} edges={["top"]}>
            <Tab.Navigator
                screenOptions={{
                    tabBarScrollEnabled: false,
                    tabBarIndicatorStyle:{height:3},
                    tabBarLabelStyle: { fontWeight: "600" , fontSize: 16},
                    tabBarStyle: { backgroundColor: "#fff"},

                }}
            >
                <Tab.Screen name={"Skeniraj"} component={Skeniraj} options={{title: "Skeniraj"}}/>
                <Tab.Screen name={"Unesi"} component={Profil} options={{title: "Unesi"}}/>
            </Tab.Navigator>
        </SafeAreaView>

    );
}