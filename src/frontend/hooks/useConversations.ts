import { useState } from 'react';
import {fetchConversations, ChatConversation} from '@/services/api';
import { useAuth } from './useAuth';
export const useConversations = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const getConversations = async ():Promise<ChatConversation[]> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result: ChatConversation[] = await fetchConversations(token);
            console.log('Conversations fetched successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greska pri dohvaćanju conversations!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        getConversations,
        isLoading,
        error,
    };
};
