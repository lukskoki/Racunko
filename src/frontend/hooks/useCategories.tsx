import { useState } from 'react';
import {Category, getCategories} from '@/services/api';
import { useAuth } from './useAuth';
export const useCategories = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const listCategories = async ():Promise<Category[]> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result: Category[] = await getCategories(token);
            console.log('Categories fetched successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greska pri dohvaćanju kategorija!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        listCategories,
        isLoading,
        error,
    };
};
