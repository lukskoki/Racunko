import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useGroup } from '@/hooks/useGroup';
import NoGroupView from '@/app/components/group/NoGroupView';
import GroupView from '@/app/components/group/GroupView';
import styles from '@/app/styles/groupTab';

const Grupa = () => {
    const { hasGroup, fetchGroup, isLoading } = useGroup();
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        // Provjeri ima li korisnik grupu pri ucitavanju
        fetchGroup().finally(() => setInitialLoading(false));
    }, []);

    // Callback za kad se korisnik pridruzi grupi
    const handleGroupJoined = () => {
        fetchGroup();
    };

    // Callback za kad korisnik kreira grupu
    const handleGroupCreated = () => {
        fetchGroup();
    };

    // Callback za kad korisnik napusti grupu
    const handleGroupLeft = () => {
        // hasGroup se automatski postavlja na false u leaveGroupHandler
    };

    // Prikazi loading dok provjeravamo status grupe
    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Učitavanje...</Text>
            </View>
        );
    }

    // Prikazi odgovarajuci view ovisno o tome ima li korisnik grupu
    if (hasGroup) {
        return <GroupView onGroupLeft={handleGroupLeft} />;
    }

    return (
        <NoGroupView
            onGroupJoined={handleGroupJoined}
            onGroupCreated={handleGroupCreated}
        />
    );
};

export default Grupa;
