import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/app/styles/groupTab';

interface GroupHeaderProps {
    groupName: string;
    onMenuPress: () => void;
}

const GroupHeader = ({ groupName, onMenuPress }: GroupHeaderProps) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{groupName}</Text>
            <Pressable style={styles.hamburgerButton} onPress={onMenuPress}>
                <Ionicons name="menu" size={25} color="#1E293B" />
            </Pressable>
        </View>
    );
};

export default GroupHeader;
