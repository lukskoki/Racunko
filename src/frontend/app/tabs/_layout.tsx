import { Tabs } from 'expo-router';
import React from 'react';

import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {

  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
                title: "Home",

            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",

            }}
        />
    </Tabs>


  );
}
