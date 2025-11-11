import { useState } from 'react';
import { sendTransaction } from '@/services/api';
import { useAuth } from './useAuth';

interface CreateTransactionProps {
    amount: number;
    category: number;
    date: string;
}

export const useTransaction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const createTransaction = async ({ amount, category, date }: CreateTransactionProps) => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await sendTransaction(amount, category, date, token);
            console.log('Transaction created successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greska pri kreiranju transakcije';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        createTransaction,
        isLoading,
        error,
    };
};
