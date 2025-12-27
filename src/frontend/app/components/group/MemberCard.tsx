import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/app/styles/groupTab';
import { Member } from '@/services/api';

interface MemberCardProps {
    member: Member;
    isCurrentUser: boolean;
    canManage: boolean;
    onMenuPress?: () => void;
}

const MemberCard = ({ member, isCurrentUser, canManage, onMenuPress }: MemberCardProps) => {
    const getRoleBadge = () => {
        if (member.role === 'GroupLeader') return 'Vlasnik';
        if (member.isAdmin) return 'Admin';
        return 'Član';
    };

    const getInitials = () => {
        return member.user.charAt(0).toUpperCase();
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null || amount === undefined) {
            return null;
        }
        // Convert to number in case it comes as string from API
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) {
            return null;
        }
        return `€${numAmount.toFixed(2)}`;
    };

    const roleBadge = getRoleBadge();

    return (
        <View style={[styles.memberItem, isCurrentUser && styles.currentUserItem]}>
            <View style={styles.memberInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials()}</Text>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.memberName}>
                        {member.user} {isCurrentUser && '(Vi)'}
                    </Text>
                    {roleBadge && (
                        <View style={[
                            styles.roleBadge,
                            member.role === 'GroupLeader' && styles.roleBadgeOwner
                        ]}>
                            <Text style={[
                                styles.roleBadgeText,
                                member.role === 'GroupLeader' && styles.roleBadgeTextOwner
                            ]}>
                                {roleBadge}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Three-dot menu for owner/admin */}
                {canManage && (
                    <Pressable onPress={onMenuPress}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
                    </Pressable>
                )}
            </View>

            <View style={styles.allowanceContainer}>
                <Text style={styles.allowanceLabel}>Dopušteni limit:</Text>
                <Text style={styles.allowanceValue}>
                    {formatCurrency(member.allowance) || 'Nije postavljen'}
                </Text>
            </View>

            {/* FUTURE: Ovdje ce doci progress bar za potrosnju kad backend doda endpoint */}
        </View>
    );
};

export default MemberCard;
