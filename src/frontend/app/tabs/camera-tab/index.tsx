import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '@/app/styles/upperTabStyle';

// Import komponenti
import CameraView from './CameraView';
import ManualInputView from './ManualInputView';

type TabType = 'skeniraj' | 'unesi';

const CameraTab = () => {
    const [activeTab, setActiveTab] = useState<TabType>('skeniraj');

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            {/* Gornji Tab */}
            <View style={styles.container}>
                <Pressable
                    style={activeTab === "skeniraj" ? styles.buttonActive : styles.button}
                    onPress={() => setActiveTab('skeniraj')}
                >
                    <Text style={activeTab === "skeniraj" ? styles.text : styles.plain}>Skeniraj</Text>
                </Pressable>

                <Pressable
                    style={activeTab === "unesi" ? styles.buttonActive : styles.button}
                    onPress={() => setActiveTab('unesi')}
                >
                    <Text style={activeTab === "unesi" ? styles.text : styles.plain}>Unesi</Text>
                </Pressable>
            </View>

            {/* Prikaži odgovarajući view ovisno o aktivnom tabu */}
            {activeTab === 'skeniraj' ? <CameraView /> : <ManualInputView />}
        </SafeAreaView>
    );
};

export default CameraTab;
