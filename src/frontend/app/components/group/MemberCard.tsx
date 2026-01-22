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
    onCardPress?: () => void;
    totalSpent?: number;
}

const MemberCard = ({ member, isCurrentUser, canManage, onMenuPress, onCardPress, totalSpent = 0 }: MemberCardProps) => {
    const getRoleBadge = () => {
        if (member.role === 'GroupLeader') return 'Vlasnik';
        if (member.role === 'GroupCoLeader') return 'Suvlasnik';
        return 'Član';
    };

    const getInitials = () => {
        return member.user.charAt(0).toUpperCase();
    };

    const roleBadge = getRoleBadge();

    // Calculate progress bar percentage
    const allowanceNum = member.allowance ? (typeof member.allowance === 'string' ? parseFloat(member.allowance) : member.allowance) : null;
    const hasAllowance = allowanceNum !== null && !isNaN(allowanceNum) && allowanceNum > 0;
    const spentPercentage = hasAllowance ? Math.min((totalSpent / allowanceNum) * 100, 100) : 0;
    const isOverBudget = hasAllowance && totalSpent > allowanceNum;

    return (
        <Pressable
            style={[styles.memberItem, isCurrentUser && styles.currentUserItem]}
            onPress={onCardPress}
        >
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
                            member.role === 'GroupLeader' && styles.roleBadgeOwner,
                            member.role === 'GroupCoLeader' && styles.roleBadgeCoOwner,

                        ]}>
                            <Text style={[
                                styles.roleBadgeText,
                                member.role === 'GroupLeader' && styles.roleBadgeTextOwner,
                                member.role === 'GroupCoLeader' && styles.roleBadgeTextCoOwner,
                            ]}>
                                {roleBadge}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Tri tockice menu za owner/admin */}
                {canManage && member.role !== 'GroupLeader' && (
                    <Pressable onPress={onMenuPress}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
                    </Pressable>
                )}
            </View>

            { !canManage && ( member.role === 'GroupLeader' || member.role === 'GroupCoLeader' ) && (
                <View style={styles.permissionNotice}>
                    <Text style={styles.permissionNoticeText}>
                        Nemate ovlasti za pregled transakcija ovog člana.</Text>
                </View>
            )}

            {/* Progress bar za potrosnju */}
            {hasAllowance && ((member.role !== 'GroupLeader' && member.role !== 'GroupCoLeader' && !canManage) || canManage) && (
                <View style={styles.spendingContainer}>
                    <View style={styles.spendingHeader}>
                        <Text style={styles.spendingLabel}>Potrošeno ovaj mjesec:</Text>
                        <Text style={[
                            styles.spendingValue,
                            isOverBudget && styles.spendingValueOver
                        ]}>
                            €{totalSpent.toFixed(2)} / €{allowanceNum!.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View
                            style={[
                                styles.progressBar,
                                { width: `${spentPercentage}%` },
                                isOverBudget ? styles.progressBarOver : styles.progressBarNormal
                            ]}
                        />
                    </View>
                </View>
            )}
        </Pressable>
    );
};

export default MemberCard;
