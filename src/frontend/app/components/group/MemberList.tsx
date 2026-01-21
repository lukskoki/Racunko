import React, { useState, useEffect } from 'react';
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
            <Text style={styles.sectionTitle}>Članovi ({members.length})</Text>

            <FlatList
                data={members}
                keyExtractor={(item) => item.userId.toString()}
                renderItem={renderMember}
                scrollEnabled={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        {isLoading ? 'Učitavanje članova...' : 'Nema članova'}
                    </Text>
                }
            />

            <AllowanceModal
                visible={showAllowanceModal}
                memberName={selectedMember?.user || ''}
                currentAllowance={selectedMember?.allowance || null}
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
