import React, { useState } from 'react';
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
    onAllowanceChange: (userId: number, allowance: number) => Promise<unknown>;
    isLoading?: boolean;
}

const MemberList = ({
    members,
    memberSpending,
    currentUserName,
    isOwner,
    onAllowanceChange,
    isLoading
}: MemberListProps) => {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [showAllowanceModal, setShowAllowanceModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailMemberSpent, setDetailMemberSpent] = useState(0);

    const handleMenuPress = (member: Member) => {
        if (isOwner) {
            setSelectedMember(member);
            setShowAllowanceModal(true);
        }
    };

    const handleCardPress = (member: Member, totalSpent: number) => {
        if (isOwner) {
            setSelectedMember(member);
            setDetailMemberSpent(totalSpent);
            setShowDetailModal(true);
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
        return (
            <MemberCard
                member={item}
                isCurrentUser={item.user === currentUserName}
                canManage={isOwner && item.role !== 'GroupLeader'}
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
                    <Text style={styles.emptyText}>Nema članova</Text>
                }
            />

            <AllowanceModal
                visible={showAllowanceModal}
                memberName={selectedMember?.user || ''}
                currentAllowance={selectedMember?.allowance || null}
                onClose={() => {
                    setShowAllowanceModal(false);
                    setSelectedMember(null);
                }}
                onSave={handleAllowanceSave}
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
