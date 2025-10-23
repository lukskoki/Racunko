import React from 'react'
import {Tabs} from "expo-router";


import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {borderWidth: 2, borderTopRightRadius: 15, borderTopLeftRadius: 15, height: 90,  width: '100%', shadowColor: "#3e3d3d", shadowOpacity: 0.7,
                    shadowOffset:{width:0, height:-4},shadowRadius:2, elevation:15},
                tabBarLabelStyle: {fontSize: 11, fontWeight: "thin"},
                tabBarItemStyle: {justifyContent: "center", alignItems: "center", paddingTop: 10},
            }}>
            <Tabs.Screen
                name="home-tab"
                options={{
                    title: 'Početna',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color="black" />,

                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="group-tab"
                options={{
                    title: 'Grupa',
                    tabBarIcon: ({ color }) => <Feather name="award" size={24} color="black" />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="camera-tab"
                options={{
                    title: 'Skeniraj',
                    tabBarIcon: ({ color }) => <Feather name="plus" size={24} color="black" />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="chatbot-tab"
                options={{
                    title: 'ChatBot',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color="black" />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile-tab"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color="black" />,
                    headerShown: false,
                }}
            />


        </Tabs>
    );
}
