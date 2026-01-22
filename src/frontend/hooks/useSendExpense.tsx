import { useState } from 'react';
import {sendExpense, sendTransaction} from '@/services/api';
import { useAuth } from './useAuth';

interface CreateExpenseProps {
    amount: number;
    category: number;
    expenseName: string;
}

export const useSendExpense = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const createExpense = async ({ amount, category , expenseName}: CreateExpenseProps) => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await sendExpense(amount, category,expenseName, token);
            console.log('Expense created successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greska pri kreiranju expensa';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        createExpense,
    };
};
