import React from 'react'
import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    height: 85,
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowOffset: {width: 0, height: -2},
                    shadowRadius: 8,
                    elevation: 4,
                },
                tabBarLabelStyle: {fontSize: 11, fontWeight: "thin"},
                tabBarItemStyle: {justifyContent: "center", alignItems: "center", paddingTop: 10},
            }}>
            <Tabs.Screen
                name="home-tab"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => <Ionicons
                    name={focused ? "home" : "home-outline"}
                    size={30}
                    color={focused ? "#2563EB" : "#888"} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="group-tab"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => <Ionicons
                    name={focused ? "people" : "people-outline"}
                    size={30}
                    color={focused ? "#2563EB" : "#888"} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="camera-tab"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => <Ionicons
                        name="add"
                        size={30}
                        color={focused ? "#2563EB" : "#888"}/>,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="chatbot-tab"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => <Ionicons
                        name={focused ? "chatbubbles" : "chatbubbles-outline"}
                        size={30}
                        color={focused ? "#2563EB" : "#888"}/>,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile-tab"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => <Ionicons
                        name={focused ? "person" : "person-outline"}
                        size={30}
                        color={focused ? "#2563EB" : "#888"}/>,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
