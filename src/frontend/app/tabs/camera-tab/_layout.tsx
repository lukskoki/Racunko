import React from 'react'
import {Stack} from "expo-router";

const _Layout = () => {
    return (
        <Stack>

            {/* ovo otvara kameru */}
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />
            
            {/* ovo otvara rucni unos racuna */}
            <Stack.Screen
                name="manual-input"
                options={{ headerShown: false }}
            />

            {/* ovo je dodatni ekran koji se otvara kada se stisne desna strelica za kategorije */}
            <Stack.Screen
                name="categoryList"
                options={{
                    title: "Kategorije",
                    headerBackTitleVisible: false,
                }}
            />
        </Stack>
    )
}
export default _Layout;
