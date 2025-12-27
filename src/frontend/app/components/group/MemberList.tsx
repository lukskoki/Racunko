import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '@/app/styles/groupTab';
import { Member } from '@/services/api';
import MemberCard from './MemberCard';
import AllowanceModal from './AllowanceModal';

interface MemberListProps {
    members: Member[];
    currentUserName: string;
    isOwner: boolean;
    onAllowanceChange: (userId: number, allowance: number) => Promise<unknown>;
    isLoading?: boolean;
}

const MemberList = ({
    members,
    currentUserName,
    isOwner,
    onAllowanceChange,
    isLoading
}: MemberListProps) => {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [showAllowanceModal, setShowAllowanceModal] = useState(false);

    const handleMenuPress = (member: Member) => {
        if (isOwner) {
            setSelectedMember(member);
            setShowAllowanceModal(true);
        }
    };

    const handleAllowanceSave = async (allowance: number) => {
        if (selectedMember) {
            await onAllowanceChange(selectedMember.userId, allowance);
            setShowAllowanceModal(false);
            setSelectedMember(null);
        }
    };

    const renderMember = ({ item }: { item: Member }) => (
        <MemberCard
            member={item}
            isCurrentUser={item.user === currentUserName}
            canManage={isOwner && item.role !== 'GroupLeader'}
            onMenuPress={() => handleMenuPress(item)}
        />
    );

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
        </View>
    );
};

export default MemberList;
