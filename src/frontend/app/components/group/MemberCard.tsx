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

                {/* Tri tockice menu za owner/admin */}
                {canManage && (
                    <Pressable onPress={onMenuPress}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
                    </Pressable>
                )}
            </View>

            {/*
            <View style={styles.allowanceContainer}>
                <Text style={styles.allowanceLabel}>Dopušteni limit:</Text>
                <Text style={styles.allowanceValue}>
                    {formatCurrency(member.allowance) || 'Nije postavljen'}
                </Text>
            </View>
            */}

            {/* Progress bar za potrosnju */}
            {hasAllowance && (
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
