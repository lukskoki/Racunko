import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroup } from '@/hooks/useGroup';
import { useAuth } from '@/hooks/useAuth';
import GroupHeader from './GroupHeader';
import BudgetCard from './BudgetCard';
import MemberList from './MemberList';
import GroupMenuModal from './GroupMenuModal';
import styles from '@/app/styles/groupTab';

interface GroupViewProps {
    onGroupLeft?: () => void;
}

const GroupView = ({ onGroupLeft }: GroupViewProps) => {
    const { user } = useAuth();
    const {
        group,
        members,
        fetchGroup,
        fetchMembers,
        updateGroupBudget,
        updateMemberAllowance,
        leaveGroupHandler,
        isLoading
    } = useGroup();

    const [refreshing, setRefreshing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const loadData = useCallback(async () => {
        await Promise.all([fetchGroup(), fetchMembers()]);
    }, [fetchGroup, fetchMembers]);

    useEffect(() => {
        loadData().finally(() => setInitialLoading(false));
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    // Pronadi trenutnog korisnika u listi clanova
    const currentMember = members.find(m => m.user === user?.username);
    const isOwner = currentMember?.role === 'GroupLeader';
    const isAdmin = currentMember?.isAdmin || false;
    const canEdit = isOwner || isAdmin;

    const handleLeaveGroup = async () => {
        await leaveGroupHandler();
        onGroupLeft?.();
    };

    if (initialLoading) {
        return (
            <SafeAreaView style={styles.groupContainer}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Učitavanje...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!group) {
        return (
            <SafeAreaView style={styles.groupContainer}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>Nije moguće učitati grupu</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.groupContainer} edges={['top']}>
            <GroupHeader
                groupName={group.groupName}
                onMenuPress={() => setShowMenu(true)}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2563EB']}
                        tintColor="#2563EB"
                    />
                }
            >
                <BudgetCard
                    budget={group.budget}
                    canEdit={canEdit}
                    onBudgetChange={updateGroupBudget}
                    isLoading={isLoading}
                />

                <MemberList
                    members={members}
                    currentUserName={user?.username || ''}
                    isOwner={isOwner}
                    onAllowanceChange={updateMemberAllowance}
                    isLoading={isLoading}
                />
            </ScrollView>

            <GroupMenuModal
                visible={showMenu}
                groupCode={group.groupCode}
                onClose={() => setShowMenu(false)}
                onLeaveGroup={handleLeaveGroup}
                isLoading={isLoading}
            />
        </SafeAreaView>
    );
};

export default GroupView;
