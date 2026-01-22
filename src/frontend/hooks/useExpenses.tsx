import { useState } from 'react';
import {Category, Expense, getCategories, getExpenses, sendTransaction} from '@/services/api';
import { useAuth } from './useAuth';



export const useExpenses = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const listExpenses = async ():Promise<Expense[]> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result: Expense[] = await getExpenses(token);
            console.log('Expenses fetched successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greska pri dohvaćanju fiksnih troškova!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        listExpenses,
    };
};
