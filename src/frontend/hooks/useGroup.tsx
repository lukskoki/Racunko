// hooks/useGroup.ts
import { useState, useCallback } from 'react';
import {
    Profile,
    Group,
    Member,
    MemberSpending,
    joinGroup,
    makeGroup,
    getGroup,
    getMembers,
    changeGroupBudget,
    changeUserAllowance,
    leaveGroup,
    getMemberSpending, toggleMemberAdmin
} from '@/services/api';
import { useAuth } from './useAuth';

export const useGroup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [hasGroup, setHasGroup] = useState<boolean | null>(null);
    const [memberSpending, setMemberSpending] = useState<MemberSpending[]>([]);
    const { token } = useAuth();

    // Dohvaca informacije o grupi
    const fetchGroup = useCallback(async (): Promise<Group | null> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await getGroup(token);
            setGroup(result);
            setHasGroup(true);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            // Ako korisnik nije u grupi, to nije greska
            if (err.message?.includes('not in a group') || err.message?.includes('User is not in a group')) {
                setHasGroup(false);
                setGroup(null);
                setIsLoading(false);
                return null;
            }
            const errorMessage = err.message || 'Greška pri dohvaćanju grupe!';
            setError(errorMessage);
            setHasGroup(false);
            setIsLoading(false);
            return null;
        }
    }, [token]);

    // Dohvaca sve clanove grupe
    const fetchMembers = useCallback(async (): Promise<Member[]> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await getMembers(token);
            setMembers(result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri dohvaćanju članova!';
            setError(errorMessage);
            setIsLoading(false);
            return [];
        }
    }, [token]);

    // Dohvaca potrosnju svih clanova (tekuci mjesec)
    const fetchMemberSpending = useCallback(async (): Promise<MemberSpending[]> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        try {
            const result = await getMemberSpending(token);
            setMemberSpending(result);
            return result;
        } catch (err: any) {
            console.log('Error fetching member spending:', err.message);
            return [];
        }
    }, [token]);

    // Azurira budzet grupe (samo GroupLeader)
    const updateGroupBudget = useCallback(async (budget: number): Promise<Group | null> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await changeGroupBudget(token, budget);
            setGroup(result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri ažuriranju budžeta!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    }, [token]);

    // Azurira dopusteni limit clana (samo GroupLeader)
    const updateMemberAllowance = useCallback(async (userId: number, allowance: number): Promise<void> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            await changeUserAllowance(token, userId, allowance);
            // Azuriraj lokalno stanje
            setMembers(prev =>
                prev.map(m => m.userId === userId ? { ...m, allowance } : m)
            );
            setIsLoading(false);
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri ažuriranju limita!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    }, [token]);

    // Napusta grupu
    const leaveGroupHandler = useCallback(async (): Promise<void> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            await leaveGroup(token);
            setGroup(null);
            setMembers([]);
            setHasGroup(false);
            setIsLoading(false);
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri napuštanju grupe!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    }, [token]);

    // Stvara novu grupu
    const makeGroupHandler = async (groupName: string): Promise<Group> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await makeGroup(token, groupName);
            console.log('Group created successfully:', result);
            setGroup(result);
            setHasGroup(true);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri pravljenju grupe!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    // Pridruzuje se grupi
    const joinGroupHandler = async (groupCode: string): Promise<Profile> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result: Profile = await joinGroup(token, groupCode);
            console.log('Successfully joined group:', result);
            setHasGroup(true);
            // Dohvati grupu nakon pridruživanja
            await fetchGroup();
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri pridruživanju grupi!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    const changeMembersAuthority = async (userId: number) => {
        if (!token) return;

        setIsLoading(true);
        try {
            await toggleMemberAdmin(token, userId);
            // Refresh podataka nakon promjene
            await fetchMembers();
        } catch (err: any) {
            console.error('Error toggling member admin:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        group,
        members,
        memberSpending,
        hasGroup,
        isLoading,
        error,
        // Actions
        fetchGroup,
        fetchMembers,
        fetchMemberSpending,
        updateGroupBudget,
        updateMemberAllowance,
        leaveGroupHandler,
        joinGroupHandler,
        makeGroupHandler,
        changeMembersAuthority,
    };
};
