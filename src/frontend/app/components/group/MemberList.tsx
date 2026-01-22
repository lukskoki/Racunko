import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '@/app/styles/groupTab';
import { Member, MemberSpending } from '@/services/api';
import MemberCard from './MemberCard';
import AllowanceModal from './AllowanceModal';
import MemberDetailModal from './MemberDetailModal';

interface MemberListProps {
    members: Member[];
    memberSpending: MemberSpending[];
    currentUserName: string;
    isOwner: boolean;
    isCoOwner: boolean;
    onAllowanceChange: (userId: number, allowance: number) => Promise<unknown>;
    onToggleAdmin: (userId: number) => Promise<void>;
    onRefreshNeeded?: () => Promise<void>;
    isLoading?: boolean;
}

const MemberList = ({
                        members,
                        memberSpending,
                        currentUserName,
                        isOwner,
                        isCoOwner,
                        onAllowanceChange,
                        onToggleAdmin,
                        onRefreshNeeded,
                        isLoading
                    }: MemberListProps) => {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [showAllowanceModal, setShowAllowanceModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailMemberSpent, setDetailMemberSpent] = useState(0);
    const [hasAttemptedAutoRefresh, setHasAttemptedAutoRefresh] = useState(false);

    const sortedMembers = useMemo(() => {
        return members
            .filter(m => m.role !== 'GroupLeader')
            .sort((a, b) => {
                const aIsCurrent = a.user === currentUserName;
                const bIsCurrent = b.user === currentUserName;

                if (aIsCurrent && !bIsCurrent) return -1;
                if (!aIsCurrent && bIsCurrent) return 1;

                const roleOrder = {
                    GroupCoLeader: 0,
                    GroupMember: 1,
                } as const;

                const orderA = roleOrder[a.role as keyof typeof roleOrder] ?? 99;
                const orderB = roleOrder[b.role as keyof typeof roleOrder] ?? 99;

                return orderA - orderB;
            });
    }, [members, currentUserName]);


    const leader = useMemo(
        () => members.find(m => m.role === 'GroupLeader') ?? null,
        [members]
    );

    const otherMembers = useMemo(
        () => sortedMembers.filter(m => m.role !== 'GroupLeader'),
        [sortedMembers]
    );

    // Auto-refresh ako nema članova prikazanih ali grupa postoji
    useEffect(() => {
        const shouldAutoRefresh =
            !isLoading &&
            members.length === 0 &&
            !hasAttemptedAutoRefresh &&
            onRefreshNeeded;

        if (shouldAutoRefresh) {
            console.log('Auto-refreshing members list...');
            setHasAttemptedAutoRefresh(true);
            onRefreshNeeded();
        }
    }, [members.length, isLoading, hasAttemptedAutoRefresh, onRefreshNeeded]);

    // Reset auto-refresh flag kad se članovi uspješno učitaju
    useEffect(() => {
        if (members.length > 0 && hasAttemptedAutoRefresh) {
            setHasAttemptedAutoRefresh(false);
        }
    }, [members.length]);


    const handleMenuPress = (member: Member) => {
        if (isOwner || isCoOwner) {
            setSelectedMember(member);
            setShowAllowanceModal(true);
        }
    };

    const handleCardPress = (member: Member, totalSpent: number) => {
        if (isOwner || isCoOwner) {
            setSelectedMember(member);
            setDetailMemberSpent(totalSpent);
            setShowDetailModal(true);
        }
    };

    const handleToggleAdmin = async () => {
        if (selectedMember) {
            await onToggleAdmin(selectedMember.userId);
            setShowAllowanceModal(false);
            setSelectedMember(null);
        }
    };

    const handleAllowanceSave = async (allowance: number) => {
        if (selectedMember) {
            await onAllowanceChange(selectedMember.userId, allowance);
            setShowAllowanceModal(false);
            setSelectedMember(null);
        }
    };

    // render za vlasnika (bez onMenuPress i bez onCardPress)
    const renderLeader = () => {
        if (!leader) {
            return (
                <Text style={styles.emptyText}>
                    {isLoading ? 'Učitavanje vlasnika...' : 'Nema vlasnika'}
                </Text>
            );
        }

        const spending = memberSpending.find(s => s.userId === leader.userId);
        const totalSpent = spending?.totalSpent || 0;

        return (
            <MemberCard
                member={leader}
                isCurrentUser={leader.user === currentUserName}
                canManage={isOwner}
                totalSpent={totalSpent}
            />
        );
    };

    // render za ostale članove
    const renderMember = ({ item }: { item: Member }) => {
        const spending = memberSpending.find(s => s.userId === item.userId);
        const totalSpent = spending?.totalSpent || 0;
        const canManageThisMember = (isOwner || isCoOwner) && item.role !== 'GroupLeader';

        return (
            <MemberCard
                member={item}
                isCurrentUser={item.user === currentUserName}
                canManage={canManageThisMember}
                onMenuPress={() => handleMenuPress(item)}
                onCardPress={() => handleCardPress(item, totalSpent)}
                totalSpent={totalSpent}
            />
        );
    };

    return (
        <View style={styles.memberListContainer}>
            <View>
                <Text style={styles.sectionTitle}>Vlasnik</Text>
                {renderLeader()}
            </View>

            <View>
                <Text style={styles.sectionTitle}>Članovi ({sortedMembers.length})</Text>
                <FlatList
                    data={sortedMembers}
                    keyExtractor={(item) => item.userId.toString()}
                    renderItem={renderMember}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {isLoading ? 'Učitavanje članova...' : 'Nema članova'}
                        </Text>
                    }
                />
            </View>

            <AllowanceModal
                visible={showAllowanceModal}
                memberName={selectedMember?.user || ''}
                currentAllowance={selectedMember?.allowance || null}
                isOwner={isOwner}
                isCoOwner={selectedMember?.role === 'GroupCoLeader'}
                onClose={() => {
                    setShowAllowanceModal(false);
                    setSelectedMember(null);
                }}
                onSave={handleAllowanceSave}
                onToggleAdmin={handleToggleAdmin}
                isLoading={isLoading}
            />


            <MemberDetailModal
                visible={showDetailModal}
                memberId={selectedMember?.userId || 0}
                memberName={selectedMember?.user || ''}
                totalSpent={detailMemberSpent}
                allowance={selectedMember?.allowance || null}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedMember(null);
                }}
            />
        </View>
    );
};

export default MemberList;
