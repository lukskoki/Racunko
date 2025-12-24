// hooks/useGroup.ts
import { useState } from 'react';
import { Profile, joinGroup, makeGroup } from '@/services/api';
import { useAuth } from './useAuth';

export const useGroup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const makeGroupHandler = async (groupName: string): Promise<any> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await makeGroup(token, groupName);
            console.log('Group created successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri pravljenju grupe!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };


    const joinGroupHandler = async (groupCode: string): Promise<Profile> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result: Profile = await joinGroup(token, groupCode);
            console.log('Successfully joined group:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri pridruživanju grupi!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        joinGroupHandler,
        makeGroupHandler,
        isLoading,
        error,
    };
};