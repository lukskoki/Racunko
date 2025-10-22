import React from 'react'
import {Tabs} from "expo-router";


import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
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
